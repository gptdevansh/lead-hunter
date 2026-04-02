from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "LeadHunter API"
    API_V1_PREFIX: str = "/api/v1"

    # ── Database — PostgreSQL only ──────────────────────────────────
    DATABASE_URL: str = "postgresql+psycopg2://leadhunter:leadhunter_secret_2024@postgres:5432/leadhunter"

    # ── Security ────────────────────────────────────────────────────
    SECRET_KEY: str = "change-me-in-production-use-a-32-char-secret"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # ── Google OAuth ────────────────────────────────────────────────
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/api/v1/auth/google/callback"
    GOOGLE_OAUTH_SCOPES: str = "openid email profile"
    FRONTEND_BASE_URL: str = "http://localhost:3000"
    FRONTEND_AUTH_CALLBACK_PATH: str = "/auth/callback"

    # ── CORS ────────────────────────────────────────────────────────
    CORS_ORIGINS: list[AnyHttpUrl | str] = [
        "http://localhost:3000",
        "http://frontend:3000",
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors(cls, v: str | list) -> list:
        """Allow CORS_ORIGINS to be supplied as a JSON string or a list."""
        if isinstance(v, str):
            import json
            return json.loads(v)
        return v

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


settings = Settings()
