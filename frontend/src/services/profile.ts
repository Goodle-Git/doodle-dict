import { api } from '@/lib/api';

export interface ProfileData {
  username: string;
  email: string;
  name: string;
  created_at: string;
  total_games_played: number;
  total_attempts: number;
  successful_attempts: number;
  average_accuracy: number;
  highest_score: number;
  current_level: number;
  experience_points: number;
  total_time_spent_seconds: number;
}

export interface PasswordChangeData {
  current_password: string;
  new_password: string;
}

export const profileService = {
  getProfile: () => api.get<ProfileData>('/api/profile/me'),
  
  changePassword: (data: PasswordChangeData) => 
    api.post<{ message: string }>('/api/profile/change-password', data)
};
