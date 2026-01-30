from pydantic import BaseModel
from typing import List, Optional

class PhaseMilestone(BaseModel):
    name: str
    description: str

class RoadmapPhase(BaseModel):
    name: str # Stabilization, Skill Build, Proof, Market Validation, Transition
    objective: str
    duration_weeks: int
    weekly_hours_required: int
    milestones: List[PhaseMilestone]

class RoadmapOutput(BaseModel):
    horizon: str # "6 months", "1 year", "2 years"
    phases: List[RoadmapPhase]
    total_duration_months: int
    risk_level: str # Low, Medium, High, Extreme
    is_feasible: bool
    warnings: List[str]
