import os
import base64
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv
from datetime import datetime, timedelta
import jwt
from db import get_db_connection, init_db
from psycopg2.extras import DictCursor

load_dotenv()
# Load environment variables
# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


app = FastAPI()
@app.on_event("startup")
async def startup_event():
    init_db()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ImageRecognitionRequest(BaseModel):
    image: str

class ScoreRequest(BaseModel):
    username: str
    score: int
    total_attempts: int

class UserSignup(BaseModel):
    username: str
    password: str
    email: str
    name: str

class PasswordReset(BaseModel):
    email: str

SECRET_KEY = "doodleisawesome"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class UserLogin(BaseModel):
    username: str
    password: str

def preprocess_image(image_base64):
    """
    Preprocess the base64 encoded image for AI recognition
    """
    # Remove data URL prefix if present
    if "base64," in image_base64:
        image_base64 = image_base64.split("base64,")[1]

    # Decode base64 to image bytes
    image_bytes = base64.b64decode(image_base64)

    return image_bytes  # Return actual image bytes

@app.get("/")
async def root():
    return {"message": "Welcome to Doodle AI!"}

@app.post("/recognize")
async def recognize_doodle(request: ImageRecognitionRequest):
    try:
        base64_image = preprocess_image(request.image)
        
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content([
            "Identify the object in this doodle in a single word.",
            {
                "mime_type": "image/png",
                "data": base64_image
            }
        ])

        result = response.text.split()[0].strip(".,!?").lower()
        return {"result": result}

    except Exception as e:
        print(f"Error in recognition: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail="Failed to recognize doodle"
        )

@app.post("/save-score")
async def save_score(score_data: ScoreRequest):
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=DictCursor)
        
        cur.execute('''
            INSERT INTO scores (user_id, session_id, score, total_attempts)
            VALUES ((SELECT id FROM users WHERE username = %s), %s, %s, %s)
            ON CONFLICT (user_id) DO UPDATE 
            SET score = EXCLUDED.score, total_attempts = EXCLUDED.total_attempts
            WHERE EXCLUDED.score > scores.score
        ''', (score_data.username, None, score_data.score, score_data.total_attempts))
        
        conn.commit()
        cur.close()
        return_db_connection(conn)
        return {"message": "Score saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/leaderboard")
async def get_leaderboard():
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=DictCursor)
        
        cur.execute('''
            SELECT u.username, s.score, s.total_attempts 
            FROM scores s
            JOIN users u ON s.user_id = u.id
            ORDER BY s.score DESC 
            LIMIT 10
        ''')
        boards = cur.fetchall()
        
        scores = [{
            "username": row["username"],
            "score": row["score"],
            "total_attempts": row["total_attempts"]
        } for row in boards]
        
        cur.close()
        return_db_connection(conn)
        return {"leaderboard": scores}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/login")
async def login(user_data: UserLogin):
    try:
        print("Received login data:", user_data.username)
        conn = get_db_connection()
        
        # Check if user exists
        result = conn.execute(
            'SELECT password FROM users WHERE username = ?', 
            (user_data.username,)
        ).fetchone()
        
        if not result:
            raise HTTPException(
                status_code=404,
                detail="User does not exist"
            )
            
        # Verify password
        if not pwd_context.verify(user_data.password, result[0]):
            raise HTTPException(
                status_code=401, 
                detail="Incorrect password for existing user"
            )
        
        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user_data.username}, 
            expires_delta=access_token_expires
        )
        
        # Get user data
        user_info = conn.execute(
            'SELECT username, email, name FROM users WHERE username = ?',
            (user_data.username,)
        ).fetchone()
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "username": user_info[0],
                "email": user_info[1],
                "name": user_info[2]
            }
        }
        
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error in login: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/signup")
async def signup(user_data: UserSignup):
    try:
        conn = get_db_connection()
        
        # Check if user exists
        result = conn.execute(
            'SELECT username FROM users WHERE username = ? OR email = ?', 
            (user_data.username, user_data.email)
        ).fetchone()
        
        if result:
            raise HTTPException(
                status_code=400,
                detail="Username or email already exists"
            )
            
        # Create new user
        hashed_password = pwd_context.hash(user_data.password)
        conn.execute(
            'INSERT INTO users (username, password, email, name) VALUES (?, ?, ?, ?)',
            (user_data.username, hashed_password, user_data.email, user_data.name)
        )
        conn.commit()
        conn.sync()
        
        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user_data.username},
            expires_delta=access_token_expires
        )
        
        return {"access_token": access_token, "token_type": "bearer"}
        
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error in signup: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/forgot-password")
async def forgot_password(data: PasswordReset):
    try:
        conn = get_db_connection()
        result = conn.execute(
            'SELECT username FROM users WHERE email = ?',
            (data.email,)
        ).fetchone()
        
        if not result:
            raise HTTPException(
                status_code=404,
                detail="Email not found"
            )
            
        # In a real application, send password reset email here
        # For demo, we'll just return success
        return {"message": "Password reset instructions sent to email"}
        
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error in forgot password: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/verify-token")
async def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
            
        # Get user data
        conn = get_db_connection()
        result = conn.execute(
            'SELECT username, email, name FROM users WHERE username = ?',
            (username,)
        ).fetchone()
        
        if not result:
            raise HTTPException(status_code=404, detail="User not found")
            
        return {
            "username": result[0],
            "email": result[1],
            "name": result[2]
        }
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Could not validate token")

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

if __name__ == "__main__":
    init_db()
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
