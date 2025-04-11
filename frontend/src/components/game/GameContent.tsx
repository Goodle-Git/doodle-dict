import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { GameBoard } from './GameBoard';
import { GameStats } from './GameStats';
import { GameStartScreen } from './GameStartScreen';
import { GameEndScreen } from './GameEndScreen';
import DashboardNavbar from '@/components/layout/DashboardNavbar';

export const GameContent = () => {
  const { state } = useGame();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <DashboardNavbar />
      <div className="container mx-auto px-4 py-8 flex-1 pt-24">
        <div className="max-w-4xl mx-auto">
          {state.gameEnded ? (
            <GameEndScreen />
          ) : !state.gameStarted ? (
            <GameStartScreen />
          ) : (
            <>
              <GameStats />
              <GameBoard />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
