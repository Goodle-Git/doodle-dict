from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from app.schemas.auth import UserLogin, UserSignup, PasswordReset, Token
from app.services.auth import (
    authenticate_user,
    create_user,
    handle_password_reset,
    verify_token
)

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

@router.post("/login")
async def login(user_data: UserLogin):
    try:
        return await authenticate_user(user_data)
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@router.post("/signup")
async def signup(user_data: UserSignup):
    try:
        return await create_user(user_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/forgot-password")
async def forgot_password(data: PasswordReset):
    try:
        return await handle_password_reset(data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/verify")
async def verify_token_endpoint(token: str = Depends(oauth2_scheme)):
    try:
        return await verify_token(token)
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
