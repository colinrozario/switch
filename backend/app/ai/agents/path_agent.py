"""
PathAgent — Constrained LLM narrative generation for career paths.

Uses Gemini to generate specific, grounded, honest feasibility assessments.
Critical rule: the model is given all financial math outputs as immovable facts.
It may not invent salary numbers, override timelines, or claim transitions are "easy".
"""
import json
import logging
from typing import Optional
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

        response = self._client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.3,
            ),
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
        """Deterministic fallback when Gemini is unavailable."""
        t_months = role.get("avg_transition_months", 9)
        monthly_expenses = profile.get("monthly_expenses") or 45000
        liquid_savings = profile.get("liquid_savings") or 0
        runway_months = round(liquid_savings / monthly_expenses, 1) if monthly_expenses else 0

        # Sanitize fallback strings
        c_role = profile.get('current_role', '').strip()
        c_role_clean = c_role if c_role and c_role.lower() not in ["professional", "software_career", "not specified", "unknown"] else "professional"
        
        c_ind = profile.get('industry', '').strip()
        c_ind_clean = f" in {c_ind}" if c_ind and c_ind.lower() not in ["not specified", "unknown"] else ""
        
        # Keep inferred skills clean
        inferred = [s.replace("_", " ").title() for s in profile.get('inferred_skills', [])[:3]]
        inferred_str = ", ".join(inferred) if inferred else "your primary field"

        return {
            "feasibility_summary": (
                f"Your background as a {c_role_clean}{c_ind_clean} shows transferable competencies for "
                f"transitioning into a {role.get('label', 'this role')}."
            ),
            "feasibility_details": (
                f"A transition to {role.get('label', 'this role')} typically takes {t_months} months. "
                f"Your core skills in {inferred_str} "
                f"are highly relevant. The main gaps are domain-specific tooling and portfolio evidence."
            ),
            "top_risk": "Market competition for entry-level positions in this domain.",
            "skill_gaps": role.get("skills", [])[:4],
            "recommended_certifications": ["Google Career Certificate (relevant track)", "LinkedIn Learning path"],
            "first_30_day_action": (
                f"Enroll in a structured {role.get('label', '')} course and complete one portfolio project."
            ),
            "financial_flag": (
                f"⚠️ Runway ({runway_months} months) is shorter than estimated transition ({t_months} months)."
                if runway_months < t_months else None
            ),
        }
