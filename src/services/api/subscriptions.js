import apiClient from './client';

/**
 * Subscriptions API Service
 * Handles all subscription and payment-related API calls
 */
export const subscriptionsAPI = {
  /**
   * Get all available subscription plans
   * @returns {Promise<Array>} List of subscription plans
   */
  getPlans: async () => {
    return apiClient.get('/subscriptions/plans');
  },

  /**
   * Get specific plan details
   * @param {string} planId - Plan ID
   * @returns {Promise<Object>} Plan details
   */
  getPlanById: async (planId) => {
    if (!planId) {
      throw new Error('Plan ID is required');
    }
    return apiClient.get(`/subscriptions/plans/${planId}`);
  },

  /**
   * Activate premium subscription
   * @param {Object} data - Subscription data
   * @param {string} data.planId - Selected plan ID
   * @param {string} data.paymentMethod - Payment method (card, upi, netbanking, wallet)
   * @param {Object} data.paymentDetails - Payment details
   * @param {string} data.paymentDetails.cardNumber - Card number (for card payment)
   * @param {string} data.paymentDetails.cardExpiry - Card expiry (MM/YY)
   * @param {string} data.paymentDetails.cardCvv - Card CVV
   * @param {string} data.paymentDetails.cardName - Name on card
   * @param {string} data.paymentDetails.upiId - UPI ID (for UPI payment)
   * @param {Object} data.billingAddress - Billing address
   * @returns {Promise<Object>} Payment response and subscription details
   */
  activate: async (data) => {
    if (!data.planId) {
      throw new Error('Plan ID is required');
    }
    if (!data.paymentMethod) {
      throw new Error('Payment method is required');
    }

    const requestData = {
      planId: data.planId,
      paymentMethod: data.paymentMethod,
      paymentDetails: data.paymentDetails || {},
      billingAddress: data.billingAddress || {},
    };

    return apiClient.post('/subscriptions/activate', requestData);
  },

  /**
   * Cancel active subscription
   * @param {Object} options - Cancellation options
   * @param {string} options.reason - Cancellation reason
   * @param {boolean} options.immediate - Cancel immediately or at end of period
   * @returns {Promise<Object>} Cancellation confirmation
   */
  cancel: async (options = {}) => {
    const data = {
      reason: options.reason || 'User requested',
      immediate: options.immediate || false,
    };

    return apiClient.post('/subscriptions/cancel', data);
  },

  /**
   * Reactivate cancelled subscription
   * @returns {Promise<Object>} Reactivation confirmation
   */
  reactivate: async () => {
    return apiClient.post('/subscriptions/reactivate');
  },

  /**
   * Change subscription plan
   * @param {string} newPlanId - New plan ID
   * @returns {Promise<Object>} Updated subscription
   */
  changePlan: async (newPlanId) => {
    if (!newPlanId) {
      throw new Error('New plan ID is required');
    }
    return apiClient.post('/subscriptions/change-plan', { newPlanId });
  },

  /**
   * Get payment history
   * @param {Object} options - Query options
   * @param {number} options.page - Page number (default: 1)
   * @param {number} options.limit - Items per page (default: 20)
   * @returns {Promise<Object>} Paginated payment history
   */
  getPaymentHistory: async (options = {}) => {
    const params = {
      page: options.page || 1,
      limit: options.limit || 20,
    };

    return apiClient.get('/subscriptions/history', { params });
  },

  /**
   * Get specific invoice
   * @param {string} invoiceId - Invoice ID
   * @returns {Promise<Object>} Invoice details
   */
  getInvoice: async (invoiceId) => {
    if (!invoiceId) {
      throw new Error('Invoice ID is required');
    }
    return apiClient.get(`/subscriptions/invoices/${invoiceId}`);
  },

  /**
   * Download invoice PDF
   * @param {string} invoiceId - Invoice ID
   * @returns {Promise<Blob>} PDF file
   */
  downloadInvoice: async (invoiceId) => {
    if (!invoiceId) {
      throw new Error('Invoice ID is required');
    }
    return apiClient.get(`/subscriptions/invoices/${invoiceId}/download`, {
      responseType: 'blob',
    });
  },

  /**
   * Update payment method
   * @param {Object} paymentData - New payment method data
   * @param {string} paymentData.paymentMethod - Payment method type
   * @param {Object} paymentData.paymentDetails - Payment details
   * @returns {Promise<Object>} Updated payment method
   */
  updatePaymentMethod: async (paymentData) => {
    if (!paymentData.paymentMethod) {
      throw new Error('Payment method is required');
    }

    return apiClient.put('/subscriptions/payment-method', paymentData);
  },

  /**
   * Get saved payment methods
   * @returns {Promise<Array>} List of saved payment methods
   */
  getPaymentMethods: async () => {
    return apiClient.get('/subscriptions/payment-methods');
  },

  /**
   * Delete saved payment method
   * @param {string} paymentMethodId - Payment method ID
   * @returns {Promise<Object>} Success message
   */
  deletePaymentMethod: async (paymentMethodId) => {
    if (!paymentMethodId) {
      throw new Error('Payment method ID is required');
    }
    return apiClient.delete(`/subscriptions/payment-methods/${paymentMethodId}`);
  },

  /**
   * Apply promo code
   * @param {string} promoCode - Promo code
   * @returns {Promise<Object>} Discount details
   */
  applyPromoCode: async (promoCode) => {
    if (!promoCode || promoCode.trim().length === 0) {
      throw new Error('Promo code is required');
    }
    return apiClient.post('/subscriptions/promo', {
      code: promoCode.trim().toUpperCase(),
    });
  },

  /**
   * Get billing information
   * @returns {Promise<Object>} Billing details
   */
  getBillingInfo: async () => {
    return apiClient.get('/subscriptions/billing');
  },

  /**
   * Update billing information
   * @param {Object} billingData - Billing information
   * @param {string} billingData.name - Full name
   * @param {string} billingData.email - Email
   * @param {string} billingData.phone - Phone number
   * @param {Object} billingData.address - Address
   * @param {string} billingData.address.line1 - Address line 1
   * @param {string} billingData.address.line2 - Address line 2
   * @param {string} billingData.address.city - City
   * @param {string} billingData.address.state - State
   * @param {string} billingData.address.postalCode - Postal code
   * @param {string} billingData.address.country - Country
   * @returns {Promise<Object>} Updated billing info
   */
  updateBillingInfo: async (billingData) => {
    return apiClient.put('/subscriptions/billing', billingData);
  },

  /**
   * Get subscription benefits
   * @returns {Promise<Object>} List of premium benefits
   */
  getBenefits: async () => {
    return apiClient.get('/subscriptions/benefits');
  },

  /**
   * Check subscription status
   * @returns {Promise<Object>} Current subscription status
   */
  checkStatus: async () => {
    return apiClient.get('/subscriptions/status');
  },
};
