import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { GameProvider } from '@/contexts/GameContext';
import DashboardNavbar from '@/components/layout/DashboardNavbar';
import { GameContent } from '@/components/game/GameContent';

export default function Game() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}