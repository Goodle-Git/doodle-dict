
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Target } from 'lucide-react';

interface OverallProgressCardProps {
  childName: string;
  timeframe: string;
}

const OverallProgressCard = ({ childName, timeframe }: OverallProgressCardProps) => {
  // Mock data - in a real app, this would come from an API
  const overallProgress = 78;
  const completedExercises = 42;
  const totalExercises = 55;
  const level = 5;
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Overall Progress
        </CardTitle>
        <CardDescription>
          {childName}'s learning journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Drawing & Vocabulary Skills</span>
              <span className="text-sm font-medium">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Exercises</span>
            </div>
            <span className="text-sm font-medium">{completedExercises}/{totalExercises}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500" />
              <span className="text-sm">Current Level</span>
            </div>
            <span className="text-sm font-medium">{level}</span>
          </div>
          
          <div className="pt-2 text-xs text-muted-foreground">
            {timeframe === 'week' && 'Last 7 days'}
            {timeframe === 'month' && 'Last 30 days'}
            {timeframe === 'quarter' && 'Last 3 months'}
            {timeframe === 'year' && 'Last 12 months'}
            {timeframe === 'all' && 'All time progress'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverallProgressCard;
