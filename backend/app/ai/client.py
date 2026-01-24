import os
import json
from typing import Dict, Any, Type
from pydantic import BaseModel
from openai import OpenAI

from app.core.config import settings

from app.core.config import settings
import google.generativeai as genai

class AIClient:
    def __init__(self):
        self.provider = "openai"
        self.client = None
        
        # Priority to Gemini if set (per user request "instead")
        if settings.GEMINI_API_KEY:
            self.provider = "gemini"
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        elif settings.OPENAI_API_KEY:
            self.provider = "openai"
            self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
            self.model = "gpt-4o"
        else:
            print("WARNING: No API KEY found (OpenAI or Gemini). AI features will fail.")

    def generate_json(self, prompt: str, system_prompt: str, response_model: Type[BaseModel]) -> Dict[str, Any]:
        if self.provider == "gemini":
            try:
                # Gemini doesn't have system prompts in the same way for chat, 
                # strictly speaking, but passing it as first part works or system_instruction in 1.5
                # We'll prepend it.
                combined_prompt = f"System: {system_prompt}\n\nUser: {prompt}\n\nReturn valid JSON."
                
                response = self.model.generate_content(
                    combined_prompt,
                    generation_config={"response_mime_type": "application/json"}
                )
                return json.loads(response.text)
            except Exception as e:
                print(f"Gemini Error: {e}")
                raise e
        
        # OpenAI Fallback
        if not self.client:
             raise ValueError("AI Client not configured. Set GEMINI_API_KEY or OPENAI_API_KEY.")

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"},
                temperature=0.2,
            )
            content = response.choices[0].message.content
            return json.loads(content)
            
        except Exception as e:
            print(f"OpenAI Error: {e}")
            raise e

    def generate_text(self, prompt: str, system_prompt: str) -> str:
        if self.provider == "gemini":
            combined_prompt = f"{system_prompt}\n\n{prompt}"
            response = self.model.generate_content(combined_prompt)
            return response.text

        if not self.client:
             return "AI Placeholder (Missing Key)"
             
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3
        )
        return response.choices[0].message.content or ""
