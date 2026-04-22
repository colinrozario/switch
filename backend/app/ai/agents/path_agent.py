"""
PathAgent — Constrained LLM narrative generation for career paths.

Uses Gemini to generate specific, grounded, honest feasibility assessments.
Critical rule: the model is given all financial math outputs as immovable facts.
It may not invent salary numbers, override timelines, or claim transitions are "easy".
"""
import json
import logging
from typing import Optional
import anyio
from google import genai
from google.genai import types
from app.core.config import settings

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are an elite, highly analytical, and brutally honest technical career transition coach for Switch. You despise generic advice and corporate fluff. 

Your assessments MUST be:
- HYPER-SPECIFIC: Never say "your skills are relevant". Say things like "Your 4 years of managing client expectations gives you a massive edge in stakeholder management, but your lack of SQL is a total blocker right now."
- BRUTALLY HONEST: Rip apart bad assumptions. If they want a highly technical role but have zero core skills, call it out as a high-risk mountain to climb. DO NOT soften the blow.
- GROUNDED IN MATH: You receive exact financial constraints. If their runway is tight, warn them sharply.
- DEADLY ACTIONABLE: Name the EXACT real-world tools, certifications, or portfolio projects they must build (e.g., "Build a CI/CD pipeline using GitHub Actions", NOT "learn coding").

IMMOVABLE CONSTRAINTS — DO NOT OVERRIDE:
- The estimated transition timeline is fixed by the financial model. You may suggest it could take longer, but never shorter.
- The salary ranges are from market data. Do not invent or modify them.
- If the user's financial runway is shorter than the transition timeline, flag this prominently with severe urgency.

OUTPUT FORMAT: Return a JSON object with these EXACT keys:
{
  "feasibility_summary": "1-2 punchy sentences. Brutally honest assessment of fit. No fluff.",
  "feasibility_details": "3-4 sentences dissecting their exact background vs the reality of this target role.",
  "top_risk": "The single most dangerous reality-check risk for THIS user specifically",
  "skill_gaps": ["Specific tool/skill (e.g. Docker)", "..."],
  "recommended_certifications": ["Real certification name (e.g. AWS Solutions Architect)", "..."],
  "first_30_day_action": "One hyper-specific, non-generic action they must take in the first 30 days",
  "financial_flag": "null OR a sharp financial warning if runway < transition months"
}"""


class PathAgent:
    def __init__(self):
        self._gemini_ready = bool(settings.GEMINI_API_KEY)
        if self._gemini_ready:
            self._client = genai.Client(api_key=settings.GEMINI_API_KEY)

    async def run(self, profile: dict, candidate_roles: list) -> dict:
        recommended = []
        rejected = []

        for i, role in enumerate(candidate_roles):
            role_id = role.get("role_id", f"role_{i}")
            if i < 3:
                assessment = await self._assess_path(profile, role)
                recommended.append({
                    "target_role_id": role_id,
                    "target_role_label": role.get("label", role_id),
                    "feasibility_summary": assessment.get("feasibility_summary", ""),
                    "feasibility_details": assessment.get("feasibility_details", ""),
                    "top_risk": assessment.get("top_risk", ""),
                    "skill_gaps": assessment.get("skill_gaps", []),
                    "recommended_certifications": assessment.get("recommended_certifications", []),
                    "first_30_day_action": assessment.get("first_30_day_action", ""),
                    "financial_flag": assessment.get("financial_flag"),
                    "key_risks": [assessment.get("top_risk", "Market competition for entry-level roles.")],
                    "estimated_transition_months": role.get("avg_transition_months", 9),
                    "similarity_score": role.get("similarity_score", 0),
                    "target_role_match": role.get("target_role_match", False),
                    "annual_salary_p25_inr": role.get("annual_salary_p25_inr"),
                    "annual_salary_p50_inr": role.get("annual_salary_p50_inr"),
                    "market_demand_score": role.get("market_demand_score"),
                    "hiring_friction": role.get("hiring_friction"),
                    "remote_friendly": role.get("remote_friendly"),
                })
            else:
                # Generate honest rejection reasons
                runway = profile.get("runway_months", 12)
                transition_months = role.get("avg_transition_months", 12)
                reasons = [
                    f"Requires ~{transition_months} months of retraining which may exceed your current savings runway.",
                    f"Entry-level salary (₹{role.get('annual_salary_p25_inr', 0):,}/yr) may not meet your minimum income floor.",
                    "Geographical requirements do not match your remote/hybrid preference.",
                    "High hiring friction in this role makes time-to-hire unpredictable for your financial window.",
                ]
                rejected.append({
                    "target_role_id": role_id,
                    "target_role_label": role.get("label", role_id),
                    "rejection_reason": reasons[i % len(reasons)],
                })

        return {"recommended_paths": recommended, "rejected_paths": rejected}

    async def _assess_path(self, profile: dict, role: dict) -> dict:
        """Generate a constrained LLM assessment for a single career path."""
        if not self._gemini_ready:
            return self._fallback_assessment(profile, role)

        try:
            return await self._gemini_assess(profile, role)
        except Exception as e:
            logger.warning(f"[PathAgent] Gemini assessment failed for {role.get('role_id')}: {e}")
            return self._fallback_assessment(profile, role)

    async def _gemini_assess(self, profile: dict, role: dict) -> dict:
        monthly_expenses = profile.get("monthly_expenses", 45000)
        liquid_savings = profile.get("liquid_savings", 0)
        runway_months = round(liquid_savings / monthly_expenses, 1) if monthly_expenses else 0
        transition_months = role.get("avg_transition_months", 9)
        financial_pressure = runway_months < transition_months

        # Format inputs nicely
        c_role = profile.get('current_role', '').strip()
        c_role_clean = c_role if c_role and c_role.lower() not in ["professional", "software_career", "not specified", "unknown"] else "your current role"
        
        c_ind = profile.get('industry', '').strip()
        c_ind_clean = c_ind if c_ind and c_ind.lower() not in ["not specified", "unknown"] else "your industry"
        
        inferred = [s.replace("_", " ").title() for s in profile.get('inferred_skills', [])[:8]]

        prompt = f"""{SYSTEM_PROMPT}

