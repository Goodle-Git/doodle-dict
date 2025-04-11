from app.db.connection import get_db_connection
from app.schemas.game import DrawingAttempt, GameSession, GameScore

async def create_game_session(session_data: GameSession) -> int:
    query = """
        INSERT INTO game_sessions (user_id, difficulty)
        VALUES (%s, %s)
        RETURNING id
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(query, (
                session_data.user_id,
                session_data.difficulty
            ))
            conn.commit()
            return cur.fetchone()[0]

async def save_drawing_attempt(attempt: DrawingAttempt) -> int:
    query = """
        INSERT INTO drawing_attempts 
        (session_id, word_prompt, difficulty, is_correct, drawing_time_ms, recognition_accuracy)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(query, (
                attempt.session_id,
                attempt.word_prompt,
                attempt.difficulty,
                attempt.is_correct,
                attempt.drawing_time_ms,
                attempt.recognition_accuracy
            ))
            conn.commit()
            return cur.fetchone()[0]

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
