import apiClient from './client';

/**
 * Search API Service
 * Handles all search-related API calls
 */
export const searchAPI = {
  /**
   * Search across all content (songs, albums, artists, playlists)
   * @param {string} query - Search query
   * @param {Object} options - Search options
   * @param {number} options.limit - Results per category (default: 10)
   * @returns {Promise<Object>} Search results by category
   */
  searchAll: async (query, options = {}) => {
    if (!query || query.trim().length === 0) {
      throw new Error('Search query is required');
    }

    const params = {
      q: query.trim(),
      limit: options.limit || 10,
    };

    return apiClient.get('/search', { params });
  },

  /**
   * Search songs only
   * @param {string} query - Search query
   * @param {Object} filters - Additional filters
   * @param {string} filters.genre - Genre filter
   * @param {string} filters.artist - Artist name filter
   * @param {number} filters.minDuration - Min duration (seconds)
   * @param {number} filters.maxDuration - Max duration (seconds)
   * @param {number} filters.page - Page number
   * @param {number} filters.limit - Results per page (default: 20)
   * @returns {Promise<Object>} Paginated song results
   */
  searchSongs: async (query, filters = {}) => {
    if (!query || query.trim().length === 0) {
      throw new Error('Search query is required');
    }

    const params = {
      q: query.trim(),
      page: filters.page || 1,
      limit: filters.limit || 20,
      ...(filters.genre && { genre: filters.genre }),
      ...(filters.artist && { artist: filters.artist }),
      ...(filters.minDuration && { minDuration: filters.minDuration }),
      ...(filters.maxDuration && { maxDuration: filters.maxDuration }),
    };

    return apiClient.get('/search/songs', { params });
  },

  /**
   * Search artists only
   * @param {string} query - Search query
   * @param {Object} options - Search options
   * @param {number} options.page - Page number
   * @param {number} options.limit - Results per page (default: 20)
   * @returns {Promise<Object>} Paginated artist results
   */
  searchArtists: async (query, options = {}) => {
    if (!query || query.trim().length === 0) {
      throw new Error('Search query is required');
    }

    const params = {
      q: query.trim(),
      page: options.page || 1,
      limit: options.limit || 20,
    };

    return apiClient.get('/search/artists', { params });
  },

  /**
   * Search albums only
   * @param {string} query - Search query
   * @param {Object} filters - Additional filters
   * @param {string} filters.artist - Artist name filter
   * @param {number} filters.year - Release year filter
   * @param {number} filters.page - Page number
   * @param {number} filters.limit - Results per page (default: 20)
   * @returns {Promise<Object>} Paginated album results
   */
  searchAlbums: async (query, filters = {}) => {
    if (!query || query.trim().length === 0) {
      throw new Error('Search query is required');
    }

    const params = {
      q: query.trim(),
      page: filters.page || 1,
      limit: filters.limit || 20,
      ...(filters.artist && { artist: filters.artist }),
      ...(filters.year && { year: filters.year }),
    };

    return apiClient.get('/search/albums', { params });
  },

  /**
   * Search playlists only
   * @param {string} query - Search query
   * @param {Object} options - Search options
   * @param {boolean} options.publicOnly - Search only public playlists
   * @param {number} options.page - Page number
   * @param {number} options.limit - Results per page (default: 20)
   * @returns {Promise<Object>} Paginated playlist results
   */
  searchPlaylists: async (query, options = {}) => {
    if (!query || query.trim().length === 0) {
      throw new Error('Search query is required');
    }

    const params = {
      q: query.trim(),
      page: options.page || 1,
      limit: options.limit || 20,
      publicOnly: options.publicOnly !== false, // Default true
    };

    return apiClient.get('/search/playlists', { params });
  },

  /**
   * Get search suggestions (autocomplete)
   * @param {string} query - Partial search query
   * @param {number} limit - Number of suggestions (default: 5)
   * @returns {Promise<Array>} Search suggestions
   */
  getSuggestions: async (query, limit = 5) => {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const params = {
      q: query.trim(),
      limit,
    };

    return apiClient.get('/search/suggestions', { params });
  },

  /**
   * Get popular searches (trending searches)
   * @param {number} limit - Number of results (default: 10)
   * @returns {Promise<Array>} Popular search queries
   */
  getPopularSearches: async (limit = 10) => {
    return apiClient.get('/search/popular', {
      params: { limit },
    });
  },

  /**
   * Get user's search history
   * @param {number} limit - Number of results (default: 20)
   * @returns {Promise<Array>} User's recent searches
   */
  getSearchHistory: async (limit = 20) => {
    return apiClient.get('/search/history', {
      params: { limit },
    });
  },

  /**
   * Clear user's search history
   * @returns {Promise<Object>} Success message
   */
  clearSearchHistory: async () => {
    return apiClient.delete('/search/history');
  },

  /**
   * Delete specific search from history
   * @param {string} searchId - Search history ID
   * @returns {Promise<Object>} Success message
   */
  deleteFromHistory: async (searchId) => {
    if (!searchId) {
      throw new Error('Search ID is required');
    }
    return apiClient.delete(`/search/history/${searchId}`);
  },
};
