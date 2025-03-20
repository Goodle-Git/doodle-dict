
import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DoodleAccuracyChartProps {
  childName: string;
  timeframe: string;
}

const DoodleAccuracyChart = ({ childName, timeframe }: DoodleAccuracyChartProps) => {
  // Mock data - in a real app, this would come from an API
  const data = [
    { 
      name: 'Cat', 
      currentAccuracy: 85,
      previousAccuracy: 72
    },
    { 
      name: 'House', 
      currentAccuracy: 92,
      previousAccuracy: 85
    },
    { 
      name: 'Tree', 
      currentAccuracy: 68,
      previousAccuracy: 55
    },
    { 
      name: 'Car', 
      currentAccuracy: 76,
      previousAccuracy: 65
    },
    { 
      name: 'Sun', 
      currentAccuracy: 95,
      previousAccuracy: 90
    },
    { 
      name: 'Flower', 
      currentAccuracy: 82,
      previousAccuracy: 70
    }
  ];

  const chartConfig = {
    currentAccuracy: {
      label: 'Current',
      color: '#3b82f6', // blue
    },
    previousAccuracy: {
      label: 'Previous',
      color: '#cbd5e1', // slate
    },
  };

  return (
    <div className="w-full h-[300px]">
      <ChartContainer config={chartConfig}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar 
            dataKey="previousAccuracy" 
            fill={chartConfig.previousAccuracy.color} 
            name="Previous" 
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="currentAccuracy" 
            fill={chartConfig.currentAccuracy.color} 
            name="Current" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default DoodleAccuracyChart;
