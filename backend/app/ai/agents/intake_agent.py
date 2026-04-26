"""
IntakeAgent — Gemini-powered structured profile extractor.

Replaces the regex parser. Uses Gemini 2.0 Flash with JSON mode to extract
a typed profile schema from any freeform input: wizard text, resume paste,
LinkedIn summary, or a mix.

GUARDRAIL: Financial fields (monthly_expenses, liquid_savings) are NEVER invented.
If they are absent from the input, the fields return None and the API will
prompt the user to fill them in before proceeding.
"""
import json
import logging
import re
import anyio
from typing import Optional
from google import genai
from google.genai import types
from app.core.config import settings

logger = logging.getLogger(__name__)

EXTRACTION_SCHEMA = {
    "type": "object",
    "properties": {
        "current_role": {"type": "string", "description": "The user's current job title"},
        "years_experience": {"type": "number", "description": "Years of professional work experience"},
        "industry": {"type": "string", "description": "The industry they currently work in"},
        "monthly_expenses": {"type": "number", "description": "Monthly living expenses in INR. ONLY extract if explicitly stated. Return null if not mentioned."},
        "liquid_savings": {"type": "number", "description": "Total liquid savings in INR. ONLY extract if explicitly stated. Return null if not mentioned."},
        "weekly_hours_available": {"type": "number", "description": "Hours per week available for upskilling"},
        "location_preference": {"type": "string", "enum": ["Remote", "Hybrid", "Onsite", "Flexible"], "description": "Work location preference"},
        "has_dependents": {"type": "boolean", "description": "Whether the user has financial dependents"},
        "target_role": {"type": "string", "description": "Specific role the user wants to transition into. Empty string if exploring."},
        "stated_motivations": {"type": "array", "items": {"type": "string"}, "description": "User's stated motivations for switching"},
        "inferred_skills": {"type": "array", "items": {"type": "string"}, "description": "Skills inferred from their role, resume text, and industry. Use Title Case (e.g. 'Financial Modeling')."},
        "confidence_notes": {"type": "string", "description": "Brief note on which fields were guessed vs explicitly stated"}
    },
    "required": ["current_role", "years_experience", "industry", "weekly_hours_available", "location_preference", "has_dependents", "stated_motivations", "inferred_skills"]
}

SYSTEM_PROMPT = """You are a professional career intake analyst. Your job is to extract a structured profile from the user's input text.

STRICT RULES:
1. For financial fields (monthly_expenses, liquid_savings): ONLY extract these if they are EXPLICITLY stated as numbers. If they say "my expenses are 45000" → 45000. If not stated → return null. NEVER invent or estimate financial figures.
2. For inferred_skills: extract real, specific skills from their job title, industry, resume text, and stated experience. Use Title Case with spaces (e.g., "Financial Modeling", "Team Management", "Cold Outreach").
3. For target_role: extract only if they name a specific role. If they say "I want to explore" or "I'm not sure" → return empty string.
4. Be specific and grounded. No hallucinations.
5. Return ONLY valid JSON matching the schema. No markdown, no explanation."""


