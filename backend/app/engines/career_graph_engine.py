from typing import List, Dict

def generate_career_options(
    profile: Dict,
    constraints: Dict,
    finance_limits: Dict,
    top_n: int = 3
) -> List[Dict]:
    """
    Generates career options based on profile and graph analysis.
    
    Args:
        profile: Dictionary containing user skills, current role, etc.
        constraints: User constraints (e.g., no relocation).
        finance_limits: Constraints from finance engine (optional).
        top_n: Number of options to return.
        
    Returns:
        List of career option dictionaries.
    """
    
    # Use AI to generate options
    from app.ai.orchestrator import Orchestrator
    from app.schemas.profile import UserProfileData
    
    # Reconvert dict to Pydantic for the orchestrator (temporary hack until we standardize inputs)
    # The engine should arguably receive the Pydantic object directly
    try:
        user_profile = UserProfileData(**profile)
    except:
        # If it's already an object or has issues, try best effort or fail
        # For now assume it's the dict from the profile object
        user_profile = UserProfileData(**profile)

    orchestrator = Orchestrator()
    ai_options = orchestrator.generate_career_paths(user_profile)
    
    results = []
    
    for role in ai_options:
        # Normalize keys if needed
        result = {
            "role_key": role.get("role_key"),
            "title": role.get("title"),
            "feasibility_score": role.get("feasibility_score"),
            "estimated_timeline": {
                "low": int(role.get("difficulty", 3) * 4), # Heuristic: difficulty * 4 weeks? No, maybe months. Let's say difficulty 1=3m, 5=15m.
                "high": int(role.get("difficulty", 3) * 6) 
            },  
            "salary_delta_p25": role.get("salary_delta_p25"),
            "risk_preview": {
                "level": "High" if role.get("difficulty", 3) > 3.5 else "Medium" if role.get("difficulty", 3) > 2 else "Low",
                "score": int(role.get("difficulty", 3) * 20)
            },
            "reason_codes": role.get("reason_codes", []),
            "ai_rationale": role.get("rationale")
        }
        results.append(result)
        
    # Sort by feasibility
    results.sort(key=lambda x: x["feasibility_score"], reverse=True)
    
    return results[:top_n]
