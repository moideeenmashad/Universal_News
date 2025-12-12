'use client';

import { useSearchParams } from 'next/navigation';
import { ContentDetails } from '@/components/content-detail/ContentDetails';

interface NewsDetailsContentProps {
  category: string;
  title: string;
}

export function NewsDetailsContent({ category, title }: NewsDetailsContentProps) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || undefined;
  
  // ContentDetails will auto-detect type from category
  return <ContentDetails category={category} title={title} searchQuery={searchQuery} />;
}
