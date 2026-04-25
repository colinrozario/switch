"""
RoadmapAgent — Gemini-powered detailed career roadmap generator.

Generates a structured, phase-by-phase roadmap with:
- Sequenced skill learning timeline (week-by-week)
- Specific portfolio projects to build
- Real courses/exams with costs in INR
- Per-phase financial cost breakdown
- Failure triggers and fallback actions
"""
import json
import logging
import math
import anyio
from typing import Optional
from google import genai
from google.genai import types
from app.core.config import settings

logger = logging.getLogger(__name__)


SYSTEM_PROMPT = """You are an elite career transition architect. You build detailed, executable career roadmaps for professionals switching careers in India.

RULES:
1. Be HYPER-SPECIFIC. Name real tools, real platforms, real course names. No generic "learn Python" — say "Complete 'Python for Everybody' on Coursera (₹2,800/month)".
2. Sequence skills with actual week numbers. If SQL must come before Tableau, week_start for Tableau must be > week_end for SQL.
3. Use REAL costs in INR. Free = ₹0. Coursera = ₹2,800–3,500/month. Udemy = ₹499–799. Official certs = actual exam fees.
4. Projects must be portfolio-quality. Not "build a calculator" — "Build a sales forecasting dashboard using real Kaggle data, deploy on Streamlit, and publish on GitHub."
5. Scale the roadmap to the exact horizon_months provided. Distribute phases proportionally.
6. Be financially honest. Include course costs, exam fees in estimated_cost_inr for each phase.

OUTPUT: Return ONLY a valid JSON object with no markdown, no explanation."""


ROADMAP_SCHEMA = {
    "type": "object",
    "properties": {
        "opening_warning": {"type": "string"},
        "go_no_go_signal": {"type": "string"},
        "total_months": {"type": "number"},
        "horizon_months": {"type": "number"},
        "phases": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "phase_number": {"type": "number"},
                    "name": {"type": "string"},
                    "duration_weeks": {"type": "number"},
                    "goal": {"type": "string"},
                    "weekly_hours": {"type": "number"},
                    "estimated_cost_inr": {"type": "number"},
                    "skills": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "name": {"type": "string"},
                                "week_start": {"type": "number"},
                                "week_end": {"type": "number"},
                                "is_blocker": {"type": "boolean"},
                                "why_essential": {"type": "string"},
                                "free_resource": {"type": "string"},
                                "paid_resource": {"type": "string"}
                            }
                        }
                    },
                    "projects": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "name": {"type": "string"},
                                "description": {"type": "string"},
                                "tech_stack": {"type": "array", "items": {"type": "string"}},
                                "outcome": {"type": "string"},
                                "difficulty": {"type": "string"}
                            }
                        }
                    },
                    "courses": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "name": {"type": "string"},
                                "platform": {"type": "string"},
                                "cost_inr": {"type": "number"},
                                "duration_weeks": {"type": "number"},
                                "is_certification": {"type": "boolean"},
                                "priority": {"type": "string"}
                            }
                        }
                    },
                    "failure_trigger": {"type": "string"},
                    "fallback_action": {"type": "string"}
                }
            }
        }
    }
}


