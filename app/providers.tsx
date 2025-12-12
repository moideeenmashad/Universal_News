'use client';

import { Navbar } from '@/components/layout/Navbar/Navbar';
import { Footer } from '@/components/layout/Footer/Footer';
import { SmoothScroll } from '@/components/layout/providers/SmoothScroll';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <Navbar />
      <main role="main">
        {children}
      </main>
      <Footer />
    </SmoothScroll>
  );
}
