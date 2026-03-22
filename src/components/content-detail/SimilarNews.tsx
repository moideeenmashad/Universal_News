'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatDate, getArticleUrl, sanitizeTitle } from '@/lib/utils';
import type { SimilarNewsProps } from '@/types';

export const SimilarNews = ({ articles, category, isLoading = false }: SimilarNewsProps) => {
  if (isLoading) {
    return (
      <section className="mx-auto max-w-screen-xl px-4 md:px-0 py-8 mt-12 border-t border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-4 md:gap-4">
          {[0, 1, 2].map((i) => (
            <div key={`similar-skeleton-${i}`} className="flex flex-col" aria-hidden="true">
              {/* Image Skeleton */}
              <div className="relative w-full h-[180px] sm:h-[200px] mb-3 overflow-hidden rounded-sm bg-gray-200 animate-pulse"></div>
              
              {/* Content Skeleton */}
              <div className="flex flex-col px-1">
                {/* Author/Date Skeleton */}
                <div className="flex flex-wrap items-center mb-2 gap-1">
                  <div className="h-3 w-24 bg-gray-200 animate-pulse rounded"></div>
                  <div className="hidden sm:block h-3 w-1 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-3 w-20 bg-gray-200 animate-pulse rounded"></div>
                </div>
                
                {/* Title Skeleton */}
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 w-5/6 bg-gray-200 animate-pulse rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-screen-xl px-4 md:px-0 py-8">
      <h2 className="text-xl sm:text-2xl md:text-3xl text-primary uppercase mb-4 md:mb-6">Similar News</h2>
      <div className="border-b border-black mb-4 md:mb-6"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-4 md:gap-4 [&>a]:flex [&>a]:flex-col [&>a]:group [&>a]:focus:outline-none [&>a]:focus-visible:outline-2 [&>a]:focus-visible:outline-[#E63946] [&>a]:focus-visible:outline-offset-2 [&>a]:rounded-md [&_img]:object-cover [&_img]:group-hover:scale-110 [&_img]:ease-in-out [&_img]:transition-transform [&_img]:duration-500">
        {articles.map((article, index) => {
          const articleUrl = getArticleUrl(article, category);

          return (
            <Link
              key={article.url || `similar-${index}`}
              href={articleUrl}
            >
              <div className="relative w-full h-[180px] sm:h-[200px] mb-3 overflow-hidden rounded-sm shadow-sm group-hover:shadow-md transition-shadow duration-300">
                {article.urlToImage ? (
                  <Image
                    src={article.urlToImage}
                    alt={article.title || 'News thumbnail'}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No Image</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col px-1">
                <p className="text-xs text-primary/70 flex flex-wrap items-center mb-2 gap-1">
                  <span className="truncate max-w-[120px] sm:max-w-none">{sanitizeTitle(article.author || 'Unknown Author')}</span>
                  <span className="hidden sm:inline">—</span>
                  <span className="whitespace-nowrap">{article.publishedAt ? formatDate(article.publishedAt, 'MMM d, yyyy') : 'Date Unavailable'}</span>
                </p>
                <h3 className="text-sm sm:text-base leading-tight text-gray-900 line-clamp-2">
                  {article.title || 'Untitled'}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

