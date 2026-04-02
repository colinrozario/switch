import json
import os
import math
from collections import Counter
from typing import List, Dict, Any

class CareerFilter:
    def __init__(self):
        data_path = os.path.join(os.path.dirname(__file__), "data", "careers.json")
        with open(data_path, "r", encoding="utf-8") as f:
            self.careers = json.load(f)
            
    def _cosine_similarity(self, vec1: Counter, vec2: Counter) -> float:
        intersection = set(vec1.keys()) & set(vec2.keys())
        numerator = sum([vec1[x] * vec2[x] for x in intersection])

        sum1 = sum([val**2 for val in vec1.values()])
        sum2 = sum([val**2 for val in vec2.values()])
        denominator = math.sqrt(sum1) * math.sqrt(sum2)

        if not denominator:
            return 0.0
        else:
            return numerator / denominator

    def top_n(self, profile_skills: List[str], n: int = 20) -> List[Dict[str, Any]]:
        # Lowercase skills and create a counter for the user
        user_skills_lower = [s.lower() for s in profile_skills]
        user_vec = Counter(user_skills_lower)
        
        scored_careers = []
        for career in self.careers:
            role_skills = [s.lower() for s in career.get("skills", [])]
            role_vec = Counter(role_skills)
            
            score = self._cosine_similarity(user_vec, role_vec)
            
            # create a copy of the dict to not mutate the cached one (though here it's loaded per init)
            career_copy = dict(career)
            career_copy["skill_overlap_score"] = float(score)
            scored_careers.append(career_copy)
            
        # Sort descending by score
        scored_careers.sort(key=lambda x: x["skill_overlap_score"], reverse=True)
        return scored_careers[:n]
