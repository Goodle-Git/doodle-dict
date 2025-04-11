from app.db.connection import get_db_connection
from psycopg2.extras import DictCursor

async def get_user(username: str):
    query = """
        SELECT id, username, password, email, name 
        FROM users 
        WHERE username = %s
    """
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=DictCursor) as cur:
            cur.execute(query, (username,))
            return cur.fetchone()

async def get_user_by_email(email: str):
    query = "SELECT * FROM users WHERE email = %s"
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=DictCursor) as cur:
            cur.execute(query, (email,))
            return cur.fetchone()

async def create_new_user(user_data: dict):
    query = """
        INSERT INTO users (username, password, email, name)
        VALUES (%s, %s, %s, %s)
        RETURNING id
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(query, (
                user_data["username"],
                user_data["password"],
                user_data["email"],
                user_data["name"]
            ))
            conn.commit()
            return cur.fetchone()[0]
