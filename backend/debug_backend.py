import sys
import os
from dotenv import load_dotenv

# Add current directory to sys.path
sys.path.append(os.getcwd())
load_dotenv()

from app.ai.orchestrator import Orchestrator

def debug_intake():
    print("Initializing Orchestrator...")
    orchestrator = Orchestrator()
    
    input_text = """
    Current Role: Senior Marketing Manager
    Experience: 5 years
    Industry: General

    Financials:
    - Monthly Expenses: $3000
    - Savings: $10000
    - Stable Income: true

    Constraints:
    - Location: Flexible
    - Weekly Hours: 10-15
    - Dependents: None

    Goal:
    - Target: Unsure
    - Type: unsure
    - Motivations: 
    """
    
    print("\n--- Sending Input to AI ---")
    try:
        result = orchestrator.process_intake(input_text)
        print("\n--- SUCCESS ---")
        print(result.model_dump_json(indent=2))
    except Exception as e:
        print("\n--- FAILURE ---")
        print(e)
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    debug_intake()
