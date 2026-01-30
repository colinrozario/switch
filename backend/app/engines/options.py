from pydantic import BaseModel
from typing import List

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

def generate_options(data: OptionInput) -> OptionOutput:
    options = []
    user_skills = set(s.lower() for s in data.skills)
    
    for role in ROLES_DB:
        role_skills = set(role["skills"])
        overlap = len(user_skills.intersection(role_skills))
        score = int((overlap / len(role_skills)) * 100) if role_skills else 0
        
        # Include if score > 0 or we need filler? 
        # PRD says always >= 3.
        options.append(CareerRole(
            title=role["title"],
            category=role["category"],
            match_score=score
        ))
        
    # Sort by score desc
    options.sort(key=lambda x: x.match_score, reverse=True)
    
    # Return top 5
    return OptionOutput(options=options[:5])
