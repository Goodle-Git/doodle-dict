import os
from psycopg2 import pool
from dotenv import load_dotenv
from contextlib import contextmanager

load_dotenv()

# Create a connection pool
connection_pool = None

def init_connection_pool():
    global connection_pool
    try:
        connection_pool = pool.SimpleConnectionPool(
            1,  # Minimum connections
            20,  # Maximum connections
            os.getenv('DATABASE_URL')
        )
        print("Database pool initialized successfully")
    except Exception as e:
        print(f"Error creating connection pool: {e}")
        raise

@contextmanager
def get_db_connection():
    """Get a database connection from the pool"""
    if connection_pool is None:
        init_connection_pool()
    
    conn = connection_pool.getconn()
    try:
        yield conn
    finally:
        connection_pool.putconn(conn)

def close_all_connections():
    """Close all database connections"""
    if connection_pool is not None:
        connection_pool.closeall()

def init_db():
    """Initialize database tables"""
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                # Execute schema.sql content here
                with open('db/schema.sql', 'r') as schema_file:
                    cur.execute(schema_file.read())
                conn.commit()
                print("Database initialized successfully")
    except Exception as e:
        print(f"Error initializing database: {e}")
        raise

# Clean up on module unload
import atexit
atexit.register(close_all_connections)
