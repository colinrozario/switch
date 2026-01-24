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

class ProfileConstraints(BaseModel):
    weekly_hours: str = "10-15"
    location_flexibility: str = "Flexible"
    dependents: str = "None"

class ProfileFinancials(BaseModel):
    monthly_expenses: int = 0
    liquid_savings: int = 0
    has_stable_income: bool = True

class ProfileGoal(BaseModel):
    target_role: Optional[str] = None
    type: str = "unsure" # target or unsure
    motivations: List[str] = []

class UserProfileData(BaseModel):
    full_name: str = "Unknown"
    current_role: str
    current_income: int = 0
    location: str = "Unknown"
    skills: List[Skill] = []
    experience: List[WorkExperience] = []
    interests: List[str] = []
    risk_tolerance: str = Field(description="Low, Medium, High", default="Medium")
    
    # New Diagnosis Fields
    constraints: ProfileConstraints = Field(default_factory=ProfileConstraints)
    financials: ProfileFinancials = Field(default_factory=ProfileFinancials)
    goal: ProfileGoal = Field(default_factory=ProfileGoal)

class ProfileCreate(BaseModel):
    user_id: Optional[UUID] = None
    structured_data: UserProfileData

class ProfileResponse(BaseModel):
    id: UUID
    user_id: UUID
    structured_data: UserProfileData
