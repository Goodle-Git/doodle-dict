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

export const authService = {
  login: (credentials: LoginCredentials): Promise<AuthResponse> => 
    api.post<AuthResponse>('/api/auth/login', credentials),

  signup: (userData: SignupData) => 
    api.post<AuthResponse>('/api/auth/signup', userData),

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

  verifyToken: () => 
    api.get<UserResponse>('/api/auth/verify'),
};
