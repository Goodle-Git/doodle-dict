from fastapi import APIRouter, HTTPException, Depends, Query
from app.db.queries.dashboard_queries import (
    get_user_overall_stats,
    get_weekly_progress,
    get_difficulty_stats,
    get_recent_activities,
    get_performance_metrics,
    get_user_sessions,
    get_session_details
)
from app.services.auth import get_current_user

router = APIRouter()

@router.get("/stats/overall")
async def get_overall_stats(current_user: dict = Depends(get_current_user)):
    try:
        stats = await get_user_overall_stats(current_user["id"])
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stats/weekly")
async def get_weekly_stats(current_user: dict = Depends(get_current_user)):
    try:
        stats = await get_weekly_progress(current_user["id"])
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stats/difficulty")
async def get_difficulty_statistics(current_user: dict = Depends(get_current_user)):
    try:
        stats = await get_difficulty_stats(current_user["id"])
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/activities/recent")
async def get_recent_user_activities(
    limit: int = 10,
    current_user: dict = Depends(get_current_user)
):
    try:
        activities = await get_recent_activities(current_user["id"], limit)
        return activities
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stats/performance")
async def get_user_performance(current_user: dict = Depends(get_current_user)):
    try:
        metrics = await get_performance_metrics(current_user["id"])
        return metrics
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sessions")
async def get_sessions(
    current_user: dict = Depends(get_current_user),
    limit: int = Query(default=10, ge=1, le=50),
    offset: int = Query(default=0, ge=0)
):
    """Get user's game sessions with pagination"""
    try:
        sessions = await get_user_sessions(
            user_id=current_user["id"],
            limit=limit,
            offset=offset
        )
        return sessions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sessions/{session_id}")
async def get_session_detail(
    session_id: int,
    current_user: dict = Depends(get_current_user)
):
    """Get detailed information about a specific game session"""
    try:
        session = await get_session_details(
            user_id=current_user["id"],
            session_id=session_id
        )
        if not session:
            raise HTTPException(
                status_code=404,
                detail="Session not found or unauthorized"
            )
        return session
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
