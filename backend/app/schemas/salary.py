from pydantic import BaseModel
from typing import List, Optional

class SalaryBridgeInput(BaseModel):
    current_net_income: float
    monthly_expenses: float
    savings: float
    side_income_schedule: List[float]  # Expected side income per month
    transition_timeline_months: int
    target_salary_p25: float  # Expected entry-level salary (25th percentile)

class MonthlyCashflow(BaseModel):
    month: int
    income: float
    expenses: float
    net_flow: float
    balance: float
    
class SalaryBridgeOutput(BaseModel):
    month_by_month_cashflow: List[MonthlyCashflow]
    lowest_balance: float
    required_buffer: float
    failure_month: Optional[int]
    warnings: List[str]
