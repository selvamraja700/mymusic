import React, { useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import SongCard from '../components/SongCard';
import SearchBar from '../components/SearchBar';
import { useTheme } from '../context/ThemeContext';
import { useMusic } from '../context/MusicContext';

// Trending and Made For You songs (replace with your own when needed)
const TRENDING_SONGS = [
  {
    id: '1',
    title: "Naan Pizhaippeno",
    artist: "Sid Sriram",
    coverImage: "https://i.imgur.com/oLbn6QJ.jpg",
    url: "https://igrkhhdgtimmnfnakjib.supabase.co/storage/v1/object/public/tbytezmusic_10/Naan-Pizhaippeno-MassTamilan.com.mp3",
    duration: 242,
    plays: 409873
  },
  {
    id: '2',
    title: "Mundhinam Parthene",
    artist: "Alaipayuthey",
    coverImage: "https://i.imgur.com/OTH1za5.jpg",
    url: "https://igrkhhdgtimmnfnakjib.supabase.co/storage/v1/object/public/tbytezmusic_10/Mundhinam-Parthene-MassTamilan.com.mp3",
    duration: 237,
    plays: 340295
  },
  {
    id: '3',
    title: "Kanave Kanave",
    artist: "Anirudh",
    coverImage: "https://i.imgur.com/Lk9Zo3p.jpg",
    url: "https://igrkhhdgtimmnfnakjib.supabase.co/storage/v1/object/public/tbytezmusic_10/Kalyaana-Vayasu-MassTamilan.com.mp3",
    duration: 213,
    plays: 397231
  },
  {
    id: '4',
    title: "Anbe En Anbe",
    artist: "AR Rahman",
    coverImage: "https://i.imgur.com/KtD9MZu.jpg",
    url: "https://igrkhhdgtimmnfnakjib.supabase.co/storage/v1/object/public/tbytezmusic_10/Anbe-En-Anbe-MassTamilan.fm.mp3",
    duration: 201,
    plays: 279471
  },
  {
    id: '5',
    title: "Yaanji",
    artist: "Sid Sriram",
    coverImage: "https://i.imgur.com/VuTlUKF.jpg",
    url: "https://igrkhhdgtimmnfnakjib.supabase.co/storage/v1/object/public/tbytezmusic_10/Yaanji-MassTamilan.com.mp3",
    duration: 204,
    plays: 593002
  }
];

const MADE_FOR_YOU_SONGS = [
  {
    id: '6',
    title: "Why This Kolaveri Di",
    artist: "Dhanush",
    coverImage: "https://i.imgur.com/j01onRQ.jpg",
    url: "https://igrkhhdgtimmnfnakjib.supabase.co/storage/v1/object/public/tbytezmusic_10/Why%20This%20Kolaveri%20Di%20(The%20Soup%20of%20Love).mp3",
    duration: 258,
    plays: 639182
  },
  {
    id: '7',
    title: "Vaathi Coming",
    artist: "Anirudh",
    coverImage: "https://i.imgur.com/l0I9FeG.jpg",
    url: "https://igrkhhdgtimmnfnakjib.supabase.co/storage/v1/object/public/tbytezmusic_10/Vaathi-Coming-MassTamilan.io.mp3",
    duration: 236,
    plays: 502391
  },
  {
    id: '8',
    title: "Marana Mass",
    artist: "Anirudh",
    coverImage: "https://i.imgur.com/Aa80B2G.jpg",
    url: "https://igrkhhdgtimmnfnakjib.supabase.co/storage/v1/object/public/tbytezmusic_10/Marana-Mass-MassTamilan.org.mp3",
    duration: 209,
    plays: 358641
  },
  {
    id: '9',
    title: "Kadhal Psycho",
    artist: "Sid Sriram",
    coverImage: "https://i.imgur.com/0WQ8trO.jpg",
    url: "https://igrkhhdgtimmnfnakjib.supabase.co/storage/v1/object/public/tbytezmusic_10/Kadhal-Psycho-MassTamilan.org.mp3",
    duration: 258,
    plays: 401203
  },
  {
    id: '10',
    title: "Why This Kolaveri Di (Remix)",
    artist: "Dhanush",
    coverImage: "https://i.imgur.com/j01onRQ.jpg",
    url: "https://igrkhhdgtimmnfnakjib.supabase.co/storage/v1/object/public/tbytezmusic_10/Kalyaana-Vayasu-MassTamilan.com.mp3",
    duration: 258,
    plays: 200201
  }
];

const Home = () => {
  const { theme } = useTheme();
  const { setCurrentSong, setIsPlaying, currentSong } = useMusic();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const username = user?.username || 'Music Lover';

  // State for homepage filtering (responsive to all screens)
  const [filteredTrending, setFilteredTrending] = useState(TRENDING_SONGS);
  const [filteredMade, setFilteredMade] = useState(MADE_FOR_YOU_SONGS);

  // Home song search logic
  const handleHomeSearch = (q) => {
    if (!q) {
      setFilteredTrending(TRENDING_SONGS);
      setFilteredMade(MADE_FOR_YOU_SONGS);
    } else {
      const lower = q.toLowerCase();
      setFilteredTrending(
        TRENDING_SONGS.filter(
          song =>
            song.title.toLowerCase().includes(lower) ||
            song.artist.toLowerCase().includes(lower)
        )
      );
      setFilteredMade(
        MADE_FOR_YOU_SONGS.filter(
          song =>
            song.title.toLowerCase().includes(lower) ||
            song.artist.toLowerCase().includes(lower)
        )
      );
    }
  };

  const handlePlaySong = song => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  return (
    <AppLayout>
      <div className={`px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-sans`}>
        {/* Welcome / hero */}
        <section className="space-y-2">
          <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Welcome back, {username}!
          </h1>
          <p className={`text-sm sm:text-base max-w-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Good {getGreetingTime()}, ready to discover amazing music?
          </p>
        </section>
        {/* responsive SearchBar */}
        <section>
          <SearchBar onSearch={handleHomeSearch} placeholder="Search any song, artist, or genre..." />
        </section>
        {/* Trending Now */}
        <section className="space-y-4">
          <SectionHeader title="Trending Now" theme={theme} />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {filteredTrending.length === 0 && (
              <div className="col-span-full text-center text-gray-400 py-6">No trending songs found.</div>
            )}
            {filteredTrending.map(song => (
              <SongCard
                key={song.id}
                song={song}
                onPlay={handlePlaySong}
                isPlaying={currentSong?.id === song.id}
              />
            ))}
          </div>
        </section>
        {/* Made For You */}
        <section className="space-y-4">
          <SectionHeader title="Made For You" theme={theme} />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {filteredMade.length === 0 && (
              <div className="col-span-full text-center text-gray-400 py-6">No made-for-you songs found.</div>
            )}
            {filteredMade.map(song => (
              <SongCard
                key={song.id}
                song={song}
                onPlay={handlePlaySong}
                isPlaying={currentSong?.id === song.id}
              />
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

const SectionHeader = ({ title, theme }) => (
  <div className="flex items-center justify-between">
    <h2 className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
  </div>
);

const getGreetingTime = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
};

export default Home;
