// src/pages/Practice.tsx
import React from 'react';
import DashboardNavbar from '@/components/layout/DashboardNavbar';

const Practice = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <DashboardNavbar />
      <div className="container mx-auto px-4 py-8 flex-1 pt-24">
        <h1>Practice Page</h1>
        {/* Add practice content */}
      </div>
    </div>
  );
};

export default Practice;