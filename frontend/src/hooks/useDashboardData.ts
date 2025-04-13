import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard';

export const useDashboardData = () => {
  const overallStats = useQuery({
    queryKey: ['dashboard', 'overall'],
    queryFn: dashboardService.getOverallStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const weeklyProgress = useQuery({
    queryKey: ['dashboard', 'weekly'],
    queryFn: dashboardService.getWeeklyProgress,
    staleTime: 1000 * 60 * 5,
  });

  const difficultyStats = useQuery({
    queryKey: ['dashboard', 'difficulty'],
    queryFn: dashboardService.getDifficultyStats,
    staleTime: 1000 * 60 * 5,
  });

  const recentActivities = useQuery({
    queryKey: ['dashboard', 'recent'],
    queryFn: () => dashboardService.getRecentActivities(10),
    staleTime: 1000 * 60,
  });

  const performanceMetrics = useQuery({
    queryKey: ['dashboard', 'performance'],
    queryFn: dashboardService.getPerformanceMetrics,
    staleTime: 1000 * 60 * 5,
  });

  return {
    overallStats,
    weeklyProgress,
    difficultyStats,
    recentActivities,
    performanceMetrics,
    isLoading: 
      overallStats.isLoading || 
      weeklyProgress.isLoading || 
      difficultyStats.isLoading || 
      recentActivities.isLoading || 
      performanceMetrics.isLoading,
    isError:
      overallStats.isError ||
      weeklyProgress.isError ||
      difficultyStats.isError ||
      recentActivities.isError ||
      performanceMetrics.isError,
  };
};
