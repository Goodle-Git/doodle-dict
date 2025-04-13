import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';
import { format } from 'date-fns';

interface PersonalBestMetrics {
  best_score: number;
  best_score_date: string;
  fastest_correct_ms: number;
  fastest_correct_date: string;
  highest_streak: number;
  highest_streak_date: string;
}

interface PersonalBestCardProps {
  metrics: PersonalBestMetrics;
}

const PersonalBestCard = ({ metrics }: PersonalBestCardProps) => {
  const formatTime = (ms: number) => `${(ms / 1000).toFixed(1)}s`;
  const formatDate = (dateStr: string) => format(new Date(dateStr), 'dd-MM-yyyy');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-500" />
          Personal Best
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Best Game Score</span>
            <span className="text-green-600 font-semibold">{metrics.best_score}</span>
          </div>
          <div className="text-xs text-gray-500">{formatDate(metrics.best_score_date)}</div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Fastest Correct Drawing</span>
            <span className="text-green-600 font-semibold">{formatTime(metrics.fastest_correct_ms)}</span>
          </div>
          <div className="text-xs text-gray-500">{formatDate(metrics.fastest_correct_date)}</div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Highest Streak</span>
            <span className="text-green-600 font-semibold">{metrics.highest_streak}</span>
          </div>
          <div className="text-xs text-gray-500">{formatDate(metrics.highest_streak_date)}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalBestCard;
