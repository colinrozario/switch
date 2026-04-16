import math


class RoadmapAgent:
    async def run(
        self,
        profile: dict,
        bridge_outputs: dict,
        selected_path: dict,
        horizon_months: int = 9,
    ) -> dict:
        """
        Generates a deterministic, phase-based roadmap scaled to the user's chosen horizon.
        horizon_months: 6, 8, or 12 (defaults to 9 for legacy calls).
        """
        role = selected_path.get("role", "your target role")
        liquid_savings = profile.get("liquid_savings", 300000)
        monthly_expenses = profile.get("monthly_expenses", 45000)
        savings_threshold = monthly_expenses * 3  # 3-month buffer = danger zone

        # --- Scale phases proportionally to horizon ---
        # Horizon breakdown (approximate):
        #  Phase 1 Intake/Alignment:  ~10% of horizon (min 1 month)
        #  Phase 2 Skill Build:       ~40% of horizon
        #  Phase 3 Active Pivot:      ~30% of horizon
        #  Phase 4 Stabilization:     ~20% of horizon (min 1 month)

        p1_months = max(1, math.floor(horizon_months * 0.10))
        p2_months = max(1, math.floor(horizon_months * 0.40))
        p3_months = max(1, math.floor(horizon_months * 0.30))
        p4_months = max(1, horizon_months - p1_months - p2_months - p3_months)

        weekly_hours = profile.get("weekly_hours_available", 10)

        phases = [
            {
                "name": "Phase 1: Intake & Alignment",
                "duration_months": p1_months,
                "goal": "Lock in your financial buffer and weekly schedule.",
                "weekly_effort_hours": min(10, weekly_hours),
                "milestones": [
                    "Finalize current monthly budget and burn rate",
                    "Define your minimum acceptable salary for the new role",
                    f"Confirm at least {savings_threshold:,.0f} savings buffer in place",
                ],
                "failure_trigger": f"Liquid savings found below ₹{savings_threshold:,.0f} before Phase 2",
                "fallback_action": "Pause transition. Grow primary income for 2-3 months before restarting.",
            },
            {
                "name": "Phase 2: Skill Build",
                "duration_months": p2_months,
                "goal": f"Acquire the core competencies needed for {role}.",
                "weekly_effort_hours": weekly_hours,
                "milestones": [
                    "Complete primary certification or structured course",
                    "Build 2 domain-specific portfolio projects",
                    "Optimize LinkedIn and resume for the new role",
                ],
                "failure_trigger": "Missed 3 or more consecutive weeks of structured learning",
                "fallback_action": f"Reduce daily targets, extend Phase 2 by {max(1, p2_months // 3)} months.",
            },
            {
                "name": "Phase 3: Active Pivot",
                "duration_months": p3_months,
                "goal": "Secure the first professional offer in the new field.",
                "weekly_effort_hours": min(weekly_hours + 5, 30),
                "milestones": [
                    "Apply to 30+ targeted, well-researched roles",
                    "Complete 5 focused networking calls with people in the target role",
                    "Close at least 2 full interview cycles",
                ],
                "failure_trigger": "Zero interview invites after 50 targeted applications",
                "fallback_action": "Re-audit skill gaps. Pivot to a 'bridge' adjacent role to build credibility.",
            },
            {
                "name": "Phase 4: Post-Pivot Stabilisation",
                "duration_months": p4_months,
                "goal": "Achieve performance stability and rebuild savings.",
                "weekly_effort_hours": 45,
                "milestones": [
                    "Master new internal tools and workflows",
                    "Deliver one high-visibility project in the new role",
                    "Rebuild your full 6-month emergency savings buffer",
                ],
                "failure_trigger": "Performance rating below 'meets expectations' in first 90 days",
                "fallback_action": "Seek internal mentorship immediately. Prioritise core skill mastery over output speed.",
            },
        ]

        total_months = p1_months + p2_months + p3_months + p4_months

        opening_warning = (
            f"This is a {horizon_months}-month plan. "
            f"Sticking to weekly effort hours is non-negotiable — skipping even 2 weeks has compounding effects."
        )

        go_no_go_signal = (
            f"If your liquid savings fall below ₹{savings_threshold:,.0f} before reaching Phase 3, "
            f"halt the transition immediately and restore your buffer first."
        )

        return {
            "phases": phases,
            "total_months": total_months,
            "horizon_months": horizon_months,
            "opening_warning": opening_warning,
            "go_no_go_signal": go_no_go_signal,
        }
