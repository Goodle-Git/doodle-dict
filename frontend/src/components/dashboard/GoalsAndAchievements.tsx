
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Award } from 'lucide-react';

interface GoalsAndAchievementsProps {
  childName: string;
}

const GoalsAndAchievements = ({ childName }: GoalsAndAchievementsProps) => {
  // Mock data - in a real app, this would come from an API
  const goals = [
    { 
      id: 1,
      name: 'Draw 5 animal doodles', 
      progress: 3,
      total: 5
    },
    { 
      id: 2,
      name: 'Learn 20 new vocabulary words', 
      progress: 15,
      total: 20
    },
    { 
      id: 3,
      name: 'Complete beginner drawing course', 
      progress: 7,
      total: 10
    }
  ];

  const achievements = [
    {
      id: 1,
      name: 'Fast Drawer',
      description: 'Completed 3 drawings in under 2 minutes',
      date: '2023-07-08'
    },
    {
      id: 2,
      name: 'Vocabulary Master',
      description: 'Learned 50 words through doodling',
      date: '2023-07-05'
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-purple-500" />
          Goals & Achievements
        </CardTitle>
        <CardDescription>
          {childName}'s progress toward learning goals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm mb-2">Current Goals</h4>
            <ul className="space-y-2">
              {goals.map(goal => (
                <li key={goal.id} className="text-sm flex items-center justify-between">
                  <span>{goal.name}</span>
                  <span className="font-medium">
                    {goal.progress}/{goal.total}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-sm mb-2">Recent Achievements</h4>
            <ul className="space-y-2">
              {achievements.map(achievement => (
                <li key={achievement.id} className="text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{achievement.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(achievement.date)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalsAndAchievements;
