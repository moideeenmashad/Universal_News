'use client';

interface FeaturedArticleSkeletonProps {
  className?: string;
}

export const FeaturedArticleSkeleton = ({ className = '' }: FeaturedArticleSkeletonProps) => {
  return (
    <div className={`animate-pulse ${className}`} aria-hidden="true" role="presentation">
      {/* Image Skeleton */}
      <div className="relative mb-6 overflow-hidden rounded-sm">
        <div className="h-[400px] md:h-[580px] w-full skeleton-shimmer relative">
          {/* Live Badge Skeleton */}
          <div className="absolute top-[18px] left-[18px] bg-white rounded-sm px-3 py-3 flex items-center gap-2">
            <div className="w-2 h-2 skeleton-dark rounded-full"></div>
            <div className="h-3 skeleton-dark rounded w-20"></div>
          </div>
        </div>
      </div>

      {/* Date Skeleton */}
      <div className="flex justify-end mb-3">
        <div className="h-3 skeleton-shimmer rounded w-32"></div>
      </div>

      {/* Title and Link Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-3 space-y-3">
          <div className="h-8 skeleton-shimmer rounded w-full"></div>
          <div className="h-8 skeleton-shimmer rounded w-3/4"></div>
        </div>
        <div className="flex items-start justify-end">
          <div className="h-5 skeleton-shimmer rounded w-24"></div>
        </div>
      </div>
    </div>
  );
};

