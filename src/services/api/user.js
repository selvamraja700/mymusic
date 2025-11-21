import apiClient from './client';

/**
 * User API Service
 * Handles all user-related API calls
 */
export const userAPI = {
  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile data
   */
  getProfile: async () => {
    return apiClient.get('/users/profile');
  },

  /**
   * Update user profile
   * @param {Object} data - Profile data to update
   * @param {string} data.username - Username
   * @param {string} data.fullName - Full name
   * @param {string} data.bio - User bio
   * @param {string} data.country - Country
   * @param {string} data.dateOfBirth - Date of birth (YYYY-MM-DD)
   * @param {string} data.gender - Gender
   * @returns {Promise<Object>} Updated profile
   */
  updateProfile: async (data) => {
    const updateData = {};
    
    if (data.username) updateData.username = data.username.trim();
    if (data.fullName) updateData.fullName = data.fullName.trim();
    if (data.bio !== undefined) updateData.bio = data.bio.trim();
    if (data.country) updateData.country = data.country;
    if (data.dateOfBirth) updateData.dateOfBirth = data.dateOfBirth;
    if (data.gender) updateData.gender = data.gender;

    return apiClient.put('/users/profile', updateData);
  },

  /**
   * Upload profile picture
   * @param {File} file - Image file
   * @returns {Promise<Object>} Updated profile with new image URL
   */
  uploadProfilePicture: async (file) => {
    if (!file) {
      throw new Error('File is required');
    }

    const formData = new FormData();
    formData.append('profilePicture', file);

    return apiClient.post('/users/profile/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Delete profile picture
   * @returns {Promise<Object>} Success message
   */
  deleteProfilePicture: async () => {
    return apiClient.delete('/users/profile/picture');
  },

  /**
   * Get user's liked songs
   * @param {Object} options - Query options
   * @param {number} options.page - Page number (default: 1)
   * @param {number} options.limit - Items per page (default: 20)
   * @param {string} options.sort - Sort by (likedAt, title, artist)
   * @param {string} options.order - Sort order (asc, desc)
   * @returns {Promise<Object>} Paginated liked songs
   */
  getLikedSongs: async (options = {}) => {
    const params = {
      page: options.page || 1,
      limit: options.limit || 20,
      sort: options.sort || 'likedAt',
      order: options.order || 'desc',
    };

    return apiClient.get('/users/songs/liked', { params });
  },

  /**
   * Like a song
   * @param {string} songId - Song ID
   * @returns {Promise<Object>} Success message
   */
  likeSong: async (songId) => {
    if (!songId) {
      throw new Error('Song ID is required');
    }
    return apiClient.post(`/users/songs/like/${songId}`);
  },

  /**
   * Unlike a song
   * @param {string} songId - Song ID
   * @returns {Promise<Object>} Success message
   */
  unlikeSong: async (songId) => {
    if (!songId) {
      throw new Error('Song ID is required');
    }
    return apiClient.delete(`/users/songs/like/${songId}`);
  },

  /**
   * Check if songs are liked (bulk check)
   * @param {Array<string>} songIds - Array of song IDs
   * @returns {Promise<Object>} Object with songId as key, boolean as value
   */
  checkLikedSongs: async (songIds) => {
    if (!songIds || songIds.length === 0) {
      return {};
    }
    return apiClient.post('/users/songs/liked/check', { songIds });
  },

  /**
   * Get user's listening history
   * @param {Object} options - Query options
   * @param {number} options.page - Page number (default: 1)
   * @param {number} options.limit - Items per page (default: 50)
   * @param {string} options.startDate - Start date (YYYY-MM-DD)
   * @param {string} options.endDate - End date (YYYY-MM-DD)
   * @returns {Promise<Object>} Paginated listening history
   */
  getListeningHistory: async (options = {}) => {
    const params = {
      page: options.page || 1,
      limit: options.limit || 50,
    };

    if (options.startDate) params.startDate = options.startDate;
    if (options.endDate) params.endDate = options.endDate;

    return apiClient.get('/users/history', { params });
  },

  /**
   * Clear listening history
   * @returns {Promise<Object>} Success message
   */
  clearListeningHistory: async () => {
    return apiClient.delete('/users/history');
  },

  /**
   * Get user's subscription info
   * @returns {Promise<Object>} Subscription details
   */
  getSubscription: async () => {
    return apiClient.get('/users/subscription');
  },

  /**
   * Get user preferences
   * @returns {Promise<Object>} User preferences
   */
  getPreferences: async () => {
    return apiClient.get('/users/preferences');
  },

  /**
   * Update user preferences
   * @param {Object} preferences - Preferences to update
   * @param {boolean} preferences.explicitContent - Allow explicit content
   * @param {string} preferences.audioQuality - Audio quality (low, normal, high, very_high)
   * @param {boolean} preferences.downloadQuality - Download quality
   * @param {boolean} preferences.autoplay - Enable autoplay
   * @param {boolean} preferences.crossfade - Enable crossfade
   * @param {number} preferences.crossfadeDuration - Crossfade duration (seconds)
   * @param {boolean} preferences.notifications - Enable notifications
   * @param {string} preferences.language - Language preference
   * @returns {Promise<Object>} Updated preferences
   */
  updatePreferences: async (preferences) => {
    return apiClient.put('/users/preferences', preferences);
  },

  /**
   * Get followed artists
   * @returns {Promise<Array>} List of followed artists
   */
  getFollowedArtists: async () => {
    return apiClient.get('/users/following/artists');
  },

  /**
   * Follow an artist
   * @param {string} artistId - Artist ID
   * @returns {Promise<Object>} Success message
   */
  followArtist: async (artistId) => {
    if (!artistId) {
      throw new Error('Artist ID is required');
    }
    return apiClient.post(`/users/following/artists/${artistId}`);
  },

  /**
   * Unfollow an artist
   * @param {string} artistId - Artist ID
   * @returns {Promise<Object>} Success message
   */
  unfollowArtist: async (artistId) => {
    if (!artistId) {
      throw new Error('Artist ID is required');
    }
    return apiClient.delete(`/users/following/artists/${artistId}`);
  },

  /**
   * Get followed users
   * @returns {Promise<Array>} List of followed users
   */
  getFollowedUsers: async () => {
    return apiClient.get('/users/following/users');
  },

  /**
   * Follow a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Success message
   */
  followUser: async (userId) => {
    if (!userId) {
      throw new Error('User ID is required');
    }
    return apiClient.post(`/users/following/users/${userId}`);
  },

  /**
   * Unfollow a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Success message
   */
  unfollowUser: async (userId) => {
    if (!userId) {
      throw new Error('User ID is required');
    }
    return apiClient.delete(`/users/following/users/${userId}`);
  },

  /**
   * Get user's followers
   * @returns {Promise<Array>} List of followers
   */
  getFollowers: async () => {
    return apiClient.get('/users/followers');
  },

  /**
   * Get user statistics
   * @returns {Promise<Object>} User stats (total plays, top artists, etc.)
   */
  getStatistics: async () => {
    return apiClient.get('/users/statistics');
  },

  /**
   * Get top artists for user
   * @param {Object} options - Options
   * @param {string} options.timeRange - Time range (week, month, 6months, year, all)
   * @param {number} options.limit - Number of artists (default: 10)
   * @returns {Promise<Array>} Top artists
   */
  getTopArtists: async (options = {}) => {
    const params = {
      timeRange: options.timeRange || 'month',
      limit: options.limit || 10,
    };
    return apiClient.get('/users/top/artists', { params });
  },

  /**
   * Get top songs for user
   * @param {Object} options - Options
   * @param {string} options.timeRange - Time range
   * @param {number} options.limit - Number of songs (default: 10)
   * @returns {Promise<Array>} Top songs
   */
  getTopSongs: async (options = {}) => {
    const params = {
      timeRange: options.timeRange || 'month',
      limit: options.limit || 10,
    };
    return apiClient.get('/users/top/songs', { params });
  },

  /**
   * Delete user account
   * @param {string} password - Current password for confirmation
   * @returns {Promise<Object>} Success message
   */
  deleteAccount: async (password) => {
    if (!password) {
      throw new Error('Password is required to delete account');
    }
    return apiClient.post('/users/account/delete', { password });
  },

  /**
   * Export user data (GDPR compliance)
   * @returns {Promise<Object>} Download link or data
   */
  exportData: async () => {
    return apiClient.get('/users/export');
  },
};
