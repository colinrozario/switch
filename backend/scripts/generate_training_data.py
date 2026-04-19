import pandas as pd
import numpy as np
import random
import os

# Define the directory for our ML data
DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "ml_data")
os.makedirs(DATA_DIR, exist_ok=True)

# 1. Define our target domain (Roles we want to recommend)
TARGET_ROLES = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Analyst",
    "Data Scientist",
    "Product Manager",
    "UX/UI Designer",
    "DevOps Engineer"
]

# 2. Define pool of potential source skills
SKILL_POOL = [
    "Python", "JavaScript", "HTML", "CSS", "React", "Node.js", "SQL", "Excel",
    "Tableau", "Figma", "Project Management", "Customer Service", "Sales",
    "AWS", "Docker", "Marketing", "Statistics", "Machine Learning", "Agile"
]

def generate_synthetic_data(num_samples=1000):
    """
    Generates synthetic career transition data to bootstrap our ML model.
    In production, you will replace this dataset with real scraped data 
    (from Kaggle, LinkedIn API, etc.)
    """
    data = []
    
    for _ in range(num_samples):
        # Random initial profile config
        current_salary = int(np.random.normal(500000, 200000)) # INR
        current_salary = max(200000, current_salary)
        
        # Pick 2-5 random skills the user currently has
        num_skills = random.randint(2, 5)
        user_skills = random.sample(SKILL_POOL, num_skills)
        
        # Determine a logical "Target Role" based on skills to make synthetic data realistic
        if "React" in user_skills or "HTML" in user_skills or "CSS" in user_skills:
            target = "Frontend Developer"
        elif "Python" in user_skills and "SQL" in user_skills and "Statistics" in user_skills:
            target = "Data Scientist"
        elif "SQL" in user_skills or "Excel" in user_skills or "Tableau" in user_skills:
            target = "Data Analyst"
        elif "Project Management" in user_skills or "Agile" in user_skills:
            target = "Product Manager"
        elif "Figma" in user_skills:
            target = "UX/UI Designer"
        elif "AWS" in user_skills or "Docker" in user_skills:
            target = "DevOps Engineer"
        elif "Node.js" in user_skills:
            target = "Backend Developer"
        else:
            target = random.choice(TARGET_ROLES)
            
        data.append({
            "current_salary": current_salary,
            "skills": ", ".join(user_skills),
            "recommended_role": target,
            "success_score": round(random.uniform(0.7, 1.0), 2) # Target label for regression/ranking
        })
        
    df = pd.DataFrame(data)
    
    output_path = os.path.join(DATA_DIR, "synthetic_career_data.csv")
    df.to_csv(output_path, index=False)
    print(f"Created synthetic training dataset at: {output_path}")
    print(df.head())

if __name__ == "__main__":
    generate_synthetic_data()
