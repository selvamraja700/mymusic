import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

/**
 * SearchBar Component
 * Works on mobile/tablet/desktop, stores recent searches.
 * onSearch is a callback for filtering songs on the homepage.
 */
const SearchBar = ({
  onSearch,
  placeholder = 'Search for songs, artists, albums...'
}) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) setRecentSearches(JSON.parse(saved));

    // Global '/' shortcut to focus
    const handleKeyPress = (e) => {
      if (e.key === '/' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleChange = (e) => setQuery(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) performSearch(query.trim());
  };

  const performSearch = (searchQuery) => {
    // Save to recent
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 10);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
    setIsFocused(false);
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const handleRecentClick = (search) => {
    setQuery(search);
    performSearch(search);
  };

  return (
    <div className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search
            className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder={placeholder}
            className={`w-full pl-12 pr-12 py-3 rounded-full transition-all text-base
              ${theme === 'dark'
                ? 'bg-white/10 border border-gray-700 focus:border-white text-white placeholder-gray-500'
                : 'bg-gray-100 border border-gray-300 focus:border-gray-900 text-gray-900 placeholder-gray-500'
            } focus:outline-none`}
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className={`absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full ${
                theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-200'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>
      {/* Recent Searches Dropdown */}
      {isFocused && recentSearches.length > 0 && !query && (
        <div
          className={`absolute top-full left-0 right-0 mt-2 rounded-lg shadow-2xl overflow-hidden z-50 ${
            theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
          }`}
        >
          <div className="p-3">
            <p className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Recent Searches
            </p>
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => handleRecentClick(search)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-100'
                }`}
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
