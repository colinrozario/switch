from pydantic import BaseModel
from typing import Dict

class RiskInput(BaseModel):
    salary_bridge_buffer_months: float # How many months of expenses do they have covered?
    required_timeline_months: int
    skill_gap: float # 0-1

class RiskOutput(BaseModel):
    risk_score: int # 0-100
    breakdown: Dict[str, int]
    recommendation: str

def calculate_risk(data: RiskInput) -> RiskOutput:
    # 1. Financial Risk (Weighted 50%)
    if data.required_timeline_months > 0:
        fin_ratio = data.salary_bridge_buffer_months / data.required_timeline_months
    else:
        fin_ratio = 1.0
        
    if fin_ratio >= 1.2:
        fin_risk = 10
    elif fin_ratio >= 1.0:
        fin_risk = 30
    elif fin_ratio >= 0.5:
        fin_risk = 70
    else:
        fin_risk = 95
        
    # 2. Skill Risk (Weighted 30%)
    skill_risk = int(data.skill_gap * 100)
    
    # 3. Time Risk (Weighted 20%)
    if data.required_timeline_months > 12:
        time_risk = 80
    elif data.required_timeline_months > 6:
        time_risk = 40
    else:
        time_risk = 20
        
    total_score = (fin_risk * 0.5) + (skill_risk * 0.3) + (time_risk * 0.2)
    
    rec = "Safe"
    if total_score > 75:
        rec = "Dangerous"
    elif total_score > 50:
        rec = "High Risk"
    elif total_score > 25:
        rec = "Moderate"
        
    return RiskOutput(
        risk_score=int(total_score),
        breakdown={
            "financial_risk": fin_risk,
            "skill_risk": skill_risk,
            "time_risk": time_risk
        },
        recommendation=rec
    )
