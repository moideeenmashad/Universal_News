import { News } from '@/components/news/News';
import { notFound } from 'next/navigation';
import { isValidCategory } from '@/lib/utils/validation';

type Props = {
  params: Promise<{ category: string }>;
};

export default async function CategoryPage(props: Props) {
  const params = await props.params;
  const { category } = params;

  if (!isValidCategory(category)) {
    notFound();
  }

  // Capitalize title for display
  const title = category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') + ' News';

  return <News category={category} title={title} />;
}

export function generateStaticParams() {
   // Optional: Return valid categories for static generation
   return [
    { category: 'world-news' },
    { category: 'business' },
    { category: 'entertainment' },
    { category: 'general' },
    { category: 'health' },
    { category: 'science' },
    { category: 'sports' },
    { category: 'technology' },
   ];
}
