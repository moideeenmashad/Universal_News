import { Suspense } from 'react';
import { SearchContent } from '@/components/search/SearchContent';

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-screen-xl px-4 py-8">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
