import { Suspense } from 'react';
import { ArticleDetailsContent } from './ArticleDetailsContent';
import { ArticleDetailSkeleton } from '@/components/ui/ArticleDetailSkeleton';

interface PageProps {
  params: Promise<{ title: string }>;
}

export default async function ArticlePage({ params }: PageProps) {
  const { title } = await params;
  return (
    <Suspense
      fallback={
        <section className="mx-auto max-w-screen-xl px-4 md:px-0 py-8 mt-24" aria-label="Loading content">
          <ArticleDetailSkeleton />
        </section>
      }
    >
      <ArticleDetailsContent title={title} />
    </Suspense>
  );
}

