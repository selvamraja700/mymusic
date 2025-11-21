/**
 * Application Constants
 * Centralized configuration and constant values
 */

// ============================================
// APP CONFIGURATION
// ============================================
export const APP_NAME = 'TBytez Music';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Your Ultimate Music Streaming Platform';

// ============================================
// API CONFIGURATION
// ============================================
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const API_TIMEOUT = 15000; // 15 seconds

// ============================================
// STORAGE KEYS
// ============================================
export const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  THEME: 'theme',
  VOLUME: 'tbytez_volume',
  LIKED_SONGS: 'tbytez_liked_songs',
  RECENTLY_PLAYED: 'tbytez_recently_played',
  REPEAT_MODE: 'tbytez_repeat_mode',
  SHUFFLE_ENABLED: 'tbytez_shuffle_enabled',
  LANGUAGE: 'tbytez_language',
  QUALITY: 'tbytez_quality',
};

// ============================================
// PLAYER SETTINGS
// ============================================
export const PLAYER_CONFIG = {
  DEFAULT_VOLUME: 0.7,
  MAX_VOLUME: 1.0,
  MIN_VOLUME: 0.0,
  VOLUME_STEP: 0.1,
  SEEK_STEP: 10, // seconds
  CROSSFADE_DURATION: 3, // seconds
};

export const REPEAT_MODES = {
  OFF: 'off',
  ALL: 'all',
  ONE: 'one',
};

export const AUDIO_QUALITY = {
  LOW: 'low',        // 64 kbps
  NORMAL: 'normal',  // 128 kbps
  HIGH: 'high',      // 256 kbps
  VERY_HIGH: 'very_high', // 320 kbps
};

// ============================================
// PAGINATION
// ============================================
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  SONGS_PER_PAGE: 20,
  ALBUMS_PER_PAGE: 15,
  ARTISTS_PER_PAGE: 12,
  PLAYLISTS_PER_PAGE: 15,
  MAX_LIMIT: 100,
};

// ============================================
// LIMITS
// ============================================
export const LIMITS = {
  MAX_PLAYLIST_NAME_LENGTH: 100,
  MAX_PLAYLIST_DESCRIPTION_LENGTH: 500,
  MAX_SONGS_IN_QUEUE: 500,
  MAX_RECENTLY_PLAYED: 50,
  MAX_SEARCH_HISTORY: 20,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
};

// ============================================
// UI CONFIGURATION
// ============================================
export const UI_CONFIG = {
  SIDEBAR_WIDTH: 240,
  PLAYER_HEIGHT: 90,
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
  DESKTOP_BREAKPOINT: 1280,
};

export const TOAST_CONFIG = {
  DURATION: 3000,
  POSITION: 'top-right',
  SUCCESS_DURATION: 2000,
  ERROR_DURATION: 4000,
};

// ============================================
// ROUTES
// ============================================
export const ROUTES = {
  HOME: '/home',
  SEARCH: '/search',
  LIBRARY: '/library',
  LIKED_SONGS: '/liked',
  PLAYLIST: '/playlist/:id',
  ALBUM: '/album/:id',
  ARTIST: '/artist/:id',
  PREMIUM: '/premium',
  SUBSCRIBE: '/subscribe',
  SETTINGS: '/settings',
  PROFILE: '/profile',
  LOGIN: '/login',
  REGISTER: '/register',
  NOT_FOUND: '*',
};

// ============================================
// GENRES
// ============================================
export const GENRES = [
  'All',
  'Bollywood',
  'Pop',
  'Rock',
  'Hip Hop',
  'Classical',
  'Electronic',
  'Punjabi',
  'Tamil',
  'Telugu',
  'Malayalam',
  'Kannada',
  'Bengali',
  'Marathi',
  'Gujarati',
  'Indie',
  'Jazz',
  'R&B',
  'Country',
  'Devotional',
  'Ghazal',
  'Qawwali',
];

// ============================================
// LANGUAGES
// ============================================
export const LANGUAGES = [
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'pa', name: 'Punjabi', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳' },
];

