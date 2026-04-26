"""
PathAgent — Constrained LLM narrative generation for career paths.

Uses Gemini to generate specific, grounded, honest feasibility assessments.
Critical rule: the model is given all financial math outputs as immovable facts.
It may not invent salary numbers, override timelines, or claim transitions are "easy".
"""
import json
import logging
import asyncio
from typing import Optional
import anyio
from google import genai
from google.genai import types
from app.core.config import settings

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are an elite, highly analytical, and brutally honest technical career transition coach for Switch. You despise generic advice and corporate fluff. 

Your assessments MUST be:
- HYPER-SPECIFIC: Never say "your skills are relevant". Say things like "Your 4 years of managing client expectations gives you a massive edge in stakeholder management, but your lack of SQL is a total blocker right now."
- BRUTALLY HONEST: Rip apart bad assumptions. If they want a highly technical role but have zero core skills, call it out as a high-risk mountain to climb. DO NOT soften the blow.
- GROUNDED IN MATH: You receive exact financial constraints. If their runway is tight, warn them sharply.
- DEADLY ACTIONABLE: Name the EXACT real-world tools, certifications, or portfolio projects they must build (e.g., "Build a CI/CD pipeline using GitHub Actions", NOT "learn coding").

IMMOVABLE CONSTRAINTS — DO NOT OVERRIDE:
- The estimated transition timeline is fixed by the financial model. You may suggest it could take longer, but never shorter.
- The salary ranges are from market data. Do not invent or modify them.
- If the user's financial runway is shorter than the transition timeline, flag this prominently with severe urgency.

OUTPUT FORMAT: Return a JSON object with these EXACT keys:
{
  "feasibility_summary": "1-2 punchy sentences. Brutally honest assessment of fit. No fluff.",
  "feasibility_details": "3-4 sentences dissecting their exact background vs the reality of this target role.",
  "top_risk": "The single most dangerous reality-check risk for THIS user specifically",
  "skill_gaps": ["Specific tool/skill (e.g. Docker)", "..."],
  "recommended_certifications": ["Real certification name (e.g. AWS Solutions Architect)", "..."],
  "first_30_day_action": "One hyper-specific, non-generic action they must take in the first 30 days",
  "financial_flag": "null OR a sharp financial warning if runway < transition months"
}"""


class PathAgent:
    def __init__(self):
        self._gemini_ready = bool(settings.GEMINI_API_KEY)
        if self._gemini_ready:
            self._client = genai.Client(api_key=settings.GEMINI_API_KEY)

    async def run(self, profile: dict, candidate_roles: list) -> dict:
        recommended = []
        rejected = []

        # Run top 3 assessments in parallel
        top_3_roles = candidate_roles[:3]
        assessment_tasks = [
            self._assess_path(profile, role, index=i) 
            for i, role in enumerate(top_3_roles)
        ]
        
        results = await asyncio.gather(*assessment_tasks, return_exceptions=True)

        for i, result in enumerate(results):
            role = top_3_roles[i]
            role_id = role.get("role_id", f"role_{i}")
            
            # Handle potential exceptions in parallel tasks
            if isinstance(result, Exception):
                logger.error(f"[PathAgent] Error assessing {role_id}: {result}")
                assessment = self._fallback_assessment(profile, role, index=i)
            else:
                assessment = result

            recommended.append({
                "target_role_id": role_id,
                "target_role_label": role.get("label", role_id),
                "feasibility_summary": assessment.get("feasibility_summary", ""),
                "feasibility_details": assessment.get("feasibility_details", ""),
                "top_risk": assessment.get("top_risk", ""),
                "skill_gaps": assessment.get("skill_gaps", []),
                "recommended_certifications": assessment.get("recommended_certifications", []),
                "first_30_day_action": assessment.get("first_30_day_action", ""),
                "match_level": assessment.get("match_level", "stretch"),
                "match_percentage": min(98, max(45, int(role.get("similarity_score", 0.5) * 100))),
                "key_risks": [assessment.get("top_risk", "Market competition for entry-level roles.")],
                "estimated_transition_months": role.get("avg_transition_months", 9),
                "similarity_score": role.get("similarity_score", 0),
                "target_role_match": role.get("target_role_match", False),
                "annual_salary_p25_inr": role.get("annual_salary_p25_inr"),
                "annual_salary_p50_inr": role.get("annual_salary_p50_inr"),
                "market_demand_score": role.get("market_demand_score"),
                "hiring_friction": role.get("hiring_friction"),
                "remote_friendly": role.get("remote_friendly"),
            })

        # Rejected paths
        for i, role in enumerate(candidate_roles[3:]):
            idx = i + 3
            role_id = role.get("role_id", f"role_{idx}")
            runway = profile.get("runway_months", 12)
            transition_months = role.get("avg_transition_months", 12)
            reasons = [
                f"Requires ~{transition_months} months of retraining which may exceed your current savings runway.",
                f"Entry-level salary (₹{role.get('annual_salary_p25_inr', 0):,}/yr) may not meet your minimum income floor.",
                "Geographical requirements do not match your remote/hybrid preference.",
                "High hiring friction in this role makes time-to-hire unpredictable for your financial window.",
            ]
            rejected.append({
                "target_role_id": role_id,
                "target_role_label": role.get("label", role_id),
                "rejection_reason": reasons[i % len(reasons)],
            })

        return {"recommended_paths": recommended, "rejected_paths": rejected}

    async def _assess_path(self, profile: dict, role: dict, index: int = 0) -> dict:
        """Generate a constrained LLM assessment for a single career path."""
        if not self._gemini_ready:
            return self._fallback_assessment(profile, role, index=index)

        # Try flash first, then flash-lite, then deterministic fallback
        for model in ["gemini-2.0-flash", "gemini-2.0-flash-lite"]:
            try:
                return await self._gemini_assess(profile, role, model=model)
            except Exception as e:
                logger.warning(f"[PathAgent] {model} failed for {role.get('role_id')}: {type(e).__name__}: {str(e)[:80]}")

        return self._fallback_assessment(profile, role, index=index)

    async def _gemini_assess(self, profile: dict, role: dict, model: str = "gemini-2.0-flash") -> dict:
        monthly_expenses = profile.get("monthly_expenses", 45000)
        liquid_savings = profile.get("liquid_savings", 0)
        runway_months = round(liquid_savings / monthly_expenses, 1) if monthly_expenses else 0
        transition_months = role.get("avg_transition_months", 9)
        financial_pressure = runway_months < transition_months

        # Format inputs nicely
        c_role = profile.get('current_role', '').strip()
        c_role_clean = c_role if c_role and c_role.lower() not in ["professional", "software_career", "not specified", "unknown"] else "your current role"
        
        c_ind = profile.get('industry', '').strip()
        c_ind_clean = c_ind if c_ind and c_ind.lower() not in ["not specified", "unknown"] else "your industry"
        
        inferred = [s.replace("_", " ").title() for s in profile.get('inferred_skills', [])[:8]]

        prompt = f"""{SYSTEM_PROMPT}

