import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';

const MusicContext = createContext(undefined);

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within MusicProvider');
  }
  return context;
};

const STORAGE_KEYS = {
  VOLUME: 'tbytez_volume',
  LIKED_SONGS: 'tbytez_liked_songs',
  RECENTLY_PLAYED: 'tbytez_recently_played',
  REPEAT_MODE: 'tbytez_repeat_mode',
  SHUFFLE_ENABLED: 'tbytez_shuffle_enabled',
};

const REPEAT_MODES = {
  OFF: 'off',
  ALL: 'all',
  ONE: 'one',
};

export const MusicProvider = ({ children }) => {
  // Core player state
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const [queue, setQueue] = useState([]);
  const [originalQueue, setOriginalQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState([]);

  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VOLUME);
    return saved ? parseFloat(saved) : 0.7;
  });
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(0.7);

  const [repeatMode, setRepeatMode] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REPEAT_MODE);
    return saved || REPEAT_MODES.OFF;
  });

  const [shuffleEnabled, setShuffleEnabled] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SHUFFLE_ENABLED);
    return saved === 'true';
  });

  const [likedSongs, setLikedSongs] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LIKED_SONGS);
    return saved ? JSON.parse(saved) : [];
  });

  const [recentlyPlayed, setRecentlyPlayed] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RECENTLY_PLAYED);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => { localStorage.setItem(STORAGE_KEYS.VOLUME, volume.toString()); }, [volume]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.LIKED_SONGS, JSON.stringify(likedSongs)); }, [likedSongs]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.RECENTLY_PLAYED, JSON.stringify(recentlyPlayed)); }, [recentlyPlayed]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.REPEAT_MODE, repeatMode); }, [repeatMode]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SHUFFLE_ENABLED, shuffleEnabled.toString()); }, [shuffleEnabled]);

  // Stubs for actions (implement as needed)
  const isLiked = id => likedSongs.includes(id);
  const toggleLike = song => setLikedSongs(old => (
    old.includes(song.id) ? old.filter(x => x !== song.id) : [...old, song.id]
  ));
  const addToQueue = song => setQueue(old => [...old, song]);

  // Main playback/transport controls (expand as needed)
  const value = useMemo(() => ({
    currentSong, setCurrentSong,
    isPlaying, setIsPlaying,
    progress, setProgress,
    duration, setDuration,
    currentTime, setCurrentTime,
    queue, setQueue,
    originalQueue, setOriginalQueue,
    currentIndex, setCurrentIndex,
    history, setHistory,
    volume, setVolume,
    isMuted, setIsMuted,
    previousVolume, setPreviousVolume,
    repeatMode, setRepeatMode,
    shuffleEnabled, setShuffleEnabled,
    likedSongs, setLikedSongs,
    recentlyPlayed, setRecentlyPlayed,
    isLiked, toggleLike, addToQueue
    // Add any further playback methods here!
  }), [
    currentSong, isPlaying, progress, duration, currentTime,
    queue, originalQueue, currentIndex, history,
    volume, isMuted, previousVolume,
    repeatMode, shuffleEnabled,
    likedSongs, recentlyPlayed
  ]);

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

export { REPEAT_MODES };