// ============================================
// SUBSCRIPTION PLANS
// ============================================
export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  PREMIUM_1M: 'premium_1m',
  PREMIUM_3M: 'premium_3m',
  PREMIUM_6M: 'premium_6m',
  PREMIUM_12M: 'premium_12m',
};

export const PLAN_FEATURES = {
  FREE: [
    'Ad-supported streaming',
    'Standard audio quality',
    'Limited skips',
    'Shuffle play only',
  ],
  PREMIUM: [
    'Ad-free listening',
    'High quality audio (320kbps)',
    'Unlimited skips',
    'Play any song',
    'Download for offline',
    'Background playback',
  ],
};

// ============================================
// PAYMENT METHODS
// ============================================
export const PAYMENT_METHODS = {
  CARD: 'card',
  UPI: 'upi',
  NETBANKING: 'netbanking',
  WALLET: 'wallet',
};

// ============================================
// ERROR MESSAGES
// ============================================
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Session expired. Please login again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  RATE_LIMIT: 'Too many requests. Please wait and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};

// ============================================
// SUCCESS MESSAGES
// ============================================
export const SUCCESS_MESSAGES = {
  LOGIN: 'Welcome back!',
  REGISTER: 'Account created successfully!',
  LOGOUT: 'Logged out successfully',
  PLAYLIST_CREATED: 'Playlist created successfully',
  PLAYLIST_UPDATED: 'Playlist updated successfully',
  PLAYLIST_DELETED: 'Playlist deleted successfully',
  SONG_ADDED: 'Song added to playlist',
  SONG_REMOVED: 'Song removed from playlist',
  SONG_LIKED: 'Song added to Liked Songs',
  SONG_UNLIKED: 'Song removed from Liked Songs',
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  SUBSCRIPTION_ACTIVATED: 'Premium subscription activated!',
  SUBSCRIPTION_CANCELLED: 'Subscription cancelled successfully',
};

// ============================================
// REGEX PATTERNS
// ============================================
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  PHONE: /^[6-9]\d{9}$/,
  UPI_ID: /^[\w.-]+@[\w.-]+$/,
};

// ============================================
// SOCIAL LINKS
// ============================================
export const SOCIAL_LINKS = {
  INSTAGRAM: 'https://instagram.com/tbytez',
  TWITTER: 'https://twitter.com/tbytez',
  FACEBOOK: 'https://facebook.com/tbytez',
  YOUTUBE: 'https://youtube.com/@tbytez',
};

// ============================================
// FEATURE FLAGS
// ============================================
export const FEATURES = {
  ENABLE_SOCIAL_LOGIN: true,
  ENABLE_OFFLINE_MODE: true,
  ENABLE_LYRICS: true,
  ENABLE_PODCASTS: false,
  ENABLE_VIDEO: false,
  ENABLE_LIVE_RADIO: false,
  ENABLE_ARTIST_RADIO: true,
  ENABLE_COLLABORATIVE_PLAYLISTS: true,
};

// ============================================
// TIME RANGES
// ============================================
export const TIME_RANGES = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  SIX_MONTHS: '6months',
  YEAR: 'year',
  ALL_TIME: 'all',
};

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
export const KEYBOARD_SHORTCUTS = {
  PLAY_PAUSE: 'Space',
  NEXT_SONG: 'ArrowRight',
  PREVIOUS_SONG: 'ArrowLeft',
  VOLUME_UP: 'ArrowUp',
  VOLUME_DOWN: 'ArrowDown',
  MUTE: 'M',
  LIKE: 'L',
  SHUFFLE: 'S',
  REPEAT: 'R',
  SEARCH: '/',
};

export default {
  APP_NAME,
  APP_VERSION,
  API_BASE_URL,
  STORAGE_KEYS,
  PLAYER_CONFIG,
  REPEAT_MODES,
  AUDIO_QUALITY,
  PAGINATION,
  LIMITS,
  ROUTES,
  GENRES,
  LANGUAGES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};
