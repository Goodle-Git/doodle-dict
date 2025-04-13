import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard';

export const useDashboardData = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: async () => {
      const [
        overallStats,
        weeklyProgress,
        difficultyStats,
        recentActivities,
        performanceMetrics
      ] = await Promise.all([
        dashboardService.getOverallStats(),
        dashboardService.getWeeklyProgress(),
        dashboardService.getDifficultyStats(),
        dashboardService.getRecentActivities(10),
        dashboardService.getPerformanceMetrics()
      ]);

      return {
        overallStats,
        weeklyProgress,
        difficultyStats,
        recentActivities,
        performanceMetrics
      };
    }
  });

  return {
    overallStats: data?.overallStats,
    weeklyProgress: data?.weeklyProgress,
    difficultyStats: data?.difficultyStats,
    recentActivities: data?.recentActivities,
    performanceMetrics: data?.performanceMetrics,
    isLoading,
    isError
  };
};
