import json
import os
import math
from app.schemas.salary_bridge import SalaryBridgeInputs, SalaryBridgeOutputs, MonthlyCashFlow
from app.engines.risk_score import RiskScoreCalculator

class SalaryBridgeEngine:
    def __init__(self):
        data_path = os.path.join(os.path.dirname(__file__), "data", "careers.json")
        with open(data_path, "r", encoding="utf-8") as f:
            self.careers = json.load(f)
            
    def compute(self, inputs: SalaryBridgeInputs) -> SalaryBridgeOutputs:
        role_data = next((r for r in self.careers if r["role_id"] == inputs.target_role_id), None)
        if not role_data:
            raise ValueError(f"Unknown target_role_id: {inputs.target_role_id}")
            
        p25_annual = role_data["annual_salary_p25"]
        entry_monthly = (p25_annual / 12) * 0.80
        
        transition_months = inputs.transition_months
        if transition_months < 1:
            transition_months = 1
            
        phase1_end = math.floor(transition_months * 0.5)
        phase2_end = math.floor(transition_months * 0.85)
        
        monthly_cashflow = []
        cumulative_burn = 0.0
        total_bridge_required = 0.0
        failure_threshold_month = None
        
        for month in range(1, transition_months + 1):
            if month <= phase1_end:
                phase = "Skill building"
                income = inputs.current_monthly_net_income * 0.9
            elif month <= phase2_end:
                phase = "Job search"
                income = inputs.current_monthly_net_income * 0.5
            else:
                phase = "Entry level"
                income = entry_monthly
                
            net = income - inputs.monthly_expenses
            
            if net < 0:
                cumulative_burn += abs(net)
                total_bridge_required += abs(net)
                
            if failure_threshold_month is None and cumulative_burn > inputs.liquid_savings:
                failure_threshold_month = month
                
            monthly_cashflow.append(MonthlyCashFlow(
                month=month,
                phase=phase,
                income=income,
                expenses=inputs.monthly_expenses,
                net=net,
                cumulative_burn=cumulative_burn
            ))
            
        runway_months = inputs.liquid_savings / inputs.monthly_expenses if inputs.monthly_expenses > 0 else float('inf')
        
        risk_score = RiskScoreCalculator.compute(
            bridge_required=total_bridge_required,
            liquid_savings=inputs.liquid_savings,
            runway_months=runway_months,
            transition_months=transition_months,
            weekly_hours_available=inputs.weekly_hours_available,
            hard_constraint_count=inputs.hard_constraint_count,
            years_experience=inputs.years_experience
        )
        
        return SalaryBridgeOutputs(
            monthly_cashflow=monthly_cashflow,
            total_bridge_required=total_bridge_required,
            runway_months=runway_months,
            risk_score=risk_score,
            failure_threshold_month=failure_threshold_month
        )
