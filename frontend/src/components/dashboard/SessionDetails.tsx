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
  BarChart,
  Bar,
  PieChart,
  Pie,
  RadialBarChart,
  RadialBar,
  LabelList
} from 'recharts';
import { dashboardService } from '@/services/dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Timer,
  Target,
  Award,
  Zap,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  BarChart2,
  PieChart as PieChartIcon,
  ListOrdered,
  Trophy
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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

const COLORS = {
  easy: '#22c55e',
  medium: '#eab308',
  hard: '#ef4444',
  correct: '#4ade80',
  incorrect: '#f87171',
  primary: '#6366f1'
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
    difficulty: attempt.difficulty.toLowerCase(),
    color: attempt.is_correct ? COLORS.correct : COLORS.incorrect
  }));

  const difficultyData = Object.entries(
    session.attempts.reduce((acc, attempt) => {
      const key = attempt.difficulty.toLowerCase();
      if (!acc[key]) {
        acc[key] = { total: 0, correct: 0, name: key };
      }
      acc[key].total++;
      if (attempt.is_correct) acc[key].correct++;
      return acc;
    }, {} as Record<string, { total: number; correct: number; name: string }>)
  ).map(([_, value]) => ({
    ...value,
    percentage: (value.correct / value.total) * 100
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Session Overview
          </CardTitle>
          <CardDescription>
            {format(new Date(session.start_time), 'MMMM d, yyyy HH:mm')}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-4 gap-4">
          <div className="space-y-1 bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              <p className="text-sm text-blue-700">Total Score</p>
            </div>
            <p className="text-2xl font-bold text-blue-900">{session.total_score}</p>
          </div>
          
          <div className="space-y-1 bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <p className="text-sm text-green-700">Success Rate</p>
            </div>
            <p className="text-2xl font-bold text-green-900">
              {Math.round((session.successful_attempts / session.total_attempts) * 100)}%
            </p>
          </div>
          
          <div className="space-y-1 bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <p className="text-sm text-yellow-700">Best Streak</p>
            </div>
            <p className="text-2xl font-bold text-yellow-900">{session.streak_count}</p>
          </div>
          
          <div className="space-y-1 bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-500" />
              <p className="text-sm text-purple-700">Avg Time</p>
            </div>
            <p className="text-2xl font-bold text-purple-900">
              {(session.avg_drawing_time_ms / 1000).toFixed(1)}s
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-blue-500" />
              Difficulty Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={difficultyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill={COLORS.primary} name="Total Attempts">
                    <LabelList dataKey="total" position="top" />
                  </Bar>
                  <Bar dataKey="correct" fill={COLORS.correct} name="Correct">
                    <LabelList dataKey="correct" position="top" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-blue-500" />
              Success Rate by Difficulty
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={difficultyData}
                    dataKey="percentage"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percentage }) => 
                      `${name}: ${percentage.toFixed(1)}%`
                    }
                  >
                    {difficultyData.map((entry, index) => (
                      <Cell 
                        key={entry.name}
                        fill={COLORS[entry.name as keyof typeof COLORS]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Performance Timeline
          </CardTitle>
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
                >
                  {timelineData.map((entry, index) => (
                    <Cell 
                      key={index} 
                      fill={COLORS[entry.difficulty]} 
                    />
                  ))}
                </Scatter>
                <Scatter
                  name="Recognition Accuracy"
                  data={timelineData}
                  fill={COLORS.primary}
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
          <CardTitle className="flex items-center gap-2">
            <ListOrdered className="h-5 w-5 text-blue-500" />
            Attempt Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Word</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Accuracy</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {session.attempts.map((attempt, index) => (
                <TableRow key={attempt.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{attempt.word_prompt}</TableCell>
                  <TableCell>
                    <Badge variant={
                      attempt.difficulty.toLowerCase() === 'easy' ? 'success' :
                      attempt.difficulty.toLowerCase() === 'medium' ? 'warning' : 'destructive'
                    }>
                      {attempt.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {attempt.is_correct ? 
                      <CheckCircle2 className="h-5 w-5 text-green-500" /> : 
                      <XCircle className="h-5 w-5 text-red-500" />
                    }
                  </TableCell>
                  <TableCell>{(attempt.drawing_time_ms / 1000).toFixed(1)}s</TableCell>
                  <TableCell>{(attempt.recognition_accuracy * 100).toFixed(1)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionDetails;
