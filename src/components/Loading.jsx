import React from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * Loading Component
 * Reusable loading indicator with multiple variants
 * 
 * @param {string} variant - Type of loader (spinner, dots, skeleton)
 * @param {string} size - Size (sm, md, lg)
 * @param {string} text - Optional loading text
 */
const Loading = ({ variant = 'spinner', size = 'md', text = '' }) => {
  const { theme } = useTheme();

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  if (variant === 'spinner') {
    return (
      <div className="flex flex-col items-center justify-center gap-3">
        <div className={`${sizeClasses[size]} relative`}>
          <div
            className={`absolute inset-0 border-4 rounded-full ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
            }`}
          />
          <div
            className={`absolute inset-0 border-4 border-transparent border-t-green-500 rounded-full animate-spin`}
          />
        </div>
        {text && (
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full bg-green-500 animate-bounce`}
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
        {text && (
          <p className={`ml-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'skeleton') {
    return (
      <div className="space-y-3 w-full">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-4 rounded animate-pulse ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
            }`}
            style={{ width: `${100 - i * 10}%` }}
          />
        ))}
      </div>
    );
  }

  return null;
};

export default Loading;
