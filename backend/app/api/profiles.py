from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.models.profile import Profile
from app.models.user import User
from pydantic import BaseModel

router = APIRouter()

class IntakeRequest(BaseModel):
    user_id: int
    raw_data: dict

@router.post("/intake")
def create_profile_intake(request: IntakeRequest, db: Session = Depends(get_db)):
    # Check if user exists
    user = db.query(User).filter(User.id == request.user_id).first()
    if not user:
        # Auto-create user for MVP simplicity if not exists
        user = User(email=f"user_{request.user_id}@example.com", is_active=True)
        db.add(user)
        db.commit()
        db.refresh(user)
    
    # Check if profile exists
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    if profile:
        profile.raw_data = request.raw_data
    else:
        profile = Profile(user_id=user.id, raw_data=request.raw_data)
        db.add(profile)
    
    db.commit()
    return {"status": "success", "profile_id": profile.id}
