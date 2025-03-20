// src/components/layout/DashboardNavbar.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { CustomButton } from '../ui/custom-button';
import { Button } from '../ui/button';

const DashboardNavbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white border-b-2 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] py-3">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="w-10 h-10 rounded-md bg-doodle-yellow border-2 border-black flex items-center justify-center">
              <span className="text-black text-lg">D</span>
            </div>
            <Link to="/dashboard" className="font-bold hover:text-doodle-coral">
              Dashboard
            </Link>
            <Link to="/practice" className="font-bold hover:text-doodle-coral">
              Practice
            </Link>
            <Link to="/game" className="font-bold hover:text-doodle-coral">
              Game
            </Link>
            <Link to="/leaderboard" className="font-bold hover:text-doodle-coral">
              Leaderboard
            </Link>
          </div>
          <CustomButton 
            variant="primary"
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={handleLogout}
          >
            Logout
          </CustomButton>
        </nav>
      </div>
    </header>
  );
};

export default DashboardNavbar;