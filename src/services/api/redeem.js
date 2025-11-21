import apiClient from './client';

/**
 * Redeem API Service
 * Handles redeem code validation and application
 */
export const redeemAPI = {
  /**
   * Validate a redeem code
   * Checks if code is valid without applying it
   * @param {string} code - Redeem code
   * @returns {Promise<Object>} Code validation result
   */
  validate: async (code) => {
    if (!code || code.trim().length === 0) {
      throw new Error('Redeem code is required');
    }

    const cleanCode = code.trim().toUpperCase();
    
    return apiClient.post('/redeem/validate', { code: cleanCode });
  },

  /**
   * Apply a redeem code to user account
   * Activates the benefits associated with the code
   * @param {string} code - Redeem code
   * @returns {Promise<Object>} Redemption result with benefits
   */
  apply: async (code) => {
    if (!code || code.trim().length === 0) {
      throw new Error('Redeem code is required');
    }

    const cleanCode = code.trim().toUpperCase();
    
    return apiClient.post('/redeem/apply', { code: cleanCode });
  },

  /**
   * Get details of a redeem code
   * Shows what benefits the code provides
   * @param {string} code - Redeem code
   * @returns {Promise<Object>} Code details (plan, duration, benefits)
   */
  getCodeDetails: async (code) => {
    if (!code || code.trim().length === 0) {
      throw new Error('Redeem code is required');
    }

    const cleanCode = code.trim().toUpperCase();
    
    return apiClient.get(`/redeem/details/${cleanCode}`);
  },

  /**
   * Get user's redeem history
   * @returns {Promise<Array>} List of previously redeemed codes
   */
  getHistory: async () => {
    return apiClient.get('/redeem/history');
  },

  /**
   * Check if user can redeem codes
   * Some plans may restrict code redemption
   * @returns {Promise<Object>} Eligibility status
   */
  checkEligibility: async () => {
    return apiClient.get('/redeem/eligibility');
  },
};
