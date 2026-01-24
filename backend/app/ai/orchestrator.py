from app.ai.client import AIClient
from app.schemas.profile import UserProfileData
import os

class Orchestrator:
    def __init__(self):
        self.ai = AIClient()
        self.prompts_dir = os.path.join(os.path.dirname(__file__), "prompts")

    def _load_prompt(self, filename: str) -> str:
        with open(os.path.join(self.prompts_dir, filename), "r") as f:
            return f.read()

    def process_intake(self, input_text: str) -> UserProfileData:
        system_prompt = self._load_prompt("intake.txt")
        # In a real app, we'd format the system prompt or user prompt dynamically
        # faster to just inject input into user prompt here
        formatted_prompt = f"Analyze this input:\n{input_text}"
        
        data = self.ai.generate_json(
            prompt=formatted_prompt,
            system_prompt=system_prompt.replace("{input_text}", ""), # Template trick
            response_model=UserProfileData
        )
        return UserProfileData(**data)

    def explain_option(self, option: dict, profile: dict) -> dict:
        template = self._load_prompt("option_explainer.txt")
        prompt = template.format(
            role_title=option.get("title"),
            user_profile_summary=profile.get("current_role"),
            feasibility=option.get("feasibility_score")
        )
        
        # We expect a simple dict response
        return self.ai.generate_json(
            prompt=prompt,
            system_prompt="You are a helpful analyst.",
            response_model=dict
        )

    def generate_roadmap_actions(self, phase: dict, profile: UserProfileData, target_role: str) -> list[str]:
        template = self._load_prompt("roadmap_writer.txt")
        
        skills_str = ", ".join([s.name for s in profile.skills])
        
        prompt = template.format(
            target_role=target_role,
            phase_name=phase["name"],
            objective=phase["objective"],
            duration=phase["duration_weeks"],
            current_role=profile.current_role,
            skills=skills_str
        )
        
        # We expect a list of strings
        return self.ai.generate_json(
            prompt=prompt,
            system_prompt="You are a tactical career coach.",
            response_model=list[str]
        )
