import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { GameProvider } from '@/contexts/GameContext';
import DashboardNavbar from '@/components/layout/DashboardNavbar';
import { GameContent } from '@/components/game/GameContent';
import { gameService } from '@/services';

export default function Game() {
  const { user } = useAuth();

  if (!user) return null;

  const handleRecognize = async (imageData: string) => {
    try {
      const result = await gameService.recognize(imageData);
      // ...rest of the code
    } catch (error) {
      // ...error handling
    }
  };

  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}