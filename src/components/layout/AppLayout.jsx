import React from 'react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import MobileTopNavbar from './MobileTopNavbar';
import PlayerBar from './PlayerBar';               // Desktop/tablet only
import MobilePlayerBar from './MobilePlayerBar';   // Mobile only
import MobileBottomNav from './MobileBottomNav';
import { useTheme } from '../../context/ThemeContext';

const playlists = [/* your playlists, as before */];

const AppLayout = ({ children }) => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-900'} font-sans`}>
      {/* Desktop/tablet top navbar */}
      <div className="hidden md:block">
        <TopNavbar />
      </div>
      {/* Mobile top navbar */}
      <div className="md:hidden">
        <MobileTopNavbar />
      </div>
      <div className="flex flex-1 min-h-screen">
        {/* Sidebar only on desktop/tablet */}
        <aside className="hidden md:flex fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 z-40 bg-inherit">
          <Sidebar playlists={playlists} />
        </aside>
        {/* Main content with bottom padding for both player bar and nav on mobile */}
        <main className="flex-1 pt-14 md:pt-16 pb-[128px] md:pb-36 md:ml-64 overflow-y-auto">
          {children}
        </main>
      </div>
      {/* Desktop/tablet player bar */}
      <div className="hidden md:block fixed left-64 right-0 bottom-0 z-50">
        <PlayerBar />
      </div>
      {/* Mobile player bar */}
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

export default AppLayout;
