import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';

/**
 * PerspectiveTransition component
 *
 * A 3D perspective rotation transition animation.
 * Applies an effect where the element lies back and then rises up to its original shape.
 * Uses only GPU-accelerated properties based on CSS perspective + rotateX.
 *
 * How it works:
 * 1. In the initial state, the element is tilted back via rotateX (opacity: 0)
 * 2. When isIn becomes true, it rises up to rotateX(0deg) and appears
 * 3. transformOrigin determines the rotation axis (hinge)
 * 4. When isTriggerOnView is true, it triggers automatically as the element enters the viewport
 *
 * Props:
 * @param {React.ReactNode} children - Content to transition [Required]
 * @param {boolean} isIn - Visibility (true: upright, false: lying back) [Optional, default: true]
 * @param {number} rotateFrom - Initial rotation angle (deg, positive: tilt back) [Optional, default: 60]
 * @param {string} transformOrigin - Rotation axis reference point [Optional, default: 'bottom center']
 * @param {number} perspective - Perspective distance (px, lower is more exaggerated) [Optional, default: 800]
 * @param {number} duration - Transition time (milliseconds) [Optional, default: 600]
 * @param {number} delay - Transition delay (milliseconds) [Optional, default: 0]
 * @param {string} easing - CSS easing function [Optional, default: 'cubic-bezier(0.16, 1, 0.3, 1)']
 * @param {boolean} isTriggerOnView - Whether to auto-trigger on viewport entry [Optional, default: false]
 * @param {number} threshold - IntersectionObserver detection ratio (0~1) [Optional, default: 0.1]
 * @param {object} sx - MUI sx styles [Optional]
 *
 * Example usage:
 * <PerspectiveTransition isTriggerOnView>Card</PerspectiveTransition>
 * <PerspectiveTransition rotateFrom={-90} perspective={600} duration={800}>Content</PerspectiveTransition>
 */
function PerspectiveTransition({
  children,
  isIn = true,
  rotateFrom = 60,
  transformOrigin = 'bottom center',
  perspective = 800,
  duration = 600,
  delay = 0,
  easing = 'cubic-bezier(0.16, 1, 0.3, 1)',
  isTriggerOnView = false,
  threshold = 0.1,
  sx = {},
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  /** IntersectionObserver-based viewport entry detection */
  useEffect(() => {
    if (!isTriggerOnView) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isTriggerOnView, threshold]);

  /** Switch state on the next frame after mount -> triggers the CSS transition */
  useEffect(() => {
    if (isTriggerOnView) return;
    const raf = requestAnimationFrame(() => {
      setIsVisible(isIn);
    });
    return () => cancelAnimationFrame(raf);
  }, [isIn, isTriggerOnView]);

  const isActive = isVisible;

  return (
    <Box
      ref={ ref }
      sx={ {
        perspective: `${perspective}px`,
        ...sx,
      } }
    >
      <Box
        sx={ {
          opacity: isActive ? 1 : 0,
          transform: isActive
            ? 'rotateX(0deg)'
            : `rotateX(${rotateFrom}deg)`,
          transformOrigin,
          transition: `opacity ${duration}ms ${easing} ${delay}ms, transform ${duration}ms ${easing} ${delay}ms`,
          willChange: 'opacity, transform',
          '@media (prefers-reduced-motion: reduce)': {
            transition: 'none',
            opacity: 1,
            transform: 'none',
          },
        } }
      >
        { children }
      </Box>
    </Box>
  );
}

export default PerspectiveTransition;
