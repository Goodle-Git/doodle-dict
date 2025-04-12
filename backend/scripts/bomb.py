import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.connection import get_db_connection, init_connection_pool
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def truncate_data():
    # Order matters due to foreign key constraints
    truncate_commands = [
        """TRUNCATE TABLE drawing_attempts CASCADE;""",
        """TRUNCATE TABLE game_sessions CASCADE;""",
        """TRUNCATE TABLE user_metrics CASCADE;""",
        """TRUNCATE TABLE token_blacklist CASCADE;""",
        """TRUNCATE TABLE users CASCADE;"""  # This will cascade to all dependent tables
    ]
    
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            try:
                # Disable triggers temporarily to avoid conflicts
                cur.execute("SET session_replication_role = 'replica';")
                
                for command in truncate_commands:
                    logger.info(f"Executing: {command}")
                    cur.execute(command)
                
                # Re-enable triggers
                cur.execute("SET session_replication_role = 'origin';")
                conn.commit()
                logger.info("All data cleared successfully!")
                
            except Exception as e:
                logger.error(f"Error clearing data: {e}")
                conn.rollback()
                raise

def main():
    try:
        init_connection_pool()
        logger.info("Connected to database successfully!")
        
        # Confirm with user
        confirm = input("⚠️ WARNING: This will delete ALL DATA while preserving the database structure. Continue? (yes/no): ")
        if confirm.lower() != 'yes':
            logger.info("Operation cancelled.")
            return
        
        logger.info("🧹 Starting data cleanup...")
        truncate_data()
        logger.info("✨ Database data cleared successfully!")
        
    except Exception as e:
        logger.error(f"Error during data cleanup: {e}")
        raise
    finally:
        from app.db.connection import close_all_connections
        close_all_connections()
        logger.info("Closed all database connections")

if __name__ == "__main__":
    main()