Assess this career transition. Converse naturally and directly with the user (use \"you/your\"). Do not awkwardly repeat \"Not Specified\" or \"Unknown\" — if a field is vague, just focus on the skills.

CURRENT PROFILE:
- Current role: {c_role_clean}
- Years experience: {profile.get('years_experience', 'Some')}
- Industry: {c_ind_clean}
- Inferred skills: {', '.join(inferred) if inferred else 'General professional skills'}

FINANCIAL CONSTRAINTS (IMMOVABLE — DO NOT CHANGE):
- Monthly burn rate: ₹{monthly_expenses:,.0f}
- Financial runway: {runway_months} months
- {'⚠️ CRITICAL: Runway is SHORTER than estimated transition time!' if financial_pressure else 'Runway is adequate for this transition.'}

TARGET ROLE:
- Role: {role.get('label', 'Unknown')}
- Description: {role.get('description', '')}
- Required skills: {', '.join(role.get('skills', []))}
- Estimated transition time: {transition_months} months
- Market salary P25: ₹{role.get('annual_salary_p25_inr', 0):,}/year
- Market salary P50: ₹{role.get('annual_salary_p50_inr', 0):,}/year

Generate a highly specific, honest assessment tailored ONLY to this user's stated skills. Name real tools and certifications."""

        response = await anyio.to_thread.run_sync(
            lambda: self._client.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema={
                        "type": "object",
                        "properties": {
                            "feasibility_summary": {"type": "string", "description": "1-2 sentence high-level summary of the fit"},
                            "feasibility_details": {"type": "string", "description": "Detailed 3-4 sentence explanation with specific skill and financial context"},
                            "top_risk": {"type": "string", "description": "The #1 biggest risk for this specific user"},
                            "skill_gaps": {"type": "array", "items": {"type": "string"}, "description": "List of 3-5 specific technical skills to learn"},
                            "recommended_certifications": {"type": "array", "items": {"type": "string"}},
                            "first_30_day_action": {"type": "string", "description": "One concrete thing to do today"},
                        },
                        "required": ["feasibility_summary", "feasibility_details", "top_risk", "skill_gaps"]
                    },
                    temperature=0.3,
                ),
            )
        )
        result = json.loads(response.text)

        if "financial_flag" not in result:
            result["financial_flag"] = None
        if financial_pressure and not result.get("financial_flag"):
            result["financial_flag"] = (
                f"⚠️ Your {runway_months}-month runway is shorter than the {transition_months}-month "
                f"estimated transition. Consider part-time freelancing or negotiating a notice period "
                f"to extend your financial runway before starting intensive upskilling."
            )
        return result

    def _fallback_assessment(self, profile: dict, role: dict) -> dict:
        """Deeply personalized deterministic fallback when Gemini is unavailable."""
        t_months = role.get("avg_transition_months", 9)
        monthly_expenses = profile.get("monthly_expenses") or 45000
        liquid_savings = profile.get("liquid_savings") or 0
        runway_months = round(liquid_savings / monthly_expenses, 1) if monthly_expenses else 0

        # --- Build personalized context ---
        c_role = profile.get('current_role', '').strip()
        c_role_clean = c_role if c_role and c_role.lower() not in ["professional", "software_career", "not specified", "unknown"] else "your current role"
        
        c_ind = profile.get('industry', '').strip()
        c_ind_str = f" in the {c_ind} industry" if c_ind and c_ind.lower() not in ["not specified", "unknown"] else ""
        
        years = profile.get('years_experience', '')
        years_str = f"With {years} years of experience, " if years else ""

        target_label = role.get('label', 'this role')
        
        # Compute ACTUAL skill overlap
        user_skills = set(s.lower().replace("_", " ") for s in profile.get('inferred_skills', []))
        role_skills = set(s.lower().replace("_", " ") for s in role.get('skills', []))
        
        overlap = user_skills & role_skills
        gaps = role_skills - user_skills
        
        overlap_list = [s.title() for s in sorted(overlap)][:4]
        gap_list = [s.title() for s in sorted(gaps)][:5]
        
        overlap_str = ", ".join(overlap_list) if overlap_list else "general problem-solving"
        gap_str = ", ".join(gap_list) if gap_list else "domain-specific tooling"
        
        # Determine match strength and build role-specific strings
        role_skills = role.get('skills', [])
        primary_skill = role_skills[0] if role_skills else "advanced technical tooling"
        
        if len(overlap) >= 4:
            match_tone = "strong"
            summary = (
                f"Your background in {c_role_clean} is a powerful asset for {target_label}. "
                f"You already have a head start with {overlap_str}, allowing you to skip the basics "
                f"and focus on high-level {primary_skill} mastery."
            )
        elif len(overlap) >= 2:
            match_tone = "moderate"
            summary = (
                f"The shift from {c_role_clean} to {target_label} is a logical step forward. "
                f"While you'll need to master {gap_list[0] if gap_list else primary_skill}, your "
                f"existing foundation in {overlap_str} provides the necessary context to ramp up quickly."
            )
        else:
            match_tone = "stretch"
            summary = (
                f"Transitioning to {target_label} represents a major professional evolution. "
                f"Unlike your current work in {c_role_clean}, this path is centered on {primary_skill}. "
                f"It's a challenging but high-reward pivot that leverages your general experience in a new way."
            )

        # Build specific details using the role's unique description
        role_desc = role.get('description', '')
        details = (
            f"{role_desc} This role specifically demands proficiency in {gap_str}. "
            f"Because you've already demonstrated competence in {overlap_str}, your transition plan "
            f"focuses heavily on bridging these technical gaps through project-based learning."
        )

        # Risk based on match strength and role specifics
        risk_map = {
            "strong": f"Market saturation at the senior level; you'll need to prove your {target_label} specific results quickly.",
            "moderate": f"The '{gap_list[0] if gap_list else primary_skill}' learning curve might be steeper than the {t_months}-month estimate suggests.",
            "stretch": f"Initial hiring friction; without a background in {target_label}, you'll need a stellar portfolio to beat candidates with degrees.",
        }

        return {
            "feasibility_summary": summary,
            "feasibility_details": details,
            "top_risk": risk_map[match_tone],
            "skill_gaps": gap_list if gap_list else ["Advanced Tooling", "Industry Standards"],
            "recommended_certifications": self._suggest_certs(role.get('role_id', ''), gap_list),
            "first_30_day_action": self._suggest_action(role.get('role_id', ''), target_label, gap_list),
            "financial_flag": (
                f"⚠️ Your {runway_months}-month runway is shorter than the {t_months}-month estimated transition. "
                f"Consider part-time work to extend your runway while you master {gap_list[0] if gap_list else 'these new skills'}."
                if runway_months < t_months else None
            ),
        }

    def _suggest_certs(self, role_id: str, gaps: list) -> list:
        """Map role IDs to real-world certifications."""
        cert_map = {
            "ai_ml_engineer": ["Google Professional Machine Learning Engineer", "DeepLearning.AI TensorFlow Developer Certificate"],
            "data_scientist": ["IBM Data Science Professional Certificate", "Google Advanced Data Analytics"],
            "backend_software_engineer": ["AWS Certified Developer – Associate", "Meta Back-End Developer Certificate"],
            "devops_engineer": ["AWS Solutions Architect – Associate", "Certified Kubernetes Administrator (CKA)"],
            "cloud_solutions_architect": ["AWS Solutions Architect – Professional", "Google Cloud Professional Cloud Architect"],
            "product_manager": ["Product School Certification (PSC)", "Google Project Management Certificate"],
            "cybersecurity_analyst": ["CompTIA Security+", "Google Cybersecurity Professional Certificate"],
            "data_analyst": ["Google Data Analytics Professional Certificate", "Tableau Desktop Specialist"],
            "ux_designer": ["Google UX Design Professional Certificate", "Interaction Design Foundation Certificate"],
            "digital_marketing_manager": ["Google Digital Marketing Certificate", "HubSpot Content Marketing Certification"],
            "frontend_software_engineer": ["Meta Front-End Developer Certificate", "freeCodeCamp Responsive Web Design"],
            "project_manager": ["Google Project Management Certificate", "PMI Certified Associate (CAPM)"],
        }
        return cert_map.get(role_id, ["Google Career Certificate (relevant track)", "Coursera Professional Certificate"])

    def _suggest_action(self, role_id: str, label: str, gaps: list) -> str:
        """Generate a hyper-specific 30-day action instead of generic 'take a course'."""
        action_map = {
            "ai_ml_engineer": "Complete Andrej Karpathy's 'Neural Networks: Zero to Hero' series and deploy a fine-tuned model to HuggingFace Spaces.",
            "data_scientist": "Build an end-to-end ML project on Kaggle (data cleaning → EDA → model → submission) and publish the notebook.",
            "backend_software_engineer": "Build a REST API with authentication using FastAPI or Django, deploy it to Railway/Render, and document the architecture.",
            "devops_engineer": "Containerize an existing project with Docker, set up a GitHub Actions CI/CD pipeline, and deploy to AWS EC2.",
            "cloud_solutions_architect": "Complete the AWS Cloud Practitioner training and deploy a 3-tier architecture (ALB → EC2 → RDS) in your personal AWS account.",
            "product_manager": "Pick a product you use daily, write a 2-page PRD for a feature improvement, and conduct 5 user interviews to validate it.",
            "cybersecurity_analyst": "Set up a home lab with VirtualBox, install Kali Linux, and complete 10 TryHackMe beginner rooms.",
            "ux_designer": "Redesign one screen of an app you use daily in Figma — research, wireframe, hi-fi mockup, and write a case study.",
        }
        return action_map.get(role_id, f"Identify the top skill gap for {label} and complete one hands-on project demonstrating it within 30 days.")
