from app.db.connection import get_db_connection
from psycopg2.extras import DictCursor

async def get_user_overall_stats(user_id: int):
    query = """
    SELECT * FROM user_progress_view WHERE user_id = %s
    """
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=DictCursor) as cur:
            cur.execute(query, (user_id,))
            return dict(cur.fetchone())

async def get_weekly_progress(user_id: int):
    query = """
    SELECT * FROM weekly_progress_view 
    WHERE user_id = %s 
    ORDER BY week_start DESC 
    LIMIT 8
    """
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=DictCursor) as cur:
            cur.execute(query, (user_id,))
            return [dict(row) for row in cur.fetchall()]

async def get_difficulty_stats(user_id: int):
    query = """
    SELECT 
        difficulty,
        COUNT(*) as total_attempts,
        SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as successful_attempts,
        AVG(drawing_time_ms)::integer as avg_time,
        AVG(recognition_accuracy)::numeric(10,2) as avg_accuracy
    FROM drawing_attempts
    WHERE user_id = %s
    GROUP BY difficulty
    """
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=DictCursor) as cur:
            cur.execute(query, (user_id,))
            return [dict(row) for row in cur.fetchall()]

async def get_recent_activities(user_id: int, limit: int = 10):
    query = """
    SELECT 
        da.id,
        da.word_prompt,
        da.difficulty,
        da.is_correct,
        da.drawing_time_ms,
        da.recognition_accuracy,
        da.created_at,
        gs.total_score as session_score
    FROM drawing_attempts da
    JOIN game_sessions gs ON da.session_id = gs.id
    WHERE da.user_id = %s
    ORDER BY da.created_at DESC
    LIMIT %s
    """
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=DictCursor) as cur:
            cur.execute(query, (user_id, limit))
            return [dict(row) for row in cur.fetchall()]

async def get_performance_metrics(user_id: int):
    query = """
    SELECT 
        total_games_played,
        total_attempts,
        successful_attempts,
        total_time_spent_seconds,
        current_level,
        experience_points,
        best_score,
        fastest_correct_ms,
        highest_streak,
        easy_accuracy,
        medium_accuracy,
        hard_accuracy,
        avg_drawing_time_ms
    FROM user_metrics
    WHERE user_id = %s
    """
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=DictCursor) as cur:
            cur.execute(query, (user_id,))
            return dict(cur.fetchone() or {})
