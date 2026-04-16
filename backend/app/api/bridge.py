from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.models.career_path_set import CareerPathSet
from app.models.salary_bridge import SalaryBridge
from app.schemas.salary_bridge import SalaryBridgeInputs
from app.engines.salary_bridge import SalaryBridgeEngine

router = APIRouter()


@router.get("/by-id/{bridge_id}")
def get_bridge_by_id(bridge_id: int, db: Session = Depends(get_db)):
    """Fetch a SalaryBridge directly by its own primary key (used by SimulatorPage)."""
    bridge = db.query(SalaryBridge).filter(SalaryBridge.id == bridge_id).first()
    if not bridge:
        raise HTTPException(status_code=404, detail="Bridge not found")
    return bridge


@router.get("/{path_set_id}")

def get_or_create_bridge(path_set_id: int, db: Session = Depends(get_db)):
    existing = db.query(SalaryBridge).filter(SalaryBridge.career_path_set_id == path_set_id).first()
    if existing:
        return existing
        
    path_set = db.query(CareerPathSet).filter(CareerPathSet.id == path_set_id).first()
    if not path_set or not path_set.selected_path_id:
        raise HTTPException(status_code=404, detail="Path set not found or no path selected")
        
    profile = path_set.profile
    structured = profile.structured
    
    # Build inputs
    engine = SalaryBridgeEngine()
    
    # Extract transition months from the selected path
    transition_months = 12
    for p in path_set.paths:
        if p["target_role_id"] == path_set.selected_path_id:
            transition_months = p.get("estimated_transition_months", 12)
            break
            
    inputs = SalaryBridgeInputs(
        current_monthly_net_income=structured.get("monthly_net_income") or 4000.0,
        monthly_expenses=structured.get("monthly_expenses") or 2500.0,
        liquid_savings=structured.get("liquid_savings") or 15000.0,
        transition_months=transition_months,
        weekly_hours_available=structured.get("weekly_hours_available") or 15.0,
        hard_constraint_count=len(structured.get("hard_constraints", [])),
        years_experience=structured.get("years_experience") or 5.0,
        target_role_id=path_set.selected_path_id
    )
    
    outputs = engine.compute(inputs)
    
    bridge = SalaryBridge(
        career_path_set_id=path_set_id,
        inputs=inputs.model_dump(),
        outputs=outputs.model_dump()
    )
    db.add(bridge)
    db.commit()
    db.refresh(bridge)
    
    return bridge
