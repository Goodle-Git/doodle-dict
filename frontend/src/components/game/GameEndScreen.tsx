import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';

export const GameEndScreen = () => {
  const navigate = useNavigate();
  const { state, resetGame } = useGame();
  const { score, attempts, username } = state;

  return (
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
            onClick={resetGame}
            className="px-4 py-2 neubrutalism bg-black text-white hover:scale-95 transition"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate('/leaderboard')}
            className="px-4 py-2 neubrutalism bg-white hover:scale-95 transition"
          >
            View Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
};
