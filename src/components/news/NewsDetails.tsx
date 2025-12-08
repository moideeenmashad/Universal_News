'use client';

import { PiCalendarLight } from 'react-icons/pi';
import { formatDate } from '@/src/lib/utils/date';
import Image from 'next/image';
import { useArticleByTitle } from '@/src/lib/hooks/useNews';
import { isValidArticle } from '@/src/lib/utils/validation';
import { ArticleSkeleton } from '../ui/ArticleSkeleton';
import { ErrorMessage } from '../ui/ErrorMessage';

interface NewsDetailsProps {
  category: string;
  title: string;
}

export const NewsDetails = ({ category, title }: NewsDetailsProps) => {
  const { data: article, isLoading, error } = useArticleByTitle(category, title);

  if (isLoading) {
    return (
      <section className="mx-auto max-w-screen-xl px-4 md:px-0 py-8" aria-label="Loading article">
        <ArticleSkeleton count={1} variant="featured" />
      </section>
    );
  }

  if (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to load article. Please try again.';
    return (
      <section className="mx-auto max-w-screen-xl px-4 md:px-0 py-8">
        <ErrorMessage message={errorMessage} />
      </section>
    );
  }

  if (!article || !isValidArticle(article)) {
    return (
      <section className="mx-auto max-w-screen-xl px-4 md:px-0 py-8">
        <ErrorMessage message="Article not found." />
      </section>
    );
  }


  const authorName = article.author || article.source?.name || 'Unknown Author';

  return (
    <article className="mx-auto max-w-screen-xl px-4 md:px-0 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 mb-[24px]">
        <div className="col-span-3">
          <div className="relative w-full h-[300px] md:h-[400px] mb-6 rounded-lg overflow-hidden">
            <Image
              src={article.urlToImage || 'https://via.placeholder.com/800x400'}
              alt={article.title || 'Article image'}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
          </div>
          <div className="publisher border-y-2 border-primary py-4 flex items-center gap-x-[10px] mb-6">
            <div className="relative size-10 rounded-full overflow-hidden flex-shrink-0">
              <Image
                className="object-cover"
                src="https://i.ibb.co/FZpNSmN/istockphoto-2151669184-612x612-removebg-preview.png"
                alt={`${authorName} avatar`}
                fill
                sizes="40px"
              />
            </div>
            <div className="article-profile min-w-0">
              <p className="text-base md:text-lg uppercase font-bold truncate">{authorName}</p>
              <div className="flex items-center text-sm text-gray-600">
                <PiCalendarLight className="mr-[6px] flex-shrink-0" aria-hidden="true" />
                <time dateTime={article.publishedAt}>
                  {formatDate(article.publishedAt, 'EEEE, MMMM d, yyyy')}
                </time>
              </div>
            </div>
          </div>
          <div className="article-content-container">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">{article.title}</h1>
            <hr className="border-b-1 border-primary mb-6" aria-hidden="true" />
            <div className="prose max-w-none">
              {article.description && (
                <p className="text-base md:text-lg leading-relaxed mb-4">{article.description}</p>
              )}
              {article.content && (
                <div
                  className="text-base md:text-lg leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              )}
              {article.url && (
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline mt-4 inline-block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                  aria-label={`Read full article on ${article.source?.name || 'source website'}`}
                >
                  Read full article on source website →
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
