'use client';

import { FiAlertCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';
import Link from 'next/link';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
  variant?: 'error' | 'warning' | 'info' | 'not-found';
  showHomeLink?: boolean;
}

export const ErrorMessage = ({ 
  message, 
  onRetry, 
  className = '',
  variant = 'error',
  showHomeLink = false
}: ErrorMessageProps) => {
  const variantClasses = {
    error: 'bg-red-50 border-red-300 text-red-900',
    warning: 'bg-yellow-50 border-yellow-300 text-yellow-900',
    info: 'bg-blue-50 border-blue-300 text-blue-900',
    'not-found': 'bg-gray-50 border-gray-300 text-gray-900',
  };

  const iconClasses = {
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
    'not-found': 'text-gray-600',
  };

  const buttonClasses = {
    error: 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white',
    warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500 text-white',
    info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white',
    'not-found': 'bg-primary hover:bg-primary/90 focus:ring-primary text-white',
  };

  const getIcon = () => {
    switch (variant) {
      case 'warning':
        return <FiAlertTriangle className={`w-6 h-6 ${iconClasses[variant]}`} />;
      case 'info':
        return <FiInfo className={`w-6 h-6 ${iconClasses[variant]}`} />;
      case 'not-found':
        return <FiAlertCircle className={`w-6 h-6 ${iconClasses[variant]}`} />;
      default:
        return <FiAlertCircle className={`w-6 h-6 ${iconClasses[variant]}`} />;
    }
  };

  return (
    <div
      className={`border-2 rounded-lg p-6 md:p-8 ${variantClasses[variant]} ${className} scroll-mt-24`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex flex-col items-center justify-center text-center">
        <div className="mb-4">
          {getIcon()}
        </div>
        <h3 className="text-lg md:text-xl font-semibold mb-2">
          {variant === 'not-found' ? 'Content Not Found' : 'Oops! Something went wrong'}
        </h3>
        <p className="text-sm md:text-base mb-4 max-w-md">{message}</p>
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className={`px-6 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 font-medium ${buttonClasses[variant]}`}
              aria-label="Retry loading content"
            >
              Try Again
            </button>
          )}
          {showHomeLink && (
            <Link
              href="/"
              className="px-6 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium"
              aria-label="Go to home page"
            >
              Go to Home
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
