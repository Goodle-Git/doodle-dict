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
    try:
        # First complete the session
        result = await complete_game_session(session_id, session_data)
        
        # Update user metrics after session completion
        await update_user_metrics_after_session(session_id)
        
        return result
    except Exception as e:
        print(f"Error ending game session: {e}")
        raise e

async def record_drawing_attempt(attempt_data: DrawingAttempt) -> int:
    return await save_drawing_attempt(attempt_data)

async def save_game_score(score_data: GameScore) -> int:
    return await save_score_query(score_data)

async def update_user_metrics_after_session(session_id: int):
    """Update user metrics based on session performance"""
    query = """
    WITH session_stats AS (
        SELECT 
            user_id,
            COUNT(*) as total_attempts,
            SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as successful_attempts,
            MAX(CASE WHEN is_correct THEN 1 ELSE 0 END) as max_streak,
            MIN(CASE WHEN is_correct THEN drawing_time_ms ELSE NULL END) as fastest_correct,
            AVG(drawing_time_ms) as avg_time
        FROM drawing_attempts
        WHERE session_id = %s
        GROUP BY user_id
    )
    UPDATE user_metrics um
    SET 
        total_attempts = um.total_attempts + s.total_attempts,
        successful_attempts = um.successful_attempts + s.successful_attempts,
        fastest_correct_ms = LEAST(um.fastest_correct_ms, s.fastest_correct),
        highest_streak = GREATEST(um.highest_streak, s.max_streak),
        avg_drawing_time_ms = (
            (um.avg_drawing_time_ms * um.total_attempts + s.avg_time * s.total_attempts) / 
            (um.total_attempts + s.total_attempts)
        )
    FROM session_stats s
    WHERE um.user_id = s.user_id
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(query, (session_id,))
            conn.commit()
