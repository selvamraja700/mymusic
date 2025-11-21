import React from 'react';
import { Toaster } from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

/**
 * Toast Component
 * Global toast notification container
 * 
 * Features:
 * - Dark/light theme support
 * - Positioned at top-right
 * - Auto-dismiss after 3 seconds
 * - Smooth animations
 * 
 * Usage:
 * import toast from 'react-hot-toast';
 * toast.success('Success message');
 * toast.error('Error message');
 * toast('Regular message');
 */
const Toast = () => {
  const { theme } = useTheme();

  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        // Default options
        duration: 3000,
        
        style: {
          background: theme === 'dark' ? '#1f2937' : '#ffffff',
          color: theme === 'dark' ? '#ffffff' : '#1f2937',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: theme === 'dark' 
            ? '0 10px 25px rgba(0, 0, 0, 0.5)' 
            : '0 10px 25px rgba(0, 0, 0, 0.1)',
          border: theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb',
        },
        
        // Success style
        success: {
          duration: 2000,
          style: {
            background: theme === 'dark' ? '#065f46' : '#d1fae5',
            color: theme === 'dark' ? '#ffffff' : '#065f46',
          },
          iconTheme: {
            primary: '#10b981',
            secondary: '#ffffff',
          },
        },
        
        // Error style
        error: {
          duration: 4000,
          style: {
            background: theme === 'dark' ? '#7f1d1d' : '#fee2e2',
            color: theme === 'dark' ? '#ffffff' : '#7f1d1d',
          },
          iconTheme: {
            primary: '#ef4444',
            secondary: '#ffffff',
          },
        },
        
        // Loading style
        loading: {
          style: {
            background: theme === 'dark' ? '#1e3a8a' : '#dbeafe',
            color: theme === 'dark' ? '#ffffff' : '#1e3a8a',
          },
          iconTheme: {
            primary: '#3b82f6',
            secondary: '#ffffff',
          },
        },
      }}
    />
  );
};

export default Toast;
