#!/usr/bin/env python3
"""
Initialize the SQLite database for development
"""
from app.db.models import Base
from app.db.session import engine

def init_db():
    """Create all tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database initialized successfully!")

if __name__ == "__main__":
    init_db()