import React from 'react';
import { Crown, Settings } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const MobileTopNavbar = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isPremium =
    user?.isPremium &&
    (!user?.premiumEndDate || new Date(user?.premiumEndDate) > new Date());

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-end px-3 border-b md:hidden
      ${theme === 'dark' ? 'bg-black/90 border-b-white' : 'bg-white/95 border-b-black'} backdrop-blur`}
      role="navigation"
      aria-label="MobileTopNavbar"
    >
      {isPremium ? (
        <button
          onClick={() => navigate('/profile')}
          className="px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold text-xs flex items-center gap-1"
          type="button"
        >
          <Crown className="w-4 h-4" /> Premium
        </button>
      ) : (
        <button
          onClick={() => navigate('/premium')}
          className="px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold text-xs flex items-center gap-1"
          type="button"
        >
          <Crown className="w-4 h-4" /> Upgrade
        </button>
      )}
      <button
        onClick={() => navigate('/settings')}
        className={`ml-2 p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
        aria-label="Settings"
        type="button"
      >
        <Settings className="w-6 h-6" />
      </button>
    </nav>
  );
};

export default MobileTopNavbar;
