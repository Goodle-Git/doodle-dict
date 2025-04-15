from google.oauth2 import id_token
from google.auth.transport import requests
import requests as http_requests
from app.core.config import settings
from app.core.security import create_access_token
from app.db.queries.auth_queries import get_user_by_email, create_new_user, get_user
from datetime import timedelta
import uuid

async def verify_google_token(token: str):
    try:
        # Use access token to get user info from Google
        response = http_requests.get(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            headers={'Authorization': f'Bearer {token}'}
        )
        if response.status_code != 200:
            raise ValueError('Invalid token')
        return response.json()
    except Exception as e:
        raise ValueError("Invalid token") from e

async def handle_google_auth(google_token: str):
    try:
        # Get user info from Google
        user_info = await verify_google_token(google_token)
        
        # Check if user exists
        user = await get_user_by_email(user_info['email'])
        
        if not user:
            # Generate a unique username from email
            base_username = user_info['email'].split('@')[0]
            username = base_username
            
            # Keep trying with a random suffix until we find a unique username
            while await get_user(username):
                username = f"{base_username}_{uuid.uuid4().hex[:6]}"
            
            # Create new user with a random password (they'll login via Google)
            user_data = {
                "username": username,
                "email": user_info['email'],
                "name": user_info.get('name', username),
                "password": uuid.uuid4().hex  # Random password for Google users
            }
            
            user_id = await create_new_user(user_data)
            user = await get_user_by_email(user_info['email'])
        
        # Generate our JWT token
        access_token = create_access_token(
            data={"sub": user['username'], "auth_type": "google"},
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
    except Exception as e:
        raise ValueError(f"Google authentication failed: {str(e)}")