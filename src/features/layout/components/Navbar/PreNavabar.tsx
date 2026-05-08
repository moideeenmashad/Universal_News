'use client';

import { useState } from 'react';
import { SlGlobe } from 'react-icons/sl';
import { GoSearch, GoChevronRight } from 'react-icons/go';
import { SearchModal } from '@/features/search/components/SearchModal';


export const PreNavabar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <>
      <div className="pre-navbar-container max-w-screen-xl mx-auto px-4 flex justify-between items-center border-primary border-y-2 my-2">
        <div className="flex items-center pb-2 pt-2 space-x-1">
          <SlGlobe />
          <p className="text-primary text-sm md:text-base">{today}</p>
        </div>
        <div className="flex items-center pb-2 pt-2 space-x-2">
          <p className="text-primary text-sm md:text-base">The Menu</p>
          <GoChevronRight className="hidden md:block" />
          <button
            onClick={() => setIsSearchOpen(true)}
            className="cursor-pointer hover:opacity-70 transition-opacity focus:outline-none rounded"
            aria-label="Open search"
          >
            <GoSearch className="w-5 h-5" />
          </button>
        </div>
      </div>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
