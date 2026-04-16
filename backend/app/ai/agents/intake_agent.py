import re
from typing import Optional


class IntakeAgent:
    async def run(self, raw_text: str, linkedin_url: Optional[str] = None) -> dict:
        """
        Parses the structured raw_text submitted by the DiagnosisPage wizard.
        Falls back to sensible defaults only when a value cannot be extracted.
        """
        text = raw_text or ""

        # --- Role ---
        role_match = re.search(r"Role:\s*(.+)", text)
        current_role = role_match.group(1).strip() if role_match else "Professional"

        # --- Years of experience ---
        exp_match = re.search(r"Experience:\s*(\d+(?:\.\d+)?)", text)
        years_experience = float(exp_match.group(1)) if exp_match else 5.0

        # --- Industry ---
        industry_match = re.search(r"Industry:\s*(.+)", text)
        industry = industry_match.group(1).strip() if industry_match else "Not Specified"

        # --- Financials ---
        expenses_match = re.search(r"Monthly Burn:\s*[₹Rs.]?\s*([\d,]+)", text)
        monthly_expenses = float(expenses_match.group(1).replace(",", "")) if expenses_match else 45000.0

        savings_match = re.search(r"Liquid Savings:\s*[₹Rs.]?\s*([\d,]+)", text)
        liquid_savings = float(savings_match.group(1).replace(",", "")) if savings_match else 300000.0

        # Estimate net income: assume monthly expenses are ~60% of take-home
        monthly_net_income = round(monthly_expenses / 0.60, 2)

        # --- Constraints ---
        hours_match = re.search(r"Weekly Time:\s*(.+)", text)
        raw_hours = hours_match.group(1).strip() if hours_match else "10-20"

        # Parse hours range like "10-20" → use lower bound
        hours_num_match = re.search(r"(\d+)", raw_hours)
        weekly_hours_available = float(hours_num_match.group(1)) if hours_num_match else 10.0

        location_match = re.search(r"Location:\s*(.+)", text)
        location = location_match.group(1).strip() if location_match else "Flexible"

        dependents_match = re.search(r"Dependents:\s*(.+)", text)
        dependents = dependents_match.group(1).strip() if dependents_match else "None"

        # Build hard constraints list from user choices
        hard_constraints = []
        location_lower = location.lower()
        if "on-site" in location_lower or "onsite" in location_lower:
            hard_constraints.append("Must be on-site")
        elif "hybrid" in location_lower:
            hard_constraints.append("Hybrid work preferred")
        else:
            hard_constraints.append("Flexible / Remote preferred")

        if dependents.lower() not in ["none", "0", ""]:
            hard_constraints.append(f"Has dependents: {dependents}")

        # --- Goal ---
        goal_type_match = re.search(r"Goal Type:\s*(.+)", text)
        goal_type = goal_type_match.group(1).strip() if goal_type_match else "searching"

        target_role_match = re.search(r"Target Role:\s*(.+)", text)
        target_role_raw = target_role_match.group(1).strip() if target_role_match else ""
        target_role = "" if target_role_raw.lower() in ["to be explored", "none", ""] else target_role_raw

        target_roles = [target_role] if target_role else ["Product Manager", "Data Analyst"]

        # Confidence: high if user provided data, low if defaulted
        confidence_scores = {
            "years_experience": 0.95 if exp_match else 0.5,
            "monthly_net_income": 0.65,  # always inferred
            "monthly_expenses": 0.95 if expenses_match else 0.5,
            "liquid_savings": 0.95 if savings_match else 0.5,
            "weekly_hours_available": 0.9 if hours_match else 0.5,
        }

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
            "goal_type": goal_type,
            "confidence_scores": confidence_scores,
        }
