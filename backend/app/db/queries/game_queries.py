from app.db.connection import get_db_connection
from app.schemas.game import DrawingAttempt, GameSession, GameScore, GameSessionComplete
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

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
            session_row = cur.fetchone()
            if not session_row or len(session_row) == 0:
                raise Exception("Failed to create game session")
            return session_row[0]

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
    queries = [
        # 0: Get user_id; ensure session exists.
        """SELECT user_id FROM game_sessions WHERE id = %s""",
        
        # 1: Get drawing attempt statistics.
        """SELECT 
              COUNT(*) as total_attempts,
              COUNT(*) FILTER (WHERE is_correct = true) as correct_attempts,
              COALESCE(AVG(drawing_time_ms), 0) as avg_time
           FROM drawing_attempts 
           WHERE session_id = %s""",
        
        # 2: Calculate max streak.
        """WITH consecutive_attempts AS (
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
            ) t""",
        
        # 3: Update game_sessions.
        """UPDATE game_sessions 
           SET 
              end_time = NOW(),
              total_score = %s,
              total_attempts = %s,
              total_time_seconds = %s,
              successful_attempts = %s,
              streak_count = %s,
              avg_drawing_time_ms = %s
           WHERE id = %s""",
        
        # 4: Update user_metrics.
        """UPDATE user_metrics 
           SET 
              total_games_played = total_games_played + 1,
              total_time_spent_seconds = total_time_spent_seconds + %s,
              best_score = GREATEST(COALESCE(best_score, 0), %s)
           WHERE user_id = %s"""
    ]
    
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                # Query 0: Get user_id
                logger.debug(f"Executing user query for session {session_id}")
                cur.execute(queries[0], (session_id,))
                user_result = cur.fetchone()
                logger.debug(f"User query result: {user_result}")
                
                if not user_result:
                    logger.error(f"Session {session_id} not found")
                    return None
                user_id = user_result[0]
                logger.debug(f"Found user_id: {user_id}")
                
                # Query 1: Get attempt statistics
                logger.debug(f"Executing stats query for session {session_id}")
                cur.execute(queries[1], (session_id,))
                stats = cur.fetchone()
                logger.debug(f"Stats query result: {stats}")
                total_attempts, correct_attempts, avg_time = stats if stats else (0, 0, 0)
                
                # Query 2: Get max streak
                logger.debug(f"Executing streak query for session {session_id}")
                cur.execute(queries[2], (session_id,))
                streak_result = cur.fetchone()
                logger.debug(f"Streak query result: {streak_result}")
                max_streak = streak_result[0] if streak_result and len(streak_result) > 0 else 0
                
                # Query 3: Update session
                logger.debug(f"Executing session update for session {session_id}")
                logger.debug(f"Update params: score={data.total_score}, attempts={data.total_attempts}, "
                           f"time={data.total_time_seconds}, correct={correct_attempts}, "
                           f"streak={max_streak}, avg_time={avg_time}")
                cur.execute(queries[3], (
                    data.total_score,
                    data.total_attempts,
                    data.total_time_seconds,
                    correct_attempts,
                    max_streak,
                    avg_time,
                    session_id
                ))
                
                # Query 4: Update metrics
                logger.debug(f"Executing metrics update for user {user_id}")
                cur.execute(queries[4], (
                    data.total_time_seconds,
                    correct_attempts,
                    user_id
                ))
                
                conn.commit()
                logger.debug(f"Successfully completed session {session_id}")
                return user_id
                
    except Exception as e:
        logger.error(f"Error in complete_game_session: {e}", exc_info=True)
        raise
