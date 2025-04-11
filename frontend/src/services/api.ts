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

const appFetch = async (url: string, init?: RequestInit) => {
  const token = localStorage.getItem('token');
  const config: RequestInit = {
    ...init,
    headers: {
      ...init?.headers,
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  };
  return fetch(url, config);
};

export const auth = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await appFetch(`${API_BASE_URL}/auth/login`, {
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
    const response = await appFetch(`${API_BASE_URL}/auth/signup`, {
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

  verifyToken: async (token: string): Promise<User> => {
    const response = await appFetch(`${API_BASE_URL}/auth/verify`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Token verification failed');
    }

    return data;
  },

  logout: async (token: string): Promise<void> => {
    try {
      const response = await appFetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Logout failed');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Still proceed with local logout even if server logout fails
      throw error;
    }
  },
};

export const game = {
  recognize: async (imageData: string): Promise<string> => {
    const response = await appFetch(`${API_BASE_URL}/game/recognize`, {
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
    const response = await appFetch(`${API_BASE_URL}/game/save-score`, {
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
    const response = await appFetch(`${API_BASE_URL}/leaderboard`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Failed to fetch leaderboard');
    }

    return data.leaderboard;
  },

  startSession: async (): Promise<number> => {
    const response = await appFetch(`${API_BASE_URL}/game/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || 'Failed to start game session');
    }

    return data.session_id;
  },

  trackAttempt: async (attemptData: {
    sessionId: number;
    wordPrompt: string;
    isCorrect: boolean;
    drawingTimeMs: number;
    recognitionAccuracy: number;
    difficulty: string;
  }) => {
    const response = await appFetch(`${API_BASE_URL}/game/attempt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: attemptData.sessionId,
        word_prompt: attemptData.wordPrompt,
        difficulty: attemptData.difficulty,
        is_correct: attemptData.isCorrect,
        drawing_time_ms: attemptData.drawingTimeMs,
        recognition_accuracy: attemptData.recognitionAccuracy,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || 'Failed to track attempt');
    }

    return true;
  },
};
