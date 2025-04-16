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

export class AuthError extends Error {
  constructor(
    message: string, 
    public statusCode?: number,
    public errorType?: string
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export enum AuthErrorType {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS'
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/api/auth/login', credentials);
      return response;
    } catch (error: any) {
      const statusCode = error.response?.status;
      const errorDetail = error.response?.data?.detail;

      let errorType = AuthErrorType.INVALID_CREDENTIALS;
      if (statusCode === 404) {
        errorType = AuthErrorType.USER_NOT_FOUND;
      } else if (statusCode === 401) {
        errorType = AuthErrorType.INVALID_PASSWORD;
      }

      throw new AuthError(
        errorDetail || 'Login failed',
        statusCode,
        errorType
      );
    }
  },

  signup: async (userData: SignupData): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/api/auth/signup', userData);
      return response;
    } catch (error: any) {
      const errorDetail = error.response?.data?.detail;
      const statusCode = error.response?.status;
      
      // Determine error type from message
      let errorType = 'UNKNOWN';
      if (errorDetail?.includes('Username')) errorType = 'USERNAME_TAKEN';
      if (errorDetail?.includes('Email')) errorType = 'EMAIL_TAKEN';
      
      throw new AuthError(
        errorDetail || 'Signup failed',
        statusCode,
        errorType
      );
    }
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
