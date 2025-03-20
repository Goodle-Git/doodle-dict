
import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface SkillProgressChartProps {
  childName: string;
  timeframe: string;
}

const SkillProgressChart = ({ childName, timeframe }: SkillProgressChartProps) => {
  // Mock data - in a real app, this would come from an API
  const getDataPoints = () => {
    // Different data based on timeframe selected
    if (timeframe === 'week') {
      return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    } else if (timeframe === 'month') {
      return ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    } else if (timeframe === 'quarter') {
      return ['Month 1', 'Month 2', 'Month 3'];
    } else {
      return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    }
  };
  
  const dataPoints = getDataPoints();
  
  const data = dataPoints.map((point, index) => {
    // Simulating growth over time
    const baseAccuracy = 40 + Math.min(index * 5, 45);
    const baseSpeed = 30 + Math.min(index * 6, 50);
    const baseConsistency = 35 + Math.min(index * 7, 55);
    
    // Adding some randomness
    return {
      name: point,
      accuracy: baseAccuracy + Math.floor(Math.random() * 10),
      speed: baseSpeed + Math.floor(Math.random() * 10),
      consistency: baseConsistency + Math.floor(Math.random() * 10),
    };
  });

  const chartConfig = {
    accuracy: {
      label: 'Accuracy',
      color: '#4f46e5', // indigo
    },
    speed: {
      label: 'Speed',
      color: '#059669', // emerald
    },
    consistency: {
      label: 'Consistency',
      color: '#ea580c', // amber
    },
  };

  return (
    <div className="w-full h-[300px]">
      <ChartContainer config={chartConfig}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="accuracy"
            stroke={chartConfig.accuracy.color}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="speed"
            stroke={chartConfig.speed.color}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="consistency"
            stroke={chartConfig.consistency.color}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default SkillProgressChart;
