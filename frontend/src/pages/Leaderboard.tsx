import React from 'react';
import { useEffect, useState } from 'react';
import { gameService } from '@/services';
import DashboardNavbar from '@/components/layout/DashboardNavbar';
import { useAuth } from '@/contexts/AuthContext';
import { LeaderboardSkeleton } from '@/components/leaderboard/LeaderboardSkeleton';

interface LeaderboardEntry {
  username: string;
  games_played: number;
  total_score: number;
  total_attempts: number;
  avg_time: number;
  best_streak: number;
    rank: number;
}

const Leaderboard = () => {
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const data = await gameService.getLeaderboard();
        setScores(data.leaderboard);
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

  const userRank = scores.find(score => score.username === user?.username);
  const topTenScores = scores.filter(score => score.rank <= 10);
  const userNotInTopTen = userRank && userRank.rank > 10;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <DashboardNavbar />
      <div className="container mx-auto px-4 py-8 flex-1 pt-24">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <LeaderboardSkeleton />
          ) : error ? (
            <div className="p-6 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-white text-center">
              <h2 className="text-3xl font-bold mb-6 text-red-600">{error}</h2>
            </div>
          ) : (
            <div className="p-6 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-white">
              <h2 className="text-3xl font-bold mb-6 text-center">Top Doodlers 🎨</h2>
              
              {/* Show user's rank at the top if not in top 10 */}
              {userNotInTopTen && userRank && (
                <div className="mb-6">
                  <div className="text-sm text-gray-500 mb-2">Your Current Ranking</div>
                  <div className="p-4 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-doodle-coral bg-opacity-20">
                    <LeaderboardEntry score={userRank} isCurrentUser={true} />
                  </div>
                </div>
              )}

              {/* Separator if user rank is shown */}
              {userNotInTopTen && userRank && (
                <div className="relative py-4 mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-black border-dashed"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-4 text-sm text-gray-500">Top 10 Leaderboard</span>
                  </div>
                </div>
              )}

              {scores.length === 0 ? (
                <div className="text-center text-gray-600">No scores yet!</div>
              ) : (
                <div className="space-y-4">
                  {topTenScores.map((score) => (
                    <div 
                      key={`${score.username}-${score.rank}`}
                      className={`p-4 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] ${
                        score.rank === 1 ? 'bg-doodle-yellow' :
                        score.rank === 2 ? 'bg-gray-200' :
                        score.rank === 3 ? 'bg-orange-200' : 'bg-white'
                      }`}
                    >
                      <LeaderboardEntry score={score} isCurrentUser={score.username === user?.username} />
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

const LeaderboardEntry = ({ score, isCurrentUser }: { score: LeaderboardEntry, isCurrentUser: boolean }) => (
  <div className="flex justify-between items-center">
    <div className="flex items-center gap-4">
      <span className="text-2xl font-bold">#{score.rank}</span>
      <span className="text-xl">
        {isCurrentUser ? (
          <span className="font-bold text-doodle-coral">
            {score.username}
            <span className="text-sm ml-1 opacity-75">(You)</span>
          </span>
        ) : (
          score.username
        )}
      </span>
    </div>
    <div className="flex gap-4">
      <span className="font-bold">Score: {score.total_score}</span>
      <span>Games: {score.games_played}</span>
      <span>Streak: {score.best_streak}</span>
      <span>Avg Time: {score.avg_time}ms</span>
    </div>
  </div>
);

export default Leaderboard;