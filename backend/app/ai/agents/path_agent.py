class PathAgent:
    async def run(self, profile: dict, candidate_roles: list) -> dict:
        # Provide exactly up to 3 paths from the candidate list as the plan describes
        recommended = []
        rejected = []
        
        for i, role in enumerate(candidate_roles):
            if i < 3:
                recommended.append({
                    "target_role_id": role["role_id"],
                    "feasibility_reasoning": f"Based on your {profile.get('years_experience', 5)} years of experience, {role['label']} is highly achievable.",
                    "key_risks": ["Might require a slight initial pay cut.", "Learning curve for new tools."],
                    "skill_gaps": ["Domain-specific knowledge", "Advanced tool certification"],
                    "estimated_transition_months": role.get("avg_transition_months", 12)
                })
            else:
                rejected.append({
                    "target_role_id": role["role_id"],
                    "rejection_reason": "Low skill overlap or insufficient available hours."
                })
                
        return {
            "recommended_paths": recommended,
            "rejected_paths": rejected
        }
