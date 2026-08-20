"""Demo-safe FastAPI boundary for RESCUECHAIN.

The frontend is intentionally standalone for the hackathon. These endpoints define
the integration seam for persistent repositories and production auth.
"""

from datetime import datetime, timezone
from typing import Literal
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

# Bulletproof import fallback to prevent ModuleNotFoundError on Render
try:
    from .ai.gemini import stream_disaster_response
except ImportError:
    from backend.ai.gemini import stream_disaster_response

app = FastAPI(
    title="RESCUECHAIN API",
    version="0.1.0",
    description="Human-approved emergency decision support",
)


class IncidentInput(BaseModel):
    title: str = Field(min_length=3, max_length=120, pattern=r"^[^<>]+$")
    category: Literal[
        "FLOOD", "FIRE", "MEDICAL", "ROAD_ACCIDENT", "BUILDING_COLLAPSE", "OTHER"
    ]
    location: str = Field(min_length=3, max_length=160, pattern=r"^[^<>]+$")
    description: str = Field(min_length=3, max_length=2000, pattern=r"^[^<>]+$")
    latitude: float | None = None
    longitude: float | None = None
    affected_people: int | None = Field(default=None, ge=0, le=1_000_000)
    count_quality: Literal["UNKNOWN", "ESTIMATE", "VERIFIED"] = "UNKNOWN"


class SimulationInput(BaseModel):
    rainfall_delta: int = Field(default=0, ge=-100, le=300)
    road_closures: int = Field(default=0, ge=0, le=50)
    available_ambulances: int = Field(default=24, ge=0)
    available_boats: int = Field(default=6, ge=0)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=1000)


@app.get("/health")
def health():
    return {
        "status": "DEMO_MODE",
        "database": "sqlite fallback",
        "timestamp": datetime.now(timezone.utc),
    }


@app.post("/api/incidents")
def create_incident(payload: IncidentInput):
    return {
        "id": "INC-DEMO-001",
        "status": "RECEIVED",
        "demo": True,
        "incident": payload.model_dump(),
    }


@app.post("/api/ai/priority")
def priority(payload: dict):
    # Production implementation delegates to rules/ML, never an LLM-only score.
    score = min(
        100,
        40 + int(payload.get("medical", 0)) * 10 + int(payload.get("trapped", 0)) * 15,
    )
    return {
        "priority": score,
        "risk": "CRITICAL" if score >= 85 else "HIGH",
        "confidence": "DEMO",
        "factors": ["medical need", "trapped people"],
    }


@app.post("/api/simulation/run")
def run_simulation(payload: SimulationInput):
    pressure = max(0, payload.rainfall_delta // 10) + payload.road_closures
    return {
        "demo_prediction": True,
        "critical_incidents": 4 + pressure // 3,
        "estimated_affected": 2400 + pressure * 275,
        "recommended_actions": [
            "Review boat allocation",
            "Check hospital capacity",
            "Recalculate routes",
        ],
    }


@app.post("/api/chat/stream")
async def chat_stream(request: ChatRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    return StreamingResponse(
        stream_disaster_response(request.message),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",  # Prevents Nginx from buffering SSE streams
        },
    )
