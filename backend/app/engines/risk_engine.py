from typing import Dict

def analyze_risk(
    finance_results: Dict,
    timeline_results: Dict,
    market_volatility_score: int = 50
) -> Dict:
    """
    Calculates a composite risk score for the transition plan.
    
    Args:
        finance_results: Output from finance_engine.
        timeline_results: Output from timeline_engine.
        market_volatility_score: 0-100 score of target role market stability (higher is risky).
        
    Returns:
        Dict with risk analysis.
    """
    
    # 1. Financial Risk
    # Based on runway and lowest balance
    financial_risk_score = 0
    if finance_results.get("failure_month"):
        financial_risk_score = 100 # Failure is certain
    elif finance_results.get("warnings"):
        financial_risk_score = 75 # High risk warnings
    else:
        # Scale based on lowest_balance margin?
        # Simple heuristic for now
        financial_risk_score = 20
        
    # 2. Timeline/Skill Risk
    # Longer timelines = higher risk of burnout/life changes
    total_months = timeline_results.get("total_high", 12)
    timeline_risk_score = min(100, (total_months / 24) * 100) # 24 months = 100 risk
    
    # 3. Market Risk
    # Input provided
    market_risk_score = market_volatility_score
    
    # Composite Score (Weighted)
    # Finance is strictly most important (survival)
    # Timeline is secondary
    weighted_score = (
        (financial_risk_score * 0.5) + 
        (timeline_risk_score * 0.3) + 
        (market_risk_score * 0.2)
    )
    
    recommendation = "Proceed"
    if weighted_score > 80:
        recommendation = "High Risk - Reconsider or strictly save more."
    elif weighted_score > 50:
        recommendation = "Moderate Risk - Proceed with caution."
    else:
        recommendation = "Safe - Green light."
        
    return {
        "risk_score": int(weighted_score),
        "components": {
            "financial": financial_risk_score,
            "timeline": timeline_risk_score,
            "market": market_risk_score
        },
        "recommendation": recommendation
    }
