import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, Settings, LogOut, Crown, ChevronDown, Menu } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const TopNavbar = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const menuRef = useRef(null);
  const notifRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const isPremiumActive = () => {
    if (!user?.isPremium) return false;
    if (!user?.premiumEndDate) return true;
    const end = new Date(user.premiumEndDate);
    return end > new Date();
  };
  const premiumActive = isPremiumActive();

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const getInitial = () => user?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between
        px-4 md:px-8 border-b
        ${theme === 'dark' ? 'bg-black/95 border-b-white' : 'bg-white/95 border-b-black'}
        backdrop-blur-md w-full font-sans`}
      style={{ minWidth: 0 }}
      role="navigation"
      aria-label="Main Navigation"
    >
      {/* Mobile: Only settings button at right */}
      <div className="flex md:hidden w-full justify-end">
        <button
          onClick={() => navigate('/settings')}
          className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
          aria-label="Settings"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>

      {/* Desktop/Tablet: full navbar content */}
      <div className="hidden md:flex flex-1 items-center justify-between">
        {/* Left: Menu + title */}
        <div className="flex items-center gap-3">
          <button
            className={`md:hidden p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
            type="button"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-lg md:text-xl font-bold hidden sm:inline">Music</span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          {!premiumActive && (
            <button
              onClick={() => navigate('/premium')}
              className="hidden sm:inline-flex px-3 md:px-4 py-1.5 md:py-2 rounded-full font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black text-xs md:text-sm transition-all shadow-md"
            >
              <Crown className="w-4 h-4 mr-1" /> Upgrade
            </button>
          )}
          {premiumActive && (
            <button
              onClick={() => navigate('/profile')}
              className="hidden sm:inline-flex px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold text-xs md:text-sm shadow-md"
            >
              <Crown className="w-4 h-4 mr-1" /> Premium
            </button>
          )}

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
            </button>
            {showNotifications && (
              <div
                className={`absolute right-0 mt-2 w-72 rounded-xl shadow-2xl overflow-hidden ${
                  theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
                }`}
              >
                <div className={`p-3 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                  <span className="font-semibold text-sm">Notifications</span>
                </div>
                <div className="p-6 text-center text-sm text-gray-500">No new notifications</div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`flex items-center gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded-full ${
                theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'
              }`}
              aria-label="User menu"
            >
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold relative">
                {getInitial()}
                {premiumActive && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 md:w-4 md:h-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center border-2 border-black">
                    <Crown className="w-2 h-2 text-white" />
                  </div>
                )}
              </div>
              <span className="hidden md:inline text-sm font-semibold max-w-[120px] truncate">
                {user?.username || 'User'}
              </span>
              <ChevronDown className={`w-4 h-4 hidden md:inline transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>
            {showUserMenu && (
              <div
                className={`absolute right-0 mt-2 w-60 rounded-xl shadow-2xl overflow-hidden ${
                  theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
                }`}
              >
                <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-lg relative">
                      {getInitial()}
                      {premiumActive && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center border-2 border-gray-900">
                          <Crown className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold truncate text-sm">{user?.username || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
                    </div>
                  </div>
                </div>
                <div className="py-1">
                  <MenuItem icon={<User className="w-4 h-4" />} label="Profile" onClick={() => navigate('/profile')} theme={theme} />
                  <MenuItem icon={<Settings className="w-4 h-4" />} label="Settings" onClick={() => navigate('/settings')} theme={theme} />
                  <div className={`my-1 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`} />
                  <MenuItem icon={<LogOut className="w-4 h-4" />} label="Logout" onClick={handleLogout} theme={theme} danger />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const MenuItem = ({ icon, label, onClick, theme, danger }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
      danger ? 'text-red-500 hover:bg-red-500/10' : theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-100'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default TopNavbar;
