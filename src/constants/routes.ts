export const ROUTES = {
  HOME: '/',
  WORLD_NEWS: '/world-news',
  BUSINESS: '/business',
  ENTERTAINMENT: '/entertainment',
  GENERAL: '/general',
  HEALTH: '/health',
  SCIENCE: '/science',
  SPORTS: '/sports',
  TECHNOLOGY: '/technology',
} as const;

export const CATEGORIES = {
  WORLD_NEWS: 'world-news',
  BUSINESS: 'business',
  ENTERTAINMENT: 'entertainment',
  GENERAL: 'general',
  HEALTH: 'health',
  SCIENCE: 'science',
  SPORTS: 'sports',
  TECHNOLOGY: 'technology',
} as const;

export type Category = (typeof CATEGORIES)[keyof typeof CATEGORIES];

