from sqlalchemy import Column, Integer, ForeignKey, JSON, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.db import Base

class ScenarioRun(Base):
    __tablename__ = "scenario_runs"

    id = Column(Integer, primary_key=True, index=True)
    roadmap_id = Column(Integer, ForeignKey("roadmaps.id"), nullable=False)
    
    modified_inputs = Column(JSON, nullable=False)
    deterministic_out = Column(JSON, nullable=False)
    narrative = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    roadmap = relationship("Roadmap", backref="scenario_runs")
