from app.db.connection import get_db_connection
from psycopg2.extras import DictCursor
from app.core.security import verify_password, get_password_hash

class ProfileError(Exception):
    def __init__(self, message: str, error_type: str):
        self.error_type = error_type
        super().__init__(message)

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
        CAST(
            CASE 
                WHEN um.total_attempts = 0 THEN 0
                ELSE (um.successful_attempts * 100.0 / um.total_attempts)
            END 
        AS DECIMAL(5,2)) as average_accuracy,
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

async def update_user_password(user_id: int, current_password: str, new_password: str):
    verify_query = "SELECT password FROM users WHERE id = %s"
    update_query = "UPDATE users SET password = %s WHERE id = %s"
    
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # Verify user exists
            cur.execute(verify_query, (user_id,))
            result = cur.fetchone()
            if not result:
                raise ProfileError("User not found", "USER_NOT_FOUND")
            
            # Verify current password
            if not verify_password(current_password, result[0]):
                raise ProfileError("Current password is incorrect", "INVALID_PASSWORD")
            
            # Update to new password
            hashed_password = get_password_hash(new_password)
            cur.execute(update_query, (hashed_password, user_id))
            conn.commit()
