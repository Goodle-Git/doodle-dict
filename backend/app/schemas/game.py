from pydantic import BaseModel

class ImageRecognitionRequest(BaseModel):
    image: str

class GameSession(BaseModel):
    user_id: int
    difficulty: str
    total_score: int = 0
    total_attempts: int = 0

class DrawingAttempt(BaseModel):
    user_id: int
    session_id: int
    word_prompt: str
    difficulty: str
    is_correct: bool
    drawing_time_ms: int
    recognition_accuracy: float = None

class GameScore(BaseModel):
    username: str
    score: int
    total_attempts: int
