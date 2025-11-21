import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useMusic } from '../context/MusicContext';
import SearchBar from '../components/SearchBar';
import SongCard from '../components/SongCard';
import AlbumCard from '../components/AlbumCard';
import ArtistCard from '../components/ArtistCard';
import PlaylistCard from '../components/PlaylistCard';
import Loading from '../components/Loading';
import mockData from '../utils/mockData';

/**
 * Search Page Component
 * Advanced search with filters and categories
 */
const Search = () => {
  const { theme } = useTheme();
  const { playSong } = useMusic();
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);

  const [results, setResults] = useState({
    songs: [],
    albums: [],
    artists: [],
    playlists: [],
  });

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults({ songs: [], albums: [], artists: [], playlists: [] });
      return;
    }

    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));

      const lowerQuery = searchQuery.toLowerCase();

      // Filter songs
      const songs = mockData.songs.filter(song =>
        song.title.toLowerCase().includes(lowerQuery) ||
        song.artist.toLowerCase().includes(lowerQuery) ||
        song.album.toLowerCase().includes(lowerQuery)
      );

      // Filter albums
      const albums = mockData.albums.filter(album =>
        album.title.toLowerCase().includes(lowerQuery) ||
        album.artist.toLowerCase().includes(lowerQuery)
      );

      // Filter artists
      const artists = mockData.artists.filter(artist =>
        artist.name.toLowerCase().includes(lowerQuery)
      );

      // Filter playlists
      const playlists = mockData.playlists.filter(playlist =>
        playlist.name.toLowerCase().includes(lowerQuery) ||
        playlist.description.toLowerCase().includes(lowerQuery)
      );

      setResults({ songs, albums, artists, playlists });
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    setSearchParams({ q: searchQuery });
  };

  const handlePlaySong = (song) => {
    playSong(song, results.songs);
  };

  const filterTabs = [
    { id: 'all', label: 'All' },
    { id: 'songs', label: 'Songs' },
    { id: 'albums', label: 'Albums' },
    { id: 'artists', label: 'Artists' },
    { id: 'playlists', label: 'Playlists' },
  ];

  const genres = ['All', ...mockData.genres];

  const filteredResults = () => {
    let filtered = { ...results };

    // Genre filter
    if (selectedGenre !== 'all') {
      filtered.songs = filtered.songs.filter(s => s.genre === selectedGenre);
      filtered.albums = filtered.albums.filter(a => a.genre === selectedGenre);
    }

    // Sort
    if (sortBy === 'plays') {
      filtered.songs = [...filtered.songs].sort((a, b) => b.plays - a.plays);
    } else if (sortBy === 'name') {
      filtered.songs = [...filtered.songs].sort((a, b) => a.title.localeCompare(b.title));
      filtered.albums = [...filtered.albums].sort((a, b) => a.title.localeCompare(b.title));
      filtered.artists = [...filtered.artists].sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  };

  const displayResults = filteredResults();
  const hasResults = Object.values(displayResults).some(arr => arr.length > 0);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-10 ${
        theme === 'dark' ? 'bg-black/95 border-b border-gray-800' : 'bg-white/95 border-b border-gray-200'
      } backdrop-blur-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <SearchBar onSearch={handleSearch} />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-3 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-white/10 hover:bg-white/20'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Pills */}
          {showFilters && (
            <div className="mt-4 space-y-4">
              {/* Genre Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Genre</label>
                <div className="flex flex-wrap gap-2">
                  {genres.map(genre => (
                    <button
                      key={genre}
                      onClick={() => setSelectedGenre(genre === 'All' ? 'all' : genre)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedGenre === (genre === 'All' ? 'all' : genre)
                          ? 'bg-green-500 text-white'
                          : theme === 'dark'
                          ? 'bg-white/10 hover:bg-white/20'
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`px-4 py-2 rounded-lg ${
                    theme === 'dark'
                      ? 'bg-white/10 border border-gray-700'
                      : 'bg-gray-100 border border-gray-300'
                  }`}
                >
                  <option value="relevance">Relevance</option>
                  <option value="name">Name</option>
                  <option value="plays">Popularity</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className={`sticky top-[140px] z-10 ${
        theme === 'dark' ? 'bg-black/95 border-b border-gray-800' : 'bg-white/95 border-b border-gray-200'
      } backdrop-blur-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
            {filterTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                  activeFilter === tab.id
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
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loading variant="spinner" size="lg" text="Searching..." />
          </div>
        ) : !query ? (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold mb-4">Search for music</h2>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Find your favorite songs, albums, artists, and playlists
            </p>
          </div>
        ) : !hasResults ? (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold mb-4">No results found</h2>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Try searching with different keywords
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Songs */}
            {(activeFilter === 'all' || activeFilter === 'songs') && displayResults.songs.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6">Songs</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {displayResults.songs.slice(0, activeFilter === 'songs' ? 50 : 10).map(song => (
                    <SongCard key={song.id} song={song} onPlay={handlePlaySong} />
                  ))}
                </div>
              </section>
            )}

            {/* Albums */}
            {(activeFilter === 'all' || activeFilter === 'albums') && displayResults.albums.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6">Albums</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {displayResults.albums.slice(0, activeFilter === 'albums' ? 50 : 6).map(album => (
                    <AlbumCard key={album.id} album={album} />
                  ))}
                </div>
              </section>
            )}

            {/* Artists */}
            {(activeFilter === 'all' || activeFilter === 'artists') && displayResults.artists.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6">Artists</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {displayResults.artists.slice(0, activeFilter === 'artists' ? 50 : 6).map(artist => (
                    <ArtistCard key={artist.id} artist={artist} />
                  ))}
                </div>
              </section>
            )}

            {/* Playlists */}
            {(activeFilter === 'all' || activeFilter === 'playlists') && displayResults.playlists.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6">Playlists</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {displayResults.playlists.slice(0, activeFilter === 'playlists' ? 50 : 6).map(playlist => (
                    <PlaylistCard key={playlist.id} playlist={playlist} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
