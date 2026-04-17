"""
EmbeddingService — uses Gemini text-embedding-004 via API.
No local model download required. Precomputes and caches all career role embeddings
in-memory at startup so path matching is instant (~0ms per query).
"""
import json
import os
import logging
import numpy as np
from typing import Optional
from google import genai
from app.core.config import settings

logger = logging.getLogger(__name__)

# Module-level cache: populated once on first use
_career_embeddings: Optional[np.ndarray] = None
_careers_list: Optional[list] = None


def _configure_gemini():
    if not settings.GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY not set in environment")
    # Client is created per-call; configuration is stateless in the new SDK


def _load_careers() -> list:
    global _careers_list
    if _careers_list is None:
        data_path = os.path.join(os.path.dirname(__file__), "..", "..", "engines", "data", "careers.json")
        data_path = os.path.normpath(data_path)
        with open(data_path, "r", encoding="utf-8") as f:
            _careers_list = json.load(f)
    return _careers_list


def _career_to_text(career: dict) -> str:
    """Convert a career object into a rich descriptive sentence for embedding."""
    label = career.get("label", "")
    description = career.get("description", "")
    skills = ", ".join(career.get("skills", []))
    industries = ", ".join(career.get("industries", []))
    backgrounds = ", ".join(career.get("typical_backgrounds", []))
    return (
        f"{label}. {description} "
        f"Core skills: {skills}. "
        f"Common in industries: {industries}. "
        f"Typical candidate backgrounds: {backgrounds}."
    )


def _get_embedding(text: str) -> np.ndarray:
    """Embed a single piece of text using Gemini text-embedding-004."""
    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    result = client.models.embed_content(
        model="models/text-embedding-004",
        contents=text,
    )
    return np.array(result.embeddings[0].values, dtype=np.float32)


def _precompute_career_embeddings() -> np.ndarray:
    global _career_embeddings
    if _career_embeddings is not None:
        return _career_embeddings

    careers = _load_careers()
    logger.info(f"[EmbeddingService] Precomputing embeddings for {len(careers)} roles...")
    vectors = []
    for career in careers:
        text = _career_to_text(career)
        vec = _get_embedding(text)
        vectors.append(vec)
    
    _career_embeddings = np.stack(vectors, axis=0)  # shape: (N_roles, embedding_dim)
    logger.info(f"[EmbeddingService] Career embeddings ready. Shape: {_career_embeddings.shape}")
    return _career_embeddings


def _cosine_similarity_batch(query_vec: np.ndarray, matrix: np.ndarray) -> np.ndarray:
    """Compute cosine similarity of query_vec against all rows in matrix."""
    # Normalise query
    query_norm = query_vec / (np.linalg.norm(query_vec) + 1e-10)
    # Normalise each row of matrix
    row_norms = np.linalg.norm(matrix, axis=1, keepdims=True) + 1e-10
    matrix_norm = matrix / row_norms
    # Dot product gives cosine similarity
    return matrix_norm @ query_norm  # shape: (N_roles,)


def profile_text_to_embedding(profile_text: str) -> np.ndarray:
    """Public helper to embed a user profile text."""
    _configure_gemini()
    return _get_embedding(profile_text)


def semantic_top_n(
    profile_text: str,
    target_role_label: str = "",
    n: int = 10,
    constraints: Optional[dict] = None
) -> list:
    """
    Main semantic search function.
    
    1. Embeds the user profile text
    2. Computes cosine similarity against all precomputed career embeddings
    3. Applies hard constraint filters (runway, salary floor, location)
    4. Boosts the explicitly requested target role to rank #1 if specified
    5. Returns top-n filtered, ranked careers
    
    Args:
        profile_text: Rich description of the user's background
        target_role_label: User's declared target goal (e.g. "Data Scientist")
        n: Number of results to return
        constraints: Dict with optional keys:
            - runway_months (int): How many months of savings the user has
            - min_acceptable_salary_inr (float): Minimum income floor
            - requires_remote (bool): Whether remote is required
    
    Returns:
        List of career dicts sorted by relevance, with 'similarity_score' added
    """
    _configure_gemini()
    careers = _load_careers()
    career_embeddings = _precompute_career_embeddings()
    
    # Embed user profile
    query_vec = _get_embedding(profile_text)
    
    # Compute similarities
    scores = _cosine_similarity_batch(query_vec, career_embeddings)
    
    # Attach scores to careers
    scored = []
    for i, career in enumerate(careers):
        sim = float(scores[i])
        
        # Target role pinning: massive boost if career matches declared goal
        target_boost = 0.0
        if target_role_label:
            label_lower = career.get("label", "").lower()
            target_lower = target_role_label.lower()
            if target_lower in label_lower or label_lower in target_lower:
                target_boost = 1.5  # pushes it well above any other role
        
        scored.append({
            **career,
            "similarity_score": round(sim + target_boost, 4),
            "target_role_match": target_boost > 0,
        })
    
    # Sort by combined score
    scored.sort(key=lambda x: x["similarity_score"], reverse=True)
    
    # Apply hard constraint filters (only if constraints provided)
    if constraints:
        filtered = []
        for c in scored:
            # Filter: transition months must fit in runway
            runway = constraints.get("runway_months")
            if runway and c.get("avg_transition_months", 12) > runway * 1.2:
                continue  # Too long to afford — skip
            
            # Filter: salary must meet floor
            min_salary = constraints.get("min_acceptable_salary_inr")
            if min_salary and c.get("annual_salary_p25_inr", 0) < min_salary:
                continue  # P25 salary too low — skip
            
            # Filter: remote constraint
            if constraints.get("requires_remote") and not c.get("remote_friendly", True):
                continue
            
            filtered.append(c)
        
        # Always keep target role even if it fails constraints (show it with a warning instead)
        target_matches = [c for c in scored if c.get("target_role_match")]
        for tm in target_matches:
            if tm not in filtered:
                filtered.insert(0, tm)  # Force it in at position 0
        
        scored = filtered
    
    return scored[:n]
