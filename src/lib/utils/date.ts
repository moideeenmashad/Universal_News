import { format, formatDistanceToNow, isValid } from 'date-fns';

/**
 * Safely formats a date string
 * @param dateString - Date string to format
 * @param formatString - Format pattern (default: 'MMMM d, yyyy')
 * @returns Formatted date string or fallback text
 */
export const formatDate = (dateString: string | undefined, formatString: string = 'MMMM d, yyyy'): string => {
  if (!dateString) return 'Unknown Date';
  
  try {
    const date = new Date(dateString);
    if (!isValid(date)) return 'Invalid Date';
    return format(date, formatString);
  } catch {
    return 'Invalid Date';
  }
};

/**
 * Formats a date as relative time (e.g., "2 hours ago")
 * @param dateString - Date string to format
 * @returns Relative time string or fallback text
 */
export const formatRelativeTime = (dateString: string | undefined): string => {
  if (!dateString) return 'Date not available';
  
  try {
    const date = new Date(dateString);
    if (!isValid(date)) return 'Invalid date';
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return 'Invalid date';
  }
};

