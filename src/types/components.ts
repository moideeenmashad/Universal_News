import type { ReactNode, RefObject } from 'react';
import type { IconType } from 'react-icons';
import type { NewsArticle } from './news';

// ── Layout ────────────────────────────────────────────────────────────────────

export interface SmoothScrollProps {
  children: ReactNode;
}

export interface NavItem {
  id: number;
  navItem: string;
  LinkTo: string;
}

export interface SocialLink {
  href: string;
  label: string;
  Icon: IconType;
}

// ── UI primitives ─────────────────────────────────────────────────────────────

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'default' | 'primary';
}

export interface TextSkeletonProps {
  lines?: number;
  className?: string;
  width?: 'full' | '3/4' | '2/3' | '1/2' | '1/3';
}

export interface ArticleSkeletonProps {
  count?: number;
  variant?: 'grid' | 'list' | 'featured';
  className?: string;
}

export interface FeaturedArticleSkeletonProps {
  className?: string;
}

export interface ArticleDetailSkeletonProps {
  className?: string;
}

export interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
  variant?: 'error' | 'warning' | 'info' | 'not-found';
  showHomeLink?: boolean;
}

// ── Search ────────────────────────────────────────────────────────────────────

export interface SearchBarProps {
  onClose?: () => void;
  className?: string;
}

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ── News list ─────────────────────────────────────────────────────────────────

export interface NewsProps {
  category: string;
  title: string;
}

export interface NewsListProps {
  title: string;
  articles: NewsArticle[];
  loading: boolean;
  error: string | null;
  lastArticleRef: RefObject<HTMLDivElement | null>;
  hasMore: boolean;
  category: string;
}

export interface LazyArticleProps {
  article: NewsArticle;
  index: number;
  category: string;
  onVisible?: () => void;
}

export interface LazyNewsItemProps {
  article: NewsArticle;
  index: number;
  articleUrlName: (text: string) => string;
  baseUrl: string;
}

// ── Home sections ─────────────────────────────────────────────────────────────

export interface FeaturedItem {
  id: number;
  title: string;
  assert: string;
  linkTo: string;
  category?: string;
}

export interface WorldNewsSectionProps {
  title: string;
}

export interface TechnologyNewsSectionProps {
  title: string;
}

export interface LatestNewsSectionProps {
  title: string;
}

export interface PodcastsSectionProps {
  title?: string;
}

// ── Content detail ────────────────────────────────────────────────────────────

export interface ContentDetailsProps {
  category?: string;
  title: string;
  type?: 'news' | 'podcast';
  searchQuery?: string;
}

export interface SimilarNewsProps {
  articles: NewsArticle[];
  category?: string;
  isLoading?: boolean;
}
