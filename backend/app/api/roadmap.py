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
    horizon: int = Query(default=9, ge=6, le=24, description="Plan horizon in months (6, 8, or 12 recommended)"),
    db: Session = Depends(get_db),
):
    # Serve cached roadmap if horizon matches; otherwise regenerate
    existing = (
        db.query(Roadmap)
        .filter(Roadmap.salary_bridge_id == bridge_id)
        .first()
    )
    if existing:
        # Re-use if the stored horizon matches the requested one
        stored_phases = existing.phases or {}
        stored_horizon = stored_phases.get("horizon_months", existing.timeline_months)
        if stored_horizon == horizon:
            return existing
        # Otherwise delete old and regenerate
        db.delete(existing)
        db.commit()

    bridge = db.query(SalaryBridge).filter(SalaryBridge.id == bridge_id).first()
    if not bridge:
        raise HTTPException(status_code=404, detail="Bridge not found")

    # Traverse relationship: bridge → career_path_set → profile
    career_path_set = bridge.career_path_set
    if not career_path_set:
        raise HTTPException(status_code=404, detail="Career path set not found for this bridge")

    profile = career_path_set.profile
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    selected_role = career_path_set.selected_path_id or "your target role"

    agent = RoadmapAgent()
    roadmap_data = await agent.run(
        profile=profile.structured or {},
        bridge_outputs=bridge.outputs or {},
        selected_path={"role": selected_role},
        horizon_months=horizon,
    )

    roadmap = Roadmap(
        salary_bridge_id=bridge_id,
        timeline_months=roadmap_data.get("total_months", horizon),
        phases=roadmap_data,
        prompt_version="roadmap_v2_deterministic",
    )
    db.add(roadmap)
    db.commit()
    db.refresh(roadmap)

    return roadmap