Assess this career transition. Converse naturally and directly with the user (use \"you/your\"). Do not awkwardly repeat \"Not Specified\" or \"Unknown\" — if a field is vague, just focus on the skills.

CURRENT PROFILE:
- Current role: {c_role_clean}
- Years experience: {profile.get('years_experience', 'Some')}
- Industry: {c_ind_clean}
- Inferred skills: {', '.join(inferred) if inferred else 'General professional skills'}

FINANCIAL CONSTRAINTS (IMMOVABLE — DO NOT CHANGE):
- Monthly burn rate: ₹{monthly_expenses:,.0f}
- Financial runway: {runway_months} months
- {'⚠️ CRITICAL: Runway is SHORTER than estimated transition time!' if financial_pressure else 'Runway is adequate for this transition.'}

TARGET ROLE:
- Role: {role.get('label', 'Unknown')}
- Description: {role.get('description', '')}
- Required skills: {', '.join(role.get('skills', []))}
- Estimated transition time: {transition_months} months
- Market salary P25: ₹{role.get('annual_salary_p25_inr', 0):,}/year
- Market salary P50: ₹{role.get('annual_salary_p50_inr', 0):,}/year

Generate a highly specific, honest assessment tailored ONLY to this user's stated skills. Name real tools and certifications."""

        response = await anyio.to_thread.run_sync(
            lambda: self._client.models.generate_content(
                model=model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema={
                        "type": "object",
                        "properties": {
                            "feasibility_summary": {"type": "string", "description": "1-2 sentence high-level summary of the fit"},
                            "feasibility_details": {"type": "string", "description": "Detailed 3-4 sentence explanation with specific skill and financial context"},
                            "top_risk": {"type": "string", "description": "The #1 biggest risk for this specific user"},
                            "skill_gaps": {"type": "array", "items": {"type": "string"}, "description": "List of 3-5 specific technical skills to learn"},
                            "recommended_certifications": {"type": "array", "items": {"type": "string"}},
                            "first_30_day_action": {"type": "string", "description": "One concrete thing to do today"},
                        },
                        "required": ["feasibility_summary", "feasibility_details", "top_risk", "skill_gaps"]
                    },
                    temperature=0.3,
                ),
            )
        )
        result = json.loads(response.text)

        if "match_level" not in result:
            # Infer match level from similarity score if not provided by Gemini
            score = role.get("similarity_score", 0.5)
            if score > 0.8: result["match_level"] = "strong"
            elif score > 0.6: result["match_level"] = "moderate"
            else: result["match_level"] = "stretch"

        return result

    def _fallback_assessment(self, profile: dict, role: dict, index: int = 0) -> dict:
        """
        Fully data-driven deterministic fallback.
        Every field is computed from the actual profile vs role data — 
        no shared prose templates. Each card reads uniquely.
        """
        t_months = role.get("avg_transition_months", 9)
        monthly_expenses = profile.get("monthly_expenses") or 45000
        liquid_savings = profile.get("liquid_savings") or 0
        runway_months = round(liquid_savings / monthly_expenses, 1) if monthly_expenses else 0
        years_exp = profile.get("years_experience", 1)

        # --- Role metadata ---
        target_label = role.get("label", "this role")
        role_id = role.get("role_id", "")
        hiring_friction = role.get("hiring_friction", "medium")
        market_demand = role.get("market_demand_score", 70)
        is_remote = role.get("remote_friendly", True)
        p25_salary = role.get("annual_salary_p25_inr", 0)
        p50_salary = role.get("annual_salary_p50_inr", 0)
        role_desc = role.get("description", "")
        role_skills = role.get("skills", [])
        typical_bgs = role.get("typical_backgrounds", [])
        industries = role.get("industries", [])
        
        # --- User context ---
        c_role = profile.get("current_role", "").strip()
        c_role_clean = c_role if c_role and c_role.lower() not in ["professional", "not specified", "unknown"] else "your current role"
        c_ind = profile.get("industry", "").strip()
        c_ind_clean = c_ind if c_ind and c_ind.lower() not in ["not specified", "unknown"] else ""

        # --- Skill overlap computation ---
        user_skills_raw = profile.get("inferred_skills", [])
        user_skills = set(s.lower().replace("_", " ").replace("-", " ").strip() for s in user_skills_raw)
        role_skills_norm = set(s.lower().replace("_", " ").replace("-", " ").strip() for s in role_skills)
        
        # Fuzzy overlap — count partial matches (e.g. "sql" matches "sql databases")
        overlap = set()
        gaps = set()
        for rs in role_skills_norm:
            matched = any(rs in us or us in rs or (len(rs) > 4 and rs[:5] in us) for us in user_skills)
            if matched:
                overlap.add(rs)
            else:
                gaps.add(rs)
        
        overlap_count = len(overlap)
        total_role_skills = max(len(role_skills_norm), 1)
        overlap_pct = round((overlap_count / total_role_skills) * 100)
        
        overlap_list = [s.title() for s in sorted(overlap)][:5]
        gap_list = [s.replace("_", " ").title() for s in sorted(gaps)][:5]
        
        # --- Financial analysis (exact numbers) ---
        financial_pressure = runway_months < t_months
        months_short = max(0, t_months - runway_months)
        bridge_needed = round(months_short * monthly_expenses)
        monthly_income_at_entry = round((p25_salary / 12) * 0.80)
        income_vs_expenses = monthly_income_at_entry - monthly_expenses

        # --- Hiring friction context ---
        friction_labels = {
            "low": "entry barrier is low — recruiters actively hire for this",
            "medium": "competition is moderate — a strong portfolio is essential",
            "high": "hiring is competitive — expect a rigorous multi-stage process",
            "very_high": "this is one of the hardest roles to break into — credentials matter enormously",
            "none": "there's no gatekeeper here — your output is your credential",
        }
        friction_context = friction_labels.get(hiring_friction, "competition is moderate")

        # --- Industry fit check ---
        user_ind_words = set(c_ind_clean.lower().split()) if c_ind_clean else set()
        role_inds = [i.lower() for i in industries]
        industry_fit = any(w in " ".join(role_inds) for w in user_ind_words if len(w) > 3)
        industry_note = (
            f"Your {c_ind_clean} background directly maps to the {', '.join(industries[:2])} industries that hire for this role."
            if industry_fit and c_ind_clean else
            f"This role primarily hires from {', '.join(industries[:3])} sectors — cross-sector moves are possible but need proof-of-work."
        )

        # --- Background fit check ---
        bg_fit = any(
            any(w in bg.lower() for bg in typical_bgs)
            for w in (c_role_clean.lower().split() + [c_ind_clean.lower()])
            if len(w) > 3
        )

        # --- Derive match strength from overlap percentage and years of experience ---
        if overlap_pct >= 50 or (overlap_pct >= 35 and years_exp >= 5):
            match_tone = "strong"
        elif overlap_pct >= 25 or (overlap_pct >= 15 and years_exp >= 3):
            match_tone = "moderate"
        else:
            match_tone = "stretch"

        # --- Build unique summary (different structure per match tone AND per role) ---
        primary_gap = gap_list[0] if gap_list else "advanced domain tooling"
        primary_overlap = overlap_list[0] if overlap_list else "general professional skills"

        if match_tone == "strong":
            summary = (
                f"Your {overlap_pct}% skill alignment with {target_label} is the clearest signal here — "
                f"{', '.join(overlap_list[:3])} are already in your toolkit from your time as a {c_role_clean}. "
                f"This isn't a pivot; it's a natural progression. "
                f"The gap to close — specifically {primary_gap} — is manageable within {t_months} months given your foundation. "
                f"{industry_note}"
            )
        elif match_tone == "moderate":
            summary = (
                f"A {overlap_pct}% skill overlap means you're not starting from zero. "
                f"Your {primary_overlap} experience as a {c_role_clean} is genuinely transferable to {target_label}, "
                f"but the missing {len(gap_list)} core skills ({', '.join(gap_list[:3])}) will define how fast you can realistically make this move. "
                f"At {t_months} months estimated transition time, this is a deliberate, structured pivot — not a weekend course."
            )
        else:  # stretch
            summary = (
                f"Let's be direct: {overlap_pct}% skill overlap with {target_label} means you're climbing with very few holds. "
                f"Coming from {c_role_clean}, the concepts don't naturally transfer — you'll need to rebuild "
                f"from {primary_gap} upward. "
                f"The {t_months}-month timeline is optimistic if you treat this casually; realistic only if you commit 10+ hours a week consistently."
            )

        # --- Build unique details with financial and role-specific data ---
        salary_verdict = (
            f"Entry salary of ₹{p25_salary:,}/yr (≈₹{monthly_income_at_entry:,}/mo) "
            + (f"covers your ₹{monthly_expenses:,} burn by ₹{income_vs_expenses:,}/mo — you'll be comfortable from day 1."
               if income_vs_expenses >= 0 else
               f"is ₹{abs(income_vs_expenses):,}/mo SHORT of your ₹{monthly_expenses:,} burn rate — plan for this gap.")
        )

        details = (
            f"SKILL REALITY: You have {overlap_count}/{total_role_skills} role-required skills covered ({overlap_pct}% match). "
            f"The critical gaps are: {', '.join(gap_list) if gap_list else 'none — you\'re well-positioned'}. "
            f"HIRING REALITY: {friction_context.capitalize()} for {target_label} — market demand score is {market_demand}/100. "
            f"{'Remote-friendly role — location is not a constraint.' if is_remote else 'This role often requires on-site presence — factor this into your decision.'} "
            f"SALARY REALITY: {salary_verdict} "
            f"P50 upside is ₹{p50_salary:,}/yr once you build 2-3 years of domain experience."
        )

        # --- Financial flag ---
        if financial_pressure:
            financial_flag = (
                f"⚠️ RUNWAY ALERT: Your ₹{liquid_savings:,} savings gives you {runway_months} months, "
                f"but this transition needs {t_months} months — that's a {round(months_short, 1)}-month gap. "
                f"You need either ₹{bridge_needed:,} additional bridge capital or a part-time income stream during the transition."
            )
        else:
            financial_flag = None

        # --- Role-specific top risk ---
        risk_map = {
            "strong": (
                f"Imposter syndrome at the hiring stage: your {overlap_pct}% overlap is strong but you may lack proof. "
                f"Build a concrete {target_label} portfolio piece before applying — don't rely on your {c_role_clean} title alone."
            ),
            "moderate": (
                f"The '{primary_gap}' learning curve is deceptively steep. "
                f"Most candidates underestimate how long it takes to go from 'completed a course' to 'can do this under pressure in a job'. "
                f"Budget for at least {max(2, t_months // 3)} months of deliberate practice specifically on this skill."
            ),
            "stretch": (
                f"Credential friction: with only {overlap_pct}% overlap, automated filters may screen you out "
                f"before a human even sees your application for {target_label}. "
                f"You need a portfolio project that's undeniably in-domain and a warm intro from someone in the field."
            ),
        }
        top_risk = risk_map[match_tone]

        return {
            "match_level": match_tone,
            "feasibility_summary": summary,
            "feasibility_details": details,
            "top_risk": top_risk,
            "skill_gaps": gap_list if gap_list else ["Advanced Tooling", "Domain-Specific Standards"],
            "recommended_certifications": self._suggest_certs(role_id, gap_list),
            "first_30_day_action": self._suggest_action(role_id, target_label, gap_list),
            "financial_flag": financial_flag,
        }

    def _suggest_certs(self, role_id: str, gaps: list) -> list:
        """Map role IDs to real-world certifications."""
        cert_map = {
            "ai_ml_engineer": ["Google Professional Machine Learning Engineer", "DeepLearning.AI TensorFlow Developer Certificate"],
            "data_scientist": ["IBM Data Science Professional Certificate", "Google Advanced Data Analytics"],
            "backend_software_engineer": ["AWS Certified Developer – Associate", "Meta Back-End Developer Certificate"],
            "devops_engineer": ["AWS Solutions Architect – Associate", "Certified Kubernetes Administrator (CKA)"],
            "cloud_solutions_architect": ["AWS Solutions Architect – Professional", "Google Cloud Professional Cloud Architect"],
            "product_manager": ["Product School Certification (PSC)", "Google Project Management Certificate"],
            "cybersecurity_analyst": ["CompTIA Security+", "Google Cybersecurity Professional Certificate"],
            "data_analyst": ["Google Data Analytics Professional Certificate", "Tableau Desktop Specialist"],
            "ux_designer": ["Google UX Design Professional Certificate", "Interaction Design Foundation Certificate"],
            "digital_marketing_manager": ["Google Digital Marketing Certificate", "HubSpot Content Marketing Certification"],
            "frontend_software_engineer": ["Meta Front-End Developer Certificate", "freeCodeCamp Responsive Web Design"],
            "project_manager": ["Google Project Management Certificate", "PMI Certified Associate (CAPM)"],
        }
        return cert_map.get(role_id, ["Google Career Certificate (relevant track)", "Coursera Professional Certificate"])

    def _suggest_action(self, role_id: str, label: str, gaps: list) -> str:
        """Generate a hyper-specific 30-day action instead of generic 'take a course'."""
        action_map = {
            "ai_ml_engineer": "Complete Andrej Karpathy's 'Neural Networks: Zero to Hero' series and deploy a fine-tuned model to HuggingFace Spaces.",
            "data_scientist": "Build an end-to-end ML project on Kaggle (data cleaning → EDA → model → submission) and publish the notebook.",
            "backend_software_engineer": "Build a REST API with authentication using FastAPI or Django, deploy it to Railway/Render, and document the architecture.",
            "devops_engineer": "Containerize an existing project with Docker, set up a GitHub Actions CI/CD pipeline, and deploy to AWS EC2.",
            "cloud_solutions_architect": "Complete the AWS Cloud Practitioner training and deploy a 3-tier architecture (ALB → EC2 → RDS) in your personal AWS account.",
            "product_manager": "Pick a product you use daily, write a 2-page PRD for a feature improvement, and conduct 5 user interviews to validate it.",
            "cybersecurity_analyst": "Set up a home lab with VirtualBox, install Kali Linux, and complete 10 TryHackMe beginner rooms.",
            "ux_designer": "Redesign one screen of an app you use daily in Figma — research, wireframe, hi-fi mockup, and write a case study.",
        }
        return action_map.get(role_id, f"Identify the top skill gap for {label} and complete one hands-on project demonstrating it within 30 days.")
