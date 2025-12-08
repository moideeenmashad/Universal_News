'use client';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
  variant?: 'error' | 'warning' | 'info';
}

export const ErrorMessage = ({ 
  message, 
  onRetry, 
  className = '',
  variant = 'error'
}: ErrorMessageProps) => {
  const variantClasses = {
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const buttonClasses = {
    error: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
    info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
  };

  return (
    <div
      className={`border rounded-lg p-4 text-center ${variantClasses[variant]} ${className}`}
      role="alert"
      aria-live="polite"
    >
      <p className="mb-2 font-medium">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className={`px-4 py-2 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${buttonClasses[variant]}`}
          aria-label="Retry loading content"
        >
          Try Again
        </button>
      )}
    </div>
  );
};
