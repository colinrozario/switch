from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.core.db import get_db
from app.models.profile import Profile
from app.models.career_path_set import CareerPathSet
from app.engines.career_filter import CareerFilter
from app.ai.agents.path_agent import PathAgent

router = APIRouter()


@router.get("/{profile_id}")
async def get_paths(profile_id: int, db: Session = Depends(get_db)):
    # Return cached result if already generated
    existing = db.query(CareerPathSet).filter(CareerPathSet.profile_id == profile_id).first()
    if existing:
        return existing

    profile = db.query(Profile).filter(Profile.id == profile_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    structured = profile.structured or {}

    # Build financial constraints for filtering
    monthly_expenses = structured.get("monthly_expenses") or 45000
    liquid_savings = structured.get("liquid_savings") or 0
    runway_months = round(liquid_savings / monthly_expenses, 1) if monthly_expenses else 12

    constraints = {
        "runway_months": runway_months,
        "min_acceptable_salary_inr": monthly_expenses * 12 * 0.8,  # 80% of annual burn as floor
        "requires_remote": any("Remote" in c for c in structured.get("hard_constraints", [])),
    }

    # Get target role from profile
    target_roles = structured.get("target_roles", [])
    target_role_label = target_roles[0] if target_roles else ""

    # Semantic career matching
    filter_engine = CareerFilter()
    candidate_roles = filter_engine.top_n(
        user_text="",  # CareerFilter builds from profile if profile kwarg provided
        target_role_label=target_role_label,
        n=20,
        profile=structured,
        constraints=constraints,
    )

    # Attach runway to profile for PathAgent financial flag generation
    structured_with_runway = {**structured, "runway_months": runway_months}

    # Run PathAgent — generates constrained LLM narratives for top 3
    agent = PathAgent()
    path_data = await agent.run(profile=structured_with_runway, candidate_roles=candidate_roles)

    path_set = CareerPathSet(
        profile_id=profile.id,
        paths=path_data["recommended_paths"],
        rejected_paths=path_data["rejected_paths"],
        prompt_version="path_v2_gemini",
    )
    db.add(path_set)
    db.commit()
    db.refresh(path_set)

    return path_set


class SelectPathRequest(BaseModel):
    path_id: str


@router.post("/{path_set_id}/select")
def select_path(path_set_id: int, request: SelectPathRequest, db: Session = Depends(get_db)):
    path_set = db.query(CareerPathSet).filter(CareerPathSet.id == path_set_id).first()
    if not path_set:
        raise HTTPException(status_code=404, detail="Path set not found")

    path_set.selected_path_id = request.path_id
    db.commit()

    return {"status": "success", "bridge_id": path_set_id}
