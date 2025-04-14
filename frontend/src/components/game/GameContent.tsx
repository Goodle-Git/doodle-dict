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
      <div className="container-fluid px-8 py-8 flex-1 pt-24"> {/* Changed from container to container-fluid and increased padding */}
        <div className="max-w-7xl mx-auto"> {/* Changed from max-w-4xl to max-w-7xl */}
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
