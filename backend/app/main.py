from fastapi import FastAPI
from app.core.config import settings
from app.api import profiles, plans

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

app.include_router(profiles.router, prefix="/profiles", tags=["profiles"])
app.include_router(plans.router, prefix="/plans", tags=["plans"])

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "project": settings.PROJECT_NAME,
        "version": settings.PROJECT_VERSION
    }
