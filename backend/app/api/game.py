from fastapi import APIRouter, HTTPException, Depends
from app.schemas.game import ImageRecognitionRequest, GameScore, DrawingAttempt
from app.services.ai import recognize_doodle
from app.services.game import save_game_score, record_drawing_attempt

router = APIRouter()

@router.post("/recognize")
async def recognize_doodle_api(request: ImageRecognitionRequest):
    try:
        result = await recognize_doodle(request.image)
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/save-score")
async def save_score(score_data: GameScore):
    try:
        result = await save_game_score(score_data)
        return {"message": "Score saved successfully", "session_id": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/attempt")
async def save_attempt(attempt_data: DrawingAttempt):
    try:
        result = await record_drawing_attempt(attempt_data)
        return {"message": "Attempt recorded successfully", "attempt_id": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
