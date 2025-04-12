from app.db.queries.game_queries import (
    create_game_session,
    save_drawing_attempt,
    complete_game_session
)
from app.db.connection import get_db_connection
from app.schemas.game import DrawingAttempt, GameSession, GameSessionComplete

async def start_game_session(session_data: GameSession) -> int:
    return await create_game_session(session_data)

async def end_game_session(session_id: int, session_data: GameSessionComplete) -> int:
    try:
        # Complete the session and update all metrics in one go
        result = await complete_game_session(session_id, session_data)
        
        # Update user metrics after session completion
        await update_user_metrics_after_session(session_id)
        
        return result
    except Exception as e:
        print(f"Error ending game session: {e}")
        raise e

async def record_drawing_attempt(attempt_data: DrawingAttempt) -> int:
    return await save_drawing_attempt(attempt_data)

async def update_user_metrics_after_session(session_id: int):
    """Update user metrics based on session performance"""
    query = """
        WITH streak_calc AS (
            SELECT 
                is_correct,
                session_id,
                COUNT(*) FILTER (WHERE NOT is_correct) OVER (ORDER BY created_at) as grp
            FROM drawing_attempts 
            WHERE session_id = %s
        ),
        session_stats AS (
            SELECT 
                user_id,
                COUNT(*) as total_attempts,
                SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as successful_attempts,
                MIN(CASE WHEN is_correct THEN drawing_time_ms ELSE NULL END) as fastest_correct,
                AVG(drawing_time_ms) as avg_time,
                (
                    SELECT MAX(streak_length)
                    FROM (
                        SELECT COUNT(*) as streak_length
                        FROM streak_calc
                        WHERE is_correct = true
                        GROUP BY grp
                    ) s
                ) as max_streak
            FROM drawing_attempts
            WHERE session_id = %s
            GROUP BY user_id
        )
        UPDATE user_metrics um
        SET 
            total_attempts = um.total_attempts + s.total_attempts,
            successful_attempts = um.successful_attempts + s.successful_attempts,
            fastest_correct_ms = LEAST(COALESCE(um.fastest_correct_ms, s.fastest_correct), s.fastest_correct),
            highest_streak = GREATEST(COALESCE(um.highest_streak, 0), s.max_streak),
            avg_drawing_time_ms = (
                (COALESCE(um.avg_drawing_time_ms, 0) * COALESCE(um.total_attempts, 0) + 
                 s.avg_time * s.total_attempts) / 
                NULLIF(COALESCE(um.total_attempts, 0) + s.total_attempts, 0)
            )
        FROM session_stats s
        WHERE um.user_id = s.user_id
    """
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                # Pass session_id twice for both subqueries
                cur.execute(query, (session_id, session_id))
                conn.commit()
    except Exception as e:
        print(f"Error updating user metrics: {e}")
        raise
