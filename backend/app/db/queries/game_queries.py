from app.db.connection import get_db_connection
from app.schemas.game import DrawingAttempt, GameSession, GameScore, GameSessionComplete

async def create_game_session(session_data: GameSession) -> int:
    query = """
        INSERT INTO game_sessions (user_id)
        VALUES (%s)
        RETURNING id
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(query, (session_data.user_id,))
            conn.commit()
            return cur.fetchone()[0]

async def save_drawing_attempt(attempt: DrawingAttempt) -> int:
    query = """
        INSERT INTO drawing_attempts 
        (session_id, user_id, word_prompt, difficulty, is_correct, drawing_time_ms, recognition_accuracy)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        RETURNING id
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(query, (
                attempt.session_id,
                attempt.user_id,
                attempt.word_prompt,
                attempt.difficulty,
                attempt.is_correct,
                attempt.drawing_time_ms,
                attempt.recognition_accuracy
            ))
            conn.commit()
            return cur.fetchone()[0]

async def complete_game_session(session_id: int, data: GameSessionComplete) -> int:
    # First, get session details for metrics
    update_query = """
        UPDATE game_sessions 
        SET end_time = NOW(),
            total_score = %s,
            total_attempts = %s,
            total_time_seconds = %s,
            successful_attempts = (
                SELECT COUNT(*) 
                FROM drawing_attempts 
                WHERE session_id = %s AND is_correct = true
            ),
            avg_drawing_time_ms = (
                SELECT AVG(drawing_time_ms) 
                FROM drawing_attempts 
                WHERE session_id = %s
            )
        WHERE id = %s
        RETURNING user_id;
    """
    
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(update_query, (
                data.total_score,
                data.total_attempts,
                data.total_time_seconds,
                session_id,
                session_id,
                session_id
            ))
            result = cur.fetchone()
            conn.commit()
            return result[0] if result else None

async def save_game_score(score: GameScore) -> int:
    # First get user_id from username
    user_query = "SELECT id FROM users WHERE username = %s"
    score_query = """
        UPDATE game_sessions 
        SET total_score = %s, total_attempts = %s, end_time = NOW()
        WHERE user_id = %s AND end_time IS NULL
        RETURNING id
    """
    
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # Get user_id
            cur.execute(user_query, (score.username,))
            user_result = cur.fetchone()
            if not user_result:
                raise ValueError("User not found")
            user_id = user_result[0]
            
            # Update game session
            cur.execute(score_query, (
                score.score,
                score.total_attempts,
                user_id
            ))
            conn.commit()
            result = cur.fetchone()
            return result[0] if result else None
