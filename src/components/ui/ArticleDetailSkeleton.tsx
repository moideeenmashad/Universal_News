'use client';

interface ArticleDetailSkeletonProps {
  className?: string;
}

export const ArticleDetailSkeleton = ({ className = '' }: ArticleDetailSkeletonProps) => {
  return (
    <div className={`animate-pulse ${className}`} aria-hidden="true" role="presentation">
      <div className="grid grid-cols-1 lg:grid-cols-4 mb-6">
        <div className="col-span-3">
          {/* Image Skeleton */}
          <div className="relative w-full h-[300px] md:h-[400px] mb-6 rounded-lg overflow-hidden">
            <div className="w-full h-full skeleton-shimmer"></div>
          </div>

          {/* Author Info Skeleton */}
          <div className="border-y-2 border-gray-200 py-4 flex items-center gap-3 mb-6">
            <div className="w-10 h-10 skeleton-shimmer rounded-full flex-shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-5 skeleton-shimmer rounded w-32"></div>
              <div className="h-4 skeleton-shimmer rounded w-40"></div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <div className="h-8 skeleton-shimmer rounded w-full"></div>
              <div className="h-8 skeleton-shimmer rounded w-5/6"></div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-200 my-6"></div>

            {/* Description */}
            <div className="space-y-3">
              <div className="h-4 skeleton-shimmer rounded w-full"></div>
              <div className="h-4 skeleton-shimmer rounded w-full"></div>
              <div className="h-4 skeleton-shimmer rounded w-4/5"></div>
            </div>

            {/* Content Paragraphs */}
            <div className="space-y-3 mt-6">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={`para-${i}`} className="space-y-2">
                    <div className="h-4 skeleton-shimmer rounded w-full"></div>
                    <div className="h-4 skeleton-shimmer rounded w-full"></div>
                    <div className="h-4 skeleton-shimmer rounded w-3/4"></div>
                  </div>
                ))}
            </div>

            {/* Link Skeleton */}
            <div className="mt-6">
              <div className="h-5 skeleton-shimmer rounded w-64"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

