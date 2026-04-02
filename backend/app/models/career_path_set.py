from sqlalchemy import Column, Integer, String, ForeignKey, JSON, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.db import Base

class CareerPathSet(Base):
    __tablename__ = "career_path_sets"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("profiles.id"), nullable=False)
    
    paths = Column(JSON, nullable=True)
    rejected_paths = Column(JSON, nullable=True)
    selected_path_id = Column(Text, nullable=True)
    prompt_version = Column(Text, nullable=True)
    
    generated_at = Column(DateTime(timezone=True), server_default=func.now())
    
    profile = relationship("Profile", backref="career_path_sets")
