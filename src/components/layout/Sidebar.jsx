import React from 'react';
import { Home, Search, Library, Heart, Plus } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import MobileSidebarNav from './MobileSidebarNav';

const playlists = [
  { name: "My Playlist #1", count: "15 songs" },
  { name: "Workout Mix", count: "28 songs" },
  { name: "Chill Vibes", count: "42 songs" },
  { name: "Party Anthems", count: "35 songs" },
];

const Sidebar = () => {
  const { theme } = useTheme();
  return (
    <>
      {/* Desktop/Tablet sidebar fixed left */}
      <div className={`hidden md:flex h-screen w-64 flex-col justify-between fixed left-0 top-0 z-40 border-r
        ${theme === 'dark' ? 'bg-black text-white border-r-white' : 'bg-white text-gray-900 border-r-black'} font-sans`}>
        <div>
          <div className="flex items-center gap-3 px-4 py-4 sticky top-0 bg-inherit z-20">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <span>🎵</span>
            </div>
            <span className="text-xl font-bold">TBytez</span>
          </div>
          <nav className="px-3 py-4 space-y-2">
            <NavItem to="/home" icon={<Home className="w-5 h-5" />} label="Home" />
            <NavItem to="/search" icon={<Search className="w-5 h-5" />} label="Search" />
            <NavItem to="/library" icon={<Library className="w-5 h-5" />} label="Your Library" />
            <NavItem to="/liked" icon={<Heart className="w-5 h-5 text-pink-400" />} label="Liked Songs" />
            <div className="mt-6">
              <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                ${theme === 'dark'
                  ? 'bg-gray-900 hover:bg-gray-800 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}>
                <Plus className="w-5 h-5" />
                <span>Create Playlist</span>
              </button>
            </div>
          </nav>
        </div>
        <div className="flex flex-col flex-1 pb-0">
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
            {playlists.map((p, idx) => (
              <SidebarPlaylist key={idx} name={p.name} count={p.count} />
            ))}
          </div>
          <div className={`px-4 py-2 border-t ${theme === 'dark' ? 'border-white/20 text-gray-400' : 'border-black/10 text-gray-500'} sticky bottom-0 bg-inherit`}>
            <span className="text-xs">Made with ❤️ by TBytez Team</span>
          </div>
        </div>
      </div>
      {/* Mobile Bottom Navbar - only visible on mobile */}
      <div className="md:hidden">
        <MobileSidebarNav playlists={playlists} />
      </div>
    </>
  );
};

const NavItem = ({ to, icon, label }) => {
  const { theme } = useTheme();
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors
        ${isActive
          ? theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'
          : theme === 'dark' ? 'text-gray-400 hover:bg-gray-900 hover:text-white' : 'text-gray-700 hover:bg-gray-100'
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};

const SidebarPlaylist = ({ name, count }) => (
  <div className="flex flex-col px-2 py-2 rounded-lg hover:bg-gray-900/40 cursor-pointer">
    <span className="text-sm font-medium">{name}</span>
    <span className="text-xs text-gray-500">{count}</span>
  </div>
);

export default Sidebar;
