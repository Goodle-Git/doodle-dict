
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X, Clock, Award } from 'lucide-react';

interface RecentActivityTableProps {
  childName: string;
  limit?: number;
}

const RecentActivityTable = ({ childName, limit = 5 }: RecentActivityTableProps) => {
  // Mock data - in a real app, this would come from an API
  const activities = [
    {
      id: 1,
      date: '2023-07-10T14:30:00',
      activity: 'Drew a cat',
      category: 'Drawing',
      doodle: 'Cat',
      result: 'success',
      score: 85,
      timeSpent: '2m 35s',
    },
    {
      id: 2,
      date: '2023-07-09T16:45:00',
      activity: 'Vocabulary quiz',
      category: 'Vocabulary',
      doodle: 'Multiple',
      result: 'success',
      score: 90,
      timeSpent: '5m 20s',
    },
    {
      id: 3,
      date: '2023-07-08T10:15:00',
      activity: 'Drew a house',
      category: 'Drawing',
      doodle: 'House',
      result: 'partial',
      score: 65,
      timeSpent: '3m 45s',
    },
    {
      id: 4,
      date: '2023-07-07T11:30:00',
      activity: 'Drew a car',
      category: 'Drawing',
      doodle: 'Car',
      result: 'fail',
      score: 40,
      timeSpent: '4m 10s',
    },
    {
      id: 5,
      date: '2023-07-06T09:20:00',
      activity: 'Word-doodle matching',
      category: 'Vocabulary',
      doodle: 'Multiple',
      result: 'success',
      score: 95,
      timeSpent: '6m 30s',
    },
    {
      id: 6,
      date: '2023-07-05T13:45:00',
      activity: 'Drew a tree',
      category: 'Drawing',
      doodle: 'Tree',
      result: 'success',
      score: 75,
      timeSpent: '3m 15s',
    },
  ];

  const limitedActivities = limit ? activities.slice(0, limit) : activities;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'success':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'partial':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'fail':
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Activity</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Doodle</TableHead>
          <TableHead>Result</TableHead>
          <TableHead>Score</TableHead>
          <TableHead>Time Spent</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {limitedActivities.map(activity => (
          <TableRow key={activity.id}>
            <TableCell>{formatDate(activity.date)}</TableCell>
            <TableCell>{activity.activity}</TableCell>
            <TableCell>{activity.category}</TableCell>
            <TableCell>{activity.doodle}</TableCell>
            <TableCell>{getResultIcon(activity.result)}</TableCell>
            <TableCell>
              <span className={
                activity.score >= 80 ? 'text-green-600' : 
                activity.score >= 60 ? 'text-amber-600' : 
                'text-red-600'
              }>
                {activity.score}%
              </span>
            </TableCell>
            <TableCell>{activity.timeSpent}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RecentActivityTable;
