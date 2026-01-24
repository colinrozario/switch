import sys
import os

# Add current directory to sys.path so we can import app
sys.path.append(os.getcwd())

from app.ai.client import AIClient
from app.core.config import settings

def test_connection():
    print("--- Diagnostic Start ---")
    print(f"Gemini Key Present: {bool(settings.GEMINI_API_KEY)}")
    print(f"OpenAI Key Present: {bool(settings.OPENAI_API_KEY)}")
    
    try:
        client = AIClient()
        print(f"Provider selected: {client.provider}")
        print(f"Model selected: {client.model}")
        
        print("Attempting generation...")
        if client.provider == "gemini":
             # Test simple text generation
             # Note: client.model is a genai.GenerativeModel object
             response = client.model.generate_content("Hello, can you hear me?")
             print(f"Response success: {bool(response.text)}")
             print(f"Response preview: {response.text[:50]}...")
        else:
             print("Skipping OpenAI test portion for now.")

    except Exception as e:
        print(f"!!! DIAGNOSTIC FAILED !!!")
        print(e)
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_connection()
