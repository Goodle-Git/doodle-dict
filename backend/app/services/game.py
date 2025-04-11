from app.db.queries.game_queries import (
    create_game_session,
    save_drawing_attempt,
    save_game_score as save_score_query,
    complete_game_session
)
from app.schemas.game import DrawingAttempt, GameSession, GameScore, GameSessionComplete

async def start_game_session(session_data: GameSession) -> int:
    return await create_game_session(session_data)

async def end_game_session(session_id: int, session_data: GameSessionComplete) -> int:
    return await complete_game_session(session_id, session_data)

async def record_drawing_attempt(attempt_data: DrawingAttempt) -> int:
    return await save_drawing_attempt(attempt_data)

async def save_game_score(score_data: GameScore) -> int:
    return await save_score_query(score_data)
