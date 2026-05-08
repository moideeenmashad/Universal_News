import { Suspense } from 'react';
import { NewsDetailsContent } from './NewsDetailsContent';
import { ArticleDetailSkeleton } from '@/shared/components/ArticleDetailSkeleton';

interface PageProps {
  params: Promise<{ category: string; title: string }>;
}

export default async function ArticlePage({ params }: PageProps) {
  const { category, title } = await params;
  return (
    <Suspense
      fallback={
        <section className="mx-auto max-w-screen-xl px-4 md:px-0 py-8 mt-24" aria-label="Loading content">
          <ArticleDetailSkeleton />
        </section>
      }
    >
      <NewsDetailsContent category={category} title={title} />
    </Suspense>
  );
}
