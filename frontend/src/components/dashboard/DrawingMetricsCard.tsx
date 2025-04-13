import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, Target, Award } from 'lucide-react';
import { PerformanceMetrics } from '@/services/dashboard';

interface DrawingMetricsCardProps {
  metrics: PerformanceMetrics;
}

const DrawingMetricsCard = ({ metrics }: DrawingMetricsCardProps) => {
  const formatTime = (ms: number) => `${(ms / 1000).toFixed(1)}s`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-500" />
          Drawing Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm">Easy Accuracy</span>
            <span className="text-sm">{Math.round(metrics.easy_accuracy * 100)}%</span>
          </div>
          <Progress value={metrics.easy_accuracy * 100} className="h-2" />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm">Medium Accuracy</span>
            <span className="text-sm">{Math.round(metrics.medium_accuracy * 100)}%</span>
          </div>
          <Progress value={metrics.medium_accuracy * 100} className="h-2" />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm">Hard Accuracy</span>
            <span className="text-sm">{Math.round(metrics.hard_accuracy * 100)}%</span>
          </div>
          <Progress value={metrics.hard_accuracy * 100} className="h-2" />
        </div>

        <div className="pt-2 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Fastest Correct</span>
            <span>{formatTime(metrics.fastest_correct_ms)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Average Time</span>
            <span>{formatTime(metrics.avg_drawing_time_ms)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DrawingMetricsCard;
