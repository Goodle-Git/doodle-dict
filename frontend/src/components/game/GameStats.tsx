import { Card } from '@/components/ui/card';
import { useGame } from '@/contexts/GameContext';
import { Badge } from '@/components/ui/badge';

export const GameStats = () => {
  const { state } = useGame();
  const { score, timeTaken, challengeTimeLeft, challengesCompleted, currentWord, currentChallenge } = state;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'success';
      case 'MEDIUM': return 'warning';
      case 'HARD': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="md:col-span-2">
        <Card className="p-6 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="bg-doodle-yellow/20 p-3 rounded-lg text-center">
              <p className="text-xl font-bold">Score</p>
              <p className="text-2xl font-bold">{score}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg text-center">
              <p className="text-xl font-bold">Time Taken</p>
              <p className="text-2xl font-bold">{timeTaken}s</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg text-center">
              <p className="text-xl font-bold">Challenge</p>
              <p className="text-2xl font-bold">{challengesCompleted}/15</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg text-center">
              <p className="text-xl font-bold">Time Left</p>
              <p className="text-2xl font-bold">{challengeTimeLeft}s</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border-2 border-black relative">
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-bold">
                {currentWord}
              </span>
              {currentChallenge && (
                <Badge variant={getDifficultyColor(currentChallenge.difficulty)}>
                  {currentChallenge.difficulty}
                </Badge>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
