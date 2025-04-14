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
    <div className="mb-4"> {/* Reduced margin-bottom */}
      <Card className="p-4"> {/* Reduced padding */}
        <div className="grid grid-cols-4 gap-2 mb-3"> {/* Reduced gap and margin */}
          <div className="bg-doodle-yellow/20 p-2 rounded-lg text-center"> {/* Reduced padding */}
            <p className="text-sm font-bold">Score</p>
            <p className="text-2xl font-bold">{score}</p> {/* Reduced text size */}
          </div>
          <div className="bg-red-100 p-2 rounded-lg text-center">
            <p className="text-sm font-bold">Time</p>
            <p className="text-2xl font-bold">{timeTaken}s</p>
          </div>
          <div className="bg-orange-100 p-2 rounded-lg text-center">
            <p className="text-sm font-bold">Challenge</p>
            <p className="text-2xl font-bold">{challengesCompleted}/15</p>
          </div>
          <div className="bg-purple-100 p-2 rounded-lg text-center">
            <p className="text-sm font-bold">Time Left</p>
            <p className="text-2xl font-bold">{challengeTimeLeft}s</p>
          </div>
        </div>
        <div className="bg-white p-3 rounded-lg border-2 border-black relative"> {/* Reduced padding */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl font-bold">{currentWord}</span>
            {currentChallenge && (
              <Badge variant={getDifficultyColor(currentChallenge.difficulty)}>
                {currentChallenge.difficulty}
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
