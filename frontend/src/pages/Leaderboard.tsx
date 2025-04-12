import React from 'react';
import { useEffect, useState } from 'react';
import { game } from '@/services/api';
import DashboardNavbar from '@/components/layout/DashboardNavbar';

interface LeaderboardEntry {
  username: string;
  games_played: number;
  total_score: number;
  total_attempts: number;
  avg_time: number;
  best_streak: number;
}

const Leaderboard = () => {
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const data = await game.getLeaderboard();
        setScores(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setError('Failed to load leaderboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchScores();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <DashboardNavbar />
      <div className="container mx-auto px-4 py-8 flex-1 pt-24">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="p-6 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-white text-center">
              <h2 className="text-3xl font-bold mb-6">Loading scores...</h2>
            </div>
          ) : error ? (
            <div className="p-6 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-white text-center">
              <h2 className="text-3xl font-bold mb-6 text-red-600">{error}</h2>
            </div>
          ) : (
            <div className="p-6 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-white">
              <h2 className="text-3xl font-bold mb-6 text-center">Top Doodlers 🎨</h2>
              {scores.length === 0 ? (
                <div className="text-center text-gray-600">No scores yet!</div>
              ) : (
                <div className="space-y-4">
                  {scores.map((score, index) => (
                    <div 
                      key={`${score.username}-${index}`}
                      className={`p-4 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] ${
                        index === 0 ? 'bg-doodle-yellow' :
                        index === 1 ? 'bg-gray-200' :
                        index === 2 ? 'bg-orange-200' : 'bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-bold">#{index + 1}</span>
                          <span className="text-xl">{score.username}</span>
                        </div>
                        <div className="flex gap-4">
                          <span className="font-bold">Score: {score.total_score}</span>
                          <span>Games: {score.games_played}</span>
                          <span>Streak: {score.best_streak}</span>
                          <span>Avg Time: {score.avg_time}ms</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;