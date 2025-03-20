// src/pages/Leaderboard.tsx
import React from 'react';
import { useEffect, useState } from 'react';
import { doodle } from '@/services/api'; 
import DashboardNavbar from '@/components/layout/DashboardNavbar';

const Leaderboard = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await doodle.getLeaderboard();
        setScores(response.leaderboard);
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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="p-6 neubrutalism bg-white text-center">
          <h2 className="text-3xl font-bold mb-6">Loading scores...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="p-6 neubrutalism bg-white text-center">
          <h2 className="text-3xl font-bold mb-6 text-red-600">{error}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="p-6 neubrutalism bg-white">
        <h2 className="text-3xl font-bold mb-6 text-center">Top Doodlers 🎨</h2>
        {scores.length === 0 ? (
          <div className="text-center text-gray-600">No scores yet!</div>
        ) : (
          <div className="space-y-4">
            {scores.map((score, index) => (
              <div 
                key={`${score.username}-${index}`}
                className={`p-4 neubrutalism ${
                  index === 0 ? 'bg-yellow-200' :
                  index === 1 ? 'bg-gray-200' :
                  index === 2 ? 'bg-orange-200' : 'bg-white'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold">{index + 1}</span>
                    <span className="text-xl">{score.username}</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="font-bold">Score: {score.score}</span>
                    <span>Attempts: {score.total_attempts}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;