import random
from datetime import datetime, timedelta

def generate_session_times(num_sessions, start_date=None):
    if not start_date:
        start_date = datetime.now() - timedelta(days=30)
    
    sessions = []
    for _ in range(num_sessions):
        start_time = start_date + timedelta(
            days=random.randint(0, 29),
            hours=random.randint(0, 23),
            minutes=random.randint(0, 59)
        )
        end_time = start_time + timedelta(minutes=random.randint(2, 5))
        sessions.append((start_time, end_time))
    
    return sessions

def generate_drawing_metrics():
    return {
        'drawing_time_ms': random.randint(1000, 10000),
        'recognition_accuracy': random.uniform(0.5, 1.0)
    }
