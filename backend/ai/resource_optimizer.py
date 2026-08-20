"""OR-Tools integration seam. Dispatch remains outside this module."""

def recommend(incident_id: str, resources: list[dict]) -> dict:
    available = [r for r in resources if r.get("status") == "AVAILABLE"]
    return {"incident_id": incident_id, "recommendations": available[:4], "requires_officer_approval": True, "engine": "OR-TOOLS_DEMO"}
