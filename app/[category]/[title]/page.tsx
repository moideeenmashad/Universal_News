import { Suspense } from 'react';
import { NewsDetailsContent } from './NewsDetailsContent';

interface PageProps {
  params: Promise<{ category: string; title: string }>;
}

export default async function ArticlePage({ params }: PageProps) {
  const { category, title } = await params;
  return (
    <Suspense fallback={<div className="mx-auto max-w-screen-xl px-4 py-8">Loading...</div>}>
      <NewsDetailsContent category={category} title={title} />
    </Suspense>
  );
}
