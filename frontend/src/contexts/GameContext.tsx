import React, { createContext, useContext, useState, useEffect } from 'react';
import { Challenge, generateGameChallenges, getRandomChallenge } from '@/lib/challenge';
import { gameService } from '@/services';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const GAME_DURATION = 60 * 2; // 2 minutes
const CHALLENGE_TIME = 30; // 30 seconds per challenge
const MAX_CHALLENGES = 15; // 15 challenges per game
const TOTAL_GAME_TIME = CHALLENGE_TIME * MAX_CHALLENGES; // 450 seconds total

interface GameState {
  username: string;
  score: number;
  attempts: number;
  timeTaken: number;  // Add this
  currentWord: string;
  isLoading: boolean;
  gameStarted: boolean;
  gameEnded: boolean;
  feedback: string;
  feedbackType: string;
  stats: {
    correctGuesses: number[];
    timePerAttempt: number[];
    wordHistory: string[];
  };
  sessionId: number | null;
  drawingStartTime: number | null;
  currentChallenge: {
    word: string;
    difficulty: string;
  } | null;
  challengeTimeLeft: number;
  challengesCompleted: number;
  challenges: Challenge[];
  currentChallengeIndex: number;
}

interface GameContextType {
  state: GameState;
  startGame: (username: string) => void;
  endGame: () => void;
  updateScore: (correct: boolean) => void;
  resetGame: () => void;
  startDrawing: () => void;
  handleAttempt: (result: string, accuracy: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<GameState>({
    username: '',
    score: 0,
    attempts: 0,
    timeTaken: 0,  // Add this
    currentWord: '',
    isLoading: false,
    gameStarted: false,
    gameEnded: false,
    feedback: '',
    feedbackType: '',
    stats: {
      correctGuesses: [],
      timePerAttempt: [],
      wordHistory: [],
    },
    sessionId: null,
    drawingStartTime: null,
    currentChallenge: null,
    challengeTimeLeft: CHALLENGE_TIME,
    challengesCompleted: 0,
    challenges: [],
    currentChallengeIndex: 0,
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (state.gameStarted && !state.gameEnded && state.challengesCompleted < MAX_CHALLENGES) {
      timer = setInterval(() => {
        setState(prev => {
          if (prev.challengeTimeLeft <= 1) {
            // Time's up for current challenge, move to next one regardless of completion
            const nextChallenge = getRandomChallenge();
            return {
              ...prev,
              challengeTimeLeft: CHALLENGE_TIME,
              currentChallenge: nextChallenge,
              currentWord: nextChallenge.word,
              challengesCompleted: prev.challengesCompleted + 1,
              timeTaken: prev.timeTaken + 1,
            };
          }
          return {
            ...prev,
            challengeTimeLeft: prev.challengeTimeLeft - 1,
            timeTaken: prev.timeTaken + 1,
          };
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [state.gameStarted, state.gameEnded, state.challengesCompleted]);

  useEffect(() => {
    if (state.gameStarted && state.challengesCompleted >= MAX_CHALLENGES) {
      endGame();
    }
  }, [state.challengesCompleted]);

  const startGame = async (username: string) => {
    try {
      const sessionId = await gameService.startSession();
      const gameChallenges = generateGameChallenges();
      
      setState({
        ...state,
        username,
        sessionId,
        score: 0,
        attempts: 0,
        timeTaken: 0,
        challengeTimeLeft: CHALLENGE_TIME,
        challengesCompleted: 0,
        gameStarted: true,
        gameEnded: false,
        challenges: gameChallenges,
        currentChallengeIndex: 0,
        stats: {
          correctGuesses: [],
          timePerAttempt: [],
          wordHistory: [],
        }
      });
      
      setNextChallenge();
    } catch (error) {
      console.error('Failed to start game session:', error);
      toast({
        title: "Error",
        description: "Failed to start game",
        variant: "destructive",
      });
    }
  };

  const endGame = async () => {
    console.log('[GameContext] Ending game with state:', {
      sessionId: state.sessionId,
      score: state.score,
      attempts: state.attempts,
      timeTaken: state.timeTaken,
      username: state.username
    });

    try {
      if (state.sessionId) {
        console.log('[GameContext] Calling completeSession API');
        await gameService.completeSession({
          sessionId: state.sessionId,
          totalScore: state.score,
          totalAttempts: state.attempts,
          totalTimeSeconds: state.timeTaken,
          username: state.username
        });
        
        console.log('[GameContext] Session completed successfully');
        toast({
          title: "Game Complete!",
          description: "Your score and stats have been recorded!",
          variant: "success",
        });
      }
    } catch (error) {
      console.error('[GameContext] Failed to end game:', error);
      toast({
        title: "Error",
        description: "Failed to save your game data",
        variant: "destructive",
      });
    }
    setState({ ...state, gameStarted: false, gameEnded: true });
  };

  const updateScore = (correct: boolean) => {
    setState(prev => ({
      ...prev,
      score: correct ? prev.score + 1 : prev.score,
      attempts: prev.attempts + 1,
      stats: {
        ...prev.stats,
        correctGuesses: [...prev.stats.correctGuesses, correct ? 1 : 0],
        timePerAttempt: [...prev.stats.timePerAttempt, GAME_DURATION - prev.timeTaken],
        wordHistory: [...prev.stats.wordHistory, prev.currentWord],
      }
    }));
  };

  const setNextChallenge = () => {
    setState(prev => {
      if (prev.currentChallengeIndex >= prev.challenges.length) {
        return prev; // Game should end
      }
      
      const challenge = prev.challenges[prev.currentChallengeIndex];
      return {
        ...prev,
        currentWord: challenge.word,
        currentChallenge: challenge,
        currentChallengeIndex: prev.currentChallengeIndex + 1,
      };
    });
  };

  const resetGame = () => {
    setState({
      ...state,
      score: 0,
      attempts: 0,
      timeTaken: 0,
      gameStarted: false,
      gameEnded: false,
      currentWord: '',
    });
  };

  const startDrawing = () => {
    setState(prev => ({
      ...prev,
      drawingStartTime: Date.now(),
    }));
  };

  const handleAttempt = async (result: string, accuracy: number) => {
    if (!state.sessionId || !state.drawingStartTime || !state.currentChallenge) return;

    const drawingTime = Date.now() - state.drawingStartTime;
    const isCorrect = result.toLowerCase() === state.currentWord.toLowerCase();
    const userData = JSON.parse(localStorage.getItem('user') || '{}');

    try {
      await gameService.trackAttempt({
        sessionId: state.sessionId,
        userId: userData.id,
        wordPrompt: state.currentWord,
        difficulty: state.currentChallenge.difficulty,
        isCorrect,
        drawingTimeMs: drawingTime,
        recognitionAccuracy: accuracy,
      });

      updateScore(isCorrect);

      // Only proceed to next challenge if correct
      if (isCorrect) {
        setState(prev => ({
          ...prev,
          challengesCompleted: prev.challengesCompleted + 1,
          challengeTimeLeft: CHALLENGE_TIME,
        }));
        setNextChallenge(); // Use the new function instead of setCurrentWord
      }
    } catch (error) {
      console.error('Failed to track attempt:', error);
      toast({
        title: "Error",
        description: "Failed to save your attempt",
        variant: "destructive",
      });
    }
  };

  return (
    <GameContext.Provider value={{
      state,
      startGame,
      endGame,
      updateScore,
      resetGame,
      startDrawing,
      handleAttempt,
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
