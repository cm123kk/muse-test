import { useEffect, useRef, useState } from 'react';

/**
 * useStaggeredSequence
 *
 * Drives a sequence via RAF where a series of items (N of them) advance through
 * state 0 -> 1 -> 2 sequentially with a time offset (stagger) after passing the
 * IntersectionObserver gate. Returns an array of (state, elapsedInItem) per item.
 * Derived state such as layerStatuses is computed by the caller from elapsedInItem.
 *
 * - state 0: not yet entered (before the cardEnter point)
 * - state 1: in progress (cardEnter <= elapsed < cardEnter + durationMs)
 * - state 2: done (elapsed >= cardEnter + durationMs)
 *
 * Runs only once after starting (idempotent). The first item has cardEnter=0, the i-th is i x staggerMs.
 *
 * @param {object} options
 * @param {React.RefObject<HTMLElement>} options.targetRef - IntersectionObserver target [Required]
 * @param {number} options.count - number of items [Required]
 * @param {number} options.staggerMs - start offset between items (default: 600 ms)
 * @param {number} options.durationMs - duration of state 1 per item (default: 2400 ms)
 * @param {number} options.threshold - IntersectionObserver threshold that triggers the start (default: 0.5)
 * @returns {Array<{ state: 0|1|2, elapsedInItem: number }>} current state per item + ms elapsed since the item started
 *
 * Example usage:
 *   const ref = useRef(null);
 *   const items = useStaggeredSequence({ targetRef: ref, count: 3 });
 *   items[0].state // 0 / 1 / 2
 *   items[0].elapsedInItem // ms since this item entered state 1
 */
export function useStaggeredSequence({
  targetRef,
  count,
  staggerMs = 600,
  durationMs = 2400,
  threshold = 0.5,
}) {
  const [now, setNow] = useState(0);
  const [startedAt, setStartedAt] = useState(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return undefined;
    if (startedAt) return undefined;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
        setStartedAt(performance.now());
      }
    }, { threshold: [0, 0.25, 0.5, 0.75, 1] });
    io.observe(el);
    return () => io.disconnect();
  }, [targetRef, startedAt, threshold]);

  useEffect(() => {
    if (!startedAt) return undefined;
    let active = true;
    const tick = () => {
      if (!active) return;
      const elapsed = performance.now() - startedAt;
      setNow(elapsed);
      const totalDuration = staggerMs * (count - 1) + durationMs + 200;
      if (elapsed < totalDuration) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      active = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [startedAt, count, staggerMs, durationMs]);

  return Array.from({ length: count }, (_, i) => {
    if (!startedAt) return { state: 0, elapsedInItem: 0 };
    const cardEnter = i * staggerMs;
    if (now < cardEnter) return { state: 0, elapsedInItem: 0 };
    const elapsedInItem = now - cardEnter;
    if (elapsedInItem >= durationMs) {
      return { state: 2, elapsedInItem };
    }
    return { state: 1, elapsedInItem };
  });
}
