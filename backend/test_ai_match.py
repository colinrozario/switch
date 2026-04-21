import json
from app.engines.options import generate_options, OptionInput

def run_test():
    print("Testing the AI Career Match Engine...\n")
    
    # Create a test profile
    test_input = OptionInput(
        current_role="Teacher",
        skills=["communication", "organization", "public speaking", "lesson planning"]
    )
    
    print(f"User Profile:")
    print(f"  Current Role: {test_input.current_role}")
    print(f"  Skills: {', '.join(test_input.skills)}\n")
    
    print("Generating Smart Adjacencies... (This might take a few seconds on the very first run to load the model)")
    
    # Run the engine
    result = generate_options(test_input)
    
    # Print the results
    print("\nTop Matches Found:")
    for i, option in enumerate(result.options, 1):
        print(f"  {i}. {option.title} ({option.category}) - Match Score: {option.match_score}%")

if __name__ == "__main__":
    run_test()
