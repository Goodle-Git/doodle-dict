import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { WeeklyProgress } from '@/services/dashboard';
import { format, parseISO } from 'date-fns';

interface WeeklyProgressChartProps {
  data: WeeklyProgress[];
}

const WeeklyProgressChart = ({ data }: WeeklyProgressChartProps) => {
  const formattedData = data.map(week => ({
    ...week,
    week: format(parseISO(week.week_start), 'MMM d'),
    accuracy: Number(week.accuracy.toFixed(1)),
    avg_time: Number((week.avg_drawing_time / 1000).toFixed(1))
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis yAxisId="left" domain={[0, 100]} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 'auto']} />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="accuracy"
                stroke="#4f46e5"
                name="Accuracy %"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avg_time"
                stroke="#059669"
                name="Avg Time (s)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyProgressChart;
