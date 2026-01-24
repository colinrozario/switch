from app.engines.timeline_engine import estimate_transition_timeline

def test_timeline_estimation():
    result = estimate_transition_timeline(
        skill_gap_score=0.5, # ~500 hours
        weekly_hours=20, # 25 weeks -> ~6 months
        difficulty_multiplier=1.0
    )
    
    # 500 hours / 20 hours/wk = 25 weeks.
    # 25 weeks / 4.3 = 5.8 -> round up to 6 months skills
    # Job search base 2 months
    # Total low = 6 + 2 = 8
    
    assert result["skill_phase_months"] == 6
    assert result["job_search_months"] == 2
    assert result["total_low"] == 8
