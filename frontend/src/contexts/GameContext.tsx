import React, { createContext, useContext, useState } from 'react';
import { DOODLE_CHALLENGES } from '@/lib/challenge';
import { game } from '@/services/api';
import { toast } from '@/hooks/use-toast';

const GAME_DURATION = 60 * 2; // 2 minutes
const EASY_DOODLE_CHALLENGES = DOODLE_CHALLENGES.EASY;

interface GameState {
  username: string;
  score: number;
  attempts: number;
  timeLeft: number;
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
}

interface GameContextType {
  state: GameState;
  startGame: (username: string) => void;
  endGame: () => void;
  updateScore: (correct: boolean) => void;
  setCurrentWord: () => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<GameState>({
    username: '',
    score: 0,
    attempts: 0,
    timeLeft: GAME_DURATION,
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
    }
  });

  const startGame = (username: string) => {
    setState({
      ...state,
      username,
      score: 0,
      attempts: 0,
      timeLeft: GAME_DURATION,
      gameStarted: true,
      gameEnded: false,
      stats: {
        correctGuesses: [],
        timePerAttempt: [],
        wordHistory: [],
      }
    });
    setCurrentWord();
  };

  const endGame = async () => {
    try {
      await game.saveScore(state.username, state.score, state.attempts);
      toast({
        title: "Score Saved",
        description: "Your score has been recorded!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your score",
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
        timePerAttempt: [...prev.stats.timePerAttempt, GAME_DURATION - prev.timeLeft],
        wordHistory: [...prev.stats.wordHistory, prev.currentWord],
      }
    }));
  };

  const setCurrentWord = () => {
    const randomWord = EASY_DOODLE_CHALLENGES[
      Math.floor(Math.random() * EASY_DOODLE_CHALLENGES.length)
    ];
    setState(prev => ({ ...prev, currentWord: randomWord }));
  };

  const resetGame = () => {
    setState({
      ...state,
      score: 0,
      attempts: 0,
      timeLeft: GAME_DURATION,
      gameStarted: false,
      gameEnded: false,
      currentWord: '',
    });
  };

  return (
    <GameContext.Provider value={{
      state,
      startGame,
      endGame,
      updateScore,
      setCurrentWord,
      resetGame
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
