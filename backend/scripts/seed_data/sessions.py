from datetime import datetime, timedelta
import random

def generate_session_template(user_id: int, start_offset_days: int) -> dict:
    start_time = datetime.now() - timedelta(days=start_offset_days, 
                                          hours=random.randint(0, 23))
    duration = random.randint(30, 45)  # Real sessions are 30-45 seconds
    end_time = start_time + timedelta(seconds=duration)
    
    total_attempts = random.randint(12, 15)
    successful_attempts = random.randint(int(total_attempts * 0.8), total_attempts)  # High success rate
    avg_time = random.randint(2300, 2800)  # Real average from data
    
    return {
        "user_id": user_id,
        "start_time": start_time,
        "end_time": end_time,
        "total_time_seconds": duration,
        "total_score": successful_attempts,  # Score matches successful attempts
        "total_attempts": total_attempts,
        "successful_attempts": successful_attempts,
        "avg_drawing_time_ms": avg_time,
        "streak_count": random.randint(3, 5)  # Real data shows 5 as common
    }

def generate_attempt_template(session_id: int, user_id: int, 
                            word: str, difficulty: str) -> dict:
    return {
        "session_id": session_id,
        "user_id": user_id,
        "word_prompt": word,
        "difficulty": difficulty,
        "is_correct": random.choices([True, False], weights=[85, 15])[0],  # 85% success rate from data
        "drawing_time_ms": random.randint(2000, 3500),  # Real range from data
        "recognition_accuracy": random.uniform(0.95, 1.0)  # High accuracy seen in data
    }
