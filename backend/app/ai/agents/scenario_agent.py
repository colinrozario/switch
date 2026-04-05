class ScenarioAgent:
    async def run(self, base_outputs: dict, new_outputs: dict, modified_inputs: dict) -> str:
        # Professional three-sentence narrative focused on risk and specific differences
        
        # 1. Delta Calculation
        score_diff = new_outputs['risk_score'] - base_outputs['risk_score']
        runway_diff = new_outputs['runway_months'] - base_outputs['runway_months']
        bridge_diff = new_outputs['total_bridge_required'] - base_outputs['total_bridge_required']
        
        # 2. Construction
        sentence_1 = f"Adjusting your parameters {'improves' if score_diff > 0 else 'shifts'} your safety score from {base_outputs['risk_score']} to {new_outputs['risk_score']}."
        
        sentence_2 = f"{'Reducing' if bridge_diff < 0 else 'Increasing'} your monthly overhead by ₹{abs(int(bridge_diff/12)):,} {'extends' if runway_diff > 0 else 'reduces'} your financial runway by {abs(round(runway_diff, 1))} months."
        
        sentence_3 = f"This scenario {'solidifies' if score_diff > 0 else 'challenges'} your transition buffer, meaning we'd recommend {'proceeding with increased confidence' if new_outputs['risk_score'] > 60 else 'adding at least 3 months of additional capital'} before the pivot."
        
        return f"{sentence_1} {sentence_2} {sentence_3}"
