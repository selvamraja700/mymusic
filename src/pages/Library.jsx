import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import PlaylistCard from '../components/PlaylistCard';
import AlbumCard from '../components/AlbumCard';
import mockData from '../utils/mockData';

const Library = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('playlists');

  const tabs = [
    { id: 'playlists', label: 'Playlists' },
    { id: 'albums', label: 'Albums' },
    { id: 'artists', label: 'Artists' },
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Your Library</h1>
          <button className="px-6 py-3 rounded-full font-semibold bg-green-500 hover:bg-green-600 text-white transition-colors">
            <div className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              <span>Create Playlist</span>
            </div>
          </button>
        </div>

        <div className="flex gap-4 mb-8 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-black'
                  : theme === 'dark'
                  ? 'bg-white/10 hover:bg-white/20'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'playlists' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {mockData.playlists.map(playlist => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        )}

        {activeTab === 'albums' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {mockData.albums.map(album => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;
