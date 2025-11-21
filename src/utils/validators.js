import { REGEX, LIMITS } from './constants';

/**
 * Validation Utilities
 * Provides validation functions for forms and inputs
 */

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validateEmail = (email) => {
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: 'Email is required' };
  }

  if (!REGEX.EMAIL.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate password
 * Requirements: At least 8 characters, 1 uppercase, 1 lowercase, 1 number
 * @param {string} password - Password to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validatePassword = (password) => {
  if (!password || password.length === 0) {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters' };
  }

  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }

  if (!/\d/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate username
 * Requirements: 3-20 characters, alphanumeric and underscore only
 * @param {string} username - Username to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validateUsername = (username) => {
  if (!username || username.trim().length === 0) {
    return { isValid: false, error: 'Username is required' };
  }

  if (username.length < 3) {
    return { isValid: false, error: 'Username must be at least 3 characters' };
  }

  if (username.length > 20) {
    return { isValid: false, error: 'Username must be less than 20 characters' };
  }

  if (!REGEX.USERNAME.test(username)) {
    return { isValid: false, error: 'Username can only contain letters, numbers, and underscores' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate phone number (Indian format)
 * @param {string} phone - Phone number to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validatePhone = (phone) => {
  if (!phone || phone.trim().length === 0) {
    return { isValid: false, error: 'Phone number is required' };
  }

  const cleanPhone = phone.replace(/\D/g, '');

  if (!REGEX.PHONE.test(cleanPhone)) {
    return { isValid: false, error: 'Invalid Indian phone number' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate UPI ID
 * @param {string} upiId - UPI ID to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validateUPI = (upiId) => {
  if (!upiId || upiId.trim().length === 0) {
    return { isValid: false, error: 'UPI ID is required' };
  }

  if (!REGEX.UPI_ID.test(upiId)) {
    return { isValid: false, error: 'Invalid UPI ID format' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate playlist name
 * @param {string} name - Playlist name to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validatePlaylistName = (name) => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Playlist name is required' };
  }

  if (name.length > LIMITS.MAX_PLAYLIST_NAME_LENGTH) {
    return { isValid: false, error: `Playlist name must be less than ${LIMITS.MAX_PLAYLIST_NAME_LENGTH} characters` };
  }

  return { isValid: true, error: null };
};

/**
 * Validate playlist description
 * @param {string} description - Playlist description to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validatePlaylistDescription = (description) => {
  if (!description) {
    return { isValid: true, error: null }; // Description is optional
  }

  if (description.length > LIMITS.MAX_PLAYLIST_DESCRIPTION_LENGTH) {
    return { isValid: false, error: `Description must be less than ${LIMITS.MAX_PLAYLIST_DESCRIPTION_LENGTH} characters` };
  }

  return { isValid: true, error: null };
};

/**
 * Validate image file
 * @param {File} file - Image file to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validateImageFile = (file) => {
  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }

  if (!LIMITS.ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { isValid: false, error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed' };
  }

  if (file.size > LIMITS.MAX_FILE_SIZE) {
    return { isValid: false, error: `File size must be less than ${LIMITS.MAX_FILE_SIZE / (1024 * 1024)}MB` };
  }

  return { isValid: true, error: null };
};

/**
 * Validate credit card number (Luhn algorithm)
 * @param {string} cardNumber - Card number to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validateCardNumber = (cardNumber) => {
  if (!cardNumber || cardNumber.trim().length === 0) {
    return { isValid: false, error: 'Card number is required' };
  }

  const cleanNumber = cardNumber.replace(/\D/g, '');

  if (cleanNumber.length < 13 || cleanNumber.length > 19) {
    return { isValid: false, error: 'Invalid card number length' };
  }

  // Luhn algorithm
  let sum = 0;
  let isEven = false;

  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  if (sum % 10 !== 0) {
    return { isValid: false, error: 'Invalid card number' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate card expiry date
 * @param {string} expiry - Expiry date (MM/YY format)
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validateCardExpiry = (expiry) => {
  if (!expiry || expiry.trim().length === 0) {
    return { isValid: false, error: 'Expiry date is required' };
  }

  const parts = expiry.split('/');
  if (parts.length !== 2) {
    return { isValid: false, error: 'Invalid expiry format. Use MM/YY' };
  }

  const month = parseInt(parts[0], 10);
  const year = parseInt('20' + parts[1], 10);

  if (month < 1 || month > 12) {
    return { isValid: false, error: 'Invalid month' };
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return { isValid: false, error: 'Card has expired' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate CVV
 * @param {string} cvv - CVV to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validateCVV = (cvv) => {
  if (!cvv || cvv.trim().length === 0) {
    return { isValid: false, error: 'CVV is required' };
  }

  if (!/^\d{3,4}$/.test(cvv)) {
    return { isValid: false, error: 'Invalid CVV' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate redeem code
 * @param {string} code - Redeem code to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validateRedeemCode = (code) => {
  if (!code || code.trim().length === 0) {
    return { isValid: false, error: 'Redeem code is required' };
  }

  const cleanCode = code.trim().toUpperCase();

  if (cleanCode.length < 6 || cleanCode.length > 20) {
    return { isValid: false, error: 'Invalid code length' };
  }

  if (!/^[A-Z0-9-]+$/.test(cleanCode)) {
    return { isValid: false, error: 'Invalid code format' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate full form (multiple fields)
 * @param {Object} fields - Object with field names and values
 * @param {Object} rules - Object with field names and validation functions
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export const validateForm = (fields, rules) => {
  const errors = {};
  let isValid = true;

  Object.keys(rules).forEach((fieldName) => {
    const value = fields[fieldName];
    const validationFn = rules[fieldName];
    const result = validationFn(value);

    if (!result.isValid) {
      errors[fieldName] = result.error;
      isValid = false;
    }
  });

  return { isValid, errors };
};

export default {
  validateEmail,
  validatePassword,
  validateUsername,
  validatePhone,
  validateUPI,
  validatePlaylistName,
  validatePlaylistDescription,
  validateImageFile,
  validateCardNumber,
  validateCardExpiry,
  validateCVV,
  validateRedeemCode,
  validateForm,
};
