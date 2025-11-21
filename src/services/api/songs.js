import apiClient from './client';

/**
 * Songs API Service
 * Handles all song-related API calls
 */
export const songsAPI = {
  /**
   * Get all songs with optional filters and pagination
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 20)
   * @param {string} params.genre - Filter by genre
   * @param {string} params.artist - Filter by artist ID
   * @param {string} params.album - Filter by album ID
   * @param {string} params.year - Filter by release year
   * @param {string} params.sort - Sort field (plays, title, releaseDate)
   * @param {string} params.order - Sort order (asc, desc)
   * @returns {Promise<Object>} Paginated songs list
   */
  getAll: async (params = {}) => {
    const defaultParams = {
      page: 1,
      limit: 20,
      sort: 'plays',
      order: 'desc',
    };

    return apiClient.get('/songs', {
      params: { ...defaultParams, ...params },
    });
  },

  /**
   * Get single song by ID
   * @param {string} id - Song ID
   * @returns {Promise<Object>} Song details
   */
  getById: async (id) => {
    if (!id) {
      throw new Error('Song ID is required');
    }
    return apiClient.get(`/songs/${id}`);
  },

  /**
   * Get trending songs
   * @param {Object} options - Options
   * @param {number} options.limit - Number of songs to return (default: 10)
   * @param {string} options.timeRange - Time range (day, week, month, all)
   * @param {string} options.genre - Filter by genre
   * @returns {Promise<Array>} Trending songs
   */
  getTrending: async ({ limit = 10, timeRange = 'week', genre = null } = {}) => {
    return apiClient.get('/songs/trending', {
      params: { limit, timeRange, genre },
    });
  },

  /**
   * Get recently added songs
   * @param {number} limit - Number of songs to return (default: 10)
   * @returns {Promise<Array>} Recently added songs
   */
  getRecent: async (limit = 10) => {
    return apiClient.get('/songs/recent', {
      params: { limit },
    });
  },

  /**
   * Get top songs (most played)
   * @param {Object} options - Options
   * @param {number} options.limit - Number of songs (default: 10)
   * @param {string} options.timeRange - Time range (day, week, month, all)
   * @returns {Promise<Array>} Top songs
   */
  getTop: async ({ limit = 10, timeRange = 'all' } = {}) => {
    return apiClient.get('/songs/top', {
      params: { limit, timeRange },
    });
  },

  /**
   * Search songs
   * @param {string} query - Search query
   * @param {Object} filters - Additional filters
   * @param {string} filters.genre - Genre filter
   * @param {string} filters.artist - Artist ID filter
   * @param {number} filters.minDuration - Minimum duration in seconds
   * @param {number} filters.maxDuration - Maximum duration in seconds
   * @param {number} filters.limit - Results limit (default: 20)
   * @returns {Promise<Array>} Search results
   */
  search: async (query, filters = {}) => {
    if (!query || query.trim().length === 0) {
      throw new Error('Search query is required');
    }

    return apiClient.get('/songs/search', {
      params: {
        q: query.trim(),
        ...filters,
      },
    });
  },

  /**
   * Increment song play count
   * Called when user plays a song
   * @param {string} id - Song ID
   * @returns {Promise<Object>} Updated play count
   */
  incrementPlayCount: async (id) => {
    if (!id) {
      throw new Error('Song ID is required');
    }
    return apiClient.post(`/songs/${id}/play`);
  },

  /**
   * Get song recommendations based on user listening history
   * @param {string} songId - Base song ID for recommendations
   * @param {number} limit - Number of recommendations (default: 10)
   * @returns {Promise<Array>} Recommended songs
   */
  getRecommendations: async (songId, limit = 10) => {
    if (!songId) {
      throw new Error('Song ID is required');
    }
    return apiClient.get(`/songs/${songId}/recommendations`, {
      params: { limit },
    });
  },

  /**
   * Get songs by genre
   * @param {string} genre - Genre name
   * @param {Object} params - Additional parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Promise<Object>} Paginated songs
   */
  getByGenre: async (genre, params = {}) => {
    if (!genre) {
      throw new Error('Genre is required');
    }
    return apiClient.get(`/songs/genre/${encodeURIComponent(genre)}`, {
      params: {
        page: 1,
        limit: 20,
        ...params,
      },
    });
  },

  /**
   * Get songs by artist
   * @param {string} artistId - Artist ID
   * @param {Object} params - Additional parameters
   * @returns {Promise<Array>} Artist's songs
   */
  getByArtist: async (artistId, params = {}) => {
    if (!artistId) {
      throw new Error('Artist ID is required');
    }
    return apiClient.get(`/songs/artist/${artistId}`, {
      params: {
        sort: 'releaseDate',
        order: 'desc',
        ...params,
      },
    });
  },

  /**
   * Get songs by album
   * @param {string} albumId - Album ID
   * @returns {Promise<Array>} Album's songs
   */
  getByAlbum: async (albumId) => {
    if (!albumId) {
      throw new Error('Album ID is required');
    }
    return apiClient.get(`/songs/album/${albumId}`);
  },

  /**
   * Get similar songs
   * @param {string} songId - Song ID
   * @param {number} limit - Number of similar songs (default: 10)
   * @returns {Promise<Array>} Similar songs
   */
  getSimilar: async (songId, limit = 10) => {
    if (!songId) {
      throw new Error('Song ID is required');
    }
    return apiClient.get(`/songs/${songId}/similar`, {
      params: { limit },
    });
  },

  /**
   * Get song lyrics
   * @param {string} songId - Song ID
   * @returns {Promise<Object>} Song lyrics
   */
  getLyrics: async (songId) => {
    if (!songId) {
      throw new Error('Song ID is required');
    }
    return apiClient.get(`/songs/${songId}/lyrics`);
  },

  /**
   * Report song issue
   * @param {string} songId - Song ID
   * @param {Object} issue - Issue details
   * @param {string} issue.type - Issue type (audio_quality, incorrect_metadata, copyright, other)
   * @param {string} issue.description - Issue description
   * @returns {Promise<Object>} Report confirmation
   */
  reportIssue: async (songId, issue) => {
    if (!songId) {
      throw new Error('Song ID is required');
    }
    if (!issue.type || !issue.description) {
      throw new Error('Issue type and description are required');
    }
    return apiClient.post(`/songs/${songId}/report`, issue);
  },
};
