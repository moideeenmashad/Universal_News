'use client';

import { PreNavabar } from './PreNavabar';
import { PrimaryNavbar } from './PrimaryNavbar';

export const Navbar = () => {
  return (
    <div className="sticky top-0 w-full bg-white z-50 mx-auto shadow-sm">
      <PreNavabar />
      <PrimaryNavbar />
    </div>
  );
};
