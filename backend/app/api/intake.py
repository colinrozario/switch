from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.core.db import get_db
from app.models.profile import Profile
from app.models.user import User
from app.ai.agents.intake_agent import IntakeAgent
import json

router = APIRouter()

class IntakeRequest(BaseModel):
    user_id: int
    raw_text: str
    linkedin_url: Optional[str] = None

@router.post("")
async def create_intake(request: IntakeRequest, db: Session = Depends(get_db)):
    # Run the mocked IntakeAgent
    agent = IntakeAgent()
    structured_data = await agent.run(raw_text=request.raw_text, linkedin_url=request.linkedin_url)
    
    # Store in DB
    profile = Profile(
        user_id=request.user_id,
        raw_input=request.raw_text,
        structured=structured_data,
        confidence_scores=structured_data.get("confidence_scores", {}),
        prompt_version="intake_v1_mock"
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)
    
    return {"status": "complete", "result_ref": profile.id}

@router.get("/{profile_id}")
def get_intake(profile_id: int, db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.id == profile_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.patch("/{profile_id}")
def update_intake(profile_id: int, updates: dict, db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.id == profile_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    # Strict validation only for financial fields — skip validation for enrichment fields
    financial_fields = ['monthly_net_income', 'monthly_expenses', 'liquid_savings']
    for field in financial_fields:
        if field in updates:
            val = updates[field]
            if val is None or (isinstance(val, (int, float)) and val <= 0):
                raise HTTPException(
                    status_code=422,
                    detail=f"Field '{field}' is required and must be greater than zero for analysis."
                )

    # Enrich fields go into a dedicated sub-dict to keep structured clean
    enrichment_fields = {'linkedin_url', 'github_url', 'portfolio_url', 'other_links', 'resume_text'}
    enrichment_data = {k: v for k, v in updates.items() if k in enrichment_fields}
    profile_data = {k: v for k, v in updates.items() if k not in enrichment_fields}

    current_structured = dict(profile.structured or {})

    if profile_data:
        current_structured.update(profile_data)

    if enrichment_data:
        current_enrichment = current_structured.get('enrichment', {})
        current_enrichment.update(enrichment_data)
        current_structured['enrichment'] = current_enrichment

    profile.structured = current_structured
    db.commit()
    return {"status": "success"}

