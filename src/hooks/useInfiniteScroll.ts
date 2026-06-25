import { useEffect, useRef } from 'react';

interface UseInfiniteScrollOptions {
  onLoadMore: () => void;
  hasNextPage: boolean;
  isLoading: boolean;
}

/**
 * 基于 IntersectionObserver 的无限滚动触底侦测 Hook
 */
export function useInfiniteScroll({
  onLoadMore,
  hasNextPage,
  isLoading,
}: UseInfiniteScrollOptions) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentSentinel = sentinelRef.current;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
      observer.disconnect();
    };
  }, [hasNextPage, isLoading, onLoadMore]);

  return { sentinelRef };
}