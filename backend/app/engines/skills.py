from app.schemas.skills import SkillGapInput, SkillGapOutput

def calculate_skill_gap(data: SkillGapInput) -> SkillGapOutput:
    user_set = set(s.lower() for s in data.user_skills)
    target_set = set(s.lower() for s in data.target_role_skills)
    
    if not target_set:
        return SkillGapOutput(gap_score=0.0, missing_skills=[], matched_skills=[])
    
    params = target_set.intersection(user_set)
    missing = target_set - user_set
    
    # Simple ratio
    score = len(missing) / len(target_set)
    
    return SkillGapOutput(
        gap_score=round(score, 2),
        missing_skills=list(missing),
        matched_skills=list(params)
    )
