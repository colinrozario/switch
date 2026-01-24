import math
from typing import Dict

def estimate_transition_timeline(
    skill_gap_score: float,
    weekly_hours: int,
    difficulty_multiplier: float = 1.0
) -> Dict:
    """
    Estimates the timeline for a career transition based on skill gap and effort.
    
    Args:
        skill_gap_score: 0.0 to 1.0 representing the magnitude of the skill gap.
        weekly_hours: Hours per week committed to the transition.
        difficulty_multiplier: Multiplier for harder roles (e.g., 1.5 for AI Research).
        
    Returns:
        Dict with estimated months for skills and job search.
    """
    
    # Baseline: A 1.0 gap (total reskill) takes ~1000 hours (roughly 6 months full time).
    # This is a heuristic base.
    BASE_HOURS_FOR_FULL_GAP = 1000
    
    required_hours = BASE_HOURS_FOR_FULL_GAP * skill_gap_score * difficulty_multiplier
    
    # Weekly hours constraint
    # Input validation
    if weekly_hours <= 0:
        weekly_hours = 1 # Avoid div by zero, assume minimal effort
    
    # Calculate weeks needed
    weeks_needed = required_hours / weekly_hours
    
    # Convert to months (approx 4.3 weeks per month)
    skill_phase_months = math.ceil(weeks_needed / 4.3)
    
    # Job search duration
    # Heuristic: Harder roles take longer to find.
    # Base search time: 2 months. 
    # Add time based on difficulty and if specific skills are niche.
    base_search_months = 2
    job_search_months = math.ceil(base_search_months * difficulty_multiplier)
    
    total_months_est = skill_phase_months + job_search_months
    
    # Ranges
    total_low = total_months_est
    total_high = math.ceil(total_months_est * 1.5) # Buffer for reality
    
    return {
        "skill_phase_months": skill_phase_months,
        "job_search_months": job_search_months,
        "total_low": total_low,
        "total_high": total_high,
        "required_hours": int(required_hours)
    }
