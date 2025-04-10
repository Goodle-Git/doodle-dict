-- Clear existing data
TRUNCATE users, game_sessions, drawing_attempts, user_stats, weekly_progress, scores CASCADE;

-- Insert demo users
INSERT INTO users (username, password, email, name) VALUES
('john_doe', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewK7GANNhByZD', 'john@example.com', 'John Doe'),
('sarah_smith', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewK7GANNhByZD', 'sarah@example.com', 'Sarah Smith'),
('mike_jones', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewK7GANNhByZD', 'mike@example.com', 'Mike Jones');

-- Insert game sessions
INSERT INTO game_sessions (user_id, start_time, end_time, total_time_seconds, difficulty_level) VALUES
(1, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour', 3600, 'easy'),
(1, NOW() - INTERVAL '1 day', NOW() - INTERVAL '23 hours', 3600, 'medium'),
(2, NOW() - INTERVAL '3 hours', NOW() - INTERVAL '2 hours', 3600, 'hard');

-- Insert drawing attempts
INSERT INTO drawing_attempts (user_id, session_id, word_prompt, is_correct, time_taken_seconds, difficulty_level) VALUES
(1, 1, 'cat', true, 45, 'easy'),
(1, 1, 'dog', true, 38, 'easy'),
(1, 2, 'elephant', false, 65, 'medium'),
(2, 3, 'giraffe', true, 55, 'hard');

-- Insert user stats
INSERT INTO user_stats (user_id, total_games_played, total_attempts, successful_attempts, total_time_spent_seconds, current_level, experience_points) VALUES
(1, 2, 3, 2, 7200, 2, 250),
(2, 1, 1, 1, 3600, 1, 100),
(3, 0, 0, 0, 0, 1, 0);

-- Insert weekly progress
INSERT INTO weekly_progress (user_id, week_start_date, accuracy_score, avg_speed_seconds, total_attempts, successful_attempts) VALUES
(1, CURRENT_DATE - INTERVAL '7 days', 75, 45.5, 10, 8),
(1, CURRENT_DATE, 82, 40.2, 15, 12),
(2, CURRENT_DATE, 90, 35.8, 5, 4);

-- Insert scores
INSERT INTO scores (user_id, session_id, score, total_attempts) VALUES
(1, 1, 85, 10),
(1, 2, 92, 15),
(2, 3, 78, 5);

-- Set sequence values after bulk insert
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('game_sessions_id_seq', (SELECT MAX(id) FROM game_sessions));
SELECT setval('drawing_attempts_id_seq', (SELECT MAX(id) FROM drawing_attempts));
SELECT setval('user_stats_id_seq', (SELECT MAX(id) FROM user_stats));
SELECT setval('weekly_progress_id_seq', (SELECT MAX(id) FROM weekly_progress));
SELECT setval('scores_id_seq', (SELECT MAX(id) FROM scores));
