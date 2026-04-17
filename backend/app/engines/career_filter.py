"""
CareerFilter — Semantic role matching using Gemini embeddings.

Replaces the old keyword scanner with genuine semantic search.
The user's profile is embedded as an English sentence; cosine similarity
against precomputed career embeddings produces contextually relevant matches.

All constraint filtering (runway, salary floor, remote) is applied AFTER
semantic ranking — ensuring the math always decides, the AI just sorts.
"""
import json
import os
import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)


class CareerFilter:
    def __init__(self):
        data_path = os.path.join(os.path.dirname(__file__), "data", "careers.json")
        with open(data_path, "r", encoding="utf-8") as f:
            self.careers = json.load(f)

    def _build_profile_text(self, profile: dict) -> str:
        """
        Converts a structured profile dict into a rich English sentence
        that captures the user's full background for semantic embedding.
        """
        role = profile.get("current_role", "professional")
        years = profile.get("years_experience", 1)
        industry = profile.get("industry", "")
        skills = profile.get("inferred_skills", [])
        skills_str = ", ".join(skills[:12]) if skills else ""
        hours = profile.get("weekly_hours_available", 10)
        location = profile.get("hard_constraints", ["Flexible"])[0]
        motivations = profile.get("stated_motivations", [])
        motivations_str = ", ".join(motivations) if motivations else ""

        resume_text = ""
        if "enrichment" in profile:
            resume_text = profile["enrichment"].get("resume_text", "")

        text = (
            f"{years} years of experience as a {role} in the {industry} industry. "
            f"Skills and competencies: {skills_str}. "
            f"Available {hours} hours per week for upskilling. "
            f"Work preference: {location}. "
        )
        if motivations_str:
            text += f"Motivated by: {motivations_str}. "
        if resume_text:
            text += f"Additional background: {resume_text[:500]}"

        return text.strip()

    def top_n(
        self,
        user_text: str,
        target_role_label: str = "",
        n: int = 20,
        profile: Optional[dict] = None,
        constraints: Optional[dict] = None,
    ) -> List[Dict[str, Any]]:
        """
        Semantic top-n career matching.

        Tries Gemini embedding-based search first. Falls back to enhanced
        keyword matching if Gemini is unavailable (e.g., no API key).

        Args:
            user_text: Freeform profile description
            target_role_label: User's explicitly declared target role
            n: Number of results to return
            profile: Full structured profile dict (used to build richer text)
            constraints: Dict with runway_months, min_acceptable_salary_inr, requires_remote
        """
        if profile:
            user_text = self._build_profile_text(profile)

        try:
            from app.ai.services.embedding_service import semantic_top_n
            return semantic_top_n(
                profile_text=user_text,
                target_role_label=target_role_label,
                n=n,
                constraints=constraints,
            )
        except Exception as e:
            logger.warning(f"[CareerFilter] Embedding search failed ({e}), using enhanced keyword fallback")
            return self._enhanced_keyword_fallback(user_text, target_role_label, n)

    def _enhanced_keyword_fallback(
        self,
        user_text: str,
        target_role_label: str = "",
        n: int = 20
    ) -> List[Dict[str, Any]]:
        """
        Enhanced keyword fallback when Gemini is unavailable.
        Scans skills, description, and typical_backgrounds against user text.
        Target role gets a large boost.
        """
        user_text_lower = user_text.lower()
        target_lower = target_role_label.lower() if target_role_label else ""

        scored = []
        for career in self.careers:
            score = 0.0
            label_lower = career.get("label", "").lower()

            # Target role boost
            if target_lower and (target_lower in label_lower or label_lower in target_lower):
                score += 50.0

            # Skill keyword matches
            for skill in career.get("skills", []):
                if skill.lower() in user_text_lower:
                    score += 1.5

            # Typical background matches (high value signal)
            for bg in career.get("typical_backgrounds", []):
                if any(word in user_text_lower for word in bg.lower().split()):
                    score += 2.0

            # Description overlap (captures semantic concepts loosely)
            desc_words = career.get("description", "").lower().split()
            for word in desc_words:
                if len(word) > 5 and word in user_text_lower:
                    score += 0.5

            career_copy = dict(career)
            career_copy["similarity_score"] = round(score, 4)
            career_copy["target_role_match"] = target_lower and target_lower in label_lower
            scored.append(career_copy)

        scored.sort(key=lambda x: x["similarity_score"], reverse=True)
        return scored[:n]
