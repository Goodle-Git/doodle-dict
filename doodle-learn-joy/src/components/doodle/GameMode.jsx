import React, { useState, useEffect, useRef } from 'react';
import { recognizeDoodle, saveScore } from '../services/api';
import { EASY_DOODLE_CHALLENGES } from '../challenges';
import { useAuth } from '../context/AuthContext';
import Canvas from './Canvas';
import DrawingTools from './DrawingTools';
import HelpModal from './HelpModal';

const GAME_DURATION = 60 * 2; // 2 minute

export default function GameMode({ onNavigate }) {
  const { user } = useAuth();
  const [gameState, setGameState] = useState({
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
  });
  const [tool, setTool] = useState('pen');
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!user) {
      onNavigate('practice');
    }
  }, [user, onNavigate]);

  useEffect(() => {
    let timer;
    if (gameState.gameStarted && gameState.timeLeft > 0) {
      timer = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    } else if (gameState.timeLeft === 0 && gameState.gameStarted) {
      handleGameEnd();
    }
    return () => clearInterval(timer);
  }, [gameState.gameStarted, gameState.timeLeft]);

  const startGame = () => {
    // Reset all game state
    setGameState({
      username: user.username,
      score: 0,
      attempts: 0,
      timeLeft: GAME_DURATION,
      currentWord: '',
      isLoading: false,
      gameStarted: true,
      gameEnded: false,
      feedback: '',
      feedbackType: ''
    });
    
    // Clear the canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    
    // Get first word
    getNewWord();
  };

  const getNewWord = () => {
    const randomWord = EASY_DOODLE_CHALLENGES[
      Math.floor(Math.random() * EASY_DOODLE_CHALLENGES.length)
    ];
    setGameState(prev => ({ ...prev, currentWord: randomWord }));
  };

  const handleGuess = async (imageData) => {
    if (!gameState.gameStarted) return;
    
    setGameState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const result = await recognizeDoodle(imageData);
      setGameState(prev => ({ ...prev, attempts: prev.attempts + 1 }));
      
      if (result.toLowerCase() === gameState.currentWord.toLowerCase()) {
        setGameState(prev => ({
          ...prev,
          score: prev.score + 1,
          feedback: 'Correct! 🎨',
          feedbackType: 'success'
        }));
      } else {
        setGameState(prev => ({
          ...prev,
          feedback: 'Wrong! Try the next one ❌',
          feedbackType: 'error'
        }));
      }

      setTimeout(() => {
        setGameState(prev => ({ ...prev, feedback: '' }));
        getNewWord();
      }, 1500);
    } catch (error) {
      console.error('Error:', error);
      setGameState(prev => ({
        ...prev,
        feedback: 'Error occurred!',
        feedbackType: 'error'
      }));
    } finally {
      setGameState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleCanvasGuess = async () => {
    if (!gameState.gameStarted || !canvasRef.current) return;
    
    try {
      setGameState(prev => ({ ...prev, isLoading: true }));
      
      const canvas = canvasRef.current;
      const imageData = canvas.toDataURL('image/png');
      const result = await recognizeDoodle(imageData);
      
      if (result) {
        setGameState(prev => ({ ...prev, attempts: prev.attempts + 1 }));
        
        if (result.toLowerCase() === gameState.currentWord.toLowerCase()) {
          setGameState(prev => ({
            ...prev,
            score: prev.score + 1,
            feedback: 'Correct! 🎨',
            feedbackType: 'success'
          }));
        } else {
          setGameState(prev => ({
            ...prev,
            feedback: 'Wrong! Next challenge ❌',
            feedbackType: 'error'
          }));
        }
        
        // Clear canvas immediately after evaluation
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Get new word immediately and clear feedback after short delay
        getNewWord();
        setTimeout(() => {
          setGameState(prev => ({ ...prev, feedback: '' }));
        }, 1500);
      }
    } catch (error) {
      console.error('Error:', error);
      setGameState(prev => ({
        ...prev,
        feedback: 'Error occurred!',
        feedbackType: 'error'
      }));
      setTimeout(() => {
        setGameState(prev => ({ ...prev, feedback: '' }));
      }, 500);
    } finally {
      setGameState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleGameEnd = async () => {
    setGameState(prev => ({
      ...prev,
      gameStarted: false,
      gameEnded: true
    }));
    
    try {
      await saveScore(gameState.username, gameState.score, gameState.attempts);
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

  if (!user) return null;

  if (gameState.gameEnded) {
    return (
      <GameEndScreen 
        score={gameState.score}
        attempts={gameState.attempts}
        username={gameState.username}
        onRestart={startGame}
        onViewLeaderboard={() => onNavigate('leaderboard')}
      />
    );
  }

  if (!gameState.gameStarted) {
    return (
      <GameStartScreen 
        username={user.username}
        onStart={startGame}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <GameStats 
        score={gameState.score}
        timeLeft={gameState.timeLeft}
        attempts={gameState.attempts}
        currentWord={gameState.currentWord}
      />

      <div className={`canvas-container neubrutalism mb-4 ${
        isDrawing ? (tool === 'pen' ? 'drawing' : 'erasing') : ''
      }`}>
        <Canvas
          ref={canvasRef}
          tool={tool}
          isDrawing={isDrawing}
          setIsDrawing={setIsDrawing}
          className="w-full h-full"
        />
      </div>

      <DrawingTools
        tool={tool}
        onToolChange={setTool}
        onClear={() => {
          if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          }
        }}
        onSubmit={handleCanvasGuess}
        isLoading={gameState.isLoading}
        submitText="Submit Guess"
        loadingText="Checking..."
      />

      {gameState.feedback && (
        <div className={`feedback ${gameState.feedbackType}`}>
          {gameState.feedback}
        </div>
      )}
    </div>
  );
}

// Subcomponents
const GameStats = ({ score, timeLeft, attempts, currentWord }) => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      <div className="mb-6 bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200 text-center">
        <div className="flex justify-between items-center mb-4">
          <div className="text-xl font-bold">Score: {score}</div>
          <div className="text-xl font-bold">Time: {timeLeft}s</div>
          <div className="text-xl font-bold">Attempts: {attempts}</div>
        </div>
        <div className="bg-blue-100 px-8 py-4 rounded-xl shadow-md relative">
          <span className="text-3xl font-bold text-blue-800 uppercase tracking-wider">
            {currentWord}
          </span>
          <button
            onClick={() => setShowHelp(true)}
            className="absolute right-4 top-1/2 -translate-y-1/2 btn btn-secondary p-2"
            title="Get Help"
          >
            <i className="bi bi-question-circle"></i>
          </button>
        </div>
      </div>

      <HelpModal
        word={currentWord}
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
      />
    </>
  );
};

const GameStartScreen = ({ username, onStart }) => (
  <div className="max-w-4xl mx-auto text-center">
    <div className="mb-8 p-6 neubrutalism bg-white">
      <h2 className="text-2xl font-bold mb-4">Welcome to Doodle Challenge! 🎨</h2>
      <div className="mb-6">
        <p className="text-lg">
          Ready to play, <span className="font-bold text-blue-600">{username}</span>?
        </p>
        <p className="text-sm text-gray-600 mt-2">
          You have 60 seconds to draw as many doodles as you can!
        </p>
      </div>
      <div className="space-y-4">
        <button onClick={onStart} className="btn btn-neu btn-primary">
          Start Challenge
        </button>
      </div>
    </div>
  </div>
);

const GameEndScreen = ({ score, attempts, username, onRestart, onViewLeaderboard }) => (
  <div className="max-w-4xl mx-auto text-center">
    <div className="mb-8 p-6 neubrutalism bg-white">
      <h2 className="text-3xl font-bold mb-4">Game Over! 🎨</h2>
      <div className="space-y-4 mb-8">
        <p className="text-2xl">Final Score: {score}</p>
        <p className="text-xl">Total Attempts: {attempts}</p>
        <p className="text-lg">Username: {username}</p>
      </div>
      <div className="space-x-4">
        <button
          onClick={onRestart}
          className="px-4 py-2 neubrutalism bg-black text-white hover:scale-95 transition"
        >
          Try Again
        </button>
        <button
          onClick={onViewLeaderboard}
          className="px-4 py-2 neubrutalism bg-white hover:scale-95 transition"
        >
          View Leaderboard
        </button>
      </div>
    </div>
  </div>
);