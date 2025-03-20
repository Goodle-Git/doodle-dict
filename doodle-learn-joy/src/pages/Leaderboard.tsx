// src/pages/Leaderboard.tsx
import React from 'react';
import DashboardNavbar from '@/components/layout/DashboardNavbar';

const Leaderboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <DashboardNavbar />
      <div className="container mx-auto px-4 py-8 flex-1 pt-24">
        <h1>Leaderboard Page</h1>
        {/* Add Leaderboard content */}
      </div>
    </div>
  );
};

export default Leaderboard;