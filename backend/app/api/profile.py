from fastapi import APIRouter, Depends, HTTPException
from app.services.auth import get_current_user
from app.db.queries.profile_queries import get_user_profile_data

router = APIRouter()

@router.get("/me")
async def get_profile(current_user: dict = Depends(get_current_user)):
    """Get current user's profile data"""
    try:
        profile_data = await get_user_profile_data(current_user["id"])
        return profile_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
