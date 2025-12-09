/**
 * List of allowed image hostnames configured in next.config.ts
 * This should match the remotePatterns in your Next.js config
 */
const ALLOWED_IMAGE_PATTERNS = [
  // Featured images
  'images.nationalgeographic.org',
  'www.artificialintelligence-news.com',
  'www.aljazeera.com',
  'th-i.thgim.com',
  'i.ibb.co',
  // News APIs
  'newsapi.org',
  // Major news sources
  'apnews.com',
  'dims.apnews.com',
  'cnn.com',
  'bbc.co.uk',
  'bbc.com',
  'reuters.com',
  'nytimes.com',
  'washingtonpost.com',
  'theguardian.com',
  'nbcnews.com',
  'cbsnews.com',
  'abcnews.go.com',
  'usatoday.com',
  'npr.org',
  // Business & Finance
  'bloomberg.com',
  'cnbc.com',
  'forbes.com',
  'insider.com',
  // Tech news
  'techcrunch.com',
  'theverge.com',
  'wired.com',
  'searchenginejournal.com',
  // Sports
  'espn.com',
  // CDNs
  'cloudinary.com',
  'imgix.net',
  'amazonaws.com',
  'cloudfront.net',
  'zenfs.com',
  'akamaized.net',
  'fastly.net',
  'wp.com',
  'gstatic.com',
  'googleusercontent.com',
  'twimg.com',
  'fbcdn.net',
  'futurecdn.net',
  'hearstapps.com',
  'vox-cdn.com',
  'media-amazon.com',
];

/**
 * Check if a hostname matches any of the allowed patterns
 */
function isHostnameAllowed(hostname: string): boolean {
  return ALLOWED_IMAGE_PATTERNS.some(pattern => {
    // Check if hostname ends with the pattern (handles subdomains)
    return hostname === pattern || hostname.endsWith('.' + pattern);
  });
}

/**
 * Validates if an image URL is allowed by Next.js image configuration
 * @param url - The image URL to validate
 * @returns true if the URL is allowed, false otherwise
 */
export function isImageUrlAllowed(url: string | null | undefined): boolean {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    
    // Only allow HTTPS
    if (urlObj.protocol !== 'https:') return false;
    
    // Check if hostname is in allowed list
    return isHostnameAllowed(urlObj.hostname);
  } catch {
    // Invalid URL
    return false;
  }
}

/**
 * Gets a safe image URL for Next.js Image component
 * Returns the original URL if allowed, otherwise returns a fallback
 * @param url - The image URL to validate
 * @param fallbackUrl - The fallback URL to use if the original is not allowed
 * @returns A safe image URL
 */
export function getSafeImageUrl(
  url: string | null | undefined,
  fallbackUrl: string
): string {
  if (!url || !isImageUrlAllowed(url)) {
    return fallbackUrl;
  }
  return url;
}
