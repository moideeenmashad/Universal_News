'use client';

import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import type { LenisOptions } from 'lenis';

interface SmoothScrollProps {
  children: React.ReactNode;
}

export const SmoothScroll = ({ children }: SmoothScrollProps) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis with slightly reduced smoothness
    const lenis = new Lenis({
      duration: 1.0, // Reduced from 1.8 for more responsive feel
      easing: (t) => {
        // Slightly faster easing for more responsive scroll
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      },
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9, // Increased from 0.7 for more responsive scrolling
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenis;

    // High-performance animation frame with time-based updates
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Handle resize for better performance
    const handleResize = () => {
      lenis.resize();
    };

    // Handle scroll events for better sync
    const handleScroll = () => {
      // Let Lenis handle it
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
};
