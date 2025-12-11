'use client';

interface FeaturedArticleSkeletonProps {
  className?: string;
}

export const FeaturedArticleSkeleton = ({ className = '' }: FeaturedArticleSkeletonProps) => {
  return (
    <div className={`animate-pulse ${className}`} aria-hidden="true" role="presentation">
      {/* Image Skeleton */}
      <div className="relative mb-6 overflow-hidden rounded-sm">
        <div className="h-[420px] md:h-[560px] w-full skeleton-shimmer relative">
          <div className="absolute top-[18px] left-[18px] bg-white rounded-sm px-3 py-3 flex items-center gap-2 shadow-sm">
            <div className="w-2 h-2 skeleton-dark rounded-full"></div>
            <div className="h-3 skeleton-dark rounded w-20"></div>
          </div>
        </div>
      </div>

      {/* Tags and Meta */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="h-6 w-20 skeleton-shimmer rounded-sm"></div>
          <div className="h-6 w-24 skeleton-shimmer rounded-sm"></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-3 w-24 skeleton-shimmer rounded"></div>
          <div className="h-3 w-16 skeleton-shimmer rounded"></div>
        </div>
      </div>

      {/* Title and CTA */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="space-y-3 flex-1">
          <div className="h-8 skeleton-shimmer rounded w-full"></div>
          <div className="h-8 skeleton-shimmer rounded w-4/5"></div>
        </div>
        <div className="h-5 skeleton-shimmer rounded w-28"></div>
      </div>
    </div>
  );
};

