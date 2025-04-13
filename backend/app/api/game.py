from fastapi import APIRouter, HTTPException, Depends
from app.schemas.game import ImageRecognitionRequest, GameSessionComplete, DrawingAttempt, GameSession
from app.services.ai import recognize_doodle
from app.services.game import record_drawing_attempt, start_game_session, end_game_session
from app.db.queries.game_queries import get_leaderboard
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/recognize")
async def recognize_doodle_api(request: ImageRecognitionRequest):
    try:
        result = await recognize_doodle(request.image)
        return result  # Now returns both result and confidence
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/attempt")
async def save_attempt(attempt_data: DrawingAttempt):
    try:
        result = await record_drawing_attempt(attempt_data)
        return {"message": "Attempt recorded successfully", "attempt_id": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/session")
async def create_game_session(session_data: GameSession):
    try:
        session_id = await start_game_session(session_data)
        return {"session_id": session_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/session/{session_id}/complete")
async def complete_game_session(session_id: int, session_data: GameSessionComplete):
    try:
        logger.debug(f"Received complete session request for session {session_id}")
        logger.debug(f"Session data: {session_data.dict()}")
        
        result = await end_game_session(session_id, session_data)
        
        logger.debug(f"Session completion result: {result}")
        return {"message": "Session completed successfully", "session_id": result}
    except Exception as e:
        logger.error(f"Error completing session {session_id}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/leaderboard")
async def get_leaderboard_endpoint():
    try:
        logger.debug("Fetching leaderboard data")
        leaderboard_data = await get_leaderboard()
        logger.debug(f"Retrieved {len(leaderboard_data)} leaderboard entries")
        return {"leaderboard": leaderboard_data}
    except Exception as e:
        logger.error(f"Error fetching leaderboard: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
