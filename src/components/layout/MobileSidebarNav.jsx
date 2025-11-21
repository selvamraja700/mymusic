import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Search, Library, User } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// Responsive bottom navbar for mobile screens
const MobileSidebarNav = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  // NavLink class function for React Router v6+
  const navLinkClass = ({ isActive }) =>
    `flex-1 flex flex-col items-center justify-center py-1 px-1 mx-1
      ${isActive ? 'text-green-500' : theme === 'dark' ? 'text-white' : 'text-gray-900'}
      transition-colors`;

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-40 h-16 flex items-center justify-between border-t px-1 gap-0
      md:hidden
      ${theme === 'dark' ? 'bg-black border-gray-800' : 'bg-white border-gray-200'}`}
      style={{ boxShadow: '0 -2px 24px rgba(0,0,0,0.09)' }}
    >
      <NavLink to="/home" className={navLinkClass}>
        <Home className="w-6 h-6" />
        <span className="text-xs mt-[2px] truncate">Home</span>
      </NavLink>
      <NavLink to="/search" className={navLinkClass}>
        <Search className="w-6 h-6" />
        <span className="text-xs mt-[2px] truncate">Search</span>
      </NavLink>
      <NavLink to="/library" className={navLinkClass}>
        <Library className="w-6 h-6" />
        <span className="text-xs mt-[2px] truncate">Playlists</span>
      </NavLink>
      <button
        onClick={() => navigate('/profile')}
        className={`flex-1 flex flex-col items-center justify-center py-1 px-1 mx-1 transition-colors 
          ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
        aria-label="Profile"
        type="button"
      >
        <User className="w-6 h-6" />
        <span className="text-xs mt-[2px] truncate">Profile</span>
      </button>
    </nav>
  );
};

export default MobileSidebarNav;
