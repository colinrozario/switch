from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.models.salary_bridge import SalaryBridge
from app.models.roadmap import Roadmap
from app.ai.agents.roadmap_agent import RoadmapAgent

router = APIRouter()


@router.get("/{bridge_id}")
async def get_roadmap(
    bridge_id: int,
    horizon: int = Query(default=9, ge=6, le=24, description="Plan horizon in months (6, 9, or 12 recommended)"),
    db: Session = Depends(get_db),
):
    # Serve cached roadmap if horizon matches; otherwise regenerate
    existing = (
        db.query(Roadmap)
        .filter(Roadmap.salary_bridge_id == bridge_id)
        .first()
    )
    if existing:
        stored_phases = existing.phases or {}
        stored_horizon = stored_phases.get("horizon_months", existing.timeline_months)
        if stored_horizon == horizon:
            return existing
        db.delete(existing)
        db.commit()

    bridge = db.query(SalaryBridge).filter(SalaryBridge.id == bridge_id).first()
    if not bridge:
        raise HTTPException(status_code=404, detail="Bridge not found")

    career_path_set = bridge.career_path_set
    if not career_path_set:
        raise HTTPException(status_code=404, detail="Career path set not found for this bridge")

    profile = career_path_set.profile
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    # Resolve the selected path's full data from the paths list
    selected_role_id = career_path_set.selected_path_id or ""
    selected_path_data = {}
    if selected_role_id and career_path_set.paths:
        for p in career_path_set.paths:
            if p.get("target_role_id") == selected_role_id:
                selected_path_data = {
                    "role": p.get("target_role_label", selected_role_id),
                    "description": p.get("feasibility_details", ""),
                    "skills": p.get("skill_gaps", []),
                    "annual_salary_p50_inr": p.get("annual_salary_p50_inr", 0),
                    "estimated_transition_months": p.get("estimated_transition_months", horizon),
                }
                break

    if not selected_path_data:
        selected_path_data = {"role": selected_role_id or "Target Role"}

    agent = RoadmapAgent()
    roadmap_data = await agent.run(
        profile=profile.structured or {},
        bridge_outputs=bridge.outputs or {},
        selected_path=selected_path_data,
        horizon_months=horizon,
    )

    roadmap = Roadmap(
        salary_bridge_id=bridge_id,
        timeline_months=roadmap_data.get("total_months", horizon),
        phases=roadmap_data,
        prompt_version="roadmap_v3_gemini_detailed",
    )
    db.add(roadmap)
    db.commit()
    db.refresh(roadmap)

    return roadmap
