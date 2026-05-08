'use client';

import type { ArticleDetailSkeletonProps } from '@/shared/types';

export const ArticleDetailSkeleton = ({ className = '' }: ArticleDetailSkeletonProps) => {
  return (
    <div className={`animate-pulse ${className}`} aria-hidden="true" role="presentation">
      <div className="grid grid-cols-1 lg:grid-cols-4 mb-6">
        <div className="col-span-3">
          {/* Image Skeleton */}
          <div className="relative w-full h-[300px] md:h-[400px] mb-6 rounded-lg overflow-hidden bg-gray-200"></div>

          {/* Author Info Skeleton */}
          <div className="border-y-2 border-gray-200 py-4 flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full flex-shrink-0 bg-gray-200"></div>
            <div className="flex-1 space-y-2">
              <div className="h-5 w-32 bg-gray-200 rounded"></div>
              <div className="h-4 w-40 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <div className="h-8 w-full bg-gray-200 rounded"></div>
              <div className="h-8 w-5/6 bg-gray-200 rounded"></div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-200 my-6"></div>

            {/* Description */}
            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-4/5 bg-gray-200 rounded"></div>
            </div>

            {/* Content Paragraphs */}
            <div className="space-y-3 mt-6">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={`para-${i}`} className="space-y-2">
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                  </div>
                ))}
            </div>

            {/* Link Skeleton */}
            <div className="mt-6">
              <div className="h-5 w-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

