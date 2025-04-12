import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.connection import get_db_connection, init_connection_pool
from seed_data.users import USERS
from seed_data.words import WORD_DIFFICULTY
from seed_data.utils import generate_session_times, generate_drawing_metrics
from seed_data.metrics import generate_user_metrics  # Add this import
import random
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def seed_users(users):
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            for user in users:
                logger.debug(f"Creating user: {user['username']}")
                cur.execute("""
                    INSERT INTO users (username, password, email, name)
                    VALUES (%s, %s, %s, %s)
                    RETURNING id
                """, (user['username'], user['password'], user['email'], user['name']))
            conn.commit()

def seed_game_sessions():
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # Get all user IDs
            cur.execute("SELECT id FROM users")
            user_ids = [row[0] for row in cur.fetchall()]
            
            for user_id in user_ids:
                logger.debug(f"Creating sessions for user_id: {user_id}")
                num_sessions = random.randint(3, 5)
                sessions = generate_session_times(num_sessions)
                
                for start_time, end_time in sessions:
                    total_time = int((end_time - start_time).total_seconds())
                    total_attempts = random.randint(12, 15)
                    successful = random.randint(8, total_attempts)
                    
                    cur.execute("""
                        INSERT INTO game_sessions 
                        (user_id, start_time, end_time, total_time_seconds, 
                         total_attempts, successful_attempts, total_score)
                        VALUES (%s, %s, %s, %s, %s, %s, %s)
                        RETURNING id
                    """, (
                        user_id, start_time, end_time, total_time,
                        total_attempts, successful, successful
                    ))
                    
                    session_id = cur.fetchone()[0]
                    seed_drawing_attempts(conn, session_id, user_id, total_attempts)
                    logger.debug(f"Created session {session_id} with {total_attempts} attempts")

def seed_drawing_attempts(conn, session_id, user_id, num_attempts):
    with conn.cursor() as cur:
        for _ in range(num_attempts):
            difficulty = random.choice(['EASY', 'MEDIUM', 'HARD'])
            word = random.choice(WORD_DIFFICULTY[difficulty])
            metrics = generate_drawing_metrics()
            
            cur.execute("""
                INSERT INTO drawing_attempts 
                (session_id, user_id, word_prompt, difficulty, 
                 is_correct, drawing_time_ms, recognition_accuracy)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (
                session_id, user_id, word, difficulty,
                random.choice([True, True, True, False]),
                metrics['drawing_time_ms'],
                metrics['recognition_accuracy']
            ))

def seed_user_metrics(conn):
    with conn.cursor() as cur:
        cur.execute("SELECT id FROM users")
        user_ids = [row[0] for row in cur.fetchall()]
        
        for user_id in user_ids:
            logger.debug(f"Initializing metrics for user_id: {user_id}")
            metrics = generate_user_metrics(user_id, random.randint(3, 5))
            
            cur.execute("""
                INSERT INTO user_metrics 
                (user_id, current_level, experience_points, total_games_played,
                 total_attempts, successful_attempts, total_time_spent_seconds,
                 best_score, fastest_correct_ms, highest_streak,
                 easy_accuracy, medium_accuracy, hard_accuracy, avg_drawing_time_ms)
                VALUES (
                    %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
                )
                ON CONFLICT (user_id) DO UPDATE SET
                    current_level = EXCLUDED.current_level,
                    experience_points = EXCLUDED.experience_points,
                    total_games_played = EXCLUDED.total_games_played,
                    total_attempts = EXCLUDED.total_attempts,
                    successful_attempts = EXCLUDED.successful_attempts,
                    total_time_spent_seconds = EXCLUDED.total_time_spent_seconds,
                    best_score = EXCLUDED.best_score,
                    fastest_correct_ms = EXCLUDED.fastest_correct_ms,
                    highest_streak = EXCLUDED.highest_streak,
                    easy_accuracy = EXCLUDED.easy_accuracy,
                    medium_accuracy = EXCLUDED.medium_accuracy,
                    hard_accuracy = EXCLUDED.hard_accuracy,
                    avg_drawing_time_ms = EXCLUDED.avg_drawing_time_ms
            """, (
                user_id,
                metrics["current_level"],
                metrics["experience_points"],
                metrics["total_games_played"],
                metrics["total_attempts"],
                metrics["successful_attempts"],
                metrics["total_time_spent_seconds"],
                metrics["best_score"],
                metrics["fastest_correct_ms"],
                metrics["highest_streak"],
                metrics["easy_accuracy"],
                metrics["medium_accuracy"],
                metrics["hard_accuracy"],
                metrics["avg_drawing_time_ms"]
            ))
            
        conn.commit()

def main():
    try:
        # Initialize the connection pool
        init_connection_pool()
        logger.info("Connected to database successfully!")

        logger.info("Seeding users...")
        seed_users(USERS)
        
        logger.info("Initializing user metrics...")
        with get_db_connection() as conn:
            seed_user_metrics(conn)
        
        logger.info("Seeding game sessions and attempts...")
        seed_game_sessions()
        
        logger.info("Seeding completed successfully!")
        
    except Exception as e:
        logger.error(f"Error during seeding: {e}")
        raise
    finally:
        from app.db.connection import close_all_connections
        close_all_connections()
        logger.info("Closed all database connections")

if __name__ == "__main__":
    main()
