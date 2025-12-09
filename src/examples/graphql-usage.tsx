/**
 * Example: Using GraphQL-style News Queries
 * This file demonstrates how to use the new GraphQL API
 */

import { getTopHeadlinesGraphQL, searchArticlesGraphQL } from '@/lib/actions/graphqlNews';
import { queryTopHeadlines } from '@/lib/graphql/newsQueries';

// ============================================
// EXAMPLE 1: Server Component with GraphQL
// ============================================
export async function TechNewsGrid() {
  // Fetch only the fields needed for a news grid
  const articles = await getTopHeadlinesGraphQL('technology', 'us', 10);

  return (
    <div className="grid grid-cols-3 gap-4">
      {articles.map((article) => (
        <div key={article.url} className="border rounded p-4">
          {article.urlToImage && (
            <img src={article.urlToImage} alt={article.title} className="w-full h-48 object-cover" />
          )}
          <h3 className="font-bold mt-2">{article.title}</h3>
          <p className="text-sm text-gray-600">{article.description}</p>
        </div>
      ))}
    </div>
  );
}

// ============================================
// EXAMPLE 2: Optimized Field Selection
// ============================================
export async function MinimalNewsCards() {
  // Only fetch title, image, and URL - saves ~70% bandwidth!
  const result = await queryTopHeadlines({
    category: 'sports',
    pageSize: 20,
    fields: ['title', 'urlToImage', 'url'], // Only these 3 fields
  });

  return (
    <div className="grid grid-cols-4 gap-4">
      {result.articles.map((article) => (
        <a key={article.url} href={article.url} className="block hover:opacity-80">
          {article.urlToImage && (
            <img src={article.urlToImage} alt={article.title || ''} className="w-full h-32 object-cover rounded" />
          )}
          <p className="mt-2 text-sm font-semibold line-clamp-2">{article.title}</p>
        </a>
      ))}
    </div>
  );
}

// ============================================
// EXAMPLE 3: Search with Field Selection
// ============================================
export async function SearchResults({ query }: { query: string }) {
  // Search with only needed fields
  const articles = await searchArticlesGraphQL(query, 20);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Results for "{query}"</h2>
      {articles.map((article) => (
        <article key={article.url} className="border-b pb-4">
          <h3 className="text-xl font-semibold">{article.title}</h3>
          <p className="text-gray-600 mt-1">{article.description}</p>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
            {article.author && <span>{article.author}</span>}
            {article.publishedAt && (
              <time>{new Date(article.publishedAt).toLocaleDateString()}</time>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

// ============================================
// EXAMPLE 4: Custom Field Selection
// ============================================
export async function CustomFieldsExample() {
  // Fetch only specific fields you need
  const result = await queryTopHeadlines({
    category: 'business',
    pageSize: 5,
    fields: ['title', 'author', 'publishedAt'], // No images, no content - minimal data!
  });

  return (
    <ul className="space-y-2">
      {result.articles.map((article) => (
        <li key={article.url} className="flex items-center justify-between">
          <span className="font-medium">{article.title}</span>
          <span className="text-sm text-gray-500">{article.author || 'Unknown'}</span>
        </li>
      ))}
    </ul>
  );
}

// ============================================
// USAGE IN YOUR PAGES
// ============================================

/*
// In app/page.tsx or any server component:

import { TechNewsGrid } from '@/examples/graphql-usage';

export default function HomePage() {
  return (
    <div>
      <h1>Latest Tech News</h1>
      <TechNewsGrid />
    </div>
  );
}
*/

/*
// In app/search/page.tsx:

import { SearchResults } from '@/examples/graphql-usage';

export default function SearchPage({ searchParams }: { searchParams: { q: string } }) {
  return <SearchResults query={searchParams.q} />;
}
*/
