from google.oauth2 import id_token
from google.auth.transport import requests
from app.core.config import settings
from app.core.security import create_access_token
from app.db.queries.auth_queries import get_user, create_new_user
from datetime import timedelta
import uuid

async def verify_google_token(token: str):
    try:
        idinfo = id_token.verify_oauth2_token(
            token, requests.Request(), settings.GOOGLE_CLIENT_ID
        )
        
        if idinfo['aud'] != settings.GOOGLE_CLIENT_ID:
            raise ValueError('Invalid audience')
            
        return idinfo
    except Exception as e:
        raise ValueError("Invalid token") from e

async def handle_google_auth(google_token: str):
    user_info = await verify_google_token(google_token)
    
    # Check if user exists
    user = await get_user(user_info['email'])
    
    if not user:
        # Generate a unique username from email
        base_username = user_info['email'].split('@')[0]
        username = base_username
        
        # Keep trying with a random suffix until we find a unique username
        while await get_user(username):
            username = f"{base_username}_{uuid.uuid4().hex[:6]}"
        
        # Create new user
        user_data = {
            "username": username,
            "email": user_info['email'],
            "name": user_info.get('name', username),
            "password": uuid.uuid4().hex  # Generate random password for Google users
        }
        
        user_id = await create_new_user(user_data)
        user = await get_user(username)
    
    # Generate JWT token
    access_token = create_access_token(
        data={"sub": user['username']},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user['id'],
            "username": user['username'],
            "email": user['email'],
            "name": user['name']
        }
    }