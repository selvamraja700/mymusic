import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

/**
 * AlbumCard Component
 * Displays album information with cover art
 */
const AlbumCard = ({ album }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    navigate(`/album/${album.id}`);
  };

  const handlePlayClick = (e) => {
    e.stopPropagation();
    // TODO: Play entire album
    console.log('Play album:', album.id);
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
          src={album.coverImage}
          alt={album.title}
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
        <h3 className="font-bold text-lg truncate mb-1" title={album.title}>
          {album.title}
        </h3>
        <p
          className={`text-sm truncate ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}
          title={album.artist}
        >
          {album.artist}
        </p>
        <div className={`flex items-center gap-2 mt-2 text-xs ${
          theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
        }`}>
          <span>{album.releaseYear}</span>
          <span>•</span>
          <span>{album.totalTracks} tracks</span>
        </div>
      </div>
    </div>
  );
};

export default AlbumCard;
