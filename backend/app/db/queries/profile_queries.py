from app.db.connection import get_db_connection
from psycopg2.extras import DictCursor

async def get_user_profile_data(user_id: int):
    query = """
    SELECT 
        u.username,
        u.email,
        u.name,
        u.created_at,
        um.total_games_played,
        um.total_attempts,
        um.successful_attempts,
        ROUND(CAST(um.successful_attempts AS FLOAT) / 
              NULLIF(um.total_attempts, 0) * 100, 2) as average_accuracy,
        um.best_score as highest_score,
        um.current_level,
        um.experience_points,
        um.total_time_spent_seconds
    FROM users u
    LEFT JOIN user_metrics um ON u.id = um.user_id
    WHERE u.id = %s
    """
    
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=DictCursor) as cur:
            cur.execute(query, (user_id,))
            result = dict(cur.fetchone() or {})
            return result
