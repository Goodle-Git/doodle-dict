import { api } from '@/lib/api';

interface RecognizeResponse {
  result: string;
  confidence: number;  // Add this field to match the backend response
}

interface SessionResponse {
  session_id: number;
}

interface GameSessionData {
  sessionId: number;
  totalScore: number;
  totalAttempts: number;
  totalTimeSeconds: number;
  username: string;
}

interface AttemptData {
  sessionId: number;
  userId: number;
  wordPrompt: string;
  isCorrect: boolean;
  drawingTimeMs: number;
  recognitionAccuracy: number;
  difficulty: string;
}

interface LeaderboardResponse {
  leaderboard: Array<{
    username: string;
    games_played: number;
    total_score: number;
    total_attempts: number;
    avg_time: number;
    best_streak: number;
  }>;
}

export const gameService = {
  recognize: async (imageData: string): Promise<RecognizeResponse> => {
    return api.post<RecognizeResponse>('/api/game/recognize', { 
      image: imageData 
    });
  },

  startSession: async () => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (!userData.id) throw new Error('User not authenticated');
    
    const response = await api.post<SessionResponse>('/api/game/session', { 
      user_id: userData.id 
    });
    return response.session_id;
  },

  completeSession: (data: GameSessionData) => 
    api.post(`/api/game/session/${data.sessionId}/complete`, {
      session_id: data.sessionId,
      total_score: data.totalScore,
      total_attempts: data.totalAttempts,
      total_time_seconds: data.totalTimeSeconds,
      username: data.username
    }),

  trackAttempt: (data: AttemptData) => 
    api.post('/api/game/attempt', {
      session_id: data.sessionId,
      user_id: data.userId,
      word_prompt: data.wordPrompt,
      difficulty: data.difficulty,
      is_correct: data.isCorrect,
      drawing_time_ms: data.drawingTimeMs,
      recognition_accuracy: data.recognitionAccuracy,
    }),

  getLeaderboard: () => 
    api.get<LeaderboardResponse>('/api/game/leaderboard'),
};
