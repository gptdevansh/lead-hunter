from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def _normalize_password_for_bcrypt(password: str) -> str:
    """Normalize password to bcrypt-compatible length (72 bytes max)."""
    password_bytes = password.encode("utf-8")
    if len(password_bytes) <= 72:
        return password

    truncated = password_bytes[:72]
    while truncated:
        try:
            return truncated.decode("utf-8")
        except UnicodeDecodeError:
            truncated = truncated[:-1]

    return ""


def verify_password(plain_password: str, hashed_password: str) -> bool:
    normalized_password = _normalize_password_for_bcrypt(plain_password)
    return pwd_context.verify(normalized_password, hashed_password)


def get_password_hash(password: str) -> str:
    normalized_password = _normalize_password_for_bcrypt(password)
    return pwd_context.hash(normalized_password)


def create_access_token(subject: str, expires_delta: timedelta | None = None) -> str:
    expires_at = datetime.now(timezone.utc) + (
        expires_delta
        if expires_delta is not None
        else timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    payload: dict[str, Any] = {"sub": subject, "type": "access", "exp": expires_at}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def create_refresh_token(subject: str, expires_delta: timedelta | None = None) -> str:
    expires_at = datetime.now(timezone.utc) + (
        expires_delta
        if expires_delta is not None
        else timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    )
    payload: dict[str, Any] = {"sub": subject, "type": "refresh", "exp": expires_at}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def verify_token(token: str, token_type: str = "access") -> str | None:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
    except JWTError:
        return None

    if payload.get("type") != token_type:
        return None

    subject = payload.get("sub")
    if not isinstance(subject, str) or not subject:
        return None
    return subject
