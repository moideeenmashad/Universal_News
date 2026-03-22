'use client';

import type { FeaturedArticleSkeletonProps } from '@/types';

export const FeaturedArticleSkeleton = ({ className = '' }: FeaturedArticleSkeletonProps) => {
  return (
    <div className={`animate-pulse ${className}`} aria-hidden="true" role="presentation">
      {/* Image Skeleton */}
      <div className="relative mb-6 overflow-hidden rounded-sm">
        <div className="h-[280px] sm:h-[320px] md:h-[420px] lg:h-[560px] w-full relative bg-gray-200">
          <div className="absolute top-[18px] left-[18px] bg-white rounded-sm px-3 py-3 flex items-center gap-2 shadow-sm">
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="h-3 bg-gray-300 rounded w-20"></div>
          </div>
        </div>
      </div>

      {/* Tags and Meta */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="h-6 w-20 rounded-sm bg-gray-200"></div>
          <div className="h-6 w-24 rounded-sm bg-gray-200"></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-3 w-24 bg-gray-200 rounded"></div>
          <div className="h-3 w-16 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Title and CTA */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="space-y-3 flex-1">
          <div className="h-8 w-full bg-gray-200 rounded"></div>
          <div className="h-8 w-4/5 bg-gray-200 rounded"></div>
        </div>
        <div className="h-5 w-28 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

