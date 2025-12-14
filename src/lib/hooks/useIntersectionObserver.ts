'use client';

import { useEffect, useRef, useState, RefObject } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

/**
 * Hook to observe when an element enters the viewport
 * @param options - Intersection Observer options
 * @returns A ref to attach to the element and whether it's visible
 */
export const useIntersectionObserver = (
  options: UseIntersectionObserverOptions = {}
): [RefObject<HTMLDivElement | null>, boolean] => {
  const { threshold = 0.1, rootMargin = '0px', enabled = true } = options;
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!enabled || !elementRef.current || isVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Once visible, we can disconnect to avoid unnecessary re-observations
            observer.disconnect();
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(elementRef.current);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, enabled, isVisible]);

  return [elementRef, isVisible];
};