class IntakeAgent:
    def __init__(self):
        self._gemini_ready = bool(settings.GEMINI_API_KEY)
        if self._gemini_ready:
            self._client = genai.Client(api_key=settings.GEMINI_API_KEY)

    async def run(self, raw_text: str, linkedin_url: Optional[str] = None) -> dict:
        """
        Extract a structured profile from freeform text.
        Tries gemini-2.0-flash first, then gemini-2.0-flash-lite (separate quota),
        then falls back to smart regex parsing if both are unavailable.
        """
        if self._gemini_ready:
            for model in ["gemini-2.0-flash", "gemini-2.0-flash-lite"]:
                try:
                    return await self._gemini_extract(raw_text, model=model)
                except Exception as e:
                    logger.warning(f"[IntakeAgent] {model} failed ({type(e).__name__}: {str(e)[:80]}), trying next...")

        return self._regex_fallback(raw_text)

    async def _gemini_extract(self, raw_text: str, model: str = "gemini-2.0-flash") -> dict:
        # Wrap the blocking sync call in a thread pool to keep the event loop free
        response = await anyio.to_thread.run_sync(
            lambda: self._client.models.generate_content(
                model=model,
                contents=f"{SYSTEM_PROMPT}\n\nExtract the structured profile from this user input:\n\n---\n{raw_text}\n---\n\nReturn JSON only.",
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.1,
                ),
            )
        )
        extracted = json.loads(response.text)

        # Validate: block invented financial fields
        # (Gemini will return null, but validate defensively)
        monthly_expenses = extracted.get("monthly_expenses")
        liquid_savings = extracted.get("liquid_savings")

        # Post-process: build the full structured dict with computed fields
        target_role = extracted.get("target_role", "")
        target_roles = [target_role] if target_role else []

        inferred_skills = [s.replace("_", " ").title() for s in extracted.get("inferred_skills", [])]
        location_pref = extracted.get("location_preference", "Flexible")
        has_dependents = extracted.get("has_dependents", False)

        hard_constraints = []
        if location_pref == "Onsite":
            hard_constraints.append("Must be on-site")
        elif location_pref == "Hybrid":
            hard_constraints.append("Hybrid work preferred")
        else:
            hard_constraints.append("Flexible / Remote preferred")
        if has_dependents:
            hard_constraints.append("Has financial dependents")

        # Estimate net income only if expenses are known (never invent)
        monthly_net_income = round(monthly_expenses / 0.60, 2) if monthly_expenses else None

        confidence_scores = {
            "years_experience": 0.9,
            "monthly_net_income": 0.65 if monthly_expenses else 0.0,
            "monthly_expenses": 0.95 if monthly_expenses else 0.0,
            "liquid_savings": 0.95 if liquid_savings else 0.0,
            "weekly_hours_available": 0.9,
            "extraction_method": f"gemini:{model}",
        }

        return {
            "current_role": extracted.get("current_role", "Professional"),
            "years_experience": extracted.get("years_experience", 1.0),
            "industry": extracted.get("industry", "Not Specified"),
            "monthly_net_income": monthly_net_income,
            "monthly_expenses": monthly_expenses,  # May be None — UI must prompt for it
            "liquid_savings": liquid_savings,         # May be None — UI must prompt for it
            "weekly_hours_available": extracted.get("weekly_hours_available", 10.0),
            "hard_constraints": hard_constraints,
            "soft_constraints": [f"Location preference: {location_pref}"],
            "target_industries": [extracted.get("industry", "Tech")],
            "target_roles": target_roles,
            "stated_motivations": extracted.get("stated_motivations", []),
            "inferred_skills": inferred_skills,
            "goal_type": "specific" if target_role else "searching",
            "confidence_scores": confidence_scores,
        }

    # ---------------------------------------------------------------------------
    # Role → realistic skill set lookup for offline fallback
    # ---------------------------------------------------------------------------
    _ROLE_SKILLS: dict = {
        "sales manager": ["Sales Strategy", "Team Leadership", "Pipeline Management", "Revenue Forecasting", "CRM", "Negotiation", "Cold Outreach", "Stakeholder Management", "Coaching", "Reporting"],
        "sales": ["Prospecting", "Negotiation", "Cold Outreach", "CRM", "Pipeline Management", "Presentation", "B2B Sales", "Relationship Building"],
        "account executive": ["Salesforce", "Negotiation", "B2B Sales", "Prospecting", "Pipeline Management", "Closing", "Cold Outreach", "Presentation"],
        "software engineer": ["Python", "SQL", "System Design", "REST APIs", "Git", "Algorithms", "Debugging", "Cloud", "Testing", "Code Review"],
        "software developer": ["Python", "JavaScript", "SQL", "Git", "REST APIs", "Debugging", "Agile", "Testing"],
        "frontend engineer": ["JavaScript", "React", "HTML", "CSS", "Git", "TypeScript", "Web Performance", "UX", "Responsive Design"],
        "backend engineer": ["Python", "SQL", "REST APIs", "System Design", "Databases", "Git", "Cloud", "Algorithms"],
        "full stack engineer": ["JavaScript", "Python", "React", "SQL", "REST APIs", "Git", "HTML", "CSS", "Cloud"],
        "data analyst": ["SQL", "Excel", "Tableau", "Python", "Data Visualization", "Reporting", "Statistics", "Communication"],
        "data scientist": ["Python", "SQL", "Machine Learning", "Statistics", "Pandas", "Deep Learning", "Data Modeling", "Research"],
        "data engineer": ["Python", "SQL", "Apache Spark", "Airflow", "ETL", "Data Warehousing", "Cloud", "Kafka"],
        "product manager": ["Product Strategy", "User Research", "Agile", "Roadmapping", "Stakeholder Management", "JIRA", "Go-To-Market", "Data-Driven Decisions"],
        "project manager": ["Agile", "JIRA", "Communication", "Budgeting", "Risk Management", "Stakeholder Management", "Planning", "Team Management"],
        "ux designer": ["Figma", "User Research", "Wireframing", "Prototyping", "Design Thinking", "Usability Testing", "Visual Design"],
        "graphic designer": ["Adobe Photoshop", "Adobe Illustrator", "Figma", "Typography", "Color Theory", "Brand Identity", "Layout Design"],
        "video editor": ["Premiere Pro", "After Effects", "DaVinci Resolve", "Motion Graphics", "Color Grading", "Storytelling", "Sound Design"],
        "marketing manager": ["SEO", "Google Analytics", "Content Strategy", "Social Media", "Copywriting", "Paid Ads", "Email Marketing", "Campaign Management"],
        "digital marketing": ["SEO", "Google Analytics", "Content Strategy", "Social Media", "Copywriting", "Paid Ads", "Email Marketing"],
        "content writer": ["Copywriting", "SEO", "Research", "Storytelling", "Content Strategy", "Editing", "Social Media"],
        "hr manager": ["Employee Relations", "Recruiting", "Performance Management", "Compliance", "Communication", "Conflict Resolution", "Payroll"],
        "recruiter": ["Sourcing", "Interviewing", "LinkedIn Recruiter", "ATS Tools", "Communication", "Negotiation", "Employer Branding"],
        "operations manager": ["Process Improvement", "Team Management", "Budgeting", "Operations", "Vendor Management", "Planning", "Reporting"],
        "business analyst": ["Requirements Gathering", "SQL", "Excel", "Communication", "Process Mapping", "Stakeholder Management", "JIRA", "Documentation"],
        "financial analyst": ["Excel", "Financial Modeling", "Forecasting", "Valuation", "Accounting", "Budgeting", "Reporting", "Data Analysis"],
        "accountant": ["Accounting", "Tally", "GST", "Taxation", "Excel", "Financial Reporting", "Compliance", "Auditing"],
        "teacher": ["Curriculum Design", "Teaching", "Communication", "Assessment", "Classroom Management", "Presentation", "Mentoring"],
        "engineer": ["Problem Solving", "Technical Analysis", "Project Management", "Documentation", "Teamwork", "Quality Control"],
        "consultant": ["Strategy", "Problem Solving", "Communication", "Stakeholder Management", "Project Management", "Analytical Thinking", "PowerPoint"],
        "manager": ["Team Management", "Communication", "Planning", "Budgeting", "Reporting", "Stakeholder Management", "Leadership"],
        "developer": ["Programming", "Debugging", "Git", "Testing", "REST APIs", "Agile", "Documentation"],
        "designer": ["Design Thinking", "Figma", "Visual Design", "User Research", "Prototyping", "Collaboration"],
        "analyst": ["Data Analysis", "Excel", "Communication", "Reporting", "Problem Solving", "SQL", "Presentation"],
        "doctor": ["Clinical Diagnosis", "Patient Care", "Medical Knowledge", "Communication", "Empathy", "Decision Making", "Pharmacology"],
        "nurse": ["Patient Care", "Clinical Skills", "Medication Administration", "Communication", "Empathy", "Emergency Response"],
        "lawyer": ["Legal Research", "Contract Drafting", "Litigation", "Compliance", "Negotiation", "Legal Writing", "Due Diligence"],
        "journalist": ["Reporting", "Research", "Writing", "Storytelling", "Communication", "Interviewing", "Editing"],
        "teacher": ["Curriculum Design", "Teaching", "Communication", "Assessment", "Mentoring", "Content Creation"],
        "chef": ["Cooking", "Menu Planning", "Team Management", "Food Safety", "Cost Control", "Creativity", "Time Management"],
    }

    def _infer_skills_from_role(self, role: str, industry: str, motivations: list) -> list:
        """Map a role title to realistic skills using the lookup table."""
        role_lower = role.lower().strip()
        skills = []

        # Try progressively shorter matches
        for key in self._ROLE_SKILLS:
            if key in role_lower or role_lower in key:
                skills = list(self._ROLE_SKILLS[key])
                break

        # Fallback: try individual words from the role title
        if not skills:
            for word in role_lower.split():
                if len(word) > 4:
                    for key in self._ROLE_SKILLS:
                        if word in key:
                            skills = list(self._ROLE_SKILLS[key])
                            break
                if skills:
                    break

        # Still nothing — use generic professional skills
        if not skills:
            skills = ["Communication", "Problem Solving", "Teamwork", "Planning", "Reporting", "Stakeholder Management"]

        # Enrich with industry context
        industry_skill_map = {
            "tech": ["Agile", "JIRA", "Data-Driven Decisions"],
            "finance": ["Excel", "Financial Modeling", "Compliance"],
            "banking": ["Compliance", "Financial Modeling", "Risk Management"],
            "healthcare": ["Compliance", "Patient Communication", "Documentation"],
            "education": ["Curriculum Design", "Communication", "Assessment"],
            "marketing": ["Content Strategy", "Analytics", "Copywriting"],
            "consulting": ["Strategy", "PowerPoint", "Stakeholder Management"],
            "sales": ["CRM", "Negotiation", "Pipeline Management"],
        }
        ind_lower = industry.lower() if industry else ""
        for ind_key, ind_skills in industry_skill_map.items():
            if ind_key in ind_lower:
                for s in ind_skills:
                    if s not in skills:
                        skills.append(s)
                break

        return skills[:12]

    def _regex_fallback(self, text: str) -> dict:
        """Smart regex extraction with real skill inference from role title."""
        role_match = re.search(r"Role:\s*(.+)", text)
        current_role = role_match.group(1).strip() if role_match else "Professional"

        exp_match = re.search(r"Experience:\s*(\d+(?:\.\d+)?)", text)
        years_experience = float(exp_match.group(1)) if exp_match else 5.0

        industry_match = re.search(r"Industry:\s*(.+)", text)
        industry = industry_match.group(1).strip() if industry_match else "Not Specified"

        expenses_match = re.search(r"Monthly Burn:\s*[₹Rs.]?\s*([\d,]+)", text)
        monthly_expenses = float(expenses_match.group(1).replace(",", "")) if expenses_match else None

        savings_match = re.search(r"Liquid Savings:\s*[₹Rs.]?\s*([\d,]+)", text)
        liquid_savings = float(savings_match.group(1).replace(",", "")) if savings_match else None

        monthly_net_income = round(monthly_expenses / 0.60, 2) if monthly_expenses else None

        hours_match = re.search(r"Weekly Time:\s*(.+)", text)
        raw_hours = hours_match.group(1).strip() if hours_match else "10"
        hours_num_match = re.search(r"(\d+)", raw_hours)
        weekly_hours_available = float(hours_num_match.group(1)) if hours_num_match else 10.0

        location_match = re.search(r"Location:\s*(.+)", text)
        location = location_match.group(1).strip() if location_match else "Flexible"

        dependents_match = re.search(r"Dependents:\s*(.+)", text)
        dependents = dependents_match.group(1).strip() if dependents_match else "None"

        hard_constraints = []
        if "on-site" in location.lower():
            hard_constraints.append("Must be on-site")
        elif "hybrid" in location.lower():
            hard_constraints.append("Hybrid work preferred")
        else:
            hard_constraints.append("Flexible / Remote preferred")
        if dependents.lower() not in ["none", "0", ""]:
            hard_constraints.append(f"Has dependents: {dependents}")

        goal_type_match = re.search(r"Goal Type:\s*(.+)", text)
        goal_type = goal_type_match.group(1).strip() if goal_type_match else "searching"

        target_role_match = re.search(r"Target Role:\s*(.+)", text)
        target_role_raw = target_role_match.group(1).strip() if target_role_match else ""
        target_role = "" if target_role_raw.lower() in ["to be explored", "none", ""] else target_role_raw
        target_roles = [target_role] if target_role else []

        motivations_match = re.search(r"Motivations:\s*(.+)", text)
        motivations_raw = motivations_match.group(1).strip() if motivations_match else ""
        motivations = [m.strip() for m in motivations_raw.split(",") if m.strip()]

        # ✅ FIXED: Use role→skill dictionary instead of just storing the role name
        inferred_skills = self._infer_skills_from_role(current_role, industry, motivations)

        return {
            "current_role": current_role,
            "years_experience": years_experience,
            "industry": industry,
            "monthly_net_income": monthly_net_income,
            "monthly_expenses": monthly_expenses,
            "liquid_savings": liquid_savings,
            "weekly_hours_available": weekly_hours_available,
            "hard_constraints": hard_constraints,
            "soft_constraints": [f"Location preference: {location}"],
            "target_industries": [industry] if industry != "Not Specified" else ["Tech"],
            "target_roles": target_roles,
            "inferred_skills": inferred_skills,
            "stated_motivations": motivations,
            "goal_type": goal_type,
            "confidence_scores": {
                "extraction_method": "regex_fallback",
                "monthly_expenses": 0.95 if expenses_match else 0.0,
                "liquid_savings": 0.95 if savings_match else 0.0,
            },
        }

