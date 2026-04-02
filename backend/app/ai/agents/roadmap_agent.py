class RoadmapAgent:
    async def run(self, profile: dict, bridge_outputs: dict, selected_path: dict) -> dict:
        phases = [
            {
                "name": "Phase 1: Skill Building",
                "duration_months": 3,
                "goal": "Acquire baseline skills required.",
                "weekly_effort_hours": 15,
                "milestones": ["Complete primary curriculum", "Build first portfolio project"],
                "failure_trigger": "Missed 3 consecutive weeks of study",
                "fallback_action": "Pause transition, reassess timeline or scale down goal."
            },
            {
                "name": "Phase 2: Job Search & Interview Prep",
                "duration_months": 2,
                "goal": "Land a job offer.",
                "weekly_effort_hours": 20,
                "milestones": ["Resume revamp", "Apply to 20 roles", "Pass 2 mock interviews"],
                "failure_trigger": "No interviews after 50 applications",
                "fallback_action": "Pivot focus back to networking or portfolio building."
            }
        ]
        
        return {
            "phases": phases,
            "total_months": 5,
            "opening_warning": "You are transitioning into a high-demand role, but your savings runway is tight. Strict budget adherence is required.",
            "go_no_go_signal": "If your liquid savings drop below $2000 before reaching Phase 2, halt the transition immediately."
        }
