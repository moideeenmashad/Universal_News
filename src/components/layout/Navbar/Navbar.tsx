'use client';

import { PreNavabar } from './PreNavabar';
import { PrimaryNavbar } from './PrimaryNavbar';

export const Navbar = () => {
  return (
    <div className="sticky top-0 w-full bg-white z-50 mx-auto shadow-sm">
      {/* PreNavbar - Hidden on mobile, visible on desktop only */}
      <div className="hidden md:block">
        <PreNavabar />
      </div>
      <PrimaryNavbar />
    </div>
  );
};
