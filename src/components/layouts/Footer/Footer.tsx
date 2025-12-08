'use client';

import { useMemo } from 'react';

export const Footer = () => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="bg-primary text-white py-8 mt-20" role="contentinfo">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="text-center">
          <p className="text-sm md:text-base">
            © {currentYear} Universal News. All rights reserved.
          </p>
          <p className="text-xs md:text-sm mt-2 opacity-80">
            Stay informed with the latest news from around the world.
          </p>
        </div>
      </div>
    </footer>
  );
};
