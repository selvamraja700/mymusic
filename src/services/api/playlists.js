import apiClient from './client';

/**
 * Playlists API Service
 * Handles all playlist-related API calls
 */
export const playlistsAPI = {
  /**
   * Get user's playlists
   * @param {Object} options - Query options
   * @param {boolean} options.includeCollaborative - Include collaborative playlists
   * @param {boolean} options.includeFollowed - Include followed playlists
   * @returns {Promise<Array>} User's playlists
   */
  getUserPlaylists: async (options = {}) => {
    const params = {
      includeCollaborative: options.includeCollaborative !== false,
      includeFollowed: options.includeFollowed !== false,
    };

    return apiClient.get('/playlists', { params });
  },

  /**
   * Get single playlist by ID
   * @param {string} id - Playlist ID
   * @returns {Promise<Object>} Playlist details with songs
   */
  getById: async (id) => {
    if (!id) {
      throw new Error('Playlist ID is required');
    }
    return apiClient.get(`/playlists/${id}`);
  },

  /**
   * Create new playlist
   * @param {Object} data - Playlist data
   * @param {string} data.name - Playlist name (required)
   * @param {string} data.description - Playlist description
   * @param {boolean} data.isPublic - Public/private (default: false)
   * @param {string} data.coverImage - Cover image URL
   * @returns {Promise<Object>} Created playlist
   */
  create: async (data) => {
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Playlist name is required');
    }

    const playlistData = {
      name: data.name.trim(),
      description: data.description?.trim() || '',
      isPublic: data.isPublic || false,
      coverImage: data.coverImage || null,
    };

    return apiClient.post('/playlists', playlistData);
  },

  /**
   * Update playlist details
   * @param {string} id - Playlist ID
   * @param {Object} data - Updated data
   * @param {string} data.name - New name
   * @param {string} data.description - New description
   * @param {boolean} data.isPublic - Public/private
   * @param {string} data.coverImage - Cover image URL
   * @returns {Promise<Object>} Updated playlist
   */
  update: async (id, data) => {
    if (!id) {
      throw new Error('Playlist ID is required');
    }

    const updateData = {};
    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.description !== undefined) updateData.description = data.description.trim();
    if (data.isPublic !== undefined) updateData.isPublic = data.isPublic;
    if (data.coverImage !== undefined) updateData.coverImage = data.coverImage;

    return apiClient.put(`/playlists/${id}`, updateData);
  },

  /**
   * Delete playlist
   * @param {string} id - Playlist ID
   * @returns {Promise<Object>} Success message
   */
  delete: async (id) => {
    if (!id) {
      throw new Error('Playlist ID is required');
    }
    return apiClient.delete(`/playlists/${id}`);
  },

  /**
   * Add song to playlist
   * @param {string} playlistId - Playlist ID
   * @param {string} songId - Song ID
   * @param {number} position - Insert position (optional, default: end)
   * @returns {Promise<Object>} Updated playlist
   */
  addSong: async (playlistId, songId, position = null) => {
    if (!playlistId || !songId) {
      throw new Error('Playlist ID and Song ID are required');
    }

    const data = { songId };
    if (position !== null) {
      data.position = position;
    }

    return apiClient.post(`/playlists/${playlistId}/songs`, data);
  },

  /**
   * Add multiple songs to playlist
   * @param {string} playlistId - Playlist ID
   * @param {Array<string>} songIds - Array of song IDs
   * @returns {Promise<Object>} Updated playlist
   */
  addSongs: async (playlistId, songIds) => {
    if (!playlistId || !songIds || songIds.length === 0) {
      throw new Error('Playlist ID and at least one Song ID are required');
    }

    return apiClient.post(`/playlists/${playlistId}/songs/bulk`, {
      songIds,
    });
  },

  /**
   * Remove song from playlist
   * @param {string} playlistId - Playlist ID
   * @param {string} songId - Song ID
   * @returns {Promise<Object>} Updated playlist
   */
  removeSong: async (playlistId, songId) => {
    if (!playlistId || !songId) {
      throw new Error('Playlist ID and Song ID are required');
    }
    return apiClient.delete(`/playlists/${playlistId}/songs/${songId}`);
  },

  /**
   * Reorder songs in playlist
   * @param {string} playlistId - Playlist ID
   * @param {Array<string>} songIds - Ordered array of song IDs
   * @returns {Promise<Object>} Updated playlist
   */
  reorderSongs: async (playlistId, songIds) => {
    if (!playlistId || !songIds || songIds.length === 0) {
      throw new Error('Playlist ID and song order are required');
    }

    return apiClient.put(`/playlists/${playlistId}/reorder`, {
      songIds,
    });
  },

  /**
   * Follow/subscribe to a playlist
   * @param {string} playlistId - Playlist ID
   * @returns {Promise<Object>} Success message
   */
  follow: async (playlistId) => {
    if (!playlistId) {
      throw new Error('Playlist ID is required');
    }
    return apiClient.post(`/playlists/${playlistId}/follow`);
  },

  /**
   * Unfollow a playlist
   * @param {string} playlistId - Playlist ID
   * @returns {Promise<Object>} Success message
   */
  unfollow: async (playlistId) => {
    if (!playlistId) {
      throw new Error('Playlist ID is required');
    }
    return apiClient.delete(`/playlists/${playlistId}/follow`);
  },

  /**
   * Get playlist followers
   * @param {string} playlistId - Playlist ID
   * @returns {Promise<Array>} List of followers
   */
  getFollowers: async (playlistId) => {
    if (!playlistId) {
      throw new Error('Playlist ID is required');
    }
    return apiClient.get(`/playlists/${playlistId}/followers`);
  },

  /**
   * Add collaborator to playlist
   * @param {string} playlistId - Playlist ID
   * @param {string} userId - User ID to add as collaborator
   * @returns {Promise<Object>} Updated playlist
   */
  addCollaborator: async (playlistId, userId) => {
    if (!playlistId || !userId) {
      throw new Error('Playlist ID and User ID are required');
    }
    return apiClient.post(`/playlists/${playlistId}/collaborators`, {
      userId,
    });
  },

  /**
   * Remove collaborator from playlist
   * @param {string} playlistId - Playlist ID
   * @param {string} userId - User ID to remove
   * @returns {Promise<Object>} Updated playlist
   */
  removeCollaborator: async (playlistId, userId) => {
    if (!playlistId || !userId) {
      throw new Error('Playlist ID and User ID are required');
    }
    return apiClient.delete(`/playlists/${playlistId}/collaborators/${userId}`);
  },
};
