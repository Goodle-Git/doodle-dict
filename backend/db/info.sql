-- List all tables in the database
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Show table columns and their properties
SELECT column_name, data_type, character_maximum_length, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'users';  -- Replace with table name you want to inspect

-- Show foreign key relationships
SELECT
    tc.table_schema, 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name,
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY';

-- Show indexes on tables
SELECT
    tablename,
    indexname,
    indexdef
FROM
    pg_indexes
WHERE
    schemaname = 'public'
ORDER BY
    tablename,
    indexname;

-- Quick data inspection queries
-- Users
SELECT * FROM users LIMIT 5;

-- Game Sessions
SELECT 
    gs.*, 
    u.username 
FROM game_sessions gs 
JOIN users u ON gs.user_id = u.id 
ORDER BY start_time DESC 
LIMIT 5;

-- Drawing Attempts with user info
SELECT 
    da.*,
    u.username,
    gs.difficulty_level as session_difficulty
FROM drawing_attempts da
JOIN users u ON da.user_id = u.id
JOIN game_sessions gs ON da.session_id = gs.id
ORDER BY da.created_at DESC
LIMIT 10;

-- User Stats Summary
SELECT 
    u.username,
    us.total_games_played,
    us.total_attempts,
    us.successful_attempts,
    ROUND(CAST(us.successful_attempts AS FLOAT) / NULLIF(us.total_attempts, 0) * 100, 2) as success_rate
FROM user_stats us
JOIN users u ON us.user_id = u.id;

-- Weekly Progress Overview
SELECT 
    u.username,
    wp.week_start_date,
    wp.accuracy_score,
    wp.avg_speed_seconds,
    wp.total_attempts,
    wp.successful_attempts
FROM weekly_progress wp
JOIN users u ON wp.user_id = u.id
ORDER BY wp.week_start_date DESC, u.username;

-- Debugging Queries

-- Find orphaned records
SELECT da.* 
FROM drawing_attempts da 
LEFT JOIN game_sessions gs ON da.session_id = gs.id 
WHERE gs.id IS NULL;

-- Check for inconsistent stats
SELECT 
    u.username,
    COUNT(DISTINCT gs.id) as actual_games,
    us.total_games_played as recorded_games,
    COUNT(da.id) as actual_attempts,
    us.total_attempts as recorded_attempts
FROM users u
LEFT JOIN game_sessions gs ON u.id = gs.user_id
LEFT JOIN drawing_attempts da ON u.id = da.user_id
LEFT JOIN user_stats us ON u.id = us.user_id
GROUP BY u.username, us.total_games_played, us.total_attempts;

-- Performance Queries

-- Slow queries
SELECT pid, age(clock_timestamp(), query_start), usename, query 
FROM pg_stat_activity 
WHERE query != '<IDLE>' 
AND query NOT ILIKE '%pg_stat_activity%' 
ORDER BY query_start desc;

-- Table sizes
SELECT 
    relname as table_name,
    pg_size_pretty(pg_total_relation_size(relid)) as total_size,
    pg_size_pretty(pg_relation_size(relid)) as data_size,
    pg_size_pretty(pg_total_relation_size(relid) - pg_relation_size(relid)) as external_size
FROM pg_catalog.pg_statio_user_tables 
ORDER BY pg_total_relation_size(relid) DESC;

-- Index usage statistics
SELECT 
    schemaname,
    relname,
    indexrelname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes 
ORDER BY idx_scan DESC;

-- Table record counts
SELECT 
    schemaname,
    relname,
    n_live_tup
FROM pg_stat_user_tables 
ORDER BY n_live_tup DESC;
