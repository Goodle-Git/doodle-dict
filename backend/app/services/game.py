from app.db.queries.game_queries import save_drawing_attempt, create_game_session
from app.schemas.game import DrawingAttempt, GameSession

async def save_game_score(score_data):
    session = GameSession(
        user_id=score_data.user_id,
        difficulty="MEDIUM",  # Default difficulty, can be made dynamic
        total_score=score_data.score,
        total_attempts=score_data.total_attempts
    )
    return await create_game_session(session)

async def record_drawing_attempt(attempt_data: DrawingAttempt):
    return await save_drawing_attempt(attempt_data)
