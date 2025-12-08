'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Navbar } from '@/components/layouts/Navbar/Navbar';
import { Footer } from '@/components/layouts/Footer/Footer';
import { SmoothScroll } from '@/components/providers/SmoothScroll';
import { QUERY_STALE_TIME, QUERY_GC_TIME } from '@/constants/config';

// Dynamically import ReactQueryDevtools only in development
const ReactQueryDevtools = dynamic(
  () =>
    import('@tanstack/react-query-devtools').then((mod) => ({
      default: mod.ReactQueryDevtools,
    })),
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: QUERY_STALE_TIME,
            gcTime: QUERY_GC_TIME,
            refetchOnWindowFocus: false,
            retry: 1,
            refetchOnMount: false,
          },
        },
      }),
    []
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SmoothScroll>
        <Navbar />
        <main role="main">{children}</main>
        <Footer />
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </SmoothScroll>
    </QueryClientProvider>
  );
}
