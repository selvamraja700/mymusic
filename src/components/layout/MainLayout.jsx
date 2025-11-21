import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import MobileTopNavbar from './MobileTopNavbar';
import PlayerBar from './PlayerBar';             // Desktop/tablet PlayerBar
import MobilePlayerBar from './MobilePlayerBar'; // Mobile PlayerBar
import MobileBottomNav from './MobileBottomNav';
import { useTheme } from '../../context/ThemeContext';

/**
 * MainLayout Component
 * Desktop: Sidebar, TopNavbar, PlayerBar
 * Mobile: MobileTopNavbar, MobilePlayerBar, MobileBottomNav
 */
const MainLayout = () => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      {/* Desktop/tablet sidebar */}
      <div className="hidden md:block fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 z-40 bg-inherit">
        <Sidebar />
      </div>

      {/* Desktop/tablet top navbar */}
      <div className="hidden md:block fixed top-0 left-64 right-0 z-50">
        <TopNavbar />
      </div>

      {/* Mobile top navbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50">
        <MobileTopNavbar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 min-h-screen">
        {/* Content margin for Sidebar on desktop */}
        <main className="flex-1 pt-14 md:pt-16 pb-[128px] md:pb-24 md:ml-64 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Desktop/tablet player bar */}
      <div className="hidden md:block fixed left-64 right-0 bottom-0 z-50">
        <PlayerBar />
      </div>

      {/* Mobile player bar (above bottom nav) */}
      <div className="md:hidden fixed left-0 right-0 bottom-16 z-50">
        <MobilePlayerBar />
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
        <MobileBottomNav />
      </div>
    </div>
  );
};

export default MainLayout;
