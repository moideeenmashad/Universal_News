'use client';

import { memo } from 'react';
import { Featured } from './Featured';
import { LatestNews } from './LatestNews';
import { LiveArticle } from './LiveArticle';
import { WorldNewsSection } from './WorldNewsSection';
import { slugify } from '@/lib/utils/string';

const SECTION_TITLES = ['Latest News', 'World News'] as const;

/**
 * Hero component - Main landing page section
 * Displays featured content, live articles, and news sections
 */
export const Hero = memo(() => {
  return (
    <div className="pt-[100px]" aria-label="Main content">
      <Featured />
      <LiveArticle articleUrlName={slugify} />
      <LatestNews title={SECTION_TITLES[0]} articleUrlName={slugify} />
      <WorldNewsSection title={SECTION_TITLES[1]} articleUrlName={slugify} />
    </div>
  );
});

Hero.displayName = 'Hero';
