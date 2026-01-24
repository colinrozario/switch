import uuid
from datetime import datetime
from sqlalchemy import String, Integer, Float, ForeignKey, DateTime, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
    
    profiles = relationship("Profile", back_populates="user")

class Profile(Base):
    __tablename__ = "profiles"
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    structured_data: Mapped[dict] = mapped_column(JSONB)  # Skills, experience, preferences
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
    
    user = relationship("User", back_populates="profiles")
    plans = relationship("Plan", back_populates="profile")

class CareerRole(Base):
    __tablename__ = "career_roles"
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String, index=True)
    salary_data: Mapped[dict] = mapped_column(JSONB) # p25, p50, p75, source
    skills: Mapped[list] = mapped_column(JSONB) # List of required skills
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

class CareerEdge(Base):
    __tablename__ = "career_edges"
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    from_role_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("career_roles.id"))
    to_role_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("career_roles.id"))
    transition_data: Mapped[dict] = mapped_column(JSONB) # difficulty, typical_duration, description
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

class Plan(Base):
    __tablename__ = "plans"
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    profile_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("profiles.id"))
    target_role_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("career_roles.id"))
    roadmap: Mapped[dict] = mapped_column(JSONB) # The generated roadmap data
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
    
    profile = relationship("Profile", back_populates="plans")
    scenarios = relationship("Scenario", back_populates="plan")

class Scenario(Base):
    __tablename__ = "scenarios"
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    plan_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("plans.id"))
    assumptions: Mapped[dict] = mapped_column(JSONB) # Overrides for finance/timeline
    results: Mapped[dict] = mapped_column(JSONB) # Resulting changes
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
    
    plan = relationship("Plan", back_populates="scenarios")
