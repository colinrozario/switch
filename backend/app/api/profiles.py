from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import Profile, User
from app.schemas.profile import ProfileCreate, ProfileResponse, UserProfileData
from app.ai.orchestrator import Orchestrator
import uuid
import json

router = APIRouter()
orchestrator = Orchestrator()

from pydantic import BaseModel

class IntakeRequest(BaseModel):
    input_text: str

@router.post("/intake", response_model=ProfileResponse)
def create_profile_intake(
    request: IntakeRequest,
    db: Session = Depends(get_db),
    # user_id: uuid.UUID = Depends(get_current_user) # Skip auth for now
):
    """
    Analyzes raw text input to create a structured profile.
    """
    # 1. AI Analysis
    try:
        print(f"Processing intake for text length: {len(request.input_text)}")
        structured_data = orchestrator.process_intake(request.input_text)
    except Exception as e:
        print(f"CRITICAL ERROR in process_intake: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"AI Processing Failed: {str(e)}")
    
    # 2. Save to DB
    # Create dummy user if not exists for prototype
    user = db.query(User).first()
    if not user:
        user = User(email="demo@example.com", hashed_password="pw")
        db.add(user)
        db.commit()
        db.refresh(user)
        
    profile = Profile(
        user_id=user.id,
        structured_data=json.dumps(structured_data.model_dump())  # Serialize to JSON string
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)
    
    return ProfileResponse(
        id=profile.id,
        user_id=profile.user_id,
        structured_data=structured_data
    )
