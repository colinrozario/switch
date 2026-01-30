from app.schemas.roadmap import RoadmapOutput, RoadmapPhase, PhaseMilestone
import math

def generate_roadmap(target_role: str, skill_gap: float, weekly_hours: int, horizon_months: int) -> RoadmapOutput:
    """
    Generates a deterministic roadmap based on inputs.
    """
    
    phases = []
    
    # 1. Stabilization Phase (Fixed)
    # Goal: Prepare finances and schedule.
    phases.append(RoadmapPhase(
        name="Stabilization",
        objective="Secure finances and carve out time.",
        duration_weeks=2,
        weekly_hours_required=5,
        milestones=[
            PhaseMilestone(name="Audit Finances", description="Calculate true burn rate and runway."),
            PhaseMilestone(name="Schedule Block", description=f"Secure {weekly_hours} hours/week mostly deep work.")
        ]
    ))
    
    # 2. Skill Build Phase
    # Duration depends on gap.
    # Base: 800 hours for 1.0 gap.
    total_skill_hours = skill_gap * 800
    if weekly_hours > 0:
        skill_weeks = math.ceil(total_skill_hours / weekly_hours)
    else:
        skill_weeks = 52 * 4 # Cap at 4 years roughly if hours are 0 (should not happen due to validation)

    phases.append(RoadmapPhase(
        name="Skill Build",
        objective=f"Acquire core competencies for {target_role}.",
        duration_weeks=skill_weeks,
        weekly_hours_required=weekly_hours,
        milestones=[
            PhaseMilestone(name="Foundations", description="Learn syntax and core concepts."),
            PhaseMilestone(name="Advanced Concepts", description="Build complexity and understanding.")
        ]
    ))
    
    # 3. Proof / Portfolio
    # Usually 20% of skill time, min 4 weeks.
    proof_weeks = max(4, math.ceil(skill_weeks * 0.2))
    phases.append(RoadmapPhase(
        name="Proof of Work",
        objective="Build evidence of ability.",
        duration_weeks=proof_weeks,
        weekly_hours_required=weekly_hours,
        milestones=[
            PhaseMilestone(name="Capstone Project", description="Build one production-grade asset."),
            PhaseMilestone(name="Case Study", description="Document the process and results.")
        ]
    ))
    
    # 4. Market Validation (Networking / Applying)
    market_weeks = 8 # Fixed conservative estimate
    phases.append(RoadmapPhase(
        name="Market Validation",
        objective="Get interviews and feedback.",
        duration_weeks=market_weeks,
        weekly_hours_required=10, # Can be lower density
        milestones=[
            PhaseMilestone(name="Resume/Profile Polish", description="Align assets with market phrasing."),
            PhaseMilestone(name="Outreach", description="Contact 50+ relevant companies.")
        ]
    ))
    
    total_weeks = 2 + skill_weeks + proof_weeks + market_weeks
    total_months = math.ceil(total_weeks / 4.33)
    
    warnings = []
    is_feasible = True
    risk_level = "Low"
    
    if total_months > horizon_months:
        warnings.append(f"Plan requires {total_months} months, but horizon is {horizon_months} months.")
        risk_level = "Difficuly"
        # Strategy: Compression? 
        # For MVP, we just mark it as longer than horizon.
        if total_months > horizon_months * 1.5:
             risk_level = "Extreme"
             is_feasible = False
        else:
            risk_level = "High"
            
    return RoadmapOutput(
        horizon=f"{horizon_months} months",
        phases=phases,
        total_duration_months=total_months,
        risk_level=risk_level,
        is_feasible=is_feasible,
        warnings=warnings
    )