class RoadmapAgent:
    def __init__(self):
        self._gemini_ready = bool(settings.GEMINI_API_KEY)
        if self._gemini_ready:
            self._client = genai.Client(api_key=settings.GEMINI_API_KEY)

    async def run(
        self,
        profile: dict,
        bridge_outputs: dict,
        selected_path: dict,
        horizon_months: int = 9,
    ) -> dict:
        if self._gemini_ready:
            try:
                return await self._gemini_generate(profile, bridge_outputs, selected_path, horizon_months)
            except Exception as e:
                logger.warning(f"[RoadmapAgent] Gemini failed ({e}), using deterministic fallback")

        return self._deterministic_fallback(profile, bridge_outputs, selected_path, horizon_months)

    async def _gemini_generate(
        self,
        profile: dict,
        bridge_outputs: dict,
        selected_path: dict,
        horizon_months: int,
    ) -> dict:
        monthly_expenses = profile.get("monthly_expenses", 45000)
        liquid_savings = profile.get("liquid_savings", 0)
        runway_months = round(liquid_savings / monthly_expenses, 1) if monthly_expenses else 0
        financial_pressure = runway_months < horizon_months

        role = selected_path.get("role", "Target Role")
        role_desc = selected_path.get("description", "")
        role_skills = selected_path.get("skills", [])
        target_salary_p50 = selected_path.get("annual_salary_p50_inr", 0)

        current_role = profile.get("current_role", "Professional")
        inferred_skills = profile.get("inferred_skills", [])
        weekly_hours = profile.get("weekly_hours_available", 10)
        years_experience = profile.get("years_experience", 0)

        # Compute skill gaps
        user_skills_lower = set(s.lower().replace(" ", "_") for s in inferred_skills)
        role_skills_lower = set(s.lower() for s in role_skills)
        skill_gaps = [s for s in role_skills_lower if s not in user_skills_lower]

        savings_threshold = monthly_expenses * 3

        prompt = f"""{SYSTEM_PROMPT}

BUILD A {horizon_months}-MONTH CAREER ROADMAP for this exact user:

CURRENT SITUATION:
- Current role: {current_role}
- Years experience: {years_experience}
- Existing skills: {', '.join(inferred_skills[:10]) if inferred_skills else 'General professional skills'}
- Weekly hours available for learning: {weekly_hours} hours/week

FINANCIAL CONTEXT:
- Monthly expenses (burn rate): ₹{monthly_expenses:,.0f}
- Liquid savings: ₹{liquid_savings:,.0f}
- Financial runway: {runway_months} months
- {'⚠️ CRITICAL: Runway is SHORTER than plan horizon. Flag this prominently.' if financial_pressure else 'Runway is adequate.'}
- Safety threshold (3-month buffer): ₹{savings_threshold:,.0f}

TARGET ROLE: {role}
- Description: {role_desc}
- Required skills: {', '.join(role_skills)}
- Market salary (P50): ₹{target_salary_p50:,.0f}/year = ₹{target_salary_p50//12:,.0f}/month
- Skill gaps to close: {', '.join(skill_gaps) if skill_gaps else 'General upskilling required'}

ROADMAP REQUIREMENTS:
- Produce exactly {self._recommended_phase_count(horizon_months)} phases covering {horizon_months} months total
- Phase durations (in weeks): {self._phase_week_distribution(horizon_months)}
- Each phase must have: 2-4 skills with week numbers, 1-2 projects, 2-3 courses/certs, failure_trigger, fallback_action
- Include REAL course names, platforms, and costs in INR
- Skills must be sequenced (prerequisite skills first, advanced skills later)
- Projects must be deployable, portfolio-grade work samples
- estimated_cost_inr per phase = sum of all course costs in that phase

Generate the opening_warning and go_no_go_signal based on their exact financial situation.
Return ONLY valid JSON. No markdown, no explanation."""

        response = await anyio.to_thread.run_sync(
            lambda: self._client.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=ROADMAP_SCHEMA,
                    temperature=0.2,
                ),
            )
        )

        result = json.loads(response.text)
        result["horizon_months"] = horizon_months
        return result

    def _recommended_phase_count(self, horizon_months: int) -> int:
        if horizon_months <= 6:
            return 3
        elif horizon_months <= 9:
            return 4
        else:
            return 4

    def _phase_week_distribution(self, horizon_months: int) -> str:
        total_weeks = horizon_months * 4
        if horizon_months <= 6:
            return f"Phase 1: {total_weeks//3} wks, Phase 2: {total_weeks//3} wks, Phase 3: {total_weeks - 2*(total_weeks//3)} wks"
        else:
            p1 = max(4, math.floor(total_weeks * 0.15))
            p2 = max(4, math.floor(total_weeks * 0.40))
            p3 = max(4, math.floor(total_weeks * 0.30))
            p4 = max(2, total_weeks - p1 - p2 - p3)
            return f"Phase 1 (Foundation): {p1} wks, Phase 2 (Skill Build): {p2} wks, Phase 3 (Portfolio & Job Hunt): {p3} wks, Phase 4 (Stabilisation): {p4} wks"

    def _deterministic_fallback(
        self,
        profile: dict,
        bridge_outputs: dict,
        selected_path: dict,
        horizon_months: int,
    ) -> dict:
        """Rich deterministic fallback when Gemini is unavailable."""
        role = selected_path.get("role", "your target role")
        role_skills = selected_path.get("skills", ["core domain skills", "industry tools", "communication"])
        monthly_expenses = profile.get("monthly_expenses", 45000)
        liquid_savings = profile.get("liquid_savings", 0)
        runway_months = round(liquid_savings / monthly_expenses, 1) if monthly_expenses else 0
        weekly_hours = profile.get("weekly_hours_available", 10)
        savings_threshold = monthly_expenses * 3
        financial_pressure = runway_months < horizon_months

        total_weeks = horizon_months * 4
        p1_w = max(4, math.floor(total_weeks * 0.15))
        p2_w = max(8, math.floor(total_weeks * 0.40))
        p3_w = max(4, math.floor(total_weeks * 0.30))
        p4_w = max(2, total_weeks - p1_w - p2_w - p3_w)

        def skill_entry(name, w_start, w_end, blocker, why, free_r, paid_r):
            return {
                "name": name,
                "week_start": w_start,
                "week_end": w_end,
                "is_blocker": blocker,
                "why_essential": why,
                "free_resource": free_r,
                "paid_resource": paid_r,
            }

        def project_entry(name, desc, stack, outcome, difficulty):
            return {"name": name, "description": desc, "tech_stack": stack, "outcome": outcome, "difficulty": difficulty}

        def course_entry(name, platform, cost, dur_w, is_cert, priority):
            return {"name": name, "platform": platform, "cost_inr": cost, "duration_weeks": dur_w, "is_certification": is_cert, "priority": priority}

        # Clean skill names
        s = [sk.replace("_", " ").title() for sk in role_skills]
        s0 = s[0] if len(s) > 0 else "Core Skill"
        s1 = s[1] if len(s) > 1 else "Advanced Tooling"
        s2 = s[2] if len(s) > 2 else "Domain Knowledge"
        s3 = s[3] if len(s) > 3 else "Professional Communication"

        phases = [
            {
                "phase_number": 1,
                "name": "Foundation & Setup",
                "duration_weeks": p1_w,
                "goal": f"Establish the non-negotiable baseline knowledge required before any specialised {role} training.",
                "weekly_hours": min(weekly_hours, 10),
                "estimated_cost_inr": 2800,
                "skills": [
                    skill_entry(s0, 1, max(2, p1_w // 2), True,
                        f"This is the entry-level gate for {role}. Without it, you cannot progress.",
                        "YouTube 'freeCodeCamp' full course", "Udemy course (₹499)"),
                    skill_entry("Professional Workflow Setup", max(2, p1_w // 2), p1_w, False,
                        "Git, Notion, and time-blocking are non-negotiables for async professional work.",
                        "GitHub Docs (free)", "GitHub Pro (₹0/student)"),
                ],
                "projects": [
                    project_entry(
                        f"Personal {s0} Fundamentals Notebook",
                        f"Document your {s0} learning with worked examples. Publish to GitHub with a clean README.",
                        [s0, "Git", "Markdown"],
                        "Proves you can document your work — underrated signal to hiring managers.",
                        "Beginner"
                    )
                ],
                "courses": [
                    course_entry(f"{s0} for Beginners", "Udemy", 499, min(p1_w, 4), False, "MUST-DO"),
                    course_entry("Git & GitHub Crash Course", "YouTube (freeCodeCamp)", 0, 1, False, "MUST-DO"),
                ],
                "failure_trigger": f"If you cannot dedicate {min(weekly_hours, 10)} hours/week consistently in Phase 1, the entire timeline collapses.",
                "fallback_action": "Drop to 6 hours/week and extend Phase 1 by 2 weeks. Do not skip foundational skills.",
            },
            {
                "phase_number": 2,
                "name": "Core Skill Build",
                "duration_weeks": p2_w,
                "goal": f"Master the primary technical and domain skills demanded in every {role} job description.",
                "weekly_hours": weekly_hours,
                "estimated_cost_inr": 7500,
                "skills": [
                    skill_entry(s1, 1, p2_w // 2, True,
                        f"{s1} appears in 80%+ of {role} job postings. It is not optional.",
                        "Official documentation + YouTube", "Coursera Professional Certificate (₹3,200/month)"),
                    skill_entry(s2, p2_w // 3, math.ceil(p2_w * 0.75), True,
                        f"{s2} is what separates junior from mid-level {role} candidates.",
                        "freeCodeCamp / Kaggle Learn (free)", "Udemy Advanced Course (₹799)"),
                    skill_entry(s3, math.ceil(p2_w * 0.5), p2_w, False,
                        "Soft skills in context — how to communicate your work to non-technical stakeholders.",
                        "Toastmasters / LinkedIn posts (free)", "Communication for Tech Professionals, Udemy (₹499)"),
                ],
                "projects": [
                    project_entry(
                        f"End-to-End {role} Portfolio Project #1",
                        f"Build a complete, real-world project using {s1} and {s2}. Use a real public dataset. Deploy it publicly.",
                        [s1, s2, "GitHub"],
                        f"The #1 thing that gets {role} candidates interviews. Must be live and documented.",
                        "Intermediate"
                    ),
                    project_entry(
                        "Domain Problem Solver",
                        f"Identify a problem in {role}'s industry. Build a tool or analysis that solves it. Write a Medium post about it.",
                        [s2, s3, "Markdown"],
                        "Demonstrates initiative, real-world thinking, and writing — a rare combination.",
                        "Intermediate"
                    )
                ],
                "courses": [
                    course_entry(f"Google Professional Certificate — {role} Track", "Coursera", 3200, min(p2_w, 8), True, "MUST-DO"),
                    course_entry(f"Advanced {s1}", "Udemy", 799, min(p2_w // 2, 4), False, "RECOMMENDED"),
                    course_entry("LinkedIn Learning — Communication Skills", "LinkedIn Learning", 1500, 2, False, "OPTIONAL"),
                ],
                "failure_trigger": "Missed 3+ consecutive weeks of study, or Phase 2 portfolio project is still empty at the halfway mark.",
                "fallback_action": f"Reduce scope of Project #1. Focus on a smaller, tighter version. Quality > quantity. Extend Phase 2 by {max(1, p2_w // 4)} weeks if needed.",
            },
            {
                "phase_number": 3,
                "name": "Portfolio & Active Job Hunt",
                "duration_weeks": p3_w,
                "goal": "Go from 'learning' to 'proving it' — build interview-worthy portfolio and land your first offer.",
                "weekly_hours": min(weekly_hours + 5, 30),
                "estimated_cost_inr": 4500,
                "skills": [
                    skill_entry("Resume & LinkedIn Optimisation", 1, 2, True,
                        f"Your resume must be 100% keyword-matched to {role} job descriptions or it will not pass ATS filters.",
                        "Jobscan (free tier)", "Jobscan Pro ($30/month = ₹2,500)"),
                    skill_entry("Behavioural Interview Mastery", 2, p3_w, True,
                        "STAR method stories are required for every senior-level interview. Practice 10 stories, not 2.",
                        "STAR method guide on YouTube", "Exponent Interview Prep (₹2,000/month)"),
                ],
                "projects": [
                    project_entry(
                        f"Capstone {role} Project",
                        f"Your strongest, most complex project. Combines {s1}, {s2}, and demonstrates end-to-end thinking. This is your hero piece.",
                        [s1, s2, s3, "Deployment Platform"],
                        "The project you reference in every interview. Must have a live URL and clean documentation.",
                        "Advanced"
                    )
                ],
                "courses": [
                    course_entry("System Design Interview Prep (if technical role)", "YouTube (Exponent)", 0, 3, False, "RECOMMENDED"),
                    course_entry("Negotiation Skills: Getting What You Want", "Udemy", 499, 1, False, "RECOMMENDED"),
                    course_entry(f"Mock Interviews for {role}", "Pramp / Interviewing.io", 2000, 3, False, "MUST-DO"),
                ],
                "failure_trigger": "Zero interview invites after 40 targeted applications. Or, 3+ interviews with no offer after completing all prep.",
                "fallback_action": "Stop applying broadly. Request 1:1 feedback from a recruiter. Re-audit your resume and portfolio for gaps. Consider a 'bridge role' — a stepping-stone position adjacent to your target.",
            },
            {
                "phase_number": 4,
                "name": "Post-Offer Stabilisation",
                "duration_weeks": p4_w,
                "goal": "Excel in the first 90 days. Rebuild financial buffer. Lock in your position permanently.",
                "weekly_hours": 45,
                "estimated_cost_inr": 0,
                "skills": [
                    skill_entry("Internal Tools Mastery", 1, p4_w // 2, True,
                        "Every company has unique stacks and processes. Learn them faster than expected.",
                        "Internal documentation", "Ask your manager on Day 1 for recommended reading"),
                    skill_entry("Stakeholder Communication", p4_w // 3, p4_w, False,
                        "Your ability to communicate clearly in a new environment is the #1 predictor of early success.",
                        "Weekly 1:1 meetings (invest in them)", "Radical Candor book (₹600)"),
                ],
                "projects": [
                    project_entry(
                        "First 90-Day High-Visibility Deliverable",
                        "Identify the most impactful project you can own solo in your first 90 days. Deliver it ahead of schedule.",
                        ["Internal Tools", "Domain Expertise"],
                        "A single strong early win cements your reputation and accelerates your path to senior.",
                        "Professional"
                    )
                ],
                "courses": [
                    course_entry("Radical Candor (book)", "Self-Study", 600, 2, False, "RECOMMENDED"),
                ],
                "failure_trigger": "Performance rating of 'below expectations' in first 90-day review.",
                "fallback_action": "Request urgent 1:1 with your manager. Identify the top 1-2 gaps. Get a mentor inside the company. Do not wait for the next review cycle.",
            },
        ]

        # Trim to 3 phases for short horizons
        if horizon_months <= 6:
            phases = phases[:3]
            for i, p in enumerate(phases):
                phases[i]["phase_number"] = i + 1

        opening_warning = (
            f"This {horizon_months}-month plan requires {weekly_hours} focused hours per week without exception. "
            f"Skipping even 2 consecutive weeks compounds into a 3-week delay by the end of each phase."
        )

        go_no_go_signal = (
            f"⛔ HALT: Your savings drop below the ₹{savings_threshold:,.0f} safety buffer before this plan completes. "
            f"Do not begin Phase 2 until your runway exceeds {horizon_months} months."
            if financial_pressure else
            f"✅ GO: Your ₹{liquid_savings:,.0f} savings cover {runway_months} months — sufficient runway to execute this plan safely."
        )

        return {
            "phases": phases,
            "total_months": horizon_months,
            "horizon_months": horizon_months,
            "opening_warning": opening_warning,
            "go_no_go_signal": go_no_go_signal,
        }
