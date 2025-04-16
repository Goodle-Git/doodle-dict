from fastapi import APIRouter, Depends, HTTPException
from app.services.auth import get_current_user
from app.db.queries.profile_queries import get_user_profile_data, update_user_password
from pydantic import BaseModel
from app.db.queries.profile_queries import ProfileError

router = APIRouter()

class PasswordChange(BaseModel):
    current_password: str
    new_password: str

@router.get("/me")
async def get_profile(current_user: dict = Depends(get_current_user)):
    """Get current user's profile data"""
    try:
        profile_data = await get_user_profile_data(current_user["id"])
        return profile_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/change-password")
async def change_password(
    password_data: PasswordChange,
    current_user: dict = Depends(get_current_user)
):
    """Change user's password"""
    try:
        await update_user_password(
            user_id=current_user["id"],
            current_password=password_data.current_password,
            new_password=password_data.new_password
        )
        return {"message": "Password updated successfully"}
    except ProfileError as e:
        status_code = 404 if e.error_type == "USER_NOT_FOUND" else 400
        raise HTTPException(
            status_code=status_code,
            detail={"message": str(e), "error_type": e.error_type}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
