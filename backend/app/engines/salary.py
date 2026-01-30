from app.schemas.salary import SalaryBridgeInput, SalaryBridgeOutput, MonthlyCashflow

def calculate_salary_bridge(data: SalaryBridgeInput) -> SalaryBridgeOutput:
    cashflow = []
    current_savings = data.savings
    
    lowest_balance = current_savings
    failure_month = None
    warnings = []
    
    # Analyze cashflow month by month
    for month in range(1, data.transition_timeline_months + 1):
        # We assume for a severe "Switch" (v1), the user relies on side income + savings.
        # If side_income_schedule is shorter than timeline, assume 0 for remaining months.
        if month <= len(data.side_income_schedule):
            income = data.side_income_schedule[month - 1]
        else:
            income = 0.0
            
        expenses = data.monthly_expenses
        
        net_flow = income - expenses
        current_savings += net_flow
        
        if current_savings < lowest_balance:
            lowest_balance = current_savings
            
        if current_savings < 0 and failure_month is None:
            failure_month = month
            
        cashflow.append(MonthlyCashflow(
            month=month,
            income=income,
            expenses=expenses,
            net_flow=net_flow,
            balance=current_savings
        ))
        
    # Calculate Required Buffer (Safety Margin)
    # PRD specifies: "required_buffer (with 15–25% uncertainty)"
    # We define safety margin as 20% of total expenses over the timeline.
    total_expenses = data.monthly_expenses * data.transition_timeline_months
    safety_margin = total_expenses * 0.20
    
    # How much extra cash do we need to ensure the balance never drops below safety_margin?
    # If Lowest Balance is 5000 and Safety is 2000, we are good (need 0).
    # If Lowest Balance is -1000 and Safety is 2000, we need 3000 total (1000 to reach 0 + 2000 safety).
    # Formula: needed = safety_margin - lowest_balance
    required_buffer = max(0.0, safety_margin - lowest_balance)
    
    if required_buffer > 0:
        warnings.append(f"Projected shortfall. You need an additional ${required_buffer:,.2f} buffer to maintain a safety margin.")
        
    if failure_month:
        warnings.append(f"Critical: You will run out of money in month {failure_month}.")

    return SalaryBridgeOutput(
        month_by_month_cashflow=cashflow,
        lowest_balance=lowest_balance,
        required_buffer=required_buffer,
        failure_month=failure_month,
        warnings=warnings
    )
