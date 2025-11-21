import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const NotFound = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      <div className="text-center px-4">
        <h1 className="text-9xl font-black mb-4 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
        <p className={`text-lg mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/home')}
            className="px-6 py-3 rounded-full font-semibold bg-green-500 hover:bg-green-600 text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              <span>Go Home</span>
            </div>
          </button>
          <button
            onClick={() => navigate('/search')}
            className={`px-6 py-3 rounded-full font-semibold transition-colors ${
              theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              <span>Search</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
