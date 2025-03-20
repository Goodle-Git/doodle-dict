
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface SkillRadarChartProps {
  skillData: Array<{
    subject: string;
    current: number;
    previous: number;
    fullMark: number;
  }>;
}

const SkillRadarChart = ({ skillData }: SkillRadarChartProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Skill Across Difficulty</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="95%" data={skillData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#374151" tick={{  fontSize: 12 }}  />
              <Radar
                name="Current Accuracy"
                dataKey="current"
                stroke="#4f46e5"
                fill="#4f46e5"
                fillOpacity={0.6}
              />
              <Radar
                name="Previous Accuracy"
                dataKey="previous"
                stroke="#ea580c"
                fill="#ea580c"
                fillOpacity={0.6}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillRadarChart;
