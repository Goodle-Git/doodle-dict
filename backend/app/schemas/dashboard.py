from pydantic import BaseModel
from typing import List
from datetime import datetime

class OverallStats(BaseModel):
    total_games_played: int
    total_attempts: int
    successful_attempts: int
    overall_accuracy: float
    avg_drawing_time_ms: int
    current_level: int
    best_score: int
    highest_streak: int
    easy_accuracy: float
    medium_accuracy: float
    hard_accuracy: float
    total_time_spent_seconds: int

class WeeklyProgress(BaseModel):
    week_start: datetime
    total_attempts: int
    successful_attempts: int
    avg_drawing_time: float
    accuracy: float

class DifficultyStats(BaseModel):
    difficulty: str
    total_attempts: int
    successful_attempts: int
    avg_time: float
    avg_accuracy: float

class RecentActivity(BaseModel):
    id: int
    word_prompt: str
    difficulty: str
    is_correct: bool
    drawing_time_ms: int
    recognition_accuracy: float
    created_at: datetime
    session_score: int
