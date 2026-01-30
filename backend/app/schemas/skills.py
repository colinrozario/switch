from pydantic import BaseModel
from typing import List

class SkillGapInput(BaseModel):
    user_skills: List[str]
    target_role_skills: List[str]

class SkillGapOutput(BaseModel):
    gap_score: float # 0.0 to 1.0 (1.0 = 100% gap)
    missing_skills: List[str]
    matched_skills: List[str]
