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
    
    # If failure is predicted, override risk to High
    if financial_risk_score == 100:
        recommendation = "High Risk - Runway failure predicted."
        # Ensure score reflects this severity
        weighted_score = max(weighted_score, 90)
    elif weighted_score > 80:
        recommendation = "High Risk - Reconsider or strictly save more."
    elif weighted_score > 50:
        recommendation = "Moderate Risk - Proceed with caution."
    else:
        recommendation = "Safe - Green light."
    
    # New gap analysis for more specific financial/timeline recommendation
    runway = finance_results.get("simulation_months", 0)
    timeline_high = timeline_results.get("total_high", 12)
    
    # Gap analysis
    gap = runway - timeline_high
    
    gap_status = ""
    gap_score = 0
    gap_recommendation = ""

    if gap < -2:
        gap_status = "CRITICAL"
        gap_score = 90
        gap_recommendation = "CRITICAL: Increase savings significantly or drastically reduce timeline."
    elif gap < 0:
        gap_status = "HIGH"
        gap_score = 75
        gap_recommendation = "HIGH: Increase savings or extend timeline."
    elif gap < 3:
        gap_status = "MODERATE"
        gap_score = 50
        gap_recommendation = "MODERATE: Proceed with caution, monitor finances closely."
    else:
        gap_status = "LOW"
        gap_score = 25
        gap_recommendation = "LOW: Plan is viable, good financial buffer."

    # Integrate gap analysis into overall recommendation and score
    # If gap analysis indicates higher risk, override or adjust
    if gap_score > weighted_score:
        weighted_score = max(weighted_score, gap_score)
        recommendation = gap_recommendation
    elif gap_score > 50 and weighted_score <= 50: # If gap is moderate/high but overall is low
        recommendation += f" (Note: Financial runway gap is {gap_status})"
    
        
    return {
        "risk_score": int(weighted_score),
        "components": {
            "financial": financial_risk_score,
            "timeline": timeline_risk_score,
            "market": market_risk_score,
            "gap_analysis": {
                "status": gap_status,
                "score": gap_score,
                "gap_months": gap,
                "recommendation": gap_recommendation
            }
        },
        "recommendation": recommendation
    }
