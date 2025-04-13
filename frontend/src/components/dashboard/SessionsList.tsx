import { useState } from 'react';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SessionListItem } from '@/services/dashboard';
import SessionDetails from './SessionDetails';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  Target,
  CheckCircle2,
  Zap,
  ChevronRight,
  History,
  Trophy,
  Info
} from 'lucide-react';

interface SessionsListProps {
  sessions?: SessionListItem[];
}

export const SessionsList = ({ sessions = [] }: SessionsListProps) => {
  const [selectedSession, setSelectedSession] = useState<number | null>(null);

  const getPerformanceBadge = (successRate: number) => {
    if (successRate >= 80) return <Badge variant="success">Excellent</Badge>;
    if (successRate >= 60) return <Badge variant="warning">Good</Badge>;
    return <Badge variant="destructive">Needs Practice</Badge>;
  };

  if (selectedSession) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          onClick={() => setSelectedSession(null)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sessions List
        </Button>
        <SessionDetails sessionId={selectedSession} />
      </div>
    );
  }

  if (!sessions.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-blue-500" />
            Game Sessions
          </CardTitle>
          <CardDescription>No sessions found</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-40 text-muted-foreground">
          <History className="h-12 w-12 mb-4 opacity-50" />
          <p>Start playing to see your sessions here!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-blue-500" />
          Game Sessions
        </CardTitle>
        <CardDescription>History of all your drawing sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Date</span>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Duration</span>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  <span>Score</span>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span>Success Rate</span>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span>Best Streak</span>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  <span>Details</span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((session) => {
              const successRate = Math.round((session.successful_attempts / session.total_attempts) * 100);
              return (
                <TableRow 
                  key={session.id}
                  className="hover:bg-muted/50 cursor-pointer"
                  onClick={() => setSelectedSession(session.id)}
                >
                  <TableCell className="font-medium">
                    {format(new Date(session.start_time), 'MMM d, yyyy HH:mm')}
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">
                      {format(
                        new Date(session.end_time).getTime() - 
                        new Date(session.start_time).getTime(),
                        'mm:ss'
                      )}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-blue-600">
                      {session.total_score}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getPerformanceBadge(successRate)}
                      <span>{successRate}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Zap className={`h-4 w-4 ${session.streak_count >= 5 ? 'text-yellow-500' : 'text-gray-400'}`} />
                      <span className="font-medium">{session.streak_count}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600"
                    >
                      View Details
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
