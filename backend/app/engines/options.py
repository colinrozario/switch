from pydantic import BaseModel
from typing import List
from sentence_transformers import SentenceTransformer, util
import torch
import math

class OptionInput(BaseModel):
    current_role: str
    skills: List[str]

class CareerRole(BaseModel):
    title: str
    category: str
    match_score: int

class OptionOutput(BaseModel):
    options: List[CareerRole]

ROLES_DB = [
    {"title": "Frontend Developer", "skills": ["javascript", "react", "css"], "category": "Tech"},
    {"title": "Backend Developer", "skills": ["python", "sql", "api"], "category": "Tech"},
    {"title": "Full Stack Developer", "skills": ["javascript", "python", "react", "sql"], "category": "Tech"},
    {"title": "Data Scientist", "skills": ["python", "statistics", "sql", "machine learning"], "category": "Data"},
    {"title": "Data Analyst", "skills": ["sql", "excel", "visualization", "python"], "category": "Data"},
    {"title": "Product Manager", "skills": ["strategy", "communication", "agile", "user research"], "category": "Product"},
    {"title": "UX Designer", "skills": ["figma", "user research", "prototyping", "wireframing"], "category": "Design"},
    {"title": "UI Designer", "skills": ["figma", "visual design", "branding"], "category": "Design"},
    {"title": "DevOps Engineer", "skills": ["aws", "docker", "linux", "ci/cd"], "category": "Tech"},
    {"title": "Cybersecurity Analyst", "skills": ["network security", "linux", "compliance"], "category": "Tech"},
    {"title": "Digital Marketer", "skills": ["seo", "content strategy", "analytics"], "category": "Marketing"},
    {"title": "Content Writer", "skills": ["copywriting", "seo", "editing"], "category": "Marketing"},
    {"title": "Sales Representative", "skills": ["crm", "negotiation", "communication"], "category": "Sales"},
    {"title": "Customer Success Manager", "skills": ["communication", "problem solving", "crm"], "category": "Sales"},
    {"title": "Project Manager", "skills": ["agile", "scrum", "organization"], "category": "Product"},
    {"title": "Business Analyst", "skills": ["sql", "requirements gathering", "communication"], "category": "Data"},
    {"title": "Technical Writer", "skills": ["writing", "documentation", "tech"], "category": "Marketing"},
    {"title": "QA Engineer", "skills": ["testing", "automation", "python"], "category": "Tech"},
    {"title": "Systems Administrator", "skills": ["linux", "networking", "bash"], "category": "Tech"},
    {"title": "Mobile Developer", "skills": ["swift", "kotlin", "react native"], "category": "Tech"}
]

# ---------------------------------------------------------------------------
# Match score scaling
# ---------------------------------------------------------------------------
# Cosine similarity from this model rarely exceeds ~0.85 even for perfect
# matches. Displaying raw values (×100) produces numbers like 55–72% that
# feel like failing grades to users, even for genuinely good recommendations.
#
# scale_match_score() applies a two-step perceptual rescaling:
#   1. Clip the raw score to a realistic observed range [RAW_FLOOR, RAW_CEIL].
#   2. Apply a concave power-curve (exponent < 1) so mid-range scores are
#      lifted toward the higher end of the display band without ever
#      hitting 100%.  The result is clipped to [DISPLAY_MIN, DISPLAY_MAX].
#
# Example mappings (approximate):
#   raw 0.40  →  display ~55%
#   raw 0.50  →  display ~65%
#   raw 0.60  →  display ~73%
#   raw 0.70  →  display ~82%
#   raw 0.78  →  display ~88%
#   raw 0.85  →  display ~93%
#
# To adjust the visual range, tweak DISPLAY_MIN / DISPLAY_MAX only.
# To adjust the curve steepness, tweak CURVE_EXPONENT (lower = more lift).
# ---------------------------------------------------------------------------

_RAW_FLOOR = 0.30       # Cosine scores below this are treated as 0% relevant
_RAW_CEIL  = 0.90       # Cosine scores above this are extremely rare
_DISPLAY_MIN = 45       # Lowest percentage shown to users
_DISPLAY_MAX = 97       # Highest percentage shown to users (never 100%)
_CURVE_EXPONENT = 0.60  # < 1.0 = concave curve that lifts middle scores


def scale_match_score(raw_cosine: float) -> int:
    """
    Convert a raw cosine similarity score to a user-facing match percentage.

    The mapping is deterministic and monotonic — a higher cosine score will
    always produce a higher displayed percentage.  The curve lifts realistic
    mid-range scores (0.50–0.75) into a more intuitive 65–85% visual band.

    Args:
        raw_cosine: Cosine similarity, typically in [0.0, 1.0].

    Returns:
        Integer percentage in [_DISPLAY_MIN, _DISPLAY_MAX].
    """
    # Clip to the realistic observed range
    clipped = max(_RAW_FLOOR, min(_RAW_CEIL, float(raw_cosine)))
    # Normalise to [0, 1]
    normalised = (clipped - _RAW_FLOOR) / (_RAW_CEIL - _RAW_FLOOR)
    # Apply concave power curve to lift mid-range values
    curved = math.pow(normalised, _CURVE_EXPONENT)
    # Map to display range
    display = _DISPLAY_MIN + curved * (_DISPLAY_MAX - _DISPLAY_MIN)
    return int(round(display))


# ---------------------------------------------------------------------------
# Lazy singleton — model loads on first request, NOT at import time.
# Loading at import time blocks uvicorn's event loop during hot-reload and
# causes ERR_CONNECTION_REFUSED for ~30-60 s on every file change.
# ---------------------------------------------------------------------------
_embedder = None
_roles_embeddings = None


def _get_embedder():
    """Return the SentenceTransformer model, initialising it on first call."""
    global _embedder, _roles_embeddings
    if _embedder is None:
        import logging
        logging.getLogger(__name__).info("[options] Loading Career Path Embedding Model (first use)...")
        _embedder = SentenceTransformer("ElenaSenger/career-path-representation-mpnet-decorte")
        roles_texts = [
            f"{role['title']} with skills: {', '.join(role['skills'])}"
            for role in ROLES_DB
        ]
        _roles_embeddings = _embedder.encode(roles_texts, convert_to_tensor=True)
        logging.getLogger(__name__).info("[options] Model ready.")
    return _embedder, _roles_embeddings


def generate_options(data: OptionInput) -> OptionOutput:
    # 1. Format user input
    user_text = f"{data.current_role} with skills: {', '.join(data.skills)}"
    
    # 2. Generate embedding for user
    embedder, roles_embeddings = _get_embedder()
    user_embedding = embedder.encode(user_text, convert_to_tensor=True)
    
    # 3. Calculate cosine similarity against all target roles
    cos_scores = util.cos_sim(user_embedding, roles_embeddings)[0]
    
    # 4. Map back to roles and create CareerRole objects
    options = []
    for i in range(len(cos_scores)):
        score = cos_scores[i].item()
        # Apply perceptual scaling so realistic cosine scores (0.4–0.8) are
        # displayed in the intuitive 55–90% range rather than as raw values.
        match_score = scale_match_score(score)
        
        options.append(CareerRole(
            title=ROLES_DB[i]["title"],
            category=ROLES_DB[i]["category"],
            match_score=match_score
        ))
        
    # Sort by score desc
    options.sort(key=lambda x: x.match_score, reverse=True)
    
    # Return top 5
    return OptionOutput(options=options[:5])

