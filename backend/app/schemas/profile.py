from pydantic import BaseModel, Field
from typing import List, Optional
from uuid import UUID

class Skill(BaseModel):
    name: str
    level: str = Field(description="Beginner, Intermediate, Advanced, Expert")

class WorkExperience(BaseModel):
    role: str
    company: str
    duration_years: float
    description: str

class UserProfileData(BaseModel):
    full_name: str
    current_role: str
    current_income: int
    location: str
    skills: List[Skill]
    experience: List[WorkExperience]
    interests: List[str]
    risk_tolerance: str = Field(description="Low, Medium, High")

class ProfileCreate(BaseModel):
    user_id: Optional[UUID] = None
    structured_data: UserProfileData

class ProfileResponse(BaseModel):
    id: UUID
    user_id: UUID
    structured_data: UserProfileData
