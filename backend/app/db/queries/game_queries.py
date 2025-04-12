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
    # Simple separate queries instead of complex CTEs
    queries = [
        # 1. Get user_id and verify session exists
        """
        SELECT user_id FROM game_sessions WHERE id = %s
        """,
        
        # 2. Get attempt statistics
        """
        SELECT 
            COUNT(*) as total_attempts,
            COUNT(*) FILTER (WHERE is_correct = true) as correct_attempts,
            COALESCE(AVG(drawing_time_ms), 0) as avg_time
        FROM drawing_attempts 
        WHERE session_id = %s
        """,
        
        # 3. Get max streak (simpler calculation)
        """
        WITH consecutive_attempts AS (
            SELECT 
                is_correct,
                row_number() OVER (ORDER BY created_at) - 
                row_number() OVER (PARTITION BY is_correct ORDER BY created_at) as grp
            FROM drawing_attempts
            WHERE session_id = %s AND is_correct = true
        )
        SELECT COALESCE(MAX(count), 0) as max_streak
        FROM (
            SELECT COUNT(*) as count
            FROM consecutive_attempts
            GROUP BY grp
        ) t
        """,
        
        # 4. Update session
        """
        UPDATE game_sessions 
        SET 
            end_time = NOW(),
            total_score = %s,
            total_attempts = %s,
            total_time_seconds = %s,
            successful_attempts = %s,
            streak_count = %s,
            avg_drawing_time_ms = %s
        WHERE id = %s
        """,
        
        # 5. Update user metrics
        """
        UPDATE user_metrics 
        SET 
            total_games_played = total_games_played + 1,
            total_time_spent_seconds = total_time_spent_seconds + %s,
            best_score = GREATEST(COALESCE(best_score, 0), %s)
        WHERE user_id = %s
        """
    ]
    
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                # 1. Get user_id
                cur.execute(queries[0], (session_id,))
                user_result = cur.fetchone()
                if not user_result:
                    print(f"Session {session_id} not found")
                    return None
                user_id = user_result[0]
                
                # 2. Get attempt statistics
                cur.execute(queries[1], (session_id,))
                stats = cur.fetchone()
                total_attempts, correct_attempts, avg_time = stats if stats else (0, 0, 0)
                
                # 3. Get max streak
                cur.execute(queries[2], (session_id,))
                streak_result = cur.fetchone()
                max_streak = streak_result[0] if streak_result else 0
                
                # 4. Update session
                cur.execute(queries[3], (
                    data.total_score,
                    data.total_attempts,
                    data.total_time_seconds,
                    correct_attempts,
                    max_streak,
                    avg_time,
                    session_id
                ))
                
                # 5. Update user metrics
                cur.execute(queries[4], (
                    data.total_time_seconds,
                    correct_attempts,  # Using correct_attempts as best_score
                    user_id
                ))
                
                conn.commit()
                return user_id
                
    except Exception as e:
        print(f"Error in complete_game_session: {e}")
        raise
