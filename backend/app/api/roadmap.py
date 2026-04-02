from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.models.salary_bridge import SalaryBridge
from app.models.roadmap import Roadmap
from app.ai.agents.roadmap_agent import RoadmapAgent

router = APIRouter()

@router.get("/{bridge_id}")
async def get_roadmap(bridge_id: int, db: Session = Depends(get_db)):
    existing = db.query(Roadmap).filter(Roadmap.salary_bridge_id == bridge_id).first()
    if existing:
        return existing
        
    bridge = db.query(SalaryBridge).filter(SalaryBridge.id == bridge_id).first()
    if not bridge:
        raise HTTPException(status_code=404, detail="Bridge not found")
        
    # Get profile
    profile = bridge.career_path_set.profile
    
    agent = RoadmapAgent()
    roadmap_data = await agent.run(
        profile=profile.structured,
        bridge_outputs=bridge.outputs,
        selected_path={"role": bridge.career_path_set.selected_path_id}
    )
    
    roadmap = Roadmap(
        salary_bridge_id=bridge_id,
        timeline_months=roadmap_data.get("total_months", 6),
        phases=roadmap_data, # store all response data under phases for MVP simplicity
        prompt_version="roadmap_v1_mock"
    )
    db.add(roadmap)
    db.commit()
    db.refresh(roadmap)
    
    return roadmap
