import os
from psycopg2 import pool
from contextlib import contextmanager
from app.core.config import settings

connection_pool = None

def init_connection_pool():
    global connection_pool
    try:
        connection_pool = pool.SimpleConnectionPool(
            1,  # Minimum connections
            20,  # Maximum connections
            settings.DATABASE_URL
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

# Clean up on module unload
import atexit
atexit.register(close_all_connections)
