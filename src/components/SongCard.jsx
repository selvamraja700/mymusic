import React, { useState } from 'react';
import { Play, Heart, MoreVertical, Plus, ListPlus } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useMusic } from '../context/MusicContext';
import { formatNumber, formatDuration } from '../utils/formatters';

const SongCard = ({ song, onPlay, showArtist = true, showAlbum = false }) => {
  const { theme } = useTheme();
  const { isLiked, toggleLike, addToQueue } = useMusic();
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const liked = isLiked(song.id);

  const handlePlay = () => { if (onPlay) { onPlay(song); } };
  const handleLike = e => { e.stopPropagation(); toggleLike(song); };
  const handleAddToQueue = e => { e.stopPropagation(); addToQueue(song); setShowMenu(false); };
  const handleMenuToggle = e => { e.stopPropagation(); setShowMenu(x => !x); };

  return (
    <div
      className={`relative group rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
        theme === 'dark' ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-100 hover:bg-gray-200'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handlePlay}
    >
      {/* Song Image */}
      <div className="relative aspect-square">
        <img src={song.coverImage} alt={song.title} className="w-full h-full object-cover" loading="lazy" />
        {/* Play Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity">
            <button
              className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center hover:scale-110 hover:bg-green-600 transition-transform shadow-lg"
              onClick={handlePlay}
            >
              <Play className="w-6 h-6 text-white fill-current ml-1" />
            </button>
          </div>
        )}
        {/* Like Button */}
        <button
          onClick={handleLike}
          className={`absolute top-2 right-2 p-2 rounded-full transition-all ${
            liked
              ? 'bg-green-500 text-white'
              : 'bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100'
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
        </button>
        {/* Context Menu Button */}
        <button
          onClick={handleMenuToggle}
          className={`absolute top-2 left-2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100`}
        >
          <MoreVertical className="w-4 h-4" />
        </button>
        {showMenu && (
          <div
            className={`absolute top-12 left-2 z-10 rounded-lg shadow-xl min-w-[200px] ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={handleAddToQueue}
              className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-white/5 transition-colors ${
                theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'
              }`}
            >
              <ListPlus className="w-5 h-5" />
              <span>Add to Queue</span>
            </button>
            <button
              className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-white/5 transition-colors ${
                theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'
              }`}
            >
              <Plus className="w-5 h-5" />
              <span>Add to Playlist</span>
            </button>
          </div>
        )}
      </div>
      {/* Song Info */}
      <div className="p-3">
        <h3 className="font-semibold truncate mb-1" title={song.title}>
          {song.title}
        </h3>
        {showArtist && (
          <p className={`text-sm truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} title={song.artist}>{song.artist}</p>
        )}
        {showAlbum && (
          <p className={`text-xs truncate mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`} title={song.album}>{song.album}</p>
        )}
        {/* Stats */}
        <div className={`flex items-center gap-3 mt-2 text-xs ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
        }`}>
          <span>{formatDuration(song.duration)}</span>
          <span>•</span>
          <span>{formatNumber(song.plays)} plays</span>
        </div>
      </div>
    </div>
  );
};

export default SongCard;
