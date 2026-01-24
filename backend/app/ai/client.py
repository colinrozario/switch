import os
import json
from typing import Dict, Any, Type
from pydantic import BaseModel
from openai import OpenAI

from app.core.config import settings

from app.core.config import settings
import google.generativeai as genai
import time
import random

class AIClient:
    def __init__(self):
        self.provider = "openai"
        self.client = None
        
        # Priority to Gemini if set (per user request "instead")
        if settings.GEMINI_API_KEY:
            self.provider = "gemini"
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.model = genai.GenerativeModel('gemini-2.0-flash')
        elif settings.OPENAI_API_KEY:
            self.provider = "openai"
            self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
            self.model = "gpt-4o"
        else:
            print("WARNING: No API KEY found (OpenAI or Gemini). AI features will fail.")



    def generate_json(self, prompt: str, system_prompt: str, response_model: Type[BaseModel]) -> Dict[str, Any]:
        if self.provider == "gemini":
            combined_prompt = f"System: {system_prompt}\n\nUser: {prompt}\n\nReturn valid JSON."
            
            retries = 3
            for attempt in range(retries):
                try:
                    response = self.model.generate_content(
                        combined_prompt,
                        generation_config={"response_mime_type": "application/json"}
                    )
                    return json.loads(response.text)
                except Exception as e:
                    # Check for "429" or "ResourceExhausted" in string representation if we don't import exact type
                    if "429" in str(e) or "ResourceExhausted" in str(e) or "Quota" in str(e):
                        if attempt < retries - 1:
                            wait_time = (2 ** attempt) + random.uniform(0, 1)
                            print(f"Gemini Rate Limit hit. Retrying in {wait_time:.1f}s...")
                            time.sleep(wait_time)
                            continue
                    
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
