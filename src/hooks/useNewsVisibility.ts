import { useEffect, useRef, RefCallback } from 'react';

// ============================================
// Hook Props
// ============================================

interface UseNewsVisibilityProps {
  onView: (newsId: string) => void;
  threshold?: number;
}

// ============================================
// useNewsVisibility Hook
// ============================================

/**
 * Hook to create an IntersectionObserver that tracks viewed news items
 * Returns a ref callback to attach to news item elements
 */
export const useNewsVisibility = ({
  onView,
  threshold = 0.5, // Trigger when 50% of item is visible
}: UseNewsVisibilityProps) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const viewedItemsRef = useRef<Set<string>>(new Set());
  const onViewRef = useRef(onView);

  // Keep onView ref up to date
  useEffect(() => {
    onViewRef.current = onView;
  }, [onView]);

  useEffect(() => {
    // Create observer
    observerRef.current = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const newsId = entry.target.getAttribute('data-news-id');
            if (newsId && !viewedItemsRef.current.has(newsId)) {
              viewedItemsRef.current.add(newsId);
              onViewRef.current(newsId);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: threshold,
      }
    );

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold]);

  /**
   * Create a ref callback for news items
   */
  const newsItemRef: RefCallback<HTMLElement> = (element) => {
    if (element && observerRef.current) {
      observerRef.current.observe(element);
      
      // Cleanup function
      return () => {
        if (observerRef.current && element) {
          observerRef.current.unobserve(element);
        }
      };
    }
  };

  return newsItemRef;
};
