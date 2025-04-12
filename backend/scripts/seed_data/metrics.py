import random

def generate_user_metrics(user_id: int, num_sessions: int) -> dict:
    total_attempts = num_sessions * random.randint(12, 15)
    successful_attempts = int(total_attempts * random.uniform(0.65, 0.85))
    
    return {
        "user_id": user_id,
        "total_games_played": num_sessions,
        "total_attempts": total_attempts,
        "successful_attempts": successful_attempts,
        "total_time_spent_seconds": num_sessions * random.randint(120, 300),
        "current_level": random.randint(1, 5),
        "experience_points": random.randint(100, 1000),
        "best_score": random.randint(10, 15),
        "fastest_correct_ms": random.randint(1000, 3000),
        "highest_streak": random.randint(5, 10),
        "easy_accuracy": random.uniform(0.8, 1.0),
        "medium_accuracy": random.uniform(0.6, 0.9),
        "hard_accuracy": random.uniform(0.4, 0.8),
        "avg_drawing_time_ms": random.randint(2000, 5000)
    }
