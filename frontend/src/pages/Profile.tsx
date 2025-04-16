import { useProfile } from '@/hooks/useProfile';
import DashboardNavbar from '@/components/layout/DashboardNavbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Trophy, Clock, Target, GamepadIcon, User, Mail, Calendar, AtSign, Award, Brain } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { CustomButton } from '@/components/ui/custom-button';
import { Input } from '@/components/ui/input';
import { profileService } from '@/services/profile';

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

const StatItem = ({ icon: Icon, label, value, color = "text-doodle-coral" }) => (
  <div className="flex items-center space-x-3 p-4 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-white hover:translate-y-[-2px] transition-transform">
    <div className={`p-2 rounded-full ${color.replace('text-', 'bg-')}/10`}>
      <Icon className={`w-5 h-5 ${color}`} />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-bold text-lg">{value}</p>
    </div>
  </div>
);

const PasswordChangeForm = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await profileService.changePassword({
        current_password: formData.currentPassword,
        new_password: formData.newPassword
      });
      
      toast({
        title: "Success",
        description: "Password updated successfully"
      });
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="password"
        placeholder="Current Password"
        value={formData.currentPassword}
        onChange={(e) => setFormData(prev => ({...prev, currentPassword: e.target.value}))}
        className="border-2 border-black focus:ring-doodle-coral"
        required
      />
      <Input
        type="password"
        placeholder="New Password"
        value={formData.newPassword}
        onChange={(e) => setFormData(prev => ({...prev, newPassword: e.target.value}))}
        className="border-2 border-black focus:ring-doodle-coral"
        required
      />
      <Input
        type="password"
        placeholder="Confirm New Password"
        value={formData.confirmPassword}
        onChange={(e) => setFormData(prev => ({...prev, confirmPassword: e.target.value}))}
        className="border-2 border-black focus:ring-doodle-coral"
        required
      />
      <CustomButton 
        type="submit" 
        disabled={isLoading} 
        className="w-full bg-doodle-yellow hover:bg-doodle-yellow/90"
      >
        {isLoading ? "Updating..." : "Update Password"}
      </CustomButton>
    </form>
  );
};

const Profile = () => {
  const { logout } = useAuth();
  const { profile, isLoading } = useProfile();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Calculate XP progress to next level
  const xpForNextLevel = (profile?.current_level || 0) * 1000;
  const currentXp = profile?.experience_points || 0;
  const xpProgress = (currentXp / xpForNextLevel) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8 flex-1 pt-24">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Profile</h1>
            <CustomButton 
              onClick={logout} 
              variant="outline"
              className="border-2 border-black hover:bg-doodle-coral hover:text-white"
            >
              Logout
            </CustomButton>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Column - Basic Info */}
            <div className="md:w-1/3 space-y-6">
              <div className="border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-white p-6">
                <div className="text-center pb-2">
                  <div className="mx-auto bg-doodle-coral w-20 h-20 rounded-full flex items-center justify-center mb-4 border-2 border-black">
                    <span className="text-3xl text-white font-bold">
                      {profile?.name?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold">{profile?.name}</h2>
                  <p className="text-doodle-coral font-semibold">Level {profile?.current_level}</p>
                </div>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Experience Progress</p>
                    <Progress value={xpProgress} className="h-2" />
                    <p className="text-xs text-gray-400 text-right">
                      {currentXp} / {xpForNextLevel} XP
                    </p>
                  </div>
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span>{profile?.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <AtSign className="w-5 h-5 text-gray-400" />
                      <span>{profile?.username}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span>{new Date(profile?.created_at || '').toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-white p-6">
                <h3 className="font-bold mb-4 text-xl">Change Password</h3>
                <PasswordChangeForm />
              </div>
            </div>

            {/* Right Column - Stats */}
            <div className="md:w-2/3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatItem
                  icon={Trophy}
                  label="Highest Score"
                  value={profile?.highest_score}
                  color="text-doodle-yellow"
                />
                <StatItem
                  icon={Target}
                  label="Average Accuracy"
                  value={`${profile?.average_accuracy}%`}
                  color="text-green-600"
                />
                <StatItem
                  icon={GamepadIcon}
                  label="Total Games"
                  value={profile?.total_games_played}
                  color="text-purple-600"
                />
                <StatItem
                  icon={Clock}
                  label="Time Played"
                  value={profile?.total_time_spent_seconds ? formatDuration(profile.total_time_spent_seconds) : '0h 0m'}
                  color="text-blue-600"
                />
                <StatItem
                  icon={Brain}
                  label="Total Attempts"
                  value={profile?.total_attempts}
                  color="text-indigo-600"
                />
                <StatItem
                  icon={Award}
                  label="Successful Attempts"
                  value={profile?.successful_attempts}
                  color="text-pink-600"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
