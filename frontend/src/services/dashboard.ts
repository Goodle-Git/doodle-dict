import { api } from '@/lib/api';

export interface OverallStats {
  total_games_played: number;
  total_attempts: number;
  successful_attempts: number;
  overall_accuracy: number;
  avg_drawing_time_ms: number;
  current_level: number;
  best_score: number;
  highest_streak: number;
  easy_accuracy: number;
  medium_accuracy: number;
  hard_accuracy: number;
}

export interface WeeklyProgress {
  week_start: string;
  total_attempts: number;
  successful_attempts: number;
  avg_drawing_time: number;
  accuracy: number;
}

export interface DifficultyStats {
  difficulty: string;
  total_attempts: number;
  successful_attempts: number;
  avg_time: number;
  avg_accuracy: number;
}

export interface RecentActivity {
  id: number;
  word_prompt: string;
  difficulty: string;
  is_correct: boolean;
  drawing_time_ms: number;
  recognition_accuracy: number;
  created_at: string;
  session_score: number;
}

export interface PerformanceMetrics {
  total_games_played: number;
  total_attempts: number;
  successful_attempts: number;
  total_time_spent_seconds: number;
  current_level: number;
  experience_points: number;
  best_score: number;
  fastest_correct_ms: number;
  highest_streak: number;
  easy_accuracy: number;
  medium_accuracy: number;
  hard_accuracy: number;
  avg_drawing_time_ms: number;
}

export const dashboardService = {
  getOverallStats: () => 
    api.get<OverallStats>('/api/dashboard/stats/overall'),

  getWeeklyProgress: () => 
    api.get<WeeklyProgress[]>('/api/dashboard/stats/weekly'),

  getDifficultyStats: () => 
    api.get<DifficultyStats[]>('/api/dashboard/stats/difficulty'),

  getRecentActivities: (limit: number = 10) => 
    api.get<RecentActivity[]>(`/api/dashboard/activities/recent?limit=${limit}`),

  getPerformanceMetrics: () => 
    api.get<PerformanceMetrics>('/api/dashboard/stats/performance'),
};
