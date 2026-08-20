# API contract

The FastAPI scaffold in `backend/main.py` provides demo-safe endpoints and is designed to be replaced by persistent repositories.

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Create a role-scoped account |
| POST | `/api/auth/login` | Start a secure session |
| GET | `/api/incidents` | List incidents with filters |
| GET | `/api/incidents/{id}` | View estimates, verification, priority, and history |
| POST | `/api/ai/analyze` | Gemini/demo structured extraction |
| POST | `/api/ai/priority` | Deterministic explainable priority assessment |
| POST | `/api/ai/allocate` | OR-Tools recommendation; never dispatches |
| POST | `/api/simulation/run` | Scenario planning result |
| GET | `/api/resources` | Fleet and supply availability |
| GET | `/api/hospitals` | Capacity and oxygen status |
| GET | `/api/shelters` | Occupancy and supplies |
| GET | `/api/analytics` | Aggregated operational charts |

All request bodies are Pydantic models. Coordinates are WGS84. Production endpoints should use authenticated role checks and return `401`, `403`, `409`, and `422` rather than silently applying unsafe actions.
