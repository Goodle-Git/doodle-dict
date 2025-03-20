import os
import base64
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv
from datetime import datetime, timedelta
import jwt
from db import get_db_connection, init_db

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
        print("Received image data:", request.image[:50])  # Log first 50 chars
        
        base64_image = preprocess_image(request.image)

        model = genai.GenerativeModel("gemini-1.5-flash")

        response = model.generate_content([
            "Identify the object in this doodle in a single word.",
            {
                "mime_type": "image/png",
                "data": base64_image
            }
        ])

        result = response.text.split()[0].strip(".,!?")
        return {"result": result}

    except Exception as e:
        print(f"Error in recognition: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/save-score")
async def save_score(score_data: ScoreRequest):
    try:
        conn = get_db_connection()
        # Check if user exists and compare scores
        result = conn.execute(
            'SELECT score FROM scores WHERE username = ?',
            (score_data.username,)
        ).fetchone()
        
        if result is None or score_data.score > result[0]:
            conn.execute('''
                INSERT OR REPLACE INTO scores 
                (username, score, total_attempts) 
                VALUES (?, ?, ?)
            ''', (score_data.username, score_data.score, score_data.total_attempts))
            conn.commit()
        
        conn.sync()  # Sync changes with Turso
        return {"message": "Score saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/leaderboard")
async def get_leaderboard():
    try:
        conn = get_db_connection()
        boards = conn.execute('SELECT username, score, total_attempts FROM scores ORDER BY score DESC LIMIT 10').fetchall()
        print("Leaderboard data:", boards)
        
        # Convert tuple results to dictionaries with explicit keys
        scores = [
            {
                "username": row[0],
                "score": row[1],
                "total_attempts": row[2]
            } 
            for row in boards
        ]
        return {"leaderboard": scores}
    except Exception as e:
        print(f"Error in leaderboard: {str(e)}")
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
        
        return {"access_token": access_token, "token_type": "bearer"}
        
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
