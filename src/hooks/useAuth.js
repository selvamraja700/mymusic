import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';

/**
 * Custom hook for authentication management
 * Provides complete auth functionality with state management
 * 
 * Features:
 * - Persistent login state
 * - Automatic token validation
 * - Cross-tab synchronization
 * - Loading states
 * - Error handling
 * 
 * @returns {Object} Auth state and methods
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  /**
   * Initialize auth state from localStorage
   * Runs once on mount
   */
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Listen for storage changes (cross-tab sync)
   */
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'user' || e.key === 'token') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  /**
   * Check authentication status
   * Validates token and loads user data
   */
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (!token || !storedUser) {
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      // Parse stored user
      const userData = JSON.parse(storedUser);

      // TODO: Validate token with backend when ready
      // Uncomment when backend is connected:
      /*
      try {
        const response = await authAPI.getMe();
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
      } catch (err) {
        if (err.response?.status === 401) {
          // Token expired, try refresh
          await refreshToken();
          return;
        }
        throw err;
      }
      */

      // For now, use stored data
      setUser(userData);
      setIsAuthenticated(true);

    } catch (err) {
      console.error('Auth check failed:', err);
      setError(err.message || 'Authentication failed');
      await logout();
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresh authentication token
   */
  const refreshToken = useCallback(async () => {
    try {
      const response = await authAPI.refreshToken();
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
          setUser(response.user);
        }
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Token refresh failed:', err);
      await logout();
      return false;
    }
  }, []);

  /**
   * Login user
   * @param {Object} credentials - User credentials
   * @param {string} credentials.email - Email address
   * @param {string} credentials.password - Password
   * @param {boolean} credentials.rememberMe - Remember login
   * @returns {Promise<Object>} User data
   */
  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      // Validate inputs
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }

      // TODO: Replace with real API call when backend is ready
      // Uncomment when backend is connected:
      /*
      const response = await authAPI.login(credentials);
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      toast.success(`Welcome back, ${response.user.username}!`);
      */

      // Mock response for development
      const response = {
        token: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        user: {
          id: Date.now(),
          email: credentials.email,
          username: credentials.email.split('@')[0],
          fullName: credentials.email.split('@')[0],
          isPremium: false,
          profilePicture: null,
          createdAt: new Date().toISOString(),
        },
      };

      // Store auth data
      localStorage.setItem('token', response.token);
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }
      localStorage.setItem('user', JSON.stringify(response.user));

      setUser(response.user);
      setIsAuthenticated(true);

      toast.success(`Welcome back, ${response.user.username}!`);

      // Navigate to home
      setTimeout(() => {
        navigate('/home');
      }, 500);

      return response;

    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  /**
   * Register new user
   * @param {Object} userData - Registration data
   * @param {string} userData.email - Email address
   * @param {string} userData.password - Password
   * @param {string} userData.username - Username
   * @param {string} userData.fullName - Full name (optional)
   * @returns {Promise<Object>} User data
   */
  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);

      // Validate inputs
      if (!userData.email || !userData.password || !userData.username) {
        throw new Error('Email, username, and password are required');
      }

      // TODO: Replace with real API call when backend is ready
      // Uncomment when backend is connected:
      /*
      const response = await authAPI.register(userData);
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      toast.success('Account created successfully!');
      */

      // Mock response for development
      const response = {
        token: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        user: {
          id: Date.now(),
          email: userData.email,
          username: userData.username,
          fullName: userData.fullName || userData.username,
          isPremium: false,
          profilePicture: null,
          createdAt: new Date().toISOString(),
        },
      };

      // Store auth data
      localStorage.setItem('token', response.token);
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }
      localStorage.setItem('user', JSON.stringify(response.user));

      setUser(response.user);
      setIsAuthenticated(true);

      toast.success('Account created successfully! Welcome to TBytez Music!');

      // Navigate to home
      setTimeout(() => {
        navigate('/home');
      }, 500);

      return response;

    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  /**
   * Logout user
   * Clears all auth data and redirects to login
   */
  const logout = useCallback(async () => {
    try {
      setLoading(true);

      // TODO: Call backend logout when ready
      // Uncomment when backend is connected:
      /*
      await authAPI.logout();
      */

      // Clear all auth data
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      setUser(null);
      setIsAuthenticated(false);
      setError(null);

      toast.success('Logged out successfully');

      // Navigate to login
      navigate('/login');

    } catch (err) {
      console.error('Logout error:', err);
      
      // Clear data anyway
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      setUser(null);
      setIsAuthenticated(false);
      
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  /**
   * Update user data in state and localStorage
   * @param {Object} updates - User data updates
   */
  const updateUser = useCallback((updates) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));

    // Sync across tabs
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'user',
      newValue: JSON.stringify(updatedUser),
    }));
  }, [user]);

  /**
   * Check if user has specific role
   * @param {string} role - Role to check
   * @returns {boolean}
   */
  const hasRole = useCallback((role) => {
    if (!user || !user.roles) return false;
    return user.roles.includes(role);
  }, [user]);

  /**
   * Check if user has permission
   * @param {string} permission - Permission to check
   * @returns {boolean}
   */
  const hasPermission = useCallback((permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  }, [user]);

  /**
   * Check if user is premium
   * @returns {boolean}
   */
  const isPremium = useCallback(() => {
    if (!user) return false;
    
    // Check if premium flag is set
    if (!user.isPremium) return false;
    
    // Check if premium hasn't expired
    if (user.premiumExpiry) {
      const expiryDate = new Date(user.premiumExpiry);
      return expiryDate > new Date();
    }
    
    return true;
  }, [user]);

  return {
    // State
    user,
    loading,
    isAuthenticated,
    error,
    
    // Methods
    login,
    register,
    logout,
    checkAuth,
    refreshToken,
    updateUser,
    
    // Helpers
    hasRole,
    hasPermission,
    isPremium,
  };
};
