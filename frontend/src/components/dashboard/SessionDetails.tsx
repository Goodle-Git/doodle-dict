import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Cell,
} from 'recharts';
import { dashboardService } from '@/services/dashboard';
import { Skeleton } from '@/components/ui/skeleton';

interface SessionDetailsProps {
  sessionId: number;
}

interface CustomScatterDotProps {
  cx?: number;
  cy?: number;
  payload?: {
    correct: boolean;
  };
}

const CustomScatterDot = ({ cx = 0, cy = 0, payload }: CustomScatterDotProps) => {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill={payload?.correct ? "#4ade80" : "#f87171"}
      stroke="none"
    />
  );
};

const SessionDetails = ({ sessionId }: SessionDetailsProps) => {
  const { data: session, isLoading } = useQuery({
    queryKey: ['sessionDetails', sessionId],
    queryFn: () => dashboardService.getSessionDetails(sessionId),
  });

  if (isLoading) {
    return <Skeleton className="w-full h-[400px]" />;
  }

  if (!session) return null;

  const timelineData = session.attempts.map((attempt, index) => ({
    index: index + 1,
    time: attempt.drawing_time_ms / 1000,
    accuracy: attempt.recognition_accuracy * 100,
    word: attempt.word_prompt,
    correct: attempt.is_correct,
    color: attempt.is_correct ? "#4ade80" : "#f87171" // Add color property
  }));

  const difficultyData = session.attempts.reduce((acc, attempt) => {
    const key = attempt.difficulty.toLowerCase();
    if (!acc[key]) {
      acc[key] = { total: 0, correct: 0 };
    }
    acc[key].total++;
    if (attempt.is_correct) acc[key].correct++;
    return acc;
  }, {} as Record<string, { total: number; correct: number }>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Session Overview</CardTitle>
          <CardDescription>
            {format(new Date(session.start_time), 'MMMM d, yyyy HH:mm')}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Score</p>
            <p className="text-2xl font-bold">{session.total_score}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Success Rate</p>
            <p className="text-2xl font-bold">
              {Math.round((session.successful_attempts / session.total_attempts) * 100)}%
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Best Streak</p>
            <p className="text-2xl font-bold">{session.streak_count}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Avg Time</p>
            <p className="text-2xl font-bold">
              {(session.avg_drawing_time_ms / 1000).toFixed(1)}s
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="index" name="Attempt" />
                <YAxis yAxisId="left" name="Time (s)" />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  name="Accuracy"
                  domain={[0, 100]}
                />
                <Tooltip />
                <Legend />
                <Scatter
                  name="Drawing Time"
                  data={timelineData}
                  yAxisId="left"
                  dataKey="time"
                  shape={<CustomScatterDot />}
                />
                <Scatter
                  name="Recognition Accuracy"
                  data={timelineData}
                  fill="#6366f1"
                  yAxisId="right"
                  dataKey="accuracy"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Difficulty Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(difficultyData).map(([difficulty, stats]) => (
              <div key={difficulty} className="space-y-2">
                <p className="font-medium capitalize">{difficulty}</p>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Success Rate: {Math.round((stats.correct / stats.total) * 100)}%
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Attempts: {stats.total}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionDetails;
