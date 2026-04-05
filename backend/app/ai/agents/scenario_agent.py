class ScenarioAgent:
    async def run(self, base_outputs: dict, new_outputs: dict, modified_inputs: dict) -> str:
        # Professional narrative focused on risk and collaboration
        return f"We've analyzed this modified scenario against your current capital buffer. While the change in parameters is feasible, we've identified a {('reduction' if new_outputs['risk_score'] < base_outputs['risk_score'] else 'increase')} in your overall safety score. We recommend prioritizing 6 months of liquid savings before committing to this extended timeline."
