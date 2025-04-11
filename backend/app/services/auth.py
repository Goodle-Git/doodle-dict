from datetime import datetime, timedelta
from fastapi import HTTPException
from app.core.config import settings
from app.core.security import verify_password, get_password_hash, create_access_token
from app.db.queries.auth_queries import get_user, create_new_user, get_user_by_email, blacklist_token, is_token_blacklisted

async def authenticate_user(user_data):
    user = await get_user(user_data.username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not verify_password(user_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Incorrect password")
    
    access_token = create_access_token(
        data={"sub": user["username"]},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],  # Add user id to response
            "username": user["username"],
            "email": user["email"],
            "name": user["name"]
        }
    }

async def create_user(user_data):
    # Check if user exists
    existing_user = await get_user(user_data.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    # Hash password and create user
    hashed_password = get_password_hash(user_data.password)
    user_id = await create_new_user({
        **user_data.dict(),
        "password": hashed_password
    })
    
    # Create access token
    access_token = create_access_token(
        data={"sub": user_data.username},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

async def handle_password_reset(reset_data):
    user = await get_user_by_email(reset_data.email)
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")
    
    # In a real application, send password reset email here
    return {"message": "Password reset instructions sent to email"}

async def verify_token(token: str):
    from jose import JWTError, jwt
    
    try:
        # Check if token is blacklisted
        if await is_token_blacklisted(token):
            raise HTTPException(status_code=401, detail="Token has been invalidated")
            
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username = payload.get("sub")
        if not username:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user = await get_user(username)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
        return {
            "username": user["username"],
            "email": user["email"],
            "name": user["name"]
        }
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def invalidate_token(token: str):
    try:
        # First verify the token
        user_data = await verify_token(token)
        # If verification passes, blacklist the token
        await blacklist_token(token)
        return {"message": "Successfully logged out"}
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
