from sqlalchemy import Column, Integer, ForeignKey, JSON, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.db import Base

class Roadmap(Base):
    __tablename__ = "roadmaps"

    id = Column(Integer, primary_key=True, index=True)
    salary_bridge_id = Column(Integer, ForeignKey("salary_bridges.id"), nullable=False)
    
    timeline_months = Column(Integer, nullable=False)
    phases = Column(JSON, nullable=False)
    prompt_version = Column(Text, nullable=True)
    
    generated_at = Column(DateTime(timezone=True), server_default=func.now())
    
    salary_bridge = relationship("SalaryBridge", backref="roadmaps")
