import { NewsDetails } from '@/src/components/news/NewsDetails';

interface PageProps {
  params: Promise<{ category: string; title: string }>;
}

export default async function ArticlePage({ params }: PageProps) {
  const { category, title } = await params;
  return <NewsDetails category={category} title={title} />;
}

