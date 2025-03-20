import os
from datetime import datetime
import libsql_experimental as libsql
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    """
    Get database connection
    """
    url = os.getenv("TURSO_DATABASE_URL")
    auth_token = os.getenv("TURSO_AUTH_TOKEN")
    
    if not url or not auth_token:
        raise ValueError("TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set in .env file")
    
    try:
        conn = libsql.connect(
            "/tmp/doodledict.db",
            sync_url=url,
            auth_token=auth_token
        )
        conn.sync()
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        raise

def init_db():
    """
    Initialize database tables
    """
    try:
        conn = get_db_connection()
        # Create users table
        conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        ''')
        
        # Create scores table
        conn.execute('''
        CREATE TABLE IF NOT EXISTS scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            score INTEGER NOT NULL,
            total_attempts INTEGER NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (username) REFERENCES users(username)
        )
        ''')
        conn.commit()
        conn.sync()
        print("Turso database initialized successfully")
    except Exception as e:
        print(f"Error initializing Turso database: {e}")
        raise
