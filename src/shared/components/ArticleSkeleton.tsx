'use client';

import type { ArticleSkeletonProps } from '@/shared/types';

export const ArticleSkeleton = ({ count = 6, variant = 'grid', className = '' }: ArticleSkeletonProps) => {
  const gridCols = variant === 'featured' ? 'lg:grid-cols-4' : variant === 'list' ? 'md:grid-cols-2' : 'md:grid-cols-3';
  const imageHeight = variant === 'featured' ? 'h-[400px] md:h-[580px]' : 'h-48 md:h-64';

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols} gap-5 ${className} animate-pulse`}>
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
            <div className={`${imageHeight} w-full rounded-sm mb-3 bg-gray-200`}></div>
            
            {/* Title Skeleton */}
            <div className="space-y-2 mb-3">
              <div className="h-5 w-full bg-gray-200 rounded"></div>
              <div className="h-5 w-4/5 bg-gray-200 rounded"></div>
            </div>
            
            {/* Meta Info Skeleton */}
            <div className="flex items-center gap-2">
              <div className="h-3 w-20 bg-gray-200 rounded"></div>
              <div className="h-3 w-1 bg-gray-200 rounded"></div>
              <div className="h-3 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
    </div>
  );
};
