import { useEffect, useRef } from 'react';

/**
 * useInfiniteScroll
 *
 * An infinite scroll hook based on IntersectionObserver.
 * When you attach the returned `sentinelRef` to a DOM node near the last list element,
 * `onLoadMore` is called when that node enters the viewport.
 *
 * Params:
 * @param {object} options
 * @param {function} options.onLoadMore - Called when the sentinel enters the viewport [Required]
 * @param {boolean} options.hasMore - Whether there is more data to load [Optional, default: true]
 * @param {boolean} options.isEnabled - Whether the observer is enabled (e.g. paused while loading) [Optional, default: true]
 * @param {string}  options.rootMargin - IntersectionObserver rootMargin [Optional, default: '200px']
 * @returns {React.RefObject} ref to attach to the sentinel DOM node
 *
 * Example usage:
 * const sentinelRef = useInfiniteScroll({ onLoadMore: loadMore, hasMore });
 * return <div ref={sentinelRef} />;
 */
export function useInfiniteScroll({
  onLoadMore,
  hasMore = true,
  isEnabled = true,
  rootMargin = '200px',
}) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!isEnabled || !hasMore) return undefined;
    const node = sentinelRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          onLoadMore?.();
        }
      },
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isEnabled, hasMore, onLoadMore, rootMargin]);

  return sentinelRef;
}
