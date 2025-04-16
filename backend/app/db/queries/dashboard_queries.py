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
    WITH best_metrics AS (
        SELECT 
            MAX(gs.total_score) as best_score,
            MIN(CASE WHEN da.is_correct THEN da.drawing_time_ms END) as fastest_correct_ms,
            MAX(gs.streak_count) as highest_streak,
            MAX(CASE WHEN gs.total_score = um.best_score THEN gs.created_at END) as best_score_date,
            MIN(CASE WHEN da.is_correct AND da.drawing_time_ms = um.fastest_correct_ms THEN da.created_at END) as fastest_correct_date,
            MAX(CASE WHEN gs.streak_count = um.highest_streak THEN gs.created_at END) as highest_streak_date
        FROM user_metrics um
        LEFT JOIN game_sessions gs ON gs.user_id = um.user_id
        LEFT JOIN drawing_attempts da ON da.user_id = um.user_id
        WHERE um.user_id = %s
    )
    SELECT 
        um.total_games_played,
        um.total_attempts,
        um.successful_attempts,
        um.total_time_spent_seconds,
        um.current_level,
        um.experience_points,
        um.best_score,
        um.fastest_correct_ms,
        um.highest_streak,
        um.easy_accuracy,
        um.medium_accuracy,
        um.hard_accuracy,
        um.avg_drawing_time_ms,
        bm.best_score_date,
        bm.fastest_correct_date,
        bm.highest_streak_date
    FROM user_metrics um
    CROSS JOIN best_metrics bm
    WHERE um.user_id = %s
    """
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=DictCursor) as cur:
            cur.execute(query, (user_id, user_id))
            result = dict(cur.fetchone() or {})
            # Ensure dates are returned even if NULL
            if result:
                result['best_score_date'] = result.get('best_score_date') or result.get('last_updated')
                result['fastest_correct_date'] = result.get('fastest_correct_date') or result.get('last_updated')
                result['highest_streak_date'] = result.get('highest_streak_date') or result.get('last_updated')
            return result

def calculate_max_streak(attempts):
    """Calculate the longest streak of correct attempts"""
    if not attempts:
        return 0
        
    current_streak = 0
    max_streak = 0
    
    # Sort attempts by created_at to ensure correct order
    sorted_attempts = sorted(attempts, key=lambda x: x['created_at'])
    
    for attempt in sorted_attempts:
        if attempt['is_correct']:
            current_streak += 1
            max_streak = max(max_streak, current_streak)
        else:
            current_streak = 0
            
    return max_streak

async def get_user_sessions(user_id: int, limit: int = 10, offset: int = 0):
    """Get paginated list of user's game sessions"""
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=DictCursor) as cur:
            # Get basic session info
            sessions_query = """
                SELECT 
                    gs.id,
                    gs.start_time,
                    gs.end_time,
                    gs.total_score,
                    gs.total_attempts,
                    gs.successful_attempts,
                    gs.avg_drawing_time_ms
                FROM game_sessions gs
                WHERE gs.user_id = %s
                ORDER BY gs.start_time DESC
                LIMIT %s OFFSET %s
            """
            cur.execute(sessions_query, (user_id, limit, offset))
            sessions = [dict(session) for session in cur.fetchall()]

            # For each session, get its attempts and calculate streak
            for session in sessions:
                attempts_query = """
                    SELECT 
                        is_correct,
                        created_at
                    FROM drawing_attempts
                    WHERE session_id = %s
                    ORDER BY created_at ASC
                """
                cur.execute(attempts_query, (session['id'],))
                attempts = cur.fetchall()
                session['streak_count'] = calculate_max_streak(attempts)

            return sessions

async def get_session_details(user_id: int, session_id: int):
    """Get detailed information about a specific game session"""
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=DictCursor) as cur:
            # Get basic session info
            session_query = """
                SELECT 
                    id,
                    start_time,
                    end_time,
                    total_score,
                    total_attempts,
                    successful_attempts,
                    avg_drawing_time_ms
                FROM game_sessions
                WHERE id = %s AND user_id = %s
            """
            cur.execute(session_query, (session_id, user_id))
            session = cur.fetchone()
            
            if not session:
                return None

            # Get all attempts for this session
            attempts_query = """
                SELECT 
                    id,
                    word_prompt,
                    difficulty,
                    is_correct,
                    drawing_time_ms,
                    recognition_accuracy,
                    created_at
                FROM drawing_attempts
                WHERE session_id = %s
                ORDER BY created_at ASC
            """
            cur.execute(attempts_query, (session_id,))
            attempts = [dict(attempt) for attempt in cur.fetchall()]

            # Calculate streak using the helper function
            session = dict(session)
            session['streak_count'] = calculate_max_streak(attempts)
            
            return {
                **session,
                "attempts": attempts
            }
