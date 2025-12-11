'use client';

interface ArticleSkeletonProps {
  count?: number;
  variant?: 'grid' | 'list' | 'featured';
  className?: string;
}

export const ArticleSkeleton = ({ count = 6, variant = 'grid', className = '' }: ArticleSkeletonProps) => {
  const gridCols = variant === 'featured' ? 'lg:grid-cols-4' : variant === 'list' ? 'md:grid-cols-2' : 'md:grid-cols-3';
  const imageHeight = variant === 'featured' ? 'h-[400px] md:h-[580px]' : 'h-48 md:h-64';

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols} gap-5 ${className}`}>
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div
            key={`skeleton-${i}`}
            className="rounded-md overflow-hidden bg-white"
            aria-hidden="true"
            role="presentation"
          >
            {/* Image Skeleton */}
            <div className={`${imageHeight} w-full skeleton-shimmer rounded-sm mb-3`}></div>
            
            {/* Title Skeleton */}
            <div className="space-y-2 mb-3">
              <div className="h-5 skeleton-shimmer rounded w-full"></div>
              <div className="h-5 skeleton-shimmer rounded w-4/5"></div>
            </div>
            
            {/* Meta Info Skeleton */}
            <div className="flex items-center gap-2">
              <div className="h-3 skeleton-shimmer rounded w-20"></div>
              <div className="h-3 skeleton-shimmer rounded w-1"></div>
              <div className="h-3 skeleton-shimmer rounded w-24"></div>
            </div>
          </div>
        ))}
    </div>
  );
};
