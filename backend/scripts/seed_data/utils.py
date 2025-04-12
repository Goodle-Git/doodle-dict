import random
from datetime import datetime, timedelta

def generate_session_times(num_sessions):
    sessions = []
    # Use fixed start date for consistent weekly view data
    base_date = datetime.now() - timedelta(days=30)
    
    for week in range(4):  # Generate data for 4 weeks
        for _ in range(num_sessions // 4):  # Spread sessions across weeks
            start_time = base_date + timedelta(
                days=week * 7 + random.randint(0, 6),
                hours=random.randint(9, 20),
                minutes=random.randint(0, 59)
            )
            duration = random.randint(30, 45)  # 30-45 seconds per session
            end_time = start_time + timedelta(seconds=duration)
            sessions.append((start_time, end_time))
    
    return sorted(sessions, key=lambda x: x[0])

def generate_drawing_metrics():
    return {
        'drawing_time_ms': random.randint(2000, 3500),  # 2-3.5 seconds per drawing
        'recognition_accuracy': random.uniform(0.85, 1.0)  # High accuracy rate
    }
