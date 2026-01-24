from app.engines.risk_engine import analyze_risk

def test_risk_analysis_high():
    finance = {"failure_month": 3, "warnings": ["Runway depleted"]}
    timeline = {"total_high": 12}
    
    result = analyze_risk(finance, timeline)
    
    assert result["components"]["financial"] == 100
    assert result["recommendation"].startswith("High Risk")

def test_risk_analysis_low():
    finance = {"failure_month": None, "warnings": []}
    timeline = {"total_high": 6} # 6/24 scale = 25 risk
    
    result = analyze_risk(finance, timeline, market_volatility_score=10)
    
    # Finance = 20
    # Timeline = 25
    # Market = 10
    # Weighted = 10 + 7.5 + 2 = 19.5 -> ~19
    
    assert result["risk_score"] < 50
    assert "Green light" in result["recommendation"] or "Safe" in result["recommendation"]
