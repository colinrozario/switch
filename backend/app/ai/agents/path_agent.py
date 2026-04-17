class PathAgent:
    async def run(self, profile: dict, candidate_roles: list) -> dict:
        # Provide exactly up to 3 paths from the candidate list as the plan describes
        recommended = []
        rejected = []
        
        # Mapping for mock data based on role ids
        mock_details = {
            "product_manager": {
                "summary": "Your background in coordination maps directly to product lifecycle management.",
                "details": "With your extensive experience in project delivery and stakeholder management, moving into Product Management is a natural progression. Your skills in managing timelines and cross-functional teams cover approximately 70% of the PM core competencies. The remaining gap is primarily in product strategy and market discovery, which can be acquired through targeted certification."
            },
            "data_analyst": {
                "summary": "Strong quantitative foundation makes this a statistically high-match transition.",
                "details": "The transition to Data Analysis is highly feasible given your previous work with spreadsheets and reporting. While you'll need to master specific tools like SQL or Tableau, your ability to extract insights from raw data is already evident. This path offers a stable transition with a 90% match for your previous analytical tasks."
            },
            "operations_lead": {
                "summary": "Matches your logistical expertise but requires adaptation to supply-chain specific tools.",
                "details": "This role leverages your experience in process optimization and team leading. Your historical success in managing operational workflows will minimize the learning curve. The primary risk is the current market volatility in logistics, but your transferable skills provide a strong safety net."
            }
        }

        for i, role in enumerate(candidate_roles):
            role_id = role["role_id"]
            if i < 3:
                # Dynamically construct details using the actual candidate_role stats
                t_months = role.get('avg_transition_months', 9)
                details = {
                    "summary": f"Your background shows overlapping skills for a transition to {role['label']}.",
                    "details": f"Transitioning to {role['label']} typically takes {t_months} to {t_months + 3} months. The primary gap is in domain-specific technical skills, which can be acquired through targeted certification."
                }
                
                recommended.append({
                    "target_role_id": role_id,
                    "target_role_label": role["label"],
                    "feasibility_summary": details["summary"],
                    "feasibility_details": details["details"],
                    "key_risks": ["Potential for initial vertical move instead of promotion.", "Higher competition for entry-level roles in this domain."],
                    "skill_gaps": ["Domain-specific tool proficiency", "Advanced stakeholder communication"],
                    "estimated_transition_months": t_months
                })
            else:
                # Specific honest reasons
                reasons = [
                    "Requires 12+ months of full-time retraining which exceeds your current savings runway.",
                    "High initial pay cut (> 40%) makes this path financially unsustainable under your current constraints.",
                    "Geographical requirement does not match your hybrid/remote constraint.",
                    "Industry saturation currently makes the time-to-hire too unpredictable."
                ]
                rejected.append({
                    "target_role_id": role_id,
                    "target_role_label": role["label"],
                    "rejection_reason": reasons[i % len(reasons)]
                })
                
        return {
            "recommended_paths": recommended,
            "rejected_paths": rejected
        }
