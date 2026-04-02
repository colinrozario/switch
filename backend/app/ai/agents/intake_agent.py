from typing import Optional

class IntakeAgent:
    async def run(self, raw_text: str, linkedin_url: Optional[str] = None) -> dict:
        # Mocked deterministic response avoiding paid external APIs
        return {
            "current_role": "Software Engineer",
            "years_experience": 5.0,
            "monthly_net_income": 4000.0,
            "monthly_expenses": 2500.0,
            "liquid_savings": 15000.0,
            "weekly_hours_available": 15.0,
            "hard_constraints": ["Cannot relocate"],
            "soft_constraints": ["Prefers remote"],
            "target_industries": ["Tech"],
            "target_roles": ["Backend Developer", "Data Analyst"],
            "confidence_scores": {
                "years_experience": 0.9,
                "monthly_net_income": 0.8,
                "monthly_expenses": 0.8,
                "liquid_savings": 1.0,
                "weekly_hours_available": 0.5
            }
        }
