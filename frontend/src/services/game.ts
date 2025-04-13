import { api } from '@/lib/api';

interface RecognizeResponse {
  result: string;
  confidence: number;
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

export const gameService = {
  recognize: async (imageData: string): Promise<RecognizeResponse> => {
    return api.post<RecognizeResponse>('/game/recognize', { 
      image: imageData 
    });
  },

  startSession: async () => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (!userData.id) throw new Error('User not authenticated');
    
    const response = await api.post<SessionResponse>('/game/session', { 
      user_id: userData.id 
    });
    return response.session_id;
  },

  completeSession: (data: GameSessionData) => 
    api.post(`/game/session/${data.sessionId}/complete`, {
      session_id: data.sessionId,
      total_score: data.totalScore,
      total_attempts: data.totalAttempts,
      total_time_seconds: data.totalTimeSeconds,
      username: data.username
    }),

  trackAttempt: (data: AttemptData) => 
    api.post('/game/attempt', {
      session_id: data.sessionId,
      user_id: data.userId,
      word_prompt: data.wordPrompt,
      difficulty: data.difficulty,
      is_correct: data.isCorrect,
      drawing_time_ms: data.drawingTimeMs,
      recognition_accuracy: data.recognitionAccuracy,
    }),

  getLeaderboard: () => 
    api.get('/game/leaderboard'),
};
