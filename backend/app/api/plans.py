from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

# Import Schemas
from app.schemas.salary import SalaryBridgeInput
from app.schemas.skills import SkillGapInput
from app.schemas.roadmap import RoadmapOutput

# Import Engines
from app.engines.salary import calculate_salary_bridge
from app.engines.skills import calculate_skill_gap
from app.engines.timeline import estimate_timeline, TimelineInput
from app.engines.risk import calculate_risk, RiskInput
from app.engines.options import generate_options, OptionInput
from app.engines.roadmap import generate_roadmap

router = APIRouter()

class GenerateOptionsRequest(BaseModel):
    current_role: str
    skills: List[str]

@router.post("/generate-options")
def api_generate_options(request: GenerateOptionsRequest):
    return generate_options(OptionInput(current_role=request.current_role, skills=request.skills))

class BuildPlanRequest(BaseModel):
    target_role: str
    current_role: str
    user_skills: List[str]
    target_skills: List[str]
    
    # Financials
    current_net_income: float
    monthly_expenses: float
    savings: float
    side_income: Optional[List[float]] = []
    
    # Timeline prefs
    hours_per_week: int
    horizon_months: int # 6, 12, 24

@router.post("/build")
def build_plan(request: BuildPlanRequest):
    # 1. Skill Gap
    gap_result = calculate_skill_gap(SkillGapInput(
        user_skills=request.user_skills,
        target_role_skills=request.target_skills
    ))
    
    # 2. Timeline Estimation
    timeline_result = estimate_timeline(TimelineInput(
        skill_gap_score=gap_result.gap_score,
        hours_per_week=request.hours_per_week
    ))
    
    # 3. Salary Bridge
    # Use estimated total months as the timeline
    salary_result = calculate_salary_bridge(SalaryBridgeInput(
        current_net_income=request.current_net_income,
        monthly_expenses=request.monthly_expenses,
        savings=request.savings,
        side_income_schedule=request.side_income,
        transition_timeline_months=timeline_result.total_months,
        target_salary_p25=0 # Not strictly needed for logic yet
    ))
    
    # 4. Risk Analysis
    # "buffer months" = savings / expenses (roughly)
    # We use the bridge's lowest balance to see if they survive, but for risk SCORE we look at starting position
    buffer_months = request.savings / request.monthly_expenses if request.monthly_expenses > 0 else 99
    
    risk_result = calculate_risk(RiskInput(
        salary_bridge_buffer_months=buffer_months,
        required_timeline_months=timeline_result.total_months,
        skill_gap=gap_result.gap_score
    ))
    
    # 5. Roadmap
    roadmap_result = generate_roadmap(
        target_role=request.target_role,
        skill_gap=gap_result.gap_score,
        weekly_hours=request.hours_per_week,
        horizon_months=request.horizon_months
    )
    
    return {
        "plan_summary": {
            "target_role": request.target_role,
            "estimated_duration_months": timeline_result.total_months,
            "feasibility": roadmap_result.is_feasible,
            "risk_level": risk_result.recommendation,
            "risk_score": risk_result.risk_score
        },
        "details": {
            "skill_gap": gap_result,
            "timeline": timeline_result,
            "financials": salary_result,
            "risk_analysis": risk_result,
            "roadmap": roadmap_result
        }
    }
