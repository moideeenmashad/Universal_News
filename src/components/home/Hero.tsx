'use client';

import { memo } from 'react';
import { Featured } from './Featured';
import { LatestNewsSection } from './LatestNewsSection';
import { LiveUpdatesSection } from './LiveUpdatesSection';
import { WorldNewsSection } from './WorldNewsSection';
import { TechnologyNewsSection } from './TechnologyNewsSection';
import { PodcastsSection } from './PodcastsSection';
import { slugify } from '@/lib/utils/string';

const SECTION_TITLES = ['Latest News', 'World News','Technology News'] as const;

/**
 * Hero component - Main landing page section
 * Displays featured content, live articles, and news sections
 */
export const Hero = memo(() => {
  return (
    <div aria-label="Main content">
      <Featured />
      <LiveUpdatesSection articleUrlName={slugify} />
      <LatestNewsSection title={SECTION_TITLES[0]} />
      <WorldNewsSection title={SECTION_TITLES[1]} />
      <TechnologyNewsSection title={SECTION_TITLES[2]} />
      <PodcastsSection />
    </div>
  );
});

Hero.displayName = 'Hero';
