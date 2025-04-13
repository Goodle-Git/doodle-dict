import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard';

export const useDashboardData = () => {
  const overallStats = useQuery({
    queryKey: ['overallStats'],
    queryFn: dashboardService.getOverallStats
  });

  const weeklyProgress = useQuery({
    queryKey: ['weeklyProgress'],
    queryFn: dashboardService.getWeeklyProgress
  });

  const difficultyStats = useQuery({
    queryKey: ['difficultyStats'],
    queryFn: dashboardService.getDifficultyStats
  });

  const recentActivities = useQuery({
    queryKey: ['recentActivities'],
    queryFn: () => dashboardService.getRecentActivities(10)
  });

  const performanceMetrics = useQuery({
    queryKey: ['performanceMetrics'],
    queryFn: dashboardService.getPerformanceMetrics
  });

  const isLoading = overallStats.isLoading || 
    weeklyProgress.isLoading || 
    difficultyStats.isLoading || 
    recentActivities.isLoading ||
    performanceMetrics.isLoading;

  const isError = overallStats.isError || 
    weeklyProgress.isError || 
    difficultyStats.isError || 
    recentActivities.isError ||
    performanceMetrics.isError;

  return {
    overallStats,
    weeklyProgress,
    difficultyStats,
    recentActivities,
    performanceMetrics,
    isLoading,
    isError
  };
};
