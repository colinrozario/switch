from pydantic import BaseModel
from typing import List, Dict, Optional
from uuid import UUID

class RoadmapPhase(BaseModel):
    name: str
    duration_weeks: int
    objective: str
    actions: List[str]

class PlanData(BaseModel):
    option_role: str
    horizon: str
    roadmap: List[RoadmapPhase]
    financial_summary: Dict
    risk_analysis: Dict

class PlanResponse(BaseModel):
    id: UUID
    profile_id: UUID
    target_role_id: UUID
    roadmap: PlanData
