from pydantic import BaseModel
import math

class TimelineInput(BaseModel):
    skill_gap_score: float
    hours_per_week: int # how much time can they commit?

class TimelineOutput(BaseModel):
    skill_phase_months: int
    proof_months: int
    job_search_months: int
    total_months: int

def estimate_timeline(data: TimelineInput) -> TimelineOutput:
    # Base assumptions (conservative)
    # A full reskill (gap=1.0) implies needing significant hours.
    # Assumption: 800 hours for a complete domain switch (gap=1.0)
    hours_needed = data.skill_gap_score * 800
    
    if data.hours_per_week <= 0:
        months_skill = 999 # Inf
    else:
        weeks = hours_needed / data.hours_per_week
        months_skill = math.ceil(weeks / 4)
        
    # Proof Phase: Building portfolio. 
    # Minimum 1 month, or 20% of skill time.
    months_proof = max(1, math.ceil(months_skill * 0.2))
    
    # Job Search: Conservative 3 months base.
    months_search = 3
    
    total = months_skill + months_proof + months_search
    
    return TimelineOutput(
        skill_phase_months=months_skill,
        proof_months=months_proof,
        job_search_months=months_search,
        total_months=total
    )
