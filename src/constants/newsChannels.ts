/**
 * Popular News Channels Configuration
 * These are the hostnames/domains of major news sources
 * Used for filtering news by specific channels
 */

export interface NewsChannel {
  id: string;
  name: string;
  hostname: string;
  category?: string;
}

export const NEWS_CHANNELS: NewsChannel[] = [
  // Major International News
  { id: 'bbc', name: 'BBC News', hostname: 'bbc.com', category: 'general' },
  { id: 'cnn', name: 'CNN', hostname: 'cnn.com', category: 'general' },
  { id: 'reuters', name: 'Reuters', hostname: 'reuters.com', category: 'general' },
  { id: 'ap', name: 'Associated Press', hostname: 'apnews.com', category: 'general' },
  { id: 'guardian', name: 'The Guardian', hostname: 'theguardian.com', category: 'general' },
  { id: 'nytimes', name: 'New York Times', hostname: 'nytimes.com', category: 'general' },
  { id: 'washingtonpost', name: 'Washington Post', hostname: 'washingtonpost.com', category: 'general' },
  { id: 'wsj', name: 'Wall Street Journal', hostname: 'wsj.com', category: 'business' },
  { id: 'bloomberg', name: 'Bloomberg', hostname: 'bloomberg.com', category: 'business' },
  { id: 'economist', name: 'The Economist', hostname: 'economist.com', category: 'business' },
  { id: 'ft', name: 'Financial Times', hostname: 'ft.com', category: 'business' },
  
  // Technology News
  { id: 'techcrunch', name: 'TechCrunch', hostname: 'techcrunch.com', category: 'technology' },
  { id: 'theverge', name: 'The Verge', hostname: 'theverge.com', category: 'technology' },
  { id: 'wired', name: 'Wired', hostname: 'wired.com', category: 'technology' },
  { id: 'ars-technica', name: 'Ars Technica', hostname: 'arstechnica.com', category: 'technology' },
  { id: 'engadget', name: 'Engadget', hostname: 'engadget.com', category: 'technology' },
  
  // Sports News
  { id: 'espn', name: 'ESPN', hostname: 'espn.com', category: 'sports' },
  { id: 'sports-illustrated', name: 'Sports Illustrated', hostname: 'si.com', category: 'sports' },
  { id: 'bleacher-report', name: 'Bleacher Report', hostname: 'bleacherreport.com', category: 'sports' },
  
  // Entertainment
  { id: 'variety', name: 'Variety', hostname: 'variety.com', category: 'entertainment' },
  { id: 'hollywood-reporter', name: 'Hollywood Reporter', hostname: 'hollywoodreporter.com', category: 'entertainment' },
  { id: 'entertainment-weekly', name: 'Entertainment Weekly', hostname: 'ew.com', category: 'entertainment' },
  
  // Health & Science
  { id: 'scientific-american', name: 'Scientific American', hostname: 'scientificamerican.com', category: 'science' },
  { id: 'nature', name: 'Nature', hostname: 'nature.com', category: 'science' },
  { id: 'science', name: 'Science Magazine', hostname: 'science.org', category: 'science' },
  { id: 'webmd', name: 'WebMD', hostname: 'webmd.com', category: 'health' },
  { id: 'healthline', name: 'Healthline', hostname: 'healthline.com', category: 'health' },
  
  // Additional Popular Sources
  { id: 'time', name: 'Time', hostname: 'time.com', category: 'general' },
  { id: 'newsweek', name: 'Newsweek', hostname: 'newsweek.com', category: 'general' },
  { id: 'usatoday', name: 'USA Today', hostname: 'usatoday.com', category: 'general' },
  { id: 'abc-news', name: 'ABC News', hostname: 'abcnews.go.com', category: 'general' },
  { id: 'cbs-news', name: 'CBS News', hostname: 'cbsnews.com', category: 'general' },
  { id: 'nbc-news', name: 'NBC News', hostname: 'nbcnews.com', category: 'general' },
  { id: 'fox-news', name: 'Fox News', hostname: 'foxnews.com', category: 'general' },
  { id: 'al-jazeera', name: 'Al Jazeera', hostname: 'aljazeera.com', category: 'general' },
  { id: 'independent', name: 'The Independent', hostname: 'independent.co.uk', category: 'general' },
  { id: 'telegraph', name: 'The Telegraph', hostname: 'telegraph.co.uk', category: 'general' },
];

/**
 * Get hostnames for a specific category
 */
export const getHostnamesByCategory = (category: string): string[] => {
  return NEWS_CHANNELS
    .filter(channel => channel.category === category)
    .map(channel => channel.hostname);
};

/**
 * Get all hostnames as a comma-separated string for API use
 */
export const getAllHostnames = (): string => {
  return NEWS_CHANNELS.map(channel => channel.hostname).join(',');
};

/**
 * Get hostnames for multiple categories
 */
export const getHostnamesByCategories = (categories: string[]): string => {
  const hostnames = NEWS_CHANNELS
    .filter(channel => channel.category && categories.includes(channel.category))
    .map(channel => channel.hostname);
  return hostnames.join(',');
};

/**
 * Get channel by ID
 */
export const getChannelById = (id: string): NewsChannel | undefined => {
  return NEWS_CHANNELS.find(channel => channel.id === id);
};

/**
 * Get channel by hostname
 */
export const getChannelByHostname = (hostname: string): NewsChannel | undefined => {
  return NEWS_CHANNELS.find(channel => channel.hostname === hostname);
};

