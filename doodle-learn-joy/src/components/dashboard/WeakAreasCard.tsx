
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Activity } from 'lucide-react';

interface WeakAreasCardProps {
  childName: string;
}

const WeakAreasCard = ({ childName }: WeakAreasCardProps) => {
  // Mock data - in a real app, this would come from an API
  const weakAreas = [
    { 
      name: 'Symmetry in drawings', 
      score: 45,
      improvement: +5
    },
    { 
      name: 'Complex shapes', 
      score: 40,
      improvement: +8
    },
    { 
      name: 'Drawing speed', 
      score: 55,
      improvement: +2
    }
  ];

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-amber-500" />
          Areas for Improvement
        </CardTitle>
        <CardDescription>
          Skills that need more practice
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {weakAreas.map((area, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{area.name}</span>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">{area.score}%</span>
                  <span className="text-xs text-green-600">+{area.improvement}%</span>
                </div>
              </div>
              <Progress value={area.score} className="h-2" />
            </div>
          ))}
          
          <div className="pt-2 text-sm">
            <p className="text-muted-foreground">
              Recommended: Practice drawing {weakAreas[0].name.toLowerCase()} exercises
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeakAreasCard;
