// src/components/layout/DashboardNavbar.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { CustomButton } from '../ui/custom-button';

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
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-2xl font-bold font-space-grotesk"
            >
              <div className="w-10 h-10 rounded-md bg-doodle-yellow border-2 border-black flex items-center justify-center">
                <div className='w-6 h-6'>

                <img src="/DoodleDict.png" alt="" />
                </div>
              </div>
              <span className="hidden sm:inline-block">
                <div className='w-28 h-8'>
                  <img src="/DoodleDict-Secondary.png" alt="" />
                </div>
              </span>
            </Link>
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
            <Link to="/profile" className="font-bold hover:text-doodle-coral">
              Profile
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