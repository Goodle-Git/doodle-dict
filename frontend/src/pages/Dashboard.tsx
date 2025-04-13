import { Suspense } from 'react';
import { 
  QueryClient,
  QueryClientProvider 
} from '@tanstack/react-query';
import DashboardNavbar from '@/components/layout/DashboardNavbar';
import Footer from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDashboardData } from '@/hooks/useDashboardData';
import OverallProgressCard from '@/components/dashboard/OverallProgressCard';
import RecentActivityTable from '@/components/dashboard/RecentActivityTable';
import WeeklyProgressChart from '@/components/dashboard/WeeklyProgressChart';
import AccuracyByDifficultyChart from '@/components/dashboard/AccuracyByDifficultyChart';
import DifficultyStatsCard from '@/components/dashboard/DifficultyStatsCard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import DrawingMetricsCard from '@/components/dashboard/DrawingMetricsCard';

const queryClient = new QueryClient();

const DashboardContent = () => {
  const { 
    overallStats,
    weeklyProgress,
    difficultyStats,
    recentActivities,
    performanceMetrics,
    isLoading,
    isError 
  } = useDashboardData();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <div className="text-center text-red-500">Error loading dashboard data</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8 flex-1 pt-24">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Learning Progress Dashboard</h1>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="progress">Detailed Progress</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <OverallProgressCard 
                metrics={{
                  ...overallStats.data!,
                  total_time_spent_seconds: performanceMetrics.data?.total_time_spent_seconds
                }} 
              />
              <DifficultyStatsCard stats={difficultyStats.data!} />
              <DrawingMetricsCard metrics={performanceMetrics.data!} />
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <WeeklyProgressChart data={weeklyProgress.data!} />
              <AccuracyByDifficultyChart stats={difficultyStats.data!} />
            </div>
            
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <RecentActivityTable activities={recentActivities.data!} />
            </div>
          </TabsContent>
          
          <TabsContent value="progress">
            {/* Additional progress metrics will be added here */}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

const Dashboard = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LoadingSpinner />}>
        <DashboardContent />
      </Suspense>
    </QueryClientProvider>
  );
};

export default Dashboard;
