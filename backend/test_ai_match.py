# Test: Software Engineer -> AI Engineer matching
from app.ai.services import embedding_service
from app.core.db import SessionLocal
from app.models.career_path_set import CareerPathSet

# 1. Clear caches
embedding_service._career_embeddings = None
embedding_service._careers_list = None

db = SessionLocal()
deleted = db.query(CareerPathSet).delete()
db.commit()
print(f"Cleared {deleted} cached path sets")

# 2. Test semantic matching
from app.ai.services.embedding_service import semantic_top_n

results = semantic_top_n(
    "Software engineer with Python, algorithms, system design",
    target_role_label="AI Engineer",
    n=5
)

print("\n=== Software Engineer -> AI Engineer ===")
for r in results:
    tag = "TARGET" if r.get("target_role_match") else "ADJACENT"
    print(f"  [{tag}] {r['label']} (score: {r['similarity_score']})")
