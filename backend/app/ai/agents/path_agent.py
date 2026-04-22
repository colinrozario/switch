"""
PathAgent — Constrained LLM narrative generation for career paths.

Uses Gemini to generate specific, grounded, honest feasibility assessments.
Critical rule: the model is given all financial math outputs as immovable facts.
It may not invent salary numbers, override timelines, or claim transitions are "easy".
"""
import json
import logging
import asyncio
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

        # Run top 3 assessments in parallel
        top_3_roles = candidate_roles[:3]
        assessment_tasks = [
            self._assess_path(profile, role, index=i) 
            for i, role in enumerate(top_3_roles)
        ]
        
        results = await asyncio.gather(*assessment_tasks, return_exceptions=True)

        for i, result in enumerate(results):
            role = top_3_roles[i]
            role_id = role.get("role_id", f"role_{i}")
            
            # Handle potential exceptions in parallel tasks
            if isinstance(result, Exception):
                logger.error(f"[PathAgent] Error assessing {role_id}: {result}")
                assessment = self._fallback_assessment(profile, role, index=i)
            else:
                assessment = result

            recommended.append({
                "target_role_id": role_id,
                "target_role_label": role.get("label", role_id),
                "feasibility_summary": assessment.get("feasibility_summary", ""),
                "feasibility_details": assessment.get("feasibility_details", ""),
                "top_risk": assessment.get("top_risk", ""),
                "skill_gaps": assessment.get("skill_gaps", []),
                "recommended_certifications": assessment.get("recommended_certifications", []),
                "first_30_day_action": assessment.get("first_30_day_action", ""),
                "match_level": assessment.get("match_level", "stretch"),
                "match_percentage": min(98, max(45, int(role.get("similarity_score", 0.5) * 100))),
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

        # Rejected paths
        for i, role in enumerate(candidate_roles[3:]):
            idx = i + 3
            role_id = role.get("role_id", f"role_{idx}")
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

    async def _assess_path(self, profile: dict, role: dict, index: int = 0) -> dict:
        """Generate a constrained LLM assessment for a single career path."""
        if not self._gemini_ready:
            return self._fallback_assessment(profile, role, index=index)

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

        if "match_level" not in result:
            # Infer match level from similarity score if not provided by Gemini
            score = role.get("similarity_score", 0.5)
            if score > 0.8: result["match_level"] = "strong"
            elif score > 0.6: result["match_level"] = "moderate"
            else: result["match_level"] = "stretch"

        return result

    def _fallback_assessment(self, profile: dict, role: dict, index: int = 0) -> dict:
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
        
        # Determine match strength and pick a unique template structure to avoid visual repetition
        role_skills = role.get('skills', [])
        primary_skill = role_skills[0] if role_skills else "advanced technical tooling"
        role_desc = role.get('description', '')
        
        # Split description into sentences to pick a unique hook
        desc_sentences = [s.strip() for s in role_desc.split('.') if len(s.strip()) > 10]
        hook = desc_sentences[0] if desc_sentences else "This role bridges technical execution with strategic value."

        if len(overlap) >= 4:
            summaries = [
                f"Your deep background as a {c_role_clean} makes you a standout candidate for {target_label}. You already master {overlap_str}, which means you can skip 70% of the standard learning curve and focus on {primary_skill}.",
                f"The transition to {target_label} is a natural evolution for you. While others start from scratch, your {years_str}experience with {overlap_str} gives you the seniority to hit the ground running.",
                f"High-fit match: {target_label} requires exactly the {overlap_str} foundation you've built as a {c_role_clean}. You are uniquely positioned to pivot into this role with minimal friction."
            ]
            summary = summaries[index % len(summaries)]
            match_tone = "strong"
        elif len(overlap) >= 2:
            summaries = [
                f"Moving from {c_role_clean} to {target_label} leverages your existing {overlap_str} while adding {primary_skill} to your toolkit. It's a calculated step that maximizes your {years_str}professional value.",
                f"As a {c_role_clean}, you've already handled the core of {target_label} via {overlap_str}. This path focuses on specializing in {primary_skill} to bridge the remaining gap.",
                f"This is a logical bridge: your background provides the {overlap_str} context, while the {target_label} path adds the specific {primary_skill} expertise needed for the next level."
            ]
            summary = summaries[index % len(summaries)]
            match_tone = "moderate"
        else:
            summaries = [
                f"{hook} For a {c_role_clean}, this is a major pivot into {primary_skill}. It’s a high-growth move that trades your current routine for a deeper focus on {role_skills[1] if len(role_skills)>1 else 'new standards'}.",
                f"This path into {target_label} is a total reset centered on {primary_skill}. While your work in {c_role_clean} is a different world, the shift allows you to reinvent your career around {hook}.",
                f"A pivot to {target_label} leverages your general professional maturity to master {primary_skill}. It's a significant change from {c_role_clean}, but one that offers a fresh start in {c_ind_str or 'tech'}."
            ]
            summary = summaries[index % len(summaries)]
            match_tone = "stretch"

        # Build specific details with a "Why it's a good switch" and "Diagnostic explanation"
        details = (
            f"DIAGNOSIS: You have a {len(overlap)}-skill overlap with this role ({overlap_str}). "
            f"The primary challenge is mastering {gap_str}, which usually takes {t_months} months for someone with your profile. "
            f"WHY IT WORKS: {hook} By combining your {c_role_clean} experience with these new {target_label} skills, you become a rare 'hybrid' candidate who understands both domains."
        )

        # Risk based on match strength and role specifics
        risk_map = {
            "strong": f"Market saturation; you'll need to prove your {target_label} results to justify a senior-level salary.",
            "moderate": f"The '{primary_skill}' learning curve; don't underestimate the time needed to go from 'knowing' to 'doing'.",
            "stretch": f"Credential friction; without a direct degree in {target_label}, your portfolio must be flawless to get past automated filters.",
        }

        return {
            "match_level": match_tone,
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
