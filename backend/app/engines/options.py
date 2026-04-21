from pydantic import BaseModel
from typing import List
from sentence_transformers import SentenceTransformer, util
import torch

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

# Initialize the embedding model
# This runs once when the module is imported
print("Loading Career Path Embedding Model...")
embedder = SentenceTransformer("ElenaSenger/career-path-representation-mpnet-decorte")

# Pre-compute embeddings for all roles in ROLES_DB
print("Pre-computing embeddings for ROLES_DB...")
roles_texts = [f"{role['title']} with skills: {', '.join(role['skills'])}" for role in ROLES_DB]
roles_embeddings = embedder.encode(roles_texts, convert_to_tensor=True)

def generate_options(data: OptionInput) -> OptionOutput:
    # 1. Format user input
    user_text = f"{data.current_role} with skills: {', '.join(data.skills)}"
    
    # 2. Generate embedding for user
    user_embedding = embedder.encode(user_text, convert_to_tensor=True)
    
    # 3. Calculate cosine similarity against all target roles
    cos_scores = util.cos_sim(user_embedding, roles_embeddings)[0]
    
    # 4. Map back to roles and create CareerRole objects
    options = []
    for i in range(len(cos_scores)):
        score = cos_scores[i].item()
        # Scale score to 0-100 (cosine sim is typically -1 to 1, but for semantic similarity it's mostly 0 to 1)
        # We use max(0, score) to avoid negative percentages
        match_score = int(max(0, score) * 100)
        
        options.append(CareerRole(
            title=ROLES_DB[i]["title"],
            category=ROLES_DB[i]["category"],
            match_score=match_score
        ))
        
    # Sort by score desc
    options.sort(key=lambda x: x.match_score, reverse=True)
    
    # Return top 5
    return OptionOutput(options=options[:5])

