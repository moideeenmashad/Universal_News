import { Suspense } from 'react';
import { ArticleDetailsContent } from './ArticleDetailsContent';

interface PageProps {
  params: Promise<{ title: string }>;
}

export default async function ArticlePage({ params }: PageProps) {
  const { title } = await params;
  return (
    <Suspense fallback={<div className="mx-auto max-w-screen-xl px-4 py-8">Loading...</div>}>
      <ArticleDetailsContent title={title} />
    </Suspense>
  );
}

