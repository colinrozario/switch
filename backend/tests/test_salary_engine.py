from app.schemas.salary import SalaryBridgeInput
from app.engines.salary import calculate_salary_bridge

def test_salary_bridge_safe():
    data = SalaryBridgeInput(
        current_net_income=5000,
        monthly_expenses=3000,
        savings=20000,
        side_income_schedule=[1000, 1000, 1000, 2000, 2000, 3000],
        transition_timeline_months=6,
        target_salary_p25=4000
    )
    result = calculate_salary_bridge(data)
    assert result.failure_month is None
    # Month 1: 1000 - 3000 = -2000. Balance 18000.
    # Month 2: -2000. Balance 16000.
    # Month 3: -2000. Balance 14000.
    # Month 4: 2000 - 3000 = -1000. Balance 13000.
    # Month 5: -1000. Balance 12000.
    # Month 6: 3000 - 3000 = 0. Balance 12000.
    assert result.lowest_balance == 12000
    # Safety margin: 3000 * 6 * 0.20 = 3600.
    # Lowest 12000 > 3600. Required buffer 0.
    assert result.required_buffer == 0.0

def test_salary_bridge_failure():
    data = SalaryBridgeInput(
        current_net_income=5000,
        monthly_expenses=5000,
        savings=2000,
        side_income_schedule=[0, 0, 0],
        transition_timeline_months=3,
        target_salary_p25=4000
    )
    result = calculate_salary_bridge(data)
    # Month 1: 0 - 5000 = -5000. Balance -3000.
    assert result.failure_month == 1
    # Month 2: Balance -8000
    # Month 3: Balance -13000
    assert result.lowest_balance == -13000 
    # Safety: 5000 * 3 * 0.20 = 3000.
    # Needed: 3000 - (-13000) = 16000.
    assert result.required_buffer == 16000.0
