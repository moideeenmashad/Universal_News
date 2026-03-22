'use client';

import type { LoadingSpinnerProps } from '@/types';

export const LoadingSpinner = ({ size = 'md', className = '', variant = 'default' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const colorClasses = {
    default: 'border-gray-300 border-t-gray-600',
    primary: 'border-gray-200 border-t-primary',
  };

  return (
    <div
      className={`inline-block ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <div className={`animate-spin rounded-full border-2 ${colorClasses[variant]}`}></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};
