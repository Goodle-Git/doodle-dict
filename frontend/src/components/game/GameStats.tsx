import { Card } from '@/components/ui/card';
import { useGame } from '@/contexts/GameContext';

export const GameStats = () => {
  const { state } = useGame();
  const { score, timeLeft, attempts, currentWord } = state;

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
    </div>
  );
};
