'use client';

import { formatDate } from '@/src/lib/utils/date';
import Link from 'next/link';
import Image from 'next/image';
import { BsDashLg } from 'react-icons/bs';
import { slugify } from '@/src/lib/utils/string';
import { sanitizeTitle, isValidArticle } from '@/src/lib/utils/validation';
import type { NewsArticle } from '@/src/types/news';
import { ArticleSkeleton } from '../ui/ArticleSkeleton';
import { ErrorMessage } from '../ui/ErrorMessage';

interface NewsListProps {
  title: string;
  articles: NewsArticle[];
  loading: boolean;
  error: string | null;
  lastArticleRef: React.RefObject<HTMLDivElement>;
  hasMore: boolean;
  category: string;
}

const MAX_TITLE_LENGTH = 60;

export const NewsList = ({
  title,
  articles,
  loading,
  error,
  lastArticleRef,
  hasMore,
  category,
}: NewsListProps) => {
  const isInitialLoad = articles.length === 0 && loading;
  const validArticles = articles.filter(isValidArticle);

  const truncateTitle = (title: string): string => {
    const sanitized = sanitizeTitle(title);
    return sanitized.length > MAX_TITLE_LENGTH
      ? sanitized.slice(0, MAX_TITLE_LENGTH) + '...'
      : sanitized;
  };

  const formatAuthor = (author: string | undefined): string => {
    if (!author || author.trim() === '') return 'Unknown';
    return sanitizeTitle(author);
  };


  return (
    <section className="mx-auto max-w-screen-xl mb-[100px] px-4 md:px-0" aria-label={title}>
      <div className="news-list-container mx-auto max-w-screen-xl">
        <div className="flex items-center justify-between border-b border-primary pb-3 mb-10">
          <h2 className="text-2xl md:text-4xl font-medium text-primary uppercase">{title}</h2>
        </div>

        {error && <ErrorMessage message={error} className="mb-5" />}

        {isInitialLoad ? (
          <ArticleSkeleton count={6} />
        ) : validArticles.length === 0 && !loading ? (
          <div className="text-center py-12" role="status">
            <p className="text-gray-600 text-lg">No articles found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {validArticles.map((article, index) => {
              const isLast = index === validArticles.length - 1;
              const articleSlug = slugify(article.title);
              const articleUrl = `/${category}/${articleSlug}`;

              return (
                <article
                  key={article.url || `article-${index}`}
                  ref={isLast ? lastArticleRef : null}
                  className="rounded-md cursor-pointer group"
                >
                  <Link
                    href={articleUrl}
                    className="block hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
                    aria-label={`Read article: ${article.title}`}
                  >
                    <div className="image-container overflow-hidden relative rounded-sm mb-3">
                      <div className="relative h-48 md:h-64 w-full">
                        <Image
                          src={article.urlToImage || 'https://via.placeholder.com/300'}
                          alt={article.title || 'News article image'}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          loading={index < 6 ? 'eager' : 'lazy'}
                        />
                      </div>
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold line-clamp-2 mb-2">
                      {truncateTitle(article.title)}
                    </h3>
                    <div className="flex items-center text-xs text-primary mt-2 gap-x-[8px]">
                      <span className="truncate">{formatAuthor(article.author)}</span>
                      <BsDashLg className="flex-shrink-0" aria-hidden="true" />
                      <time dateTime={article.publishedAt} className="flex-shrink-0">
                        {formatDate(article.publishedAt)}
                      </time>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}

        {articles.length > 0 && loading && hasMore && (
          <div className="mt-5">
            <ArticleSkeleton count={3} />
          </div>
        )}
      </div>
    </section>
  );
};
