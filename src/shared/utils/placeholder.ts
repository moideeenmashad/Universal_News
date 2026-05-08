/**
 * Generates a data URI for a placeholder image
 * @param width - Image width in pixels
 * @param height - Image height in pixels
 * @returns Data URI string for the placeholder image
 */
export const getPlaceholderImage = (width: number = 800, height: number = 400): string => {
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#e5e7eb"/><text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="#9ca3af" text-anchor="middle" dy=".3em">No Image</text></svg>`;
  
  // URL encode the SVG to create a data URI (works in both client and server)
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

