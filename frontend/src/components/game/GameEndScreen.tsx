import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { CustomButton } from '@/components/ui/custom-button';

export const GameEndScreen = () => {
  const navigate = useNavigate();
  const { state, resetGame } = useGame();
  const { user } = useAuth();
  const { score, attempts } = state;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <div className="container mx-auto px-4 py-8 flex-1 pt-24">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="p-8 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-white">
            <h2 className="text-3xl font-bold mb-6">Game Over! 🎨</h2>

            <div className="space-y-6 mb-8">
              <motion.div 
                initial={{ x: -50 }}
                animate={{ x: 0 }}
                className="p-4 border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] bg-doodle-yellow/10"
              >
                <p className="text-3xl font-bold">🌟 Score: {score}</p>
              </motion.div>
              
              <motion.div 
                initial={{ x: 50 }}
                animate={{ x: 0 }}
                className="p-4 border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] bg-doodle-coral/10"
              >
                <p className="text-2xl">✏️ Attempts: {attempts}</p>
              </motion.div>
              
              <motion.div 
                initial={{ x: -50 }}
                animate={{ x: 0 }}
                className="p-4 border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] bg-doodle-blue/10"
              >
                <p className="text-xl">👨‍🎨 Artist: {user?.username}</p>
              </motion.div>
            </div>

            <div className="space-x-6">
              <CustomButton
                onClick={resetGame}
                className="bg-doodle-yellow hover:bg-doodle-yellow/90 text-xl px-8 py-4"
              >
                🎨 Draw Again!
              </CustomButton>
              <CustomButton
                onClick={() => navigate('/leaderboard')}
                className="bg-doodle-coral hover:bg-doodle-coral/90 text-xl px-8 py-4"
              >
                🏆 View Gallery
              </CustomButton>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
