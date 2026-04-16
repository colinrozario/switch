from pydantic import BaseModel, Field, model_validator
from typing import List, Optional


class MonthlyCashFlow(BaseModel):
    month: int
    phase: str
    income: float
    expenses: float
    net: float
    cumulative_burn: float


class SalaryBridgeInputs(BaseModel):
    current_monthly_net_income: float
    monthly_expenses: float
    liquid_savings: float
    transition_months: int
    weekly_hours_available: float
    hard_constraint_count: int = 0
    years_experience: float = 5.0
    target_role_id: str
    # Optional side income for simulator scenarios
    side_income: float = 0.0

    @property
    def monthly_income(self) -> float:
        """Alias used by the frontend SimulatorPage."""
        return self.current_monthly_net_income + self.side_income


class SalaryBridgeOutputs(BaseModel):
    monthly_cashflow: List[MonthlyCashFlow]
    total_bridge_required: float
    runway_months: float
    risk_score: int
    failure_threshold_month: Optional[int] = None


class SalaryBridgeResponse(BaseModel):
    id: str
    path_set_id: str
    inputs: SalaryBridgeInputs
    outputs: SalaryBridgeOutputs

