from app.engines.roadmap import generate_roadmap

def test_roadmap_low_risk():
    # 10% gap, 20 hours/week -> Fast
    # 10% of 800 = 80 hours. / 20 = 4 weeks skill + 4 proof + 8 market = 16 + 2 = 18 weeks ~ 4-5 months.
    result = generate_roadmap("Dev", 0.1, 20, 12)
    assert result.is_feasible is True
    assert result.risk_level in ["Low", "Moderate"]
    assert result.total_duration_months <= 12

def test_roadmap_high_risk_horizon():
    # 100% gap, 5 hours/week -> Slow
    # 800 / 5 = 160 weeks skill. + 32 proof + 8 market = 200 weeks ~ 46 months.
    # Horizon 12 months.
    result = generate_roadmap("Dev", 1.0, 5, 12)
    assert result.total_duration_months > 12
    assert "horizon" in result.warnings[0]
