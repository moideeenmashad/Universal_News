import { News } from '@/components/news-list/News';
import { notFound } from 'next/navigation';
import { CATEGORIES } from '@/constants/routes';

type Props = {
  params: Promise<{ category: string }>;
};

const VALID_CATEGORIES = Object.values(CATEGORIES);

export default async function CategoryPage(props: Props) {
  const params = await props.params;
  const { category } = params;

  // Check if category is valid (including world-news)
  if (!VALID_CATEGORIES.includes(category as any)) {
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
