import os
from psycopg2 import pool
from dotenv import load_dotenv

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

def get_db_connection():
    """Get a connection from the pool"""
    if connection_pool is None:
        init_connection_pool()
    return connection_pool.getconn()

def return_db_connection(conn):
    """Return a connection to the pool"""
    if connection_pool is not None:
        connection_pool.putconn(conn)

def init_db():
    """Initialize database tables"""
    try:
        conn = get_db_connection()
        
        return_db_connection(conn)
        print("Database initialized successfully")
    except Exception as e:
        print(f"Error initializing database: {e}")
        raise
