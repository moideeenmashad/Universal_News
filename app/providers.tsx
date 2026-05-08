'use client';

import { Navbar } from '@/features/layout/components/Navbar/Navbar';
import { Footer } from '@/features/layout/components/Footer/Footer';
import { SmoothScroll } from '@/features/layout/components/providers/SmoothScroll';
import { QueryProvider } from '@/shared/components/providers/QueryProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <SmoothScroll>
        <Navbar />
        <main role="main" className="py-12">
          {children}
        </main>
        <Footer />
      </SmoothScroll>
    </QueryProvider>
  );
}
