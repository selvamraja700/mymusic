import React, { useState } from 'react';
import { UserCheck, UserPlus, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { formatNumber } from '../utils/formatters';

/**
 * ArtistCard Component
 * Displays artist profile with follow button
 */
const ArtistCard = ({ artist }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    navigate(`/artist/${artist.id}`);
  };

  const handleFollowClick = (e) => {
    e.stopPropagation();
    setIsFollowing(!isFollowing);
  };

  return (
    <div
      className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
        theme === 'dark' ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-100 hover:bg-gray-200'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="relative aspect-square">
        <img
          src={artist.image}
          alt={artist.name}
          className="w-full h-full object-cover rounded-full p-4"
          loading="lazy"
        />

        {/* Verified Badge */}
        {artist.verified && (
          <div className="absolute top-6 right-6 bg-blue-500 rounded-full p-1">
            <CheckCircle className="w-4 h-4 text-white fill-current" />
          </div>
        )}
      </div>

      <div className="p-4 text-center">
        <h3 className="font-bold text-lg truncate mb-1" title={artist.name}>
          {artist.name}
        </h3>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {formatNumber(artist.followers)} followers
        </p>

        {/* Follow Button */}
        <button
          onClick={handleFollowClick}
          className={`mt-3 px-6 py-2 rounded-full font-medium transition-all ${
            isFollowing
              ? theme === 'dark'
                ? 'bg-white/10 hover:bg-white/20 text-white'
                : 'bg-gray-300 hover:bg-gray-400 text-gray-900'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            {isFollowing ? (
              <>
                <UserCheck className="w-4 h-4" />
                <span>Following</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Follow</span>
              </>
            )}
          </div>
        </button>
      </div>
    </div>
  );
};

export default ArtistCard;
