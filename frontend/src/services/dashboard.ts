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
  total_time_spent_seconds: number;
  experience_points: number;
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
  getOverallStats: async () => {
    const response = await api.get<OverallStats>('/api/dashboard/stats/overall');
    console.log('[Dashboard Service] Overall Stats Response:', response);
    return response;
  },

  getWeeklyProgress: async () => {
    const response = await api.get<WeeklyProgress[]>('/api/dashboard/stats/weekly');
    // console.log('[Dashboard Service] Weekly Progress Response:', response);
    return response;
  },

  getDifficultyStats: async () => {
    const response = await api.get<DifficultyStats[]>('/api/dashboard/stats/difficulty');
    // console.log('[Dashboard Service] Difficulty Stats Response:', response);
    return response;
  },

  getRecentActivities: async (limit: number = 10) => {
    const response = await api.get<RecentActivity[]>(`/api/dashboard/activities/recent?limit=${limit}`);
    // console.log('[Dashboard Service] Recent Activities Response:', response);
    return response;
  },

  getPerformanceMetrics: async () => {
    const response = await api.get<PerformanceMetrics>('/api/dashboard/stats/performance');
    // console.log('[Dashboard Service] Performance Metrics Response:', response);
    return response;
  },
};
