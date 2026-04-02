from sqlalchemy import Column, Integer, ForeignKey, JSON, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.db import Base

class SalaryBridge(Base):
    __tablename__ = "salary_bridges"

    id = Column(Integer, primary_key=True, index=True)
    career_path_set_id = Column(Integer, ForeignKey("career_path_sets.id"), nullable=False)
    
    inputs = Column(JSON, nullable=False)
    outputs = Column(JSON, nullable=False)
    
    computed_at = Column(DateTime(timezone=True), server_default=func.now())
    
    career_path_set = relationship("CareerPathSet", backref="salary_bridges")
