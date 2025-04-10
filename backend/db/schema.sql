-- Users table with expanded profile information
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Game sessions to track each play session
CREATE TABLE IF NOT EXISTS game_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    total_time_seconds INTEGER,
    difficulty_level VARCHAR(20),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Individual drawing attempts
CREATE TABLE IF NOT EXISTS drawing_attempts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    session_id INTEGER REFERENCES game_sessions(id),
    word_prompt VARCHAR(100) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    time_taken_seconds INTEGER NOT NULL,
    difficulty_level VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_session FOREIGN KEY (session_id) REFERENCES game_sessions(id) ON DELETE CASCADE
);

-- User statistics for dashboard
CREATE TABLE IF NOT EXISTS user_stats (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) UNIQUE,
    total_games_played INTEGER DEFAULT 0,
    total_attempts INTEGER DEFAULT 0,
    successful_attempts INTEGER DEFAULT 0,
    total_time_spent_seconds INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,
    experience_points INTEGER DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Weekly progress tracking
CREATE TABLE IF NOT EXISTS weekly_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    week_start_date DATE NOT NULL,
    accuracy_score INTEGER DEFAULT 0,
    avg_speed_seconds FLOAT DEFAULT 0,
    total_attempts INTEGER DEFAULT 0,
    successful_attempts INTEGER DEFAULT 0,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, week_start_date)
);

-- Scores table (modified to link with sessions)
CREATE TABLE IF NOT EXISTS scores (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    session_id INTEGER REFERENCES game_sessions(id),
    score INTEGER NOT NULL,
    total_attempts INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_session FOREIGN KEY (session_id) REFERENCES game_sessions(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_drawing_attempts_user ON drawing_attempts(user_id);
CREATE INDEX idx_drawing_attempts_session ON drawing_attempts(session_id);
CREATE INDEX idx_scores_user ON scores(user_id);
CREATE INDEX idx_weekly_progress_user ON weekly_progress(user_id);
CREATE INDEX idx_weekly_progress_date ON weekly_progress(week_start_date);
CREATE INDEX idx_game_sessions_user ON game_sessions(user_id);

-- Add trigger to update user_stats on new drawing attempts
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_stats (user_id, total_attempts, successful_attempts)
    VALUES (NEW.user_id, 1, CASE WHEN NEW.is_correct THEN 1 ELSE 0 END)
    ON CONFLICT (user_id)
    DO UPDATE SET
        total_attempts = user_stats.total_attempts + 1,
        successful_attempts = user_stats.successful_attempts + CASE WHEN NEW.is_correct THEN 1 ELSE 0 END,
        last_updated = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_user_stats
AFTER INSERT ON drawing_attempts
FOR EACH ROW
EXECUTE FUNCTION update_user_stats();
