import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for data fetching
 * Handles loading, error, and success states automatically
 * 
 * Features:
 * - Automatic cleanup on unmount
 * - Request cancellation
 * - Refetch capability
 * - Dependency-based refetching
 * - Error handling
 * 
 * @param {Function} fetchFn - Async function that fetches data
 * @param {Array} dependencies - Dependencies that trigger refetch
 * @param {Object} options - Additional options
 * @returns {Object} Fetch state and methods
 */
export const useFetch = (fetchFn, dependencies = [], options = {}) => {
  const [data, setData] = useState(options.initialData || null);
  const [loading, setLoading] = useState(!options.lazy);
  const [error, setError] = useState(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef(null);

  /**
   * Fetch data
   */
  const fetchData = useCallback(async () => {
    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      // Call fetch function with abort signal
      const result = await fetchFn({
        signal: abortControllerRef.current.signal,
      });

      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setData(result);
        setIsFirstLoad(false);
        
        // Call success callback if provided
        if (options.onSuccess) {
          options.onSuccess(result);
        }
      }

      return result;

    } catch (err) {
      // Ignore abort errors
      if (err.name === 'AbortError') {
        return;
      }

      console.error('Fetch error:', err);

      if (isMountedRef.current) {
        const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
        setError(errorMessage);
        
        // Call error callback if provided
        if (options.onError) {
          options.onError(err);
        }
      }

      throw err;

    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [fetchFn, options]);

  /**
   * Refetch data manually
   */
  const refetch = useCallback(async () => {
    return fetchData();
  }, [fetchData]);

  /**
   * Reset to initial state
   */
  const reset = useCallback(() => {
    setData(options.initialData || null);
    setError(null);
    setLoading(false);
    setIsFirstLoad(true);
  }, [options.initialData]);

  /**
   * Fetch on mount or when dependencies change
   */
  useEffect(() => {
    // Skip if lazy loading is enabled and it's the first load
    if (options.lazy && isFirstLoad) {
      return;
    }

    fetchData();

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, dependencies);

  /**
   * Update mounted ref
   */
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    data,
    loading,
    error,
    isFirstLoad,
    refetch,
    reset,
    isSuccess: !loading && !error && data !== null,
    isError: !loading && error !== null,
  };
};
