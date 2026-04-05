class RoadmapAgent:
    async def run(self, profile: dict, bridge_outputs: dict, selected_path: dict) -> dict:
        phases = [
            {
                "name": "Phase 1: Intake & Alignment",
                "duration_months": 1,
                "goal": "Verify all financial buffers and transition constraints.",
                "weekly_effort_hours": 10,
                "milestones": ["Finalize current budget", "Define minimum acceptable salary", "Confirm 6-month safety buffer"],
                "failure_trigger": "Initial savings found to be below ₹1,50,000",
                "fallback_action": "Pause transition, increase primary income for 3 months."
            },
            {
                "name": "Phase 2: Preparation & Skills",
                "duration_months": 3,
                "goal": "Acquire the core 80% competencies for the new role.",
                "weekly_effort_hours": 15,
                "milestones": ["Complete certification", "Build 2 domain-specific projects", "Optimize LinkedIn profile"],
                "failure_trigger": "Missed 3 consecutive weeks of technical training",
                "fallback_action": "Reduce weekly hours, extend transition by 2 months."
            },
            {
                "name": "Phase 3: The Active Pivot",
                "duration_months": 2,
                "goal": "Secure the first professional offer.",
                "weekly_effort_hours": 20,
                "milestones": ["Apply to 30 targeted roles", "5 deep networking calls", "Complete 2 interview cycles"],
                "failure_trigger": "Zero interviews after 50 targeted applications",
                "fallback_action": "Re-audit skill gaps, pivot to adjacent 'bridge' role."
            },
            {
                "name": "Phase 4: Post-Pivot Stabilization",
                "duration_months": 3,
                "goal": "Achieve performance stability in the new role.",
                "weekly_effort_hours": 45,
                "milestones": ["Master new internal toolkits", "Deliver first major project", "Rebuild full 6-month savings buffer"],
                "failure_trigger": "Performance review below 'meets expectations' in month 3",
                "fallback_action": "Seek internal mentorship, prioritize core skill mastery."
            }
        ]
        
        return {
            "phases": phases,
            "total_months": 9,
            "opening_warning": "We've modeled this on a 9-month horizon. Adhering to the weekly effort hours is non-negotiable for success.",
            "go_no_go_signal": "If your liquid savings drop below ₹1,50,000 before reaching Phase 3, we recommend halting the transition until buffers are rebuilt."
        }
