from urllib.parse import urlencode

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import RedirectResponse

from app.api.dependencies import get_auth_service, get_current_active_user
from app.core.config import settings
from app.models.user import User
from app.schemas.user import AuthResponse, LogoutResponse, RefreshTokenRequest, UserCreate, UserLogin, UserResponse
from app.services.auth import AuthService

router = APIRouter()


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def sign_up(user_in: UserCreate, service: AuthService = Depends(get_auth_service)) -> AuthResponse:
    try:
        return service.sign_up(user_in)
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )


@router.post("/signin", response_model=AuthResponse)
def sign_in(user_in: UserLogin, service: AuthService = Depends(get_auth_service)) -> AuthResponse:
    try:
        return service.sign_in(user_in)
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(error),
        )


@router.post("/refresh", response_model=AuthResponse)
def refresh_token(
    payload: RefreshTokenRequest,
    service: AuthService = Depends(get_auth_service),
) -> AuthResponse:
    try:
        return service.refresh_access_token(payload.refresh_token)
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(error),
        )


@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_active_user)) -> UserResponse:
    return UserResponse.model_validate(current_user)


@router.post("/logout", response_model=LogoutResponse)
def logout(_: User = Depends(get_current_active_user)) -> LogoutResponse:
    return LogoutResponse(message="Successfully logged out")


@router.get("/google", status_code=status.HTTP_307_TEMPORARY_REDIRECT)
def google_sign_in(
    mode: str = Query(default="signin", pattern="^(signin|signup)$"),
    service: AuthService = Depends(get_auth_service),
) -> RedirectResponse:
    try:
        google_url = service.get_google_authorization_url(mode=mode)
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )

    return RedirectResponse(url=google_url)


@router.get("/google/callback", status_code=status.HTTP_307_TEMPORARY_REDIRECT)
def google_callback(
    code: str | None = None,
    state: str | None = None,
    error: str | None = None,
    service: AuthService = Depends(get_auth_service),
) -> RedirectResponse:
    callback_url = f"{settings.FRONTEND_BASE_URL.rstrip('/')}{settings.FRONTEND_AUTH_CALLBACK_PATH}"

    if error:
        query = urlencode({"status": "error", "message": "Google authorization was cancelled"})
        return RedirectResponse(url=f"{callback_url}?{query}")

    if not code or not state:
        query = urlencode({"status": "error", "message": "Missing Google authorization data"})
        return RedirectResponse(url=f"{callback_url}?{query}")

    try:
        auth_response, mode = service.sign_in_with_google(code=code, state=state)
    except ValueError as auth_error:
        query = urlencode({"status": "error", "message": str(auth_error)})
        return RedirectResponse(url=f"{callback_url}?{query}")

    query = urlencode(
        {
            "status": "success",
            "mode": mode,
            "access_token": auth_response.access_token,
            "token_type": auth_response.token_type,
            "email": auth_response.user.email,
            "first_name": auth_response.user.first_name,
            "last_name": auth_response.user.last_name,
        }
    )
    return RedirectResponse(url=f"{callback_url}?{query}")
