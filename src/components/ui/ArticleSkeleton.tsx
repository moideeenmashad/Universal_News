'use client';

interface ArticleSkeletonProps {
  count?: number;
  variant?: 'grid' | 'list' | 'featured';
}

export const ArticleSkeleton = ({ count = 6, variant = 'grid' }: ArticleSkeletonProps) => {
  const gridCols = variant === 'featured' ? 'lg:grid-cols-4' : 'md:grid-cols-3';
  const height = variant === 'featured' ? 'h-[580px]' : 'h-48 md:h-64';

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols} gap-5`}>
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div key={`skeleton-${i}`} className="rounded-md animate-pulse" aria-hidden="true">
            <div className={`${height} w-full bg-gray-300 rounded-sm`}></div>
            <div className="h-6 bg-gray-300 w-2/3 mt-4"></div>
            <div className="h-4 bg-gray-300 w-1/3 mt-2"></div>
          </div>
        ))}
    </div>
  );
};

