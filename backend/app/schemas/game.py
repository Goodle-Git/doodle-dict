from pydantic import BaseModel
from typing import Optional
from enum import Enum

class DifficultyLevel(str, Enum):
    EASY = "EASY"
    MEDIUM = "MEDIUM"
    HARD = "HARD"

class ImageRecognitionRequest(BaseModel):
    image: str

class GameScore(BaseModel):
    username: str
    score: int
    total_attempts: int

class GameSession(BaseModel):
    user_id: int

class GameSessionComplete(BaseModel):
    session_id: int
    total_score: int
    total_attempts: int
    total_time_seconds: int
    username: str  # Add username field

class DrawingAttempt(BaseModel):
    session_id: int
    user_id: int  # Add user_id field
    word_prompt: str
    difficulty: DifficultyLevel  # This stays as each word has its own difficulty
    is_correct: bool
    drawing_time_ms: int
    recognition_accuracy: float
