import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DifficultyStats } from '@/services/dashboard';
import { Target } from 'lucide-react';

interface DifficultyStatsCardProps {
  stats: DifficultyStats[];
}

const DifficultyStatsCard = ({ stats }: DifficultyStatsCardProps) => {
  const formatTime = (ms: number) => `${(ms / 1000).toFixed(1)}s`;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-500" />
          Difficulty Level Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stats.map((stat) => (
            <div key={stat.difficulty} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{stat.difficulty}</span>
                <span className="text-sm text-muted-foreground">
                  {stat.successful_attempts}/{stat.total_attempts} attempts
                </span>
              </div>
              <Progress 
                value={(stat.successful_attempts / stat.total_attempts) * 100} 
                className="h-2" 
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Avg. Time: {formatTime(stat.avg_time)}</span>
                <span>Accuracy: {(stat.avg_accuracy * 100).toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DifficultyStatsCard;
