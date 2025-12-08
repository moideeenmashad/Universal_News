import { LiveArticleReadMore } from '@/src/components/home/LiveArticleReadMore';

interface PageProps {
  params: Promise<{ title: string }>;
}

export default async function WorldNewsArticlePage({ params }: PageProps) {
  const { title } = await params;
  return <LiveArticleReadMore title={title} />;
}

