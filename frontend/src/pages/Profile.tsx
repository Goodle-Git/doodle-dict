import { useAuth } from '@/contexts/AuthContext';
import DashboardNavbar from '@/components/layout/DashboardNavbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useProfile } from '@/hooks/useProfile';

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

const Profile = () => {
  const { profile, isLoading } = useProfile();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8 flex-1 pt-24">
        <h1 className="text-2xl font-bold mb-6">User Profile</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="font-semibold">Name:</label>
                  <p>{profile?.name}</p>
                </div>
                <div>
                  <label className="font-semibold">Email:</label>
                  <p>{profile?.email}</p>
                </div>
                <div>
                  <label className="font-semibold">Username:</label>
                  <p>{profile?.username}</p>
                </div>
                <div>
                  <label className="font-semibold">Member Since:</label>
                  <p>{new Date(profile?.created_at || '').toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="font-semibold">Level:</label>
                  <p>{profile?.current_level}</p>
                </div>
                <div>
                  <label className="font-semibold">Total Games:</label>
                  <p>{profile?.total_games_played}</p>
                </div>
                <div>
                  <label className="font-semibold">Average Accuracy:</label>
                  <p>{profile?.average_accuracy}%</p>
                </div>
                <div>
                  <label className="font-semibold">Highest Score:</label>
                  <p>{profile?.highest_score}</p>
                </div>
                <div>
                  <label className="font-semibold">Total Time Spent:</label>
                  <p>{profile?.total_time_spent_seconds ? formatDuration(profile.total_time_spent_seconds) : '0h 0m'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
