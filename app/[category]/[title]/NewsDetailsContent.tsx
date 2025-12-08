'use client';

import { Suspense } from 'react';
import { NewsDetailsWithSearch } from './NewsDetailsWithSearch';

interface NewsDetailsContentProps {
  category: string;
  title: string;
}

export function NewsDetailsContent({ category, title }: NewsDetailsContentProps) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-screen-xl px-4 py-8">Loading...</div>}>
      <NewsDetailsWithSearch category={category} title={title} />
    </Suspense>
  );
}
