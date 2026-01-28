import uuid
import json
from datetime import datetime
from sqlalchemy import String, Integer, Float, ForeignKey, DateTime, func, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"
    
    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, onupdate=func.now(), server_default=func.now())
    
    profiles = relationship("Profile", back_populates="user")

class Profile(Base):
    __tablename__ = "profiles"
    
    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    structured_data: Mapped[str] = mapped_column(Text)  # JSON as text for SQLite
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, onupdate=func.now(), server_default=func.now())
    
    user = relationship("User", back_populates="profiles")
    plans = relationship("Plan", back_populates="profile")

class CareerRole(Base):
    __tablename__ = "career_roles"
    
    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title: Mapped[str] = mapped_column(String, index=True)
    salary_data: Mapped[str] = mapped_column(Text) # JSON as text
    skills: Mapped[str] = mapped_column(Text) # JSON as text
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, onupdate=func.now(), server_default=func.now())

class CareerEdge(Base):
    __tablename__ = "career_edges"
    
    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    from_role_id: Mapped[str] = mapped_column(ForeignKey("career_roles.id"))
    to_role_id: Mapped[str] = mapped_column(ForeignKey("career_roles.id"))
    transition_data: Mapped[str] = mapped_column(Text) # JSON as text
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, onupdate=func.now(), server_default=func.now())

class Plan(Base):
    __tablename__ = "plans"
    
    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    profile_id: Mapped[str] = mapped_column(ForeignKey("profiles.id"))
    target_role_id: Mapped[str] = mapped_column(ForeignKey("career_roles.id"))
    roadmap: Mapped[str] = mapped_column(Text) # JSON as text
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, onupdate=func.now(), server_default=func.now())
    
    profile = relationship("Profile", back_populates="plans")
    scenarios = relationship("Scenario", back_populates="plan")

class Scenario(Base):
    __tablename__ = "scenarios"
    
    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    plan_id: Mapped[str] = mapped_column(ForeignKey("plans.id"))
    assumptions: Mapped[str] = mapped_column(Text) # JSON as text
    results: Mapped[str] = mapped_column(Text) # JSON as text
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, onupdate=func.now(), server_default=func.now())
    
    plan = relationship("Plan", back_populates="scenarios")