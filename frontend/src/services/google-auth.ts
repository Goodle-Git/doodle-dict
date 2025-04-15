import { api } from '@/lib/api';
import { AuthResponse } from '@/types/auth';

export const googleAuthService = {
  authenticate: async (token: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/google', { token });
    return response;
  }
};