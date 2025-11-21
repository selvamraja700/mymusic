import apiClient from './client';

/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */
export const authAPI = {
  /**
   * Login user with credentials
   * @param {Object} credentials - User credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @param {boolean} credentials.rememberMe - Remember user session
   * @returns {Promise<Object>} User data and token
   */
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    
    // Store tokens if login successful
    if (response.token) {
      localStorage.setItem('token', response.token);
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
    }
    
    return response;
  },

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @param {string} userData.email - User email
   * @param {string} userData.password - User password
   * @param {string} userData.username - Username
   * @param {string} userData.fullName - Full name (optional)
   * @returns {Promise<Object>} User data and token
   */
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    
    // Store tokens if registration successful
    if (response.token) {
      localStorage.setItem('token', response.token);
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
    }
    
    return response;
  },

  /**
   * Logout current user
   * Clears all tokens and user data
   * @returns {Promise<void>}
   */
  logout: async () => {
    try {
      // Call backend logout endpoint
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call result
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  /**
   * Get current authenticated user data
   * @returns {Promise<Object>} Current user data
   */
  getMe: async () => {
    return apiClient.get('/auth/me');
  },

  /**
   * Refresh access token using refresh token
   * @returns {Promise<Object>} New tokens
   */
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await apiClient.post('/auth/refresh-token', {
      refreshToken,
    });
    
    // Update stored token
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    if (response.refreshToken) {
      localStorage.setItem('refreshToken', response.refreshToken);
    }
    
    return response;
  },

  /**
   * Request password reset email
   * @param {string} email - User email
   * @returns {Promise<Object>} Success message
   */
  forgotPassword: async (email) => {
    return apiClient.post('/auth/forgot-password', { email });
  },

  /**
   * Reset password with token
   * @param {string} token - Reset token from email
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Success message
   */
  resetPassword: async (token, newPassword) => {
    return apiClient.post('/auth/reset-password', {
      token,
      newPassword,
    });
  },

  /**
   * Verify email address
   * @param {string} token - Verification token from email
   * @returns {Promise<Object>} Success message
   */
  verifyEmail: async (token) => {
    return apiClient.post('/auth/verify-email', { token });
  },

  /**
   * Resend verification email
   * @param {string} email - User email
   * @returns {Promise<Object>} Success message
   */
  resendVerification: async (email) => {
    return apiClient.post('/auth/resend-verification', { email });
  },

  /**
   * Change password for authenticated user
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Success message
   */
  changePassword: async (currentPassword, newPassword) => {
    return apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },

  /**
   * Google OAuth login
   * @param {string} credential - Google credential token
   * @returns {Promise<Object>} User data and token
   */
  googleLogin: async (credential) => {
    const response = await apiClient.post('/auth/google', { credential });
    
    if (response.token) {
      localStorage.setItem('token', response.token);
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
    }
    
    return response;
  },

  /**
   * Facebook OAuth login
   * @param {string} accessToken - Facebook access token
   * @returns {Promise<Object>} User data and token
   */
  facebookLogin: async (accessToken) => {
    const response = await apiClient.post('/auth/facebook', { accessToken });
    
    if (response.token) {
      localStorage.setItem('token', response.token);
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
    }
    
    return response;
  },
};
