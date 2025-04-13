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
import { SessionListItem } from '@/services/dashboard';
import SessionDetails from './SessionDetails';

interface SessionsListProps {
  sessions?: SessionListItem[];
}

export const SessionsList = ({ sessions = [] }: SessionsListProps) => {
  const [selectedSession, setSelectedSession] = useState<number | null>(null);

  if (selectedSession) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          onClick={() => setSelectedSession(null)}
        >
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
          <CardTitle>Game Sessions</CardTitle>
          <CardDescription>No sessions found</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Game Sessions</CardTitle>
        <CardDescription>History of all your drawing sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Success Rate</TableHead>
              <TableHead>Best Streak</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell>
                  {format(new Date(session.start_time), 'MMM d, yyyy HH:mm')}
                </TableCell>
                <TableCell>
                  {format(
                    new Date(session.end_time).getTime() - 
                    new Date(session.start_time).getTime(),
                    'mm:ss'
                  )}
                </TableCell>
                <TableCell>{session.total_score}</TableCell>
                <TableCell>
                  {Math.round((session.successful_attempts / session.total_attempts) * 100)}%
                </TableCell>
                <TableCell>{session.streak_count}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedSession(session.id)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
