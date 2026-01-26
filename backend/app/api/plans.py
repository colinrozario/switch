from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Literal, Dict

from app.db.session import get_db
from app.db.models import Profile, Plan, Scenario
from app.schemas.plan import PlanResponse, PlanData
from app.engines import finance_engine, timeline_engine, risk_engine, career_graph_engine, roadmap_engine
from app.ai.orchestrator import Orchestrator
from app.schemas.profile import UserProfileData
import uuid

router = APIRouter()
orchestrator = Orchestrator()

@router.post("/generate-options")
def generate_career_options_api(
    profile_id: uuid.UUID,
    db: Session = Depends(get_db)
):
    profile = db.query(Profile).filter(Profile.id == profile_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
        
    # Run Engine
    options = career_graph_engine.generate_career_options(
        profile.structured_data,
        constraints={},
        finance_limits={}
    )
    
    # AI Explanation
    enhanced_options = []
    for opt in options:
        # We could async this or do it on demand
        explanation = orchestrator.explain_option(opt, profile.structured_data)
        opt["ai_explanation"] = explanation
        enhanced_options.append(opt)
        
    return enhanced_options

@router.post("/{id}/build", response_model=PlanResponse)
def build_plan_implementation(
    id: uuid.UUID, # Plan ID (or we create new if not passed? let's assume create new flow usually)
    target_role_key: str, # passed in body usually
    horizon: Literal["6m", "1y", "2y"],
    profile_id: uuid.UUID,
    db: Session = Depends(get_db)
):
    # This acts as the Target Role Pipeline
    profile = db.query(Profile).filter(Profile.id == profile_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
        
    # 1. Timeline
    timeline_res = timeline_engine.estimate_transition_timeline(
        skill_gap_score=0.5, # Mock, needs real calc
        weekly_hours=20
    )
    
    # 2. Finance
    # Extract financials from profile structure
    try:
        financials = profile.structured_data.get("financials", {})
        monthly_expenses = financials.get("monthly_expenses", 3000)
        savings = financials.get("liquid_savings", 10000)
        # safe defaults if 0
        if monthly_expenses == 0: monthly_expenses = 3000 
    except:
        monthly_expenses = 3000
        savings = 10000

    finance_res = finance_engine.simulate_salary_bridge(
        current_income=profile.structured_data.get("current_income", 0),
        monthly_expenses=monthly_expenses,
        savings=savings,
        timeline_months=timeline_res["total_low"],
        side_income_schedule={},
        target_income_p25=8000 # Should come from role data
    )
    
    # 3. Risk
    risk_res = risk_engine.analyze_risk(finance_res, timeline_res)
    
    # 4. Roadmap Structure
    option_mock = {"title": target_role_key} # Fetch real details
    plan_data = roadmap_engine.build_roadmap(option_mock, finance_res, risk_res, horizon)
    
    # 5. AI Enrichment (Roadmap Writer)
    for phase in plan_data.roadmap:
        # Convert dict back to UserProfileData
        user_profile_obj = UserProfileData(**profile.structured_data)
        
        actions = orchestrator.generate_roadmap_actions(
            phase.model_dump(),
            profile=user_profile_obj,
            target_role=target_role_key
        )
        phase.actions = actions

    # Save Plan
    db_plan = Plan(
        id=uuid.uuid4(),
        profile_id=profile_id,
        # target_role_id=... need to resolve key to UUID
        roadmap=plan_data.model_dump()
    )
    db.add(db_plan)
    db.commit()
    
    return PlanResponse(
        id=db_plan.id,
        profile_id=profile_id,
        target_role_id=uuid.uuid4(), # Mock
        roadmap=plan_data
    )

@router.post("/{id}/scenario")
def create_scenario(
    id: uuid.UUID,
    assumptions: Dict, # modified variables
    db: Session = Depends(get_db)
):
    # Re-run engines with new assumptions
    # This corresponds to Task 14
    # Mock implementation
    return {"message": "Scenario created", "delta": {"runway_change": "+2 months"}}

@router.post("/{id}/assets")
def generate_assets(
    id: uuid.UUID,
    asset_type: Literal["resume", "linkedin", "outreach"],
    db: Session = Depends(get_db)
):
    # Task 15
    # Call AI to generate text
    return {"asset_type": asset_type, "content": "Generated content placeholder."}
