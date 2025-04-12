import random

def generate_user_metrics(user_id: int, num_sessions: int) -> dict:
    total_attempts = num_sessions * random.randint(12, 15)
    successful_attempts = int(total_attempts * random.uniform(0.75, 0.95))  # Higher success rate
    avg_time_ms = random.randint(2000, 3000)  # Based on real data range
    
    return {
        "user_id": user_id,
        "total_games_played": num_sessions,
        "total_attempts": total_attempts,
        "successful_attempts": successful_attempts,
        "total_time_spent_seconds": num_sessions * random.randint(30, 45),  # Real sessions take 30-45s
        "current_level": random.randint(1, 5),
        "experience_points": random.randint(150, 500),  # Real range from data
        "best_score": random.randint(3, 5),  # Most sessions score 5
        "fastest_correct_ms": random.randint(2000, 2500),  # Real range
        "highest_streak": random.randint(3, 5),  # Real data shows 5
        "easy_accuracy": random.uniform(0.95, 1.0),  # High accuracy for easy
        "medium_accuracy": random.uniform(0.85, 0.95),  # Medium accuracy
        "hard_accuracy": random.uniform(0.75, 0.85),  # Lower for hard
        "avg_drawing_time_ms": avg_time_ms
    }
