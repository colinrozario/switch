import pytest
from app.engines.finance_engine import simulate_salary_bridge

def test_salary_bridge_healthy():
    """Test a scenario where savings are sufficient."""
    result = simulate_salary_bridge(
        current_income=0, # Quit job
        monthly_expenses=3000,
        savings=20000,
        timeline_months=4,
        side_income_schedule={},
        target_income_p25=5000,
        uncertainty_buffer=0.1 # 3300/mo effective
    )
    
    # Needs: 4 months * 3300 = 13200. Savings 20000. Balance should be positive.
    assert result["lowest_balance"] > 0
    assert result["failure_month"] is None
    assert len(result["warnings"]) == 0

def test_salary_bridge_failure():
    """Test a scenario where runway runs out."""
    result = simulate_salary_bridge(
        current_income=0,
        monthly_expenses=5000,
        savings=10000,
        timeline_months=6,
        side_income_schedule={},
        target_income_p25=8000,
        uncertainty_buffer=0.0
    )
    
    # Needs 6 * 5000 = 30000. Has 10000. Fails at month 3 (after paying M1, M2).
    # Month 1: 10000 - 5000 = 5000
    # Month 2: 5000 - 5000 = 0
    # Month 3: 0 - 5000 = -5000
    
    assert result["failure_month"] == 3
    assert result["required_buffer"] > 0
    assert len(result["warnings"]) > 0
