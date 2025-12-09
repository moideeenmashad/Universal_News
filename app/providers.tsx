'use client';

import { Navbar } from '@/components/layouts/Navbar/Navbar';
import { Footer } from '@/components/layouts/Footer/Footer';
import { SmoothScroll } from '@/components/providers/SmoothScroll';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <Navbar />
      <main role="main">{children}</main>
      <Footer />
    </SmoothScroll>
  );
}
