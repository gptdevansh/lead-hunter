import secrets
import time
from base64 import urlsafe_b64decode, urlsafe_b64encode
from hashlib import sha256
from hmac import compare_digest, new
from urllib.parse import urlencode

import httpx

from app.core.config import settings
from app.core.security import (
    create_access_token,
    create_refresh_token,
    get_password_hash,
    verify_password,
    verify_token,
)
from app.models.user import User
from app.repositories.user import UserRepository
from app.schemas.user import AuthResponse, UserCreate, UserLogin, UserResponse


class AuthService:
    def __init__(self, repository: UserRepository):
        self.repository = repository

    def sign_up(self, user_in: UserCreate) -> AuthResponse:
        existing_user = self.repository.get_by_email(user_in.email)
        if existing_user is not None:
            raise ValueError("Email is already registered")

        password_hash = get_password_hash(user_in.password)
        user = self.repository.create(
            first_name=user_in.first_name,
            last_name=user_in.last_name,
            email=user_in.email,
            password_hash=password_hash,
        )
        return self._build_auth_response(user)

    def sign_in(self, user_in: UserLogin) -> AuthResponse:
        user = self.repository.get_by_email(user_in.email)
        if not user or not verify_password(user_in.password, user.password_hash):
            raise ValueError("Invalid email or password")

        return self._build_auth_response(user)

    def refresh_access_token(self, refresh_token: str) -> AuthResponse:
        user_id = verify_token(refresh_token, token_type="refresh")
        if not user_id:
            raise ValueError("Invalid refresh token")

        user = self.repository.get_by_id(int(user_id))
        if user is None:
            raise ValueError("Invalid refresh token")

        return self._build_auth_response(user)

    def get_current_user(self, access_token: str) -> User:
        user_id = verify_token(access_token, token_type="access")
        if not user_id:
            raise ValueError("Invalid or expired access token")

        user = self.repository.get_by_id(int(user_id))
        if user is None:
            raise ValueError("User not found")

        return user

    def get_google_authorization_url(self, mode: str) -> str:
        if mode not in {"signin", "signup"}:
            raise ValueError("Invalid Google auth mode")

        self._validate_google_settings()
        state = self._create_google_state(mode)
        query = urlencode(
            {
                "client_id": settings.GOOGLE_CLIENT_ID,
                "redirect_uri": settings.GOOGLE_REDIRECT_URI,
                "response_type": "code",
                "scope": settings.GOOGLE_OAUTH_SCOPES,
                "state": state,
                "access_type": "offline",
                "prompt": "consent",
            }
        )
        return f"https://accounts.google.com/o/oauth2/v2/auth?{query}"

    def sign_in_with_google(self, code: str, state: str) -> tuple[AuthResponse, str]:
        self._validate_google_settings()
        mode = self._parse_google_state(state)

        token_response = self._exchange_google_code_for_tokens(code)
        access_token = token_response.get("access_token")
        if not isinstance(access_token, str) or not access_token:
            raise ValueError("Google token exchange failed")

        profile = self._fetch_google_profile(access_token)
        email = str(profile.get("email", "")).strip().lower()
        if not email:
            raise ValueError("Google account does not provide an email")

        first_name = self._resolve_first_name(profile)
        last_name = self._resolve_last_name(profile)

        user = self.repository.get_by_email(email)
        if user is None:
            user = self.repository.create(
                first_name=first_name,
                last_name=last_name,
                email=email,
                password_hash=get_password_hash(secrets.token_urlsafe(32)),
            )
        elif user.first_name != first_name or user.last_name != last_name:
            user = self.repository.update_names(user, first_name=first_name, last_name=last_name)

        return self._build_auth_response(user), mode

    def _build_auth_response(self, user: User) -> AuthResponse:
        access_token = create_access_token(subject=str(user.id))
        refresh_token = create_refresh_token(subject=str(user.id))
        return AuthResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            refresh_expires_in=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
            user=UserResponse.model_validate(user),
        )

    def _validate_google_settings(self) -> None:
        if not settings.GOOGLE_CLIENT_ID or not settings.GOOGLE_CLIENT_SECRET:
            raise ValueError("Google OAuth is not configured")

    def _exchange_google_code_for_tokens(self, code: str) -> dict:
        with httpx.Client(timeout=10.0) as client:
            response = client.post(
                "https://oauth2.googleapis.com/token",
                data={
                    "code": code,
                    "client_id": settings.GOOGLE_CLIENT_ID,
                    "client_secret": settings.GOOGLE_CLIENT_SECRET,
                    "redirect_uri": settings.GOOGLE_REDIRECT_URI,
                    "grant_type": "authorization_code",
                },
            )

        if response.status_code != 200:
            raise ValueError("Unable to complete Google authentication")

        return response.json()

    def _fetch_google_profile(self, access_token: str) -> dict:
        with httpx.Client(timeout=10.0) as client:
            response = client.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                headers={"Authorization": f"Bearer {access_token}"},
            )

        if response.status_code != 200:
            raise ValueError("Unable to fetch Google profile")

        profile = response.json()
        if not profile.get("email_verified", False):
            raise ValueError("Google email is not verified")
        return profile

    def _resolve_first_name(self, profile: dict) -> str:
        given_name = str(profile.get("given_name", "")).strip()
        if given_name:
            return given_name

        full_name = str(profile.get("name", "")).strip()
        if full_name:
            return full_name.split(" ")[0]

        return "Google"

    def _resolve_last_name(self, profile: dict) -> str:
        family_name = str(profile.get("family_name", "")).strip()
        if family_name:
            return family_name

        full_name = str(profile.get("name", "")).strip()
        if full_name and " " in full_name:
            return full_name.split(" ", 1)[1]

        return "User"

    def _create_google_state(self, mode: str) -> str:
        expires_at = int(time.time()) + 600
        payload = f"{mode}.{expires_at}.{secrets.token_urlsafe(8)}"
        signature = new(settings.SECRET_KEY.encode("utf-8"), payload.encode("utf-8"), sha256).hexdigest()
        state = f"{payload}.{signature}"
        return urlsafe_b64encode(state.encode("utf-8")).decode("utf-8").rstrip("=")

    def _parse_google_state(self, encoded_state: str) -> str:
        try:
            padded_state = f"{encoded_state}{'=' * (-len(encoded_state) % 4)}"
            decoded_state = urlsafe_b64decode(padded_state).decode("utf-8")
            mode, expires_at, nonce, signature = decoded_state.split(".", 3)
            payload = f"{mode}.{expires_at}.{nonce}"
            expected_signature = new(settings.SECRET_KEY.encode("utf-8"), payload.encode("utf-8"), sha256).hexdigest()
        except Exception as error:  # noqa: BLE001
            raise ValueError("Invalid OAuth state") from error

        if not compare_digest(signature, expected_signature):
            raise ValueError("Invalid OAuth state")

        if int(expires_at) < int(time.time()):
            raise ValueError("Google authentication session expired")

        if mode not in {"signin", "signup"}:
            raise ValueError("Invalid OAuth state")

        return mode
