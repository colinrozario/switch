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
    
    # TODO: Connect to a real graph database or in-memory graph structure.
    # For Phase 2/Prototype, we will return mock deterministic options
    # that would seemingly come from a graph analysis.
    
    # Mock database of roles
    mock_roles = [
        {
            "role_key": "backend_engineer",
            "title": "Backend Engineer",
            "base_salary_p25": 120000,
            "difficulty": 1.2,
            "match_score": 0.85
        },
        {
            "role_key": "data_engineer",
            "title": "Data Engineer",
            "base_salary_p25": 130000,
            "difficulty": 1.3,
            "match_score": 0.75
        },
        {
            "role_key": "technical_product_manager",
            "title": "Technical Product Manager",
            "base_salary_p25": 135000,
            "difficulty": 1.4,
            "match_score": 0.65
        },
        {
            "role_key": "devops_engineer",
            "title": "DevOps Engineer",
            "base_salary_p25": 125000,
            "difficulty": 1.3,
            "match_score": 0.70
        }
    ]
    
    # Filter/Sort logic (basic implementation)
    # real logic would traverse edges: current_role -> target_role
    
    results = []
    
    for role in mock_roles:
        # Check constraints (mock)
        # Calculate feasibility
        
        # Mock values
        salary_delta = role["base_salary_p25"] - profile.get("current_salary", 80000)
        
        result = {
            "role_key": role["role_key"],
            "title": role["title"],
            "feasibility_score": role["match_score"] * 100, # 0-100
            "estimated_timeline": {
                "low": 6, 
                "high": 9 
            },  # This would call timeline_engine in real flow
            "salary_delta_p25": salary_delta,
            "risk_preview": {
                "level": "Medium" if role["difficulty"] > 1.2 else "Low",
                "score": int(role["difficulty"] * 20)
            },
            "reason_codes": ["high_demand", "skill_overlap"]
        }
        results.append(result)
        
    # Sort by feasibility
    results.sort(key=lambda x: x["feasibility_score"], reverse=True)
    
    return results[:top_n]
