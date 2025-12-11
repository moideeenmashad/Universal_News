'use client';

interface TextSkeletonProps {
  lines?: number;
  className?: string;
  width?: 'full' | '3/4' | '2/3' | '1/2' | '1/3';
}

export const TextSkeleton = ({ lines = 3, className = '', width = 'full' }: TextSkeletonProps) => {
  const widthClass = {
    full: 'w-full',
    '3/4': 'w-3/4',
    '2/3': 'w-2/3',
    '1/2': 'w-1/2',
    '1/3': 'w-1/3',
  }[width];

  return (
    <div className={`space-y-2 ${className}`} aria-hidden="true" role="presentation">
      {Array(lines)
        .fill(0)
        .map((_, i) => (
          <div
            key={`text-skeleton-${i}`}
            className={`h-4 skeleton-shimmer rounded ${i === lines - 1 ? widthClass : 'w-full'}`}
          ></div>
        ))}
    </div>
  );
};

