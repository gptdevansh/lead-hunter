# LeadHunter Backend

FastAPI backend following a domain-driven modular MVC architecture.

## Run

1. Create and activate a Python environment.
2. Install dependencies:
   - `pip install -r requirements.txt`
3. Start API server:
   - `uvicorn app.main:app --reload --port 8000`

## Structure

- `app/core` - config, database, CORS
- `app/api` - top-level router assembly
- `app/modules` - domain modules (auth)
- `app/models` - shared SQLAlchemy base

## Endpoints

- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/signin`
- `GET /api/v1/auth/google?mode=signin|signup`
- `GET /api/v1/auth/google/callback`
- `GET /health`

## Google OAuth Setup

Set these environment variables for backend:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI` (default: `http://localhost:8000/api/v1/auth/google/callback`)
- `FRONTEND_BASE_URL` (default: `http://localhost:3000`)
- `FRONTEND_AUTH_CALLBACK_PATH` (default: `/auth/callback`)