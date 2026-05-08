/**
 * Script to pre-populate cache with sample data
 * Run this locally to generate cache files that can be committed
 * 
 * Usage: npx tsx scripts/prepopulate-cache.ts
 */

import { saveToCache, getHeadlinesCacheKey, getEverythingCacheKey, getLatestNewsCacheKey } from '../src/shared/lib/cache/newsCache';
import type { NewsApiResponse, NewsDataResponse } from '../src/shared/types';
import { getPlaceholderImage } from '../src/shared/utils/placeholder';

// Sample data structure matching API responses
const sampleHeadlines: NewsApiResponse = {
  status: 'ok',
  totalResults: 2,
  articles: [
    {
      source: { name: 'Sample News' },
      author: 'Sample Author',
      title: 'Sample News Article Title',
      description: 'This is a sample news article description for testing purposes.',
      url: 'https://example.com/article1',
      urlToImage: getPlaceholderImage(800, 400),
      publishedAt: new Date().toISOString(),
      content: 'This is sample content for the news article.',
    },
    {
      source: { name: 'Sample News' },
      author: 'Sample Author 2',
      title: 'Another Sample News Article',
      description: 'Another sample description for testing.',
      url: 'https://example.com/article2',
      urlToImage: getPlaceholderImage(800, 400),
      publishedAt: new Date().toISOString(),
      content: 'More sample content here.',
    },
  ],
};

const sampleLatest: NewsDataResponse = {
  status: 'success',
  totalResults: 1,
  results: [
    {
      article_id: 'sample-1',
      title: 'Sample Latest News',
      link: 'https://example.com/latest1',
      keywords: ['sample', 'news'],
      creator: ['Sample Author'],
      description: 'Sample latest news description',
      content: 'Sample content for latest news',
      pubDate: new Date().toISOString(),
      image_url: getPlaceholderImage(800, 400),
      source_id: 'sample',
      source_priority: 1,
      source_url: 'https://example.com',
      language: 'english',
      country: ['us'],
      category: ['world'],
      ai_tag: 'GENERAL',
      sentiment: 'neutral',
      sentiment_stats: 'neutral',
      ai_region: 'NORTH AMERICA',
      ai_org: 'GENERAL',
    },
  ],
};

async function prepopulateCache() {
  console.log('🔄 Pre-populating cache with sample data...');

  try {
    // Cache headlines for different categories
    const categories = ['general', 'business', 'sports', 'technology', 'entertainment'];
    for (const category of categories) {
      const key = getHeadlinesCacheKey(category, 'us', 20);
      await saveToCache(key, sampleHeadlines);
      console.log(`✓ Cached headlines for category: ${category}`);
    }

    // Cache general headlines
    const generalKey = getHeadlinesCacheKey(undefined, 'us', 20);
    await saveToCache(generalKey, sampleHeadlines);
    console.log('✓ Cached general headlines');

    // Cache search results
    const searchQueries = ['technology', 'sports', 'business'];
    for (const query of searchQueries) {
      const key = getEverythingCacheKey(query, 20);
      await saveToCache(key, sampleHeadlines);
      console.log(`✓ Cached search results for: ${query}`);
    }

    // Cache latest news
    const latestKey = getLatestNewsCacheKey('worldnews');
    await saveToCache(latestKey, sampleLatest);
    console.log('✓ Cached latest news');

    console.log('\n✅ Cache pre-population complete!');
    console.log('📁 Cache files saved to: .cache/news/');
    console.log('\n💡 Tip: Commit the .cache/ directory to have fallback data in production');
  } catch (error) {
    console.error('❌ Error pre-populating cache:', error);
    process.exit(1);
  }
}

prepopulateCache();
