from pydantic import BaseModel
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
    hard_constraint_count: int
    years_experience: float
    target_role_id: str

class SalaryBridgeOutputs(BaseModel):
    monthly_cashflow: List[MonthlyCashFlow]
    total_bridge_required: float
    runway_months: float
    risk_score: int
    failure_threshold_month: Optional[int]

class SalaryBridgeResponse(BaseModel):
    id: str
    path_set_id: str
    inputs: SalaryBridgeInputs
    outputs: SalaryBridgeOutputs
