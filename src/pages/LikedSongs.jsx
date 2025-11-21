import React from 'react';
import { Heart, Play, Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useMusic } from '../context/MusicContext';
import { formatDuration, formatDate } from '../utils/formatters';

const LikedSongs = () => {
  const { theme } = useTheme();
  const { likedSongs, playSong, toggleLike } = useMusic();

  const handlePlayAll = () => {
    if (likedSongs.length > 0) {
      playSong(likedSongs[0], likedSongs);
    }
  };

  const handlePlaySong = (song) => {
    playSong(song, likedSongs);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      <div className={`${theme === 'dark' ? 'bg-gradient-to-b from-purple-900/30 to-black' : 'bg-gradient-to-b from-purple-100 to-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-end gap-6">
            <div className="w-60 h-60 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-2xl">
              <Heart className="w-24 h-24 text-white fill-current" />
            </div>
            <div>
              <p className="text-sm font-semibold mb-2">PLAYLIST</p>
              <h1 className="text-6xl font-black mb-4">Liked Songs</h1>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                {likedSongs.length} songs
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {likedSongs.length > 0 ? (
          <>
            <button
              onClick={handlePlayAll}
              className="mb-8 w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 hover:scale-110 transition-all flex items-center justify-center text-white shadow-lg"
            >
              <Play className="w-6 h-6 fill-current ml-1" />
            </button>

            <div className={`rounded-xl overflow-hidden ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-100'}`}>
              <div className={`grid grid-cols-[auto_1fr_1fr_auto_auto] gap-4 px-6 py-3 text-sm font-semibold border-b ${
                theme === 'dark' ? 'border-gray-800 text-gray-400' : 'border-gray-200 text-gray-600'
              }`}>
                <div className="w-8">#</div>
                <div>TITLE</div>
                <div>ALBUM</div>
                <div>DATE ADDED</div>
                <div className="w-12"><Clock className="w-4 h-4" /></div>
              </div>

              {likedSongs.map((song, index) => (
                <div
                  key={song.id}
                  className={`grid grid-cols-[auto_1fr_1fr_auto_auto] gap-4 px-6 py-3 items-center cursor-pointer transition-colors ${
                    theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
                  }`}
                  onClick={() => handlePlaySong(song)}
                >
                  <div className="w-8 text-center">{index + 1}</div>
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={song.coverImage} alt={song.title} className="w-10 h-10 rounded" />
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{song.title}</div>
                      <div className={`text-sm truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {song.artist}
                      </div>
                    </div>
                  </div>
                  <div className={`truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {song.album}
                  </div>
                  <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {formatDate(song.likedAt || new Date(), 'short')}
                  </div>
                  <div className={`w-12 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {formatDuration(song.duration)}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <Heart className="w-20 h-20 mx-auto mb-4 text-gray-500" />
            <h2 className="text-2xl font-bold mb-2">No liked songs yet</h2>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Start liking songs to build your collection
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedSongs;
