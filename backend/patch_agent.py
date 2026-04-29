"""
Patch script: replaces the rigid 3-template summary block in _fallback_assessment
with a role-signal-driven narrative engine (7 distinct opening angles).
"""
import re

NEW_BLOCK = """
        # --- Narrative angle: chosen from most distinctive role signal ---
        def _join(*parts):
            return " ".join(p.strip() for p in parts if p and p.strip())

        if hiring_friction == "very_high":
            if match_tone == "strong":
                summary = _join(
                    f"{target_label} is credential-locked — one of the hardest hiring processes out there.",
                    f"The good news: your {overlap_pct}% skill match ({', '.join(overlap_list[:3])}) gives you a real argument.",
                    f"The bad news: {c_role_clean} experience alone won't get you in.",
                    f"Use {t_months} months to build provable, in-domain output — not just credentials.",
                )
            elif match_tone == "moderate":
                summary = _join(
                    f"{target_label} screens applicants hard — expect multi-stage filtering and heavy credential checks.",
                    f"Your {overlap_pct}% overlap ({', '.join(overlap_list[:2]) if overlap_list else 'partial base'}) puts you in the possible-but-unproven bucket.",
                    f"The {t_months}-month plan must produce a portfolio that answers the question: 'Why you?' — before any recruiter asks it.",
                )
            else:
                summary = _join(
                    f"{target_label} will filter you out on paper before a human reads your name.",
                    f"With {overlap_pct}% skill overlap from {c_role_clean}, automated screeners will reject you at the first pass.",
                    f"The only way through is a project that is undeniably in-domain and a warm introduction from someone inside.",
                )

        elif t_months <= 4:
            if match_tone == "strong":
                summary = _join(
                    f"This is the fastest viable move on your list — {t_months} months, and your {overlap_pct}% skill match makes it credible.",
                    f"{', '.join(overlap_list[:3])} from your {c_role_clean} toolkit map directly here.",
                    f"{'Gap to close: ' + primary_gap + ' — manageable in the first 6 weeks.' if gap_list else 'Skills are largely there — focus on building proof, not learning more.'}",
                )
            elif match_tone == "moderate":
                summary = _join(
                    f"At {t_months} months, {target_label} is one of the faster pivots available.",
                    f"Your {overlap_pct}% overlap gives you a running start, but don't let the short timeline create false confidence.",
                    f"{primary_gap} is a real gap that needs focused effort — not passive exposure — to close before you start applying.",
                )
            else:
                summary = _join(
                    f"The {t_months}-month timeline for {target_label} is short — deceptively so given your {overlap_pct}% skill overlap.",
                    f"Coming from {c_role_clean}, you would need to compress {len(gap_list)} skill gaps into a very tight window.",
                    f"Achievable only if you treat this as a full-time project from week one.",
                )

        elif t_months >= 15:
            if match_tone == "strong":
                summary = _join(
                    f"{target_label} demands {t_months} months — significant even with your {overlap_pct}% skill head-start.",
                    f"{', '.join(overlap_list[:3])} transfer from {c_role_clean} and shorten the real learning curve, not the clock.",
                    f"Runway check: {runway_months} months of savings {'comfortably covers this.' if not financial_pressure else f'is {round(months_short, 1)} months short — plan the bridge now.'}",
                )
            elif match_tone == "moderate":
                summary = _join(
                    f"Be clear-eyed about what {t_months} months actually means — this is over a year of sustained effort.",
                    f"Your {overlap_pct}% overlap ({', '.join(overlap_list[:2]) if overlap_list else 'partial base'}) is a real asset,",
                    f"but {', '.join(gap_list[:3])} will each take months of deliberate practice to move from 'aware' to 'hireable'.",
                )
            else:
                summary = _join(
                    f"This is a {t_months}-month climb — one of the longest transitions in this category.",
                    f"With {overlap_pct}% skill overlap from {c_role_clean}, you are not just learning tools; you are rebuilding your professional identity.",
                    f"The people who succeed here start with a brutally honest skills inventory, then commit like it is a second job.",
                )

        elif p25_salary >= 1500000:
            if match_tone == "strong":
                summary = _join(
                    f"The entry floor for {target_label} is {p25_salary:,} INR/yr — and your {overlap_pct}% skill match means you are genuinely in range.",
                    f"{', '.join(overlap_list[:3])} from {c_role_clean} directly support the core of this role.",
                    f"The {t_months}-month investment is justified by the economics alone — P50 is {p50_salary:,} INR/yr.",
                )
            elif match_tone == "moderate":
                summary = _join(
                    f"{target_label} starts at {p25_salary:,} INR/yr — a meaningful jump that justifies the {t_months}-month commitment.",
                    f"Your {overlap_pct}% match ({', '.join(overlap_list[:2]) if overlap_list else 'partial base'}) means you are not a long shot.",
                    f"But that salary only goes to people who can demonstrate {primary_gap} under pressure, not just list it on a resume.",
                )
            else:
                summary = _join(
                    f"The {p25_salary:,} INR/yr entry floor makes {target_label} financially compelling.",
                    f"But that rate does not go to candidates with {overlap_pct}% skill overlap from a {c_role_clean} background.",
                    f"You are {t_months} months of serious, targeted upskilling away from being the person companies pay that rate.",
                )

        elif not is_remote:
            if match_tone == "strong":
                summary = _join(
                    f"One thing to confirm before anything else: {target_label} is typically on-site.",
                    f"If that works for you, the rest is strong — {overlap_pct}% skill match ({', '.join(overlap_list[:3])}) is genuinely competitive.",
                    f"The {t_months}-month transition is manageable given what you already bring from {c_role_clean}.",
                )
            elif match_tone == "moderate":
                summary = _join(
                    f"Before the skill story: {target_label} is predominantly an on-site role.",
                    f"If location is not a constraint, the path is viable — {overlap_pct}% overlap and {t_months} months of focused work on {primary_gap}.",
                )
            else:
                summary = _join(
                    f"{target_label} is on-site — and that is before we get to the skill gap.",
                    f"With {overlap_pct}% overlap from {c_role_clean}, you are facing both a geographic constraint and a {t_months}-month learning curve.",
                    f"Confirm both commitments are real decisions before investing time here.",
                )

        elif market_demand >= 90:
            if match_tone == "strong":
                summary = _join(
                    f"{target_label} is in high demand — market score {market_demand}/100 — and your {overlap_pct}% skill match puts you in a competitive position.",
                    f"{', '.join(overlap_list[:3])} from {c_role_clean} are exactly what hiring managers in this space look for.",
                    f"The window is favourable — don't sit on this.",
                )
            elif match_tone == "moderate":
                summary = _join(
                    f"Demand for {target_label} is high ({market_demand}/100) — the market is actively pulling people in.",
                    f"Your {overlap_pct}% overlap means you are in reach, but the gap ({', '.join(gap_list[:2])}) is what stands between you and that demand.",
                    f"At {t_months} months, the timing is worth it.",
                )
            else:
                summary = _join(
                    f"The good news: {target_label} has a market demand score of {market_demand}/100 — companies want to hire.",
                    f"The honest news: {overlap_pct}% skill overlap from {c_role_clean} means {t_months} months of serious upskilling before you are genuinely competitive.",
                    f"Demand tailwinds help, but they don't close skill gaps.",
                )

        elif match_tone == "strong":
            summary = _join(
                f"You have built more of a foundation for {target_label} than you probably realise.",
                f"{overlap_count} of {total_role_skills} required skills — {', '.join(overlap_list[:3])} — are already in your {c_role_clean} toolkit.",
                f"{'Gap to close: ' + primary_gap + ' — learnable, not foundational.' if gap_list else 'Nothing critical missing — focus on documented proof.'}",
                f"{'Your ' + c_ind_clean + ' background maps well to the industries that hire here.' if industry_fit and c_ind_clean else ''}",
            )
        elif match_tone == "moderate":
            summary = _join(
                f"Your {c_role_clean} background transfers more than raw numbers suggest.",
                f"{', '.join(overlap_list[:2]) if overlap_list else 'Your transferable experience'} is genuine currency in {target_label} hiring.",
                f"The missing layer — {', '.join(gap_list[:3])} — is a defined target, not a vague one.",
                f"At {t_months} months, this pays off if you execute deliberately.",
            )
        else:
            summary = _join(
                f"Between {c_role_clean} and {target_label} there is real distance — only {overlap_pct}% skill overlap ({overlap_count} of {total_role_skills}).",
                f"The {t_months}-month timeline assumes full commitment: 10+ hours per week, structured learning, active portfolio building.",
                f"{'Market demand of ' + str(market_demand) + '/100 makes the destination worth it.' if market_demand >= 80 else 'Confirm this destination is worth the journey before committing.'}",
            )

"""

path = "app/ai/agents/path_agent.py"
content = open(path, encoding="utf-8").read()

OLD_START = "        # --- Build unique summary (different structure per match tone AND per role) ---"
OLD_END   = "        # --- Build unique details with financial and role-specific data ---"

s = content.find(OLD_START)
e = content.find(OLD_END)
if s == -1 or e == -1:
    print("MARKERS NOT FOUND"); exit(1)

new_content = content[:s] + NEW_BLOCK + "        # --- Build unique details with financial and role-specific data ---" + content[e + len(OLD_END):]
open(path, "w", encoding="utf-8").write(new_content)
print("Patched OK. Lines:", len(new_content.splitlines()))
