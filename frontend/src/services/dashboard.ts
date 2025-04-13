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
  best_score_date: string;
  fastest_correct_date: string;
  highest_streak_date: string;
}

export interface SessionListItem {
  id: number;
  start_time: string;
  end_time: string;
  total_score: number;
  total_attempts: number;
  successful_attempts: number;
  avg_drawing_time_ms: number;
  streak_count: number;
}

export interface SessionDetail {
  id: number;
  start_time: string;
  end_time: string;
  total_score: number;
  total_attempts: number;
  successful_attempts: number;
  avg_drawing_time_ms: number;
  streak_count: number;
  attempts: {
    id: number;
    word_prompt: string;
    difficulty: string;
    is_correct: boolean;
    drawing_time_ms: number;
    recognition_accuracy: number;
    created_at: string;
  }[];
}

export const dashboardService = {
  getOverallStats: async () => {
    return api.get<OverallStats>('/api/dashboard/stats/overall');
  },

  getWeeklyProgress: async () => {
    return api.get<WeeklyProgress[]>('/api/dashboard/stats/weekly');
  },

  getDifficultyStats: async () => {
    return api.get<DifficultyStats[]>('/api/dashboard/stats/difficulty');
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

  async getUserSessions(): Promise<SessionListItem[]> {
    try {
      return await api.get<SessionListItem[]>('/api/dashboard/sessions');
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      return [];
    }
  },

  async getSessionDetails(sessionId: number): Promise<SessionDetail | null> {
    try {
      return await api.get<SessionDetail>(`/api/dashboard/sessions/${sessionId}`);
    } catch (error) {
      console.error('Error fetching session details:', error);
      return null;
    }
  }
};
