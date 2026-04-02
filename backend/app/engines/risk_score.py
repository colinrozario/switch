class RiskScoreCalculator:
    @staticmethod
    def compute(
        bridge_required: float,
        liquid_savings: float,
        runway_months: float,
        transition_months: int,
        weekly_hours_available: float,
        hard_constraint_count: int,
        years_experience: float
    ) -> int:
        score = 100
        
        if liquid_savings < bridge_required:
            score -= 30
            
        if runway_months < transition_months:
            score -= 25
            
        if weekly_hours_available < 10:
            score -= 15
            
        if weekly_hours_available < 5:
            score -= 10
            
        if hard_constraint_count > 3:
            score -= 10
            
        if years_experience < 3:
            score -= 10
            
        if liquid_savings >= bridge_required * 1.5:
            score += 10
            
        # Clamp to 0-100
        score = max(0, min(100, score))
        
        return score
