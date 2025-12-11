'use client';

import { useSearchParams } from 'next/navigation';
import { NewsDetails } from '@/components/news/NewsDetails';

interface NewsDetailsWithSearchProps {
  category: string;
  title: string;
}

export function NewsDetailsWithSearch({ category, title }: NewsDetailsWithSearchProps) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || undefined;
  
  return <NewsDetails category={category} title={title} searchQuery={searchQuery} />;
}

