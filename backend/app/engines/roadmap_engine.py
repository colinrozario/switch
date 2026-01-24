from typing import List, Dict, Literal
from app.schemas.plan import RoadmapPhase, PlanData

def get_roadmap_templates(horizon: str) -> List[Dict]:
    """
    Returns the phase structure based on the horizon.
    """
    if horizon == "6m":
        # Aggressive
        return [
            {"name": "Stabilization", "duration_weeks": 2, "objective": "Secure finances and schedule."},
            {"name": "Intensive Skill Build", "duration_weeks": 12, "objective": "Acquire core competencies."},
            {"name": "Market Proof", "duration_weeks": 4, "objective": "Build portfolio projects."},
            {"name": "Aggressive Job Search", "duration_weeks": 8, "objective": "Land interviews and offers."}
        ]
    elif horizon == "1y":
        # Balanced
        return [
            {"name": "Foundation", "duration_weeks": 4, "objective": "Research and preliminary learning."},
            {"name": "Core Skill Acquisition", "duration_weeks": 20, "objective": "Deep dive into required skills."},
            {"name": "Practical Application", "duration_weeks": 12, "objective": "Projects and contributions."},
            {"name": "Networking & Branding", "duration_weeks": 8, "objective": "Build presence."},
            {"name": "Transition & Search", "duration_weeks": 8, "objective": "Active transition."}
        ]
    else:
        # Conservative (2y)
        return [
            {"name": "Exploration", "duration_weeks": 12, "objective": "Low-stakes learning."},
            {"name": "Steady Upskilling", "duration_weeks": 48, "objective": "Long-term course work."},
            {"name": "Side Projects", "duration_weeks": 24, "objective": "Apply skills without quitting."},
            {"name": "Gradual Transition", "duration_weeks": 20, "objective": "Shift role internally or searching."}
        ]

def build_roadmap(
    option: Dict,
    finance_results: Dict,
    risk_results: Dict,
    horizon: Literal["6m", "1y", "2y"]
) -> PlanData:
    """
    Constructs a deterministic roadmap skeleton.
    """
    
    templates = get_roadmap_templates(horizon)
    phases = []
    
    for tmpl in templates:
        phases.append(RoadmapPhase(
            name=tmpl["name"],
            duration_weeks=tmpl["duration_weeks"],
            objective=tmpl["objective"],
            actions=[] # To be filled by AI
        ))
        
    return PlanData(
        option_role=option.get("title", "Unknown Role"),
        horizon=horizon,
        roadmap=phases,
        financial_summary={
            "runway_months": finance_results.get("simulation_months"),
            "lowest_balance": finance_results.get("lowest_balance"),
            "risk_status": "CRITICAL" if finance_results.get("failure_month") else "OK"
        },
        risk_analysis=risk_results
    )
