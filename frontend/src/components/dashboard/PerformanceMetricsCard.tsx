import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Clock, Target, Zap } from 'lucide-react';
import { PerformanceMetrics } from '@/services/dashboard';

interface PerformanceMetricsCardProps {
  metrics: PerformanceMetrics;
}

const PerformanceMetricsCard = ({ metrics }: PerformanceMetricsCardProps) => {
  const formatTime = (ms: number) => `${(ms / 1000).toFixed(1)}s`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-purple-500" />
          Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Best Score</span>
            </div>
            <p className="text-2xl font-bold">{metrics.best_score}</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Highest Streak</span>
            </div>
            <p className="text-2xl font-bold">{metrics.highest_streak}</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Fastest Draw</span>
            </div>
            <p className="text-2xl font-bold">{formatTime(metrics.fastest_correct_ms)}</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-indigo-500" />
              <span className="text-sm font-medium">XP Level</span>
            </div>
            <p className="text-2xl font-bold">{metrics.current_level}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetricsCard;
