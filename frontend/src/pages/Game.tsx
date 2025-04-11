import React, { useState, useEffect, useRef } from 'react';
import { game } from '@/services/api'; 
import { DOODLE_CHALLENGES } from '@/lib/challenge';
import { useAuth } from '@/contexts/AuthContext';
import Canvas from '@/components/doodle/Canvas';
import DrawingTools, { DrawingTool } from '@/components/doodle/DrawingTools';
import { Card } from '@/components/ui/card';
import Help from '@/components/doodle/Help';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";
import DashboardNavbar from '@/components/layout/DashboardNavbar';
import { CustomButton } from '@/components/ui/custom-button';

const GAME_DURATION = 60 * 2; // 2 minute
const EASY_DOODLE_CHALLENGES = DOODLE_CHALLENGES.EASY;

export default function Game() {
  const navigate = useNavigate(); 

  const { user, isAuthenticated } = useAuth();

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
  const [tool, setTool] = useState<DrawingTool>('pen');
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/practice');
    }
  }, [user, navigate]); 

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
      const result = await game.recognize(imageData);
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

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  // Update handleCanvasGuess to use doodle service
  const handleCanvasGuess = async () => {
    if (!gameState.gameStarted || !canvasRef.current) return;
    
    try {
      setGameState(prev => ({ ...prev, isLoading: true }));
      
      const canvas = canvasRef.current;
      const imageData = canvas.toDataURL('image/png');
      const result = await game.recognize(imageData);
      
      setGameState(prev => ({ ...prev, attempts: prev.attempts + 1 }));
      
      if (result.toLowerCase() === gameState.currentWord.toLowerCase()) {
        setGameState(prev => ({
          ...prev,
          score: prev.score + 1,
        }));
        toast({
          title: "Correct! 🎨",
          description: "Great job! Keep going!",
          variant: "default",
        });
      } else {
        toast({
          title: "Wrong! ❌",
          description: "Try the next challenge!",
          variant: "destructive",
        });
      }
      
      clearCanvas();
      getNewWord();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check your drawing",
        variant: "destructive",
      });
    } finally {
      setGameState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Update handleGameEnd to use doodle service
  const handleGameEnd = async () => {
    setGameState(prev => ({
      ...prev,
      gameStarted: false,
      gameEnded: true
    }));
    
    try {
      await game.saveScore(
        gameState.username,
        gameState.score,
        gameState.attempts
      );
      toast({
        title: "Score Saved",
        description: "Your score has been recorded!",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your score",
        variant: "destructive",
      });
    } finally {

      setGameState(prev => ({
        ...prev,
        score: 0,
        attempts: 0,
        gameStarted: false,
        gameEnded: true,
      }));
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
        onViewLeaderboard={() => navigate('/leaderboard')}  // Update this line
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
    <div className="min-h-screen flex flex-col bg-slate-50">
      <DashboardNavbar />
      <div className="container mx-auto px-4 py-8 flex-1 pt-24">
        <div className="max-w-4xl mx-auto"> {/* Add this wrapper div */}
          <GameStats 
            score={gameState.score}
            timeLeft={gameState.timeLeft}
            attempts={gameState.attempts}
            currentWord={gameState.currentWord}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> {/* Add grid container */}
            <div className="md:col-span-2"> {/* Add column wrapper */}
              <Card className="p-4 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                <Canvas
                  ref={canvasRef}
                  tool={tool}
                  isDrawing={isDrawing}
                  setIsDrawing={setIsDrawing}
                  width={400}
                  height={300}
                  className="w-full aspect-[4/3] bg-white rounded-lg"
                />
              </Card>

              <div className="mt-4">
                <DrawingTools
                  tool={tool}
                  onToolChange={setTool}
                  onClear={clearCanvas}
                  onSubmit={handleCanvasGuess}
                  isLoading={gameState.isLoading}
                  submitText="Submit Guess"
                  loadingText="Checking..."
                />
              </div>

              {gameState.feedback && (
                <Card className="mt-4 p-4 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                  <p className="text-xl text-center">{gameState.feedback}</p>
                </Card>
              )}
            </div>
            
            <div className="md:col-span-1">
              <Help word={gameState.currentWord} className="sticky top-24" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Subcomponents
const GameStats = ({ score, timeLeft, attempts, currentWord }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="md:col-span-2">
        <Card className="p-6 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-doodle-yellow/20 p-3 rounded-lg text-center">
              <p className="text-xl font-bold">Score</p>
              <p className="text-2xl font-bold">{score}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg text-center">
              <p className="text-xl font-bold">Time</p>
              <p className="text-2xl font-bold">{timeLeft}s</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg text-center">
              <p className="text-xl font-bold">Attempts</p>
              <p className="text-2xl font-bold">{attempts}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border-2 border-black relative">
            <span className="text-3xl font-bold text-center block">
              {currentWord}
            </span>
          </div>
        </Card>
      </div>
      <div className="md:col-span-1">
        <Help word={currentWord} />
      </div>
    </div>
  );
};

const GameStartScreen = ({ username, onStart }) => (
  <div className="min-h-screen flex flex-col bg-slate-50">
    <DashboardNavbar />
    <div className="container mx-auto px-4 py-8 flex-1 pt-24">
      <div className="max-w-4xl mx-auto text-center">
        <div className="p-8 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-white">
          <h2 className="text-3xl font-bold mb-6">Welcome to Doodle Challenge! 🎨</h2>
          <div className="mb-8">
            <p className="text-xl mb-4">
              Ready to play, <span className="font-bold text-doodle-coral">{username}</span>?
            </p>
            <p className="text-gray-600">
              You have 2 minutes to draw as many doodles as you can!
            </p>
          </div>
          <CustomButton 
            onClick={onStart}
            className="bg-doodle-yellow hover:bg-doodle-yellow/90 text-xl px-8 py-4"
          >
            Start Challenge
          </CustomButton>
        </div>
      </div>
    </div>
  </div>
);

const GameEndScreen = ({ score, attempts, username, onRestart, onViewLeaderboard }: {
  score: number;
  attempts: number;
  username: string;
  onRestart: () => void;
  onViewLeaderboard: () => void;
}) => (
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