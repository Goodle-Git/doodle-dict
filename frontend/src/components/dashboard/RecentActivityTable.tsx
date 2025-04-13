import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X } from 'lucide-react';
import { format } from 'date-fns';

interface Activity {
  id: number;
  word_prompt: string;
  difficulty: string;
  is_correct: boolean;
  drawing_time_ms: number;
  recognition_accuracy: number;
  created_at: string;
  session_score: number;
}

interface RecentActivityTableProps {
  activities: Activity[];
}

const RecentActivityTable = ({ activities }: RecentActivityTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Word</TableHead>
          <TableHead>Difficulty</TableHead>
          <TableHead>Result</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Accuracy</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {activities.map(activity => (
          <TableRow key={activity.id}>
            <TableCell>{format(new Date(activity.created_at), 'MMM d, HH:mm')}</TableCell>
            <TableCell className="font-medium">{activity.word_prompt}</TableCell>
            <TableCell>{activity.difficulty}</TableCell>
            <TableCell>
              {activity.is_correct ? 
                <Check className="h-5 w-5 text-green-500" /> : 
                <X className="h-5 w-5 text-red-500" />
              }
            </TableCell>
            <TableCell>{(activity.drawing_time_ms / 1000).toFixed(1)}s</TableCell>
            <TableCell>
              <span className={
                activity.recognition_accuracy >= 0.8 ? 'text-green-600' : 
                activity.recognition_accuracy >= 0.6 ? 'text-amber-600' : 
                'text-red-600'
              }>
                {Math.round(activity.recognition_accuracy * 100)}%
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RecentActivityTable;
