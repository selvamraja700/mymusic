import React, { useState } from 'react';
import { Play, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { formatNumber } from '../utils/formatters';

/**
 * PlaylistCard Component
 * Displays playlist with metadata
 */
const PlaylistCard = ({ playlist }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    navigate(`/playlist/${playlist.id}`);
  };

  const handlePlayClick = (e) => {
    e.stopPropagation();
    // TODO: Play entire playlist
    console.log('Play playlist:', playlist.id);
  };

  return (
    <div
      className={`group rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
        theme === 'dark' ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-100 hover:bg-gray-200'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="relative aspect-square">
        <img
          src={playlist.coverImage}
          alt={playlist.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {isHovered && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <button
              onClick={handlePlayClick}
              className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center hover:scale-110 hover:bg-green-600 transition-transform shadow-lg"
            >
              <Play className="w-7 h-7 text-white fill-current ml-1" />
            </button>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg truncate mb-1" title={playlist.name}>
          {playlist.name}
        </h3>
        
        {playlist.description && (
          <p
            className={`text-sm truncate mb-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
            title={playlist.description}
          >
            {playlist.description}
          </p>
        )}

        <div className={`flex items-center gap-3 text-xs ${
          theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
        }`}>
          <span>{playlist.totalTracks} songs</span>
          {playlist.followers && (
            <>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{formatNumber(playlist.followers)}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistCard;
