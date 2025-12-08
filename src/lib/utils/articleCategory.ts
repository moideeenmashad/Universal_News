import { slugify } from './string';
import type { NewsArticle } from '@/types/news';

/**
 * Attempts to determine the category of an article by checking its title/content
 * against known category keywords
 * This is a fast heuristic method that doesn't require API calls
 */
export const guessArticleCategory = (article: NewsArticle): string => {
  const title = article.title?.toLowerCase() || '';
  const description = article.description?.toLowerCase() || '';
  const content = article.content?.toLowerCase() || '';
  const combined = `${title} ${description} ${content}`;

  // Category keywords mapping (most common terms first)
  const categoryKeywords: Record<string, string[]> = {
    technology: [
      'tech',
      'technology',
      'ai',
      'artificial intelligence',
      'software',
      'digital',
      'computer',
      'internet',
      'cyber',
      'app',
      'mobile',
      'startup',
      'innovation',
      'coding',
      'programming',
    ],
    business: [
      'business',
      'economy',
      'market',
      'stock',
      'trade',
      'finance',
      'corporate',
      'company',
      'economic',
      'investment',
      'bank',
      'financial',
      'wall street',
    ],
    sports: [
      'sport',
      'football',
      'basketball',
      'soccer',
      'tennis',
      'olympics',
      'athlete',
      'game',
      'match',
      'championship',
      'nfl',
      'nba',
      'mlb',
      'player',
    ],
    health: [
      'health',
      'medical',
      'doctor',
      'hospital',
      'disease',
      'treatment',
      'medicine',
      'patient',
      'covid',
      'pandemic',
      'healthcare',
      'wellness',
      'fitness',
    ],
    science: [
      'science',
      'research',
      'study',
      'scientist',
      'discovery',
      'experiment',
      'laboratory',
      'space',
      'nasa',
      'astronomy',
      'physics',
      'chemistry',
      'biology',
    ],
    entertainment: [
      'entertainment',
      'movie',
      'film',
      'actor',
      'celebrity',
      'music',
      'hollywood',
      'award',
      'oscar',
      'grammy',
      'tv show',
      'series',
      'netflix',
    ],
  };

  // Check each category (order matters - check more specific ones first)
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((keyword) => combined.includes(keyword))) {
      return category;
    }
  }

  // Default to general if no match
  return 'general';
};

/**
 * Finds which category an article belongs to by searching all categories
 * This is used when we have an article from search results
 * Note: This is slower, so we use guessArticleCategory first
 */
export const findArticleCategory = async (
  article: NewsArticle
): Promise<string> => {
  // First try fast heuristic method
  const guessedCategory = guessArticleCategory(article);
  
  // If we have a good guess (not general), use it
  // The universal search in NewsDetails will handle finding the article anyway
  if (guessedCategory !== 'general') {
    return guessedCategory;
  }

  // For general category, try to find in actual categories
  // This is slower but more accurate
  try {
    const { newsService } = await import('../api/news');
    const articleSlug = slugify(article.title);
    const categories = ['business', 'entertainment', 'health', 'science', 'sports', 'technology'];

    // Try each category (skip general since we already know it's not specific)
    for (const category of categories) {
      try {
        const foundArticle = await newsService.getArticleByTitle(category, articleSlug);
        if (foundArticle && foundArticle.url === article.url) {
          return category;
        }
      } catch (error) {
        // Continue to next category
        continue;
      }
    }
  } catch (error) {
    // If category search fails, return guessed category
    console.warn('Category search failed, using guessed category:', error);
  }

  // Return general as fallback
  return 'general';
};
