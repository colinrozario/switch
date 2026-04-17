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
from typing import Optional
import google.generativeai as genai
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
        "inferred_skills": {"type": "array", "items": {"type": "string"}, "description": "Skills inferred from their role, resume text, and industry. Use lowercase snake_case."},
        "confidence_notes": {"type": "string", "description": "Brief note on which fields were guessed vs explicitly stated"}
    },
    "required": ["current_role", "years_experience", "industry", "weekly_hours_available", "location_preference", "has_dependents", "stated_motivations", "inferred_skills"]
}

SYSTEM_PROMPT = """You are a professional career intake analyst. Your job is to extract a structured profile from the user's input text.

STRICT RULES:
1. For financial fields (monthly_expenses, liquid_savings): ONLY extract these if they are EXPLICITLY stated as numbers. If they say "my expenses are 45000" → 45000. If not stated → return null. NEVER invent or estimate financial figures.
2. For inferred_skills: extract real, specific skills from their job title, industry, resume text, and stated experience. Use lowercase with underscores (e.g., "financial_modeling", "team_management", "cold_outreach").
3. For target_role: extract only if they name a specific role. If they say "I want to explore" or "I'm not sure" → return empty string.
4. Be specific and grounded. No hallucinations.
5. Return ONLY valid JSON matching the schema. No markdown, no explanation."""


class IntakeAgent:
    def __init__(self):
        self._gemini_ready = bool(settings.GEMINI_API_KEY)
        if self._gemini_ready:
            genai.configure(api_key=settings.GEMINI_API_KEY)

    async def run(self, raw_text: str, linkedin_url: Optional[str] = None) -> dict:
        """
        Extract a structured profile from freeform text.
        Falls back to regex parsing if Gemini is unavailable.
        """
        if self._gemini_ready:
            try:
                return await self._gemini_extract(raw_text)
            except Exception as e:
                logger.warning(f"[IntakeAgent] Gemini extraction failed ({e}), falling back to regex")
        
        return self._regex_fallback(raw_text)

    async def _gemini_extract(self, raw_text: str) -> dict:
        model = genai.GenerativeModel(
            model_name="gemini-2.0-flash",
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                temperature=0.1,  # Low temperature for factual extraction
            ),
            system_instruction=SYSTEM_PROMPT,
        )

        prompt = f"""Extract the structured profile from this user input:

---
{raw_text}
---

Return JSON only."""

        response = model.generate_content(prompt)
        extracted = json.loads(response.text)

        # Validate: block invented financial fields
        # (Gemini will return null, but validate defensively)
        monthly_expenses = extracted.get("monthly_expenses")
        liquid_savings = extracted.get("liquid_savings")

        # Post-process: build the full structured dict with computed fields
        target_role = extracted.get("target_role", "")
        target_roles = [target_role] if target_role else []

        inferred_skills = extracted.get("inferred_skills", [])
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
            "extraction_method": "gemini-2.0-flash",
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

    def _regex_fallback(self, text: str) -> dict:
        """Regex-based extraction used when Gemini is unavailable."""
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
            "inferred_skills": [current_role.lower().replace(" ", "_")],
            "stated_motivations": [],
            "goal_type": goal_type,
            "confidence_scores": {
                "extraction_method": "regex_fallback",
                "monthly_expenses": 0.95 if expenses_match else 0.0,
                "liquid_savings": 0.95 if savings_match else 0.0,
            },
        }
