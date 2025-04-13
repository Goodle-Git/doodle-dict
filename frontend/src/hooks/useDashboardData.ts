import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard';

export const useDashboardData = () => {
  const overallStats = useQuery({
    queryKey: ['overallStats'],
    queryFn: async () => {
      const data = await dashboardService.getOverallStats();
      console.log('[Dashboard Hook] Overall Stats Data:', data);
      return data;
    }
  });

  const weeklyProgress = useQuery({
    queryKey: ['weeklyProgress'],
    queryFn: async () => {
      const data = await dashboardService.getWeeklyProgress();
      console.log('[Dashboard Hook] Weekly Progress Data:', data);
      return data;
    }
  });

  const difficultyStats = useQuery({
    queryKey: ['difficultyStats'],
    queryFn: async () => {
      const data = await dashboardService.getDifficultyStats();
      console.log('[Dashboard Hook] Difficulty Stats Data:', data);
      return data;
    }
  });

  const recentActivities = useQuery({
    queryKey: ['recentActivities'],
    queryFn: async () => {
      const data = await dashboardService.getRecentActivities(10);
      console.log('[Dashboard Hook] Recent Activities Data:', data);
      return data;
    }
  });

  const performanceMetrics = useQuery({
    queryKey: ['performanceMetrics'],
    queryFn: async () => {
      const data = await dashboardService.getPerformanceMetrics();
      console.log('[Dashboard Hook] Performance Metrics Data:', data);
      return data;
    }
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

  console.log('[Dashboard Hook] Complete State:', {
    overallStats: overallStats.data,
    weeklyProgress: weeklyProgress.data,
    difficultyStats: difficultyStats?.data,
    recentActivities: recentActivities?.data,
    performanceMetrics: performanceMetrics?.data,
  });

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
