# Architecture

## Current MVP

`frontend/` is represented by the Next.js App Router under `src/app`. The dashboard uses a compact synthetic dataset, CSS map visualization, and Recharts so the presentation works offline and without third-party map keys.

## Target services

- **FastAPI**: validated REST boundary, authentication, authorization, rate limits, and audit events.
- **SQLAlchemy + PostgreSQL/PostGIS**: incidents, resources, allocations, demographic estimates, status history, and geospatial indexes. SQLite is the local fallback.
- **AI adapter**: `backend/ai/gemini.py` calls the official Google GenAI SDK only when `GEMINI_API_KEY` exists; otherwise it returns a clearly marked demo response.
- **Priority engine**: transparent weighted rules with optional scikit-learn/XGBoost calibration. It never dispatches.
- **Resource optimizer**: OR-Tools assignment with distance, travel time, capacity, accessibility, and safety constraints.
- **Risk and shortage**: replaceable forecasting services with confidence intervals and a `DEMO_PREDICTION` label for synthetic inputs.

## Human approval

Every recommendation has an immutable original payload, officer identity, timestamp, outcome, and final allocation. Dispatch endpoints reject unapproved recommendations. Production deployment also needs SSO/MFA, least-privilege roles, encrypted storage, monitoring, and a formal emergency-services validation process.
