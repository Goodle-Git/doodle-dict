const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

interface User {
  username: string;
  email: string;
  name: string;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

interface SignupData {
  username: string;
  password: string;
  email: string;
  name: string;
}

export const auth = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Login failed');
    }

    return data;
  },

  signup: async (userData: SignupData): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Signup failed');
    }

    return data;
  },
};

export const doodle = {
  recognize: async (imageData: string): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/recognize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageData }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Recognition failed');
    }

    return data.result;
  },

  saveScore: async (username: string, score: number, totalAttempts: number) => {
    const response = await fetch(`${API_BASE_URL}/save-score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, score, total_attempts: totalAttempts }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || 'Failed to save score');
    }

    return true;
  },

  getLeaderboard: async () => {
    const response = await fetch(`${API_BASE_URL}/leaderboard`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Failed to fetch leaderboard');
    }

    return data.leaderboard;
  },
};
