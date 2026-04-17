from app.ai.services.embedding_service import semantic_top_n

# Test 1: Teacher -> content/marketing
teacher_profile = "6 years as a high school English teacher in Bangalore. Skilled at communication, curriculum design, public speaking, and storytelling. Looking to transition into content or marketing."
results = semantic_top_n(teacher_profile, n=3)
print("=== TEACHER PROFILE ===")
for r in results:
    print(f"  {r['label']} (score: {r['similarity_score']})")

# Test 2: Financial analyst wants PM
analyst_profile = "4 years as a financial analyst at a mid-size bank. Excel, financial modeling, MIS reporting, stakeholder presentations. Want to move into product management or data analysis."
results2 = semantic_top_n(analyst_profile, target_role_label="Product Manager", n=3)
print()
print("=== FINANCIAL ANALYST (wants PM) ===")
for r in results2:
    print(f"  {r['label']} (score: {r['similarity_score']}, target_match: {r.get('target_role_match')})")
