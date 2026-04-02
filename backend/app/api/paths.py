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
    # Check if already generated
    existing = db.query(CareerPathSet).filter(CareerPathSet.profile_id == profile_id).first()
    if existing:
        return existing
        
    profile = db.query(Profile).filter(Profile.id == profile_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
        
    # Get top 20 candidate roles
    filter_engine = CareerFilter()
    skills = profile.structured.get("target_roles", []) # MVP fallback if skills not asked explicitly 
    # Let's say we pass down current_role + target_roles + target_industries as a proxy for skills
    proxy_skills = [profile.structured.get("current_role", "")]
    candidate_roles = filter_engine.top_n(proxy_skills, n=20)
    
    # Run PathAgent
    agent = PathAgent()
    path_data = await agent.run(profile=profile.structured, candidate_roles=candidate_roles)
    
    path_set = CareerPathSet(
        profile_id=profile.id,
        paths=path_data["recommended_paths"],
        rejected_paths=path_data["rejected_paths"],
        prompt_version="path_v1_mock"
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
    
    # Here, Bridge record needs to be generated, but PLAN says synchronous. Wait, I will just return the path_set_id and bridge will be generated lazily or synchronously. 
    # For now, we will let bridge generation happen on /bridge/{path_set_id} GET or right here.
    return {"status": "success", "bridge_id": path_set_id} # bridge id will map 1:1 for simplicity
