import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';

/** Compute the initial transform offset per direction */
function getTranslate(direction, distance) {
  switch (direction) {
    case 'up': return `translateY(${distance}px)`;
    case 'down': return `translateY(-${distance}px)`;
    case 'left': return `translateX(${distance}px)`;
    case 'right': return `translateX(-${distance}px)`;
    default: return 'none';
  }
}

/**
 * FadeTransition component
 *
 * A basic opacity transition animation.
 * Applies a fade effect as an element enters/exits,
 * and can optionally combine a slide direction.
 *
 * How it works:
 * 1. When isIn becomes true, it fades in from opacity 0 -> 1
 * 2. When direction is set, it appears while sliding in from that direction
 * 3. When isIn becomes false, it fades out in reverse
 * 4. When isTriggerOnView is true, it triggers automatically as the element enters the viewport
 *
 * Props:
 * @param {React.ReactNode} children - Content to fade [Required]
 * @param {boolean} isIn - Visibility (true: fade in, false: fade out) [Optional, default: true]
 * @param {number} duration - Transition time (milliseconds) [Optional, default: 500]
 * @param {number} delay - Transition delay (milliseconds) [Optional, default: 0]
 * @param {string} direction - Slide direction ('none' | 'up' | 'down' | 'left' | 'right') [Optional, default: 'none']
 * @param {number} distance - Slide distance (px) [Optional, default: 24]
 * @param {boolean} isTriggerOnView - Whether to auto-trigger on viewport entry [Optional, default: false]
 * @param {number} threshold - IntersectionObserver detection ratio (0~1) [Optional, default: 0.1]
 * @param {string} easing - CSS easing function [Optional, default: 'cubic-bezier(0.4, 0, 0.2, 1)']
 * @param {object} sx - MUI sx styles [Optional]
 *
 * Example usage:
 * <FadeTransition>Content</FadeTransition>
 * <FadeTransition direction="up" duration={700} isTriggerOnView>Card</FadeTransition>
 */
function FadeTransition({
  children,
  isIn = true,
  duration = 500,
  delay = 0,
  direction = 'none',
  distance = 24,
  isTriggerOnView = false,
  threshold = 0.1,
  easing = 'cubic-bezier(0.4, 0, 0.2, 1)',
  sx = {},
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(!isTriggerOnView && isIn);

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

  /** Sync state with isIn prop changes */
  useEffect(() => {
    if (!isTriggerOnView) {
      setIsVisible(isIn);
    }
  }, [isIn, isTriggerOnView]);

  const isActive = isVisible;
  const transform = isActive ? 'none' : getTranslate(direction, distance);

  return (
    <Box
      ref={ ref }
      sx={ {
        opacity: isActive ? 1 : 0,
        transform,
        transition: `opacity ${duration}ms ${easing} ${delay}ms, transform ${duration}ms ${easing} ${delay}ms`,
        willChange: 'opacity, transform',
        '@media (prefers-reduced-motion: reduce)': {
          transition: 'none',
          opacity: 1,
          transform: 'none',
        },
        ...sx,
      } }
    >
      { children }
    </Box>
  );
}

export default FadeTransition;
