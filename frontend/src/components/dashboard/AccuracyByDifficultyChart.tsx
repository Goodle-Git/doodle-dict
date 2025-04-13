import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DifficultyStats } from '@/services/dashboard';

interface AccuracyByDifficultyChartProps {
  stats: DifficultyStats[];
}

const AccuracyByDifficultyChart = ({ stats }: AccuracyByDifficultyChartProps) => {
  const data = stats.map(stat => ({
    difficulty: stat.difficulty,
    accuracy: (stat.successful_attempts / stat.total_attempts) * 100,
    avgTime: stat.avg_time / 1000 // Convert to seconds
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Accuracy by Difficulty</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="difficulty" />
              <YAxis yAxisId="left" domain={[0, 100]} label={{ value: 'Accuracy %', angle: -90 }} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 30]} label={{ value: 'Avg Time (s)', angle: 90 }} />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="accuracy" fill="#4f46e5" name="Accuracy %" />
              <Bar yAxisId="right" dataKey="avgTime" fill="#059669" name="Avg Time (s)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccuracyByDifficultyChart;
