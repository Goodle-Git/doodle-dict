import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Target, AlarmClock } from 'lucide-react';

interface OverallProgressCardProps {
  metrics: {
    total_games_played: number;
    total_attempts: number;
    successful_attempts: number;
    total_time_spent_seconds?: number;  // Make optional
    current_level: number;
    best_score: number;
  };
}

const OverallProgressCard = ({ metrics }: OverallProgressCardProps) => {
  const overallProgress = Math.round((metrics.successful_attempts / metrics.total_attempts) * 100) || 0;
  const formatTime = (seconds?: number) => {
    if (!seconds) return '0h 0m';  // Handle undefined/null
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Overall Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Success Rate</span>
              <span className="text-sm font-medium">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Games Played</span>
            </div>
            <span className="text-sm font-medium">{metrics.total_games_played}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500" />
              <span className="text-sm">Current Level</span>
            </div>
            <span className="text-sm font-medium">{metrics.current_level}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <AlarmClock className="h-4 w-4 text-green-500" />
              <span className="text-sm">Total Time</span>
            </div>
            <span className="text-sm font-medium">{formatTime(metrics.total_time_spent_seconds)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverallProgressCard;
