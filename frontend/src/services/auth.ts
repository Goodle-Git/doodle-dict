import { api } from '@/lib/api';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupData {
  username: string;
  password: string;
  email: string;
  name: string;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    username: string;
    email: string;
    name: string;
  };
}

interface UserResponse {
  username: string;
  email: string;
  name: string;
  id: number;
}

interface PasswordResetData {
  email: string;
  newPassword: string;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/login', credentials);
    return response;
  },

  signup: async (userData: SignupData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/signup', userData);
    return response;
  },

  logout: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await api.post('/api/auth/logout', {});
      } finally {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  },

  verifyToken: async (): Promise<UserResponse> => {
    const response = await api.get<UserResponse>('/api/auth/verify');
    return response;
  },

  resetPassword: (data: PasswordResetData) => 
    api.post<{ message: string }>('/api/auth/reset-password', data),
};
