from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "Switch Backend"
    PROJECT_VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    
    # SQLite for development (easier setup)
    DATABASE_URL: str = "sqlite:///./switch_dev.db"
    
    OPENAI_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None
    
    # Constructed database URL
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        return self.DATABASE_URL

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
