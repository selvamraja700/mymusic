/**
 * API Services Index
 * Handles all API service exports properly
 */

// Import with named exports (using * as)
import * as auth from './auth';
import * as user from './user';
import * as songs from './songs';
import * as playlists from './playlists';
import * as search from './search';
import * as subscriptions from './subscriptions';

// Mock missing API services
const albums = {
  getAll: async () => [],
  getById: async (id) => null,
};

const artists = {
  getAll: async () => [],
  getById: async (id) => null,
};

const settings = {
  get: async () => ({}),
  update: async (data) => data,
};

// Export with proper names
export const authAPI = auth;
export const userAPI = user;
export const songsAPI = songs;
export const albumsAPI = albums;
export const artistsAPI = artists;
export const playlistsAPI = playlists;
export const searchAPI = search;
export const subscriptionsAPI = subscriptions;
export const settingsAPI = settings;

// Default export object
export default {
  auth,
  user,
  songs,
  albums,
  artists,
  playlists,
  search,
  subscriptions,
  settings,
};
