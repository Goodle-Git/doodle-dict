from app.db.connection import get_db_connection

async def save_drawing_attempt(attempt_data):
    query = """
        INSERT INTO drawing_attempts 
        (user_id, session_id, word_prompt, difficulty, is_correct, drawing_time_ms, recognition_accuracy)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        RETURNING id
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(query, (
                attempt_data.user_id,
                attempt_data.session_id,
                attempt_data.word_prompt,
                attempt_data.difficulty,
                attempt_data.is_correct,
                attempt_data.drawing_time_ms,
                attempt_data.recognition_accuracy
            ))
            return cur.fetchone()[0]

async def create_game_session(session_data):
    query = """
        INSERT INTO game_sessions 
        (user_id, difficulty, total_score, total_attempts)
        VALUES (%s, %s, %s, %s)
        RETURNING id
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(query, (
                session_data.user_id,
                session_data.difficulty,
                session_data.total_score,
                session_data.total_attempts
            ))
            return cur.fetchone()[0]
