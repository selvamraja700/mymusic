import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TIMEOUT = 15000;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Store for request cancellation
const pendingRequests = new Map();

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add JWT token to headers
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for performance monitoring
    config.metadata = { startTime: new Date() };

    // Handle request cancellation
    const controller = new AbortController();
    config.signal = controller.signal;
    
    // Store cancel function
    const requestKey = `${config.method}-${config.url}`;
    if (pendingRequests.has(requestKey)) {
      pendingRequests.get(requestKey).abort();
    }
    pendingRequests.set(requestKey, controller);

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`🚀 [API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ [Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const duration = new Date() - response.config.metadata.startTime;

    // Remove from pending requests
    const requestKey = `${response.config.method}-${response.config.url}`;
    pendingRequests.delete(requestKey);

    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`✅ [API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        duration: `${duration}ms`,
        data: response.data,
      });
    }

    // Return data directly (unwrap response)
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Remove from pending requests
    if (originalRequest) {
      const requestKey = `${originalRequest.method}-${originalRequest.url}`;
      pendingRequests.delete(requestKey);
    }

    // Handle request cancellation
    if (axios.isCancel(error)) {
      console.log('🚫 [Request Cancelled]', error.message);
      return Promise.reject(error);
    }

    // Handle network errors
    if (!error.response) {
      console.error('🌐 [Network Error]', error);
      toast.error('Network error. Please check your internet connection.');
      return Promise.reject(error);
    }

    const { response } = error;
    const status = response?.status;
    const errorMessage = response?.data?.message || error.message;

    // Log error in development
    if (import.meta.env.DEV) {
      console.error(`❌ [API Error] ${status} ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`, {
        error: errorMessage,
        data: response?.data,
      });
    }

    // Handle different error status codes
    switch (status) {
      case 400:
        // Bad Request
        toast.error(errorMessage || 'Invalid request. Please check your input.');
        break;

      case 401:
        // Unauthorized - Token expired or invalid
        if (!originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Try to refresh token
            const refreshToken = localStorage.getItem('refreshToken');
            
            if (refreshToken) {
              const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
                refreshToken,
              });

              const { token: newToken } = response.data;
              localStorage.setItem('token', newToken);

              // Retry original request with new token
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return apiClient(originalRequest);
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
          }
        }

        // If refresh fails or no refresh token, logout
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        toast.error('Session expired. Please login again.');
        
        // Redirect to login after a short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
        break;

      case 403:
        // Forbidden
        toast.error('Access denied. You do not have permission to perform this action.');
        break;

      case 404:
        // Not Found
        toast.error(errorMessage || 'Resource not found.');
        break;

      case 409:
        // Conflict
        toast.error(errorMessage || 'A conflict occurred. This resource may already exist.');
        break;

      case 422:
        // Validation Error
        const validationErrors = response?.data?.errors;
        if (validationErrors && Array.isArray(validationErrors)) {
          validationErrors.forEach(err => {
            toast.error(err.message || err);
          });
        } else {
          toast.error(errorMessage || 'Validation failed. Please check your input.');
        }
        break;

      case 429:
        // Too Many Requests
        const retryAfter = response?.headers['retry-after'];
        const waitTime = retryAfter ? `${retryAfter} seconds` : 'a moment';
        toast.error(`Too many requests. Please wait ${waitTime} and try again.`);
        break;

      case 500:
        // Internal Server Error
        toast.error('Server error. Please try again later.');
        break;

      case 502:
        // Bad Gateway
        toast.error('Service temporarily unavailable. Please try again.');
        break;

      case 503:
        // Service Unavailable
        toast.error('Service is currently under maintenance. Please try again later.');
        break;

      case 504:
        // Gateway Timeout
        toast.error('Request timeout. Please try again.');
        break;

      default:
        // Generic error
        toast.error(errorMessage || 'An unexpected error occurred. Please try again.');
    }

    return Promise.reject(error);
  }
);

// Helper function to cancel all pending requests
export const cancelAllRequests = () => {
  pendingRequests.forEach((controller) => {
    controller.abort();
  });
  pendingRequests.clear();
};

// Helper function to cancel specific request
export const cancelRequest = (method, url) => {
  const requestKey = `${method}-${url}`;
  const controller = pendingRequests.get(requestKey);
  if (controller) {
    controller.abort();
    pendingRequests.delete(requestKey);
  }
};

export default apiClient;
