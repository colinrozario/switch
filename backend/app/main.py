from fastapi import FastAPI
from app.core.config import settings
from app.api import profiles, plans

app = FastAPI(title=settings.PROJECT_NAME)

@app.get("/health")
def health_check():
    return {
        "status": "ok", 
        "app_name": settings.PROJECT_NAME,
        "mode": "production-ready-mvp"
    }

app.include_router(profiles.router, prefix="/profiles", tags=["Profiles"])
app.include_router(plans.router, prefix="/plans", tags=["Plans"])
