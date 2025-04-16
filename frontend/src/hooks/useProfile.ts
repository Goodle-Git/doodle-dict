import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface Profile {
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

export const useProfile = () => {
  const { data: profile, isLoading, error } = useQuery<Profile>({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await api.get<Profile>('/api/profile/me');
      return response;
    },
  });

  return { profile, isLoading, error };
};
