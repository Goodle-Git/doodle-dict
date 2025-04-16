import { CustomButton } from '@/components/ui/custom-button';
import DashboardNavbar from '@/components/layout/DashboardNavbar';
import { useGame } from '@/contexts/GameContext';
import { useAuth } from '@/contexts/AuthContext';

export const GameStartScreen = () => {
  const { startGame } = useGame();
  const { user } = useAuth();
  const username = user?.username || '';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <DashboardNavbar />
      <div className="container mx-auto px-4 py-8 flex-1 pt-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-8 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-white">
            <h2 className="text-3xl font-bold mb-6">Welcome to Doodle Challenge! 🎨</h2>
            <div className="mb-8">
              <p className="text-xl mb-4">
                Ready to play, <span className="font-bold text-doodle-coral">{username}</span>?
              </p>
              <p className="text-gray-600">
                You have 2 minutes to draw as many doodles as you can!
              </p>
            </div>
            <CustomButton 
              onClick={() => startGame(username)}
              className="bg-doodle-yellow hover:bg-doodle-yellow/90 text-xl px-8 py-4"
            >
              Start Challenge
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
};
