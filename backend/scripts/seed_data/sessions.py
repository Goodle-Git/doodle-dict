from datetime import datetime, timedelta
import random

def generate_session_template(user_id: int, start_offset_days: int) -> dict:
    start_time = datetime.now() - timedelta(days=start_offset_days, 
                                          hours=random.randint(0, 23))
    duration = random.randint(120, 300)  # 2-5 minutes
    end_time = start_time + timedelta(seconds=duration)
    
    total_attempts = random.randint(12, 15)
    successful_attempts = random.randint(int(total_attempts * 0.6), total_attempts)
    
    return {
        "user_id": user_id,
        "start_time": start_time,
        "end_time": end_time,
        "total_time_seconds": duration,
        "total_score": successful_attempts,
        "total_attempts": total_attempts,
        "successful_attempts": successful_attempts,
        "avg_drawing_time_ms": random.randint(2000, 5000),
        "streak_count": random.randint(3, 8)
    }

def generate_attempt_template(session_id: int, user_id: int, 
                            word: str, difficulty: str) -> dict:
    return {
        "session_id": session_id,
        "user_id": user_id,
        "word_prompt": word,
        "difficulty": difficulty,
        "is_correct": random.choice([True, True, True, False]),  # 75% success rate
        "drawing_time_ms": random.randint(1000, 10000),
        "recognition_accuracy": random.uniform(0.70, 1.0)
    }
