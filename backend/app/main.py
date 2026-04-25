from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import profiles, plans, intake, paths, bridge, roadmap, simulator

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {
        "status": "ok", 
        "app_name": settings.PROJECT_NAME,
        "mode": "production-ready-mvp"
    }

app.include_router(profiles.router, prefix="/profiles", tags=["Profiles"])
app.include_router(plans.router, prefix="/plans", tags=["Plans"])

# New endpoints based on PRD
app.include_router(intake.router, prefix="/api/intake", tags=["Intake"])
app.include_router(paths.router, prefix="/api/paths", tags=["Paths"])
app.include_router(bridge.router, prefix="/api/bridge", tags=["Bridge"])
app.include_router(roadmap.router, prefix="/api/roadmap", tags=["Roadmap"])
app.include_router(simulator.router, prefix="/api/simulator", tags=["Simulator"])
