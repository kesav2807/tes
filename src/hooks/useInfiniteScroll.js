import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook to trigger a callback when a target element scrolls into view (IntersectionObserver).
 * @param {Function} onLoadMore Function to execute when user reaches the target sentinel.
 * @param {boolean} hasMore Whether there are more items to load.
 * @param {boolean} isLoading Whether items are currently being appended/loaded.
 * @param {object} options IntersectionObserver options (rootMargin, threshold).
 */
export const useInfiniteScroll = (onLoadMore, hasMore, isLoading, options = {}) => {
  const observerRef = useRef(null);

  const sentinelRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore();
        }
      }, {
        rootMargin: options.rootMargin || '250px',
        threshold: options.threshold || 0.1,
      });

      if (node) observerRef.current.observe(node);
    },
    [isLoading, hasMore, onLoadMore, options.rootMargin, options.threshold]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return sentinelRef;
};

export default useInfiniteScroll;
