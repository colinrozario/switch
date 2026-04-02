from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.core.db import get_db
from app.models.roadmap import Roadmap
from app.models.scenario_run import ScenarioRun
from app.engines.salary_bridge import SalaryBridgeEngine
from app.schemas.salary_bridge import SalaryBridgeInputs
from app.ai.agents.scenario_agent import ScenarioAgent

router = APIRouter()

class SimulatorRequest(BaseModel):
    roadmap_id: int
    modified_inputs: dict

@router.post("/run")
async def run_simulator(request: SimulatorRequest, db: Session = Depends(get_db)):
    roadmap = db.query(Roadmap).filter(Roadmap.id == request.roadmap_id).first()
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")
        
    bridge = roadmap.salary_bridge
    base_inputs = bridge.inputs
    
    merged_inputs = dict(base_inputs)
    merged_inputs.update(request.modified_inputs)
    
    engine = SalaryBridgeEngine()
    inputs_obj = SalaryBridgeInputs(**merged_inputs)
    new_outputs = engine.compute(inputs_obj)
    
    agent = ScenarioAgent()
    narrative = await agent.run(
        base_outputs=bridge.outputs,
        new_outputs=new_outputs.model_dump(),
        modified_inputs=request.modified_inputs
    )
    
    run = ScenarioRun(
        roadmap_id=request.roadmap_id,
        modified_inputs=request.modified_inputs,
        deterministic_out=new_outputs.model_dump(),
        narrative=narrative
    )
    db.add(run)
    db.commit()
    db.refresh(run)
    
    return run

@router.get("/{roadmap_id}/runs")
def get_scenario_runs(roadmap_id: int, db: Session = Depends(get_db)):
    runs = db.query(ScenarioRun).filter(ScenarioRun.roadmap_id == roadmap_id).all()
    return runs
