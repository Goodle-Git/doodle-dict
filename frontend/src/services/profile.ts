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

export class ProfileError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errorType?: string
  ) {
    super(message);
    this.name = 'ProfileError';
  }
}

export const profileService = {
  getProfile: () => api.get<ProfileData>('/api/profile/me'),
  
  changePassword: async (data: { current_password: string; new_password: string }) => {
    try {
      const response = await api.post<{ message: string }>('/api/profile/change-password', data);
      return response;
    } catch (error: any) {
      const errorData = error.response?.data;
      throw new ProfileError(
        errorData?.message || 'Failed to change password',
        error.response?.status || 500,
        errorData?.error_type
      );
    }
  }
};
