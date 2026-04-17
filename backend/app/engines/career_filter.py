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
            
    def top_n(self, user_text: str, target_role_label: str = "", n: int = 20) -> List[Dict[str, Any]]:
        user_text_lower = user_text.lower()
        target_role_lower = target_role_label.lower() if target_role_label else ""
        
        scored_careers = []
        for career in self.careers:
            score = 0.0
            career_label_lower = career.get("label", "").lower()
            
            # 1. Massive boost if this is the user's specifically declared target goal
            if target_role_lower and (target_role_lower in career_label_lower or career_label_lower in target_role_lower):
                score += 100.0
                
            # 2. Score based on hard skill keyword matches present in the user's profile text
            for skill in career.get("skills", []):
                if skill.lower() in user_text_lower:
                    score += 1.0
            
            career_copy = dict(career)
            career_copy["skill_overlap_score"] = float(score)
            scored_careers.append(career_copy)
            
        # Sort descending by score
        scored_careers.sort(key=lambda x: x["skill_overlap_score"], reverse=True)
        return scored_careers[:n]
