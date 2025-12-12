'use client';

import { useSearchParams } from 'next/navigation';
import { ContentDetails } from '@/components/content-detail/ContentDetails';

interface ArticleDetailsContentProps {
  title: string;
}

export function ArticleDetailsContent({ title }: ArticleDetailsContentProps) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || undefined;
  
  // ContentDetails can work without category - it will search universally
  return <ContentDetails title={title} searchQuery={searchQuery} />;
}

