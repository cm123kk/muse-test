import { useEffect, useRef } from 'react';

/**
 * useScrollProgress
 *
 * Records the progress (0-1) while the target element stays within the viewport
 * to both the `--p` CSS variable and the returned ref (`.current`).
 *
 * - CSS var: descendants can read `var(--p)` directly to compute transform/opacity
 * - ref:     read the latest value every frame inside RAF (0 rerenders)
 *
 * An IntersectionObserver gate detaches the scroll listener itself when off-screen,
 * so off-screen cost is 0.
 *
 * @param {React.RefObject<HTMLElement>} targetRef - wrapper whose progress is measured
 * @returns {React.MutableRefObject<number>} progress (0-1) ref updated every frame
 *
 * Example usage:
 *   const wrapperRef = useRef(null);
 *   const progressRef = useScrollProgress(wrapperRef);
 *   // both wrapperRef.current.style's --p and progressRef.current update to 0-1
 */
export function useScrollProgress(targetRef) {
  const progressRef = useRef(0);

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return undefined;
    let raf = 0;
    let listening = false;

    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      const p = total > 0 ? Math.max(0, Math.min(1, scrolled / total)) : 0;
      el.style.setProperty('--p', String(p));
      progressRef.current = p;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const attach = () => {
      if (listening) return;
      window.addEventListener('scroll', onScroll, { passive: true });
      listening = true;
      update();
    };
    const detach = () => {
      if (!listening) return;
      window.removeEventListener('scroll', onScroll);
      listening = false;
    };

    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) attach();
      else detach();
    });
    io.observe(el);

    update();

    return () => {
      io.disconnect();
      detach();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [targetRef]);

  return progressRef;
}
