from typing import List, Dict, Optional

def simulate_salary_bridge(
    current_income: int,
    monthly_expenses: int,
    savings: int,
    timeline_months: int,
    side_income_schedule: Dict[int, int],
    target_income_p25: int,
    uncertainty_buffer: float = 0.2
) -> Dict:
    """
    Simulates month-by-month cashflow during a career transition.
    
    Args:
        current_income: Net monthly income from current job (0 if unemployed).
        monthly_expenses: Total monthly burn rate.
        savings: Liquid cash available.
        timeline_months: Expected duration of the transition phase.
        side_income_schedule: Map of month_index (1-based) to expected side income.
        target_income_p25: Conservative estimate of future salary (25th percentile).
        uncertainty_buffer: Percentage of expenses to add as safety margin (default 20%).
        
    Returns:
        Dict containing simulation results including cashflow, risks, and warnings.
    """
    
    # Adjust expenses with uncertainty buffer
    buffered_expenses = int(monthly_expenses * (1 + uncertainty_buffer))
    
    monthly_cashflow = []
    current_balance = savings
    lowest_balance = savings
    failure_month = None
    warnings = []
    
    # We simulate for timeline_months + 6 months buffer to see post-transition stability
    simulation_duration = timeline_months + 6
    
    for month in range(1, simulation_duration + 1):
        # Determine income sources
        # Assuming current income stops if timeline implies full-time study/switch, 
        # but the prompt implies a "bridge", so we'll be conservative.
        # If this is a "switch" plan, usually implying leaving the old job or strictly side-hustle.
        # Let's assume:
        # - internal logic: `current_income` is what they have NOW. 
        # - The caller should zero this out if they plan to quit.
        # - For this engine, we treat inputs literally. 
        
        month_income = current_income
        side_income = side_income_schedule.get(month, 0)
        
        # If we have reached the target job (after timeline_months), we assume target income starts
        # We assume 1 month ramp up or immediate start? Let's assume immediate for simplicity of model,
        # but p25 is conservative.
        is_transitioned = month > timeline_months
        
        if is_transitioned:
            total_income = target_income_p25
        else:
            total_income = month_income + side_income
            
        net_flow = total_income - buffered_expenses
        current_balance += net_flow
        
        if current_balance < lowest_balance:
            lowest_balance = current_balance
            
        if current_balance < 0 and failure_month is None:
            failure_month = month
            
        monthly_cashflow.append({
            "month": month,
            "income": total_income,
            "expenses": buffered_expenses,
            "net_flow": net_flow,
            "balance": current_balance,
            "is_transitioned": is_transitioned
        })

    # Calculations
    required_buffer = 0
    if lowest_balance < 0:
        required_buffer = abs(lowest_balance)
        warnings.append(f"Runway depleted at month {failure_month}. Need extra ${required_buffer} savings.")
    
    # Calculate Monthly Burn
    monthly_burn = monthly_expenses
    
    # Calculate Runaway
    # How many months until liquid_savings < 0
    # Assuming income stops? Or partially stops?
    # For a career switch, usually we assume they might quit.
    # But let's act conservatively: 
    # Scenario A: Quit Job -> Income = 0 (or side_income)
    
    current_savings = savings
    months_survived = 0
    failure_month = None
    lowest_balance = current_savings
    
    max_simulation = 24 # Cap at 2 years
    
    for m in range(1, max_simulation + 1):
        # Income
        income = 0
        # Note: side_income_schedule keys are integers, not strings.
        if m in side_income_schedule:
             income += side_income_schedule[m]
        
        # Expenses
        expenses = monthly_burn
        
        # Net
        net = income - expenses
        current_savings += net
        
        if current_savings < lowest_balance:
            lowest_balance = current_savings
            
        if current_savings <= 0 and failure_month is None:
            failure_month = m
            # We don't break, we want to see how deep the hole gets? No, let's stop for runway calc.
            
        if failure_month is None:
            months_survived = m
            
    return {
        "simulation_months": months_survived,
        "lowest_balance": lowest_balance,
        "failure_month": failure_month,
        "survived_full_timeline": failure_month is None or failure_month > timeline_months
    }
