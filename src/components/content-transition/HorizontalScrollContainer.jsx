import React, { useRef, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

/**
 * HorizontalScrollContainer - horizontal scroll container
 *
 * A pure container that converts vertical scrolling into horizontal movement.
 * It scrolls only as far as the given content, and the moment the last item is
 * fully in view, it immediately switches back to vertical scrolling.
 *
 * How it works:
 * 1. Measure the actual rendered track width (px)
 * 2. Horizontal travel distance = track scrollWidth - viewport width
 * 3. Vertical scroll area = viewport height + horizontal travel distance (exact px mapping)
 * 4. Linearly map scrollYProgress [0->1] to horizontal movement [0->-distance px]
 *
 * Props:
 * @param {React.ReactNode} children - Slides wrapped in HorizontalScrollContainer.Slide [Required]
 * @param {string} gap - Gap between slides (CSS unit) [Optional, default: '0px']
 * @param {string} padding - Left/right padding (CSS unit) [Optional, default: '0px']
 * @param {string} backgroundColor - Background color [Optional, default: 'transparent']
 * @param {function} onScrollProgress - Scroll progress callback (0-1) [Optional]
 *
 * Example usage:
 * <HorizontalScrollContainer gap="24px" padding="40px">
 *   <HorizontalScrollContainer.Slide>Content 1</HorizontalScrollContainer.Slide>
 *   <HorizontalScrollContainer.Slide>Content 2</HorizontalScrollContainer.Slide>
 *   <HorizontalScrollContainer.Slide>Content 3</HorizontalScrollContainer.Slide>
 * </HorizontalScrollContainer>
 */
function HorizontalScrollContainer({
  children,
  gap = '0px',
  padding = '0px',
  backgroundColor = 'transparent',
  onScrollProgress,
}) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [scrollDistance, setScrollDistance] = useState(0);

  // Measure the actual rendered track width to compute the exact scroll distance (px)
  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      const trackWidth = trackRef.current.scrollWidth;
      const viewportWidth = window.innerWidth;
      setScrollDistance(Math.max(0, trackWidth - viewportWidth));
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [children, gap, padding]);

  // Vertical scroll area height = viewport height + horizontal travel distance (px)
  // -> reaching scrollYProgress 1 = last item fully visible = immediate switch to vertical scroll
  const containerHeight = window.innerHeight + scrollDistance;

  // Track scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Invoke the scroll progress callback
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    onScrollProgress?.(v);
  });

  // Horizontal movement transform: 0px -> -scrollDistance px
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -scrollDistance]
  );

  return (
    <Box
      ref={ containerRef }
      component="section"
      sx={ {
        height: containerHeight,
        position: 'relative',
      } }
    >
      {/* Sticky container - pinned to the screen */}
      <Box
        sx={ {
          position: 'sticky',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          backgroundColor,
        } }
      >
        {/* Horizontal slide track */}
        {/* width: max-content -> the flex container expands to fit all content plus padding on both sides,
            so paddingRight is preserved even on overflow */}
        <motion.div
          ref={ trackRef }
          style={ {
            x,
            display: 'flex',
            width: 'max-content',
            gap,
            alignItems: 'center',
            height: '100%',
            paddingLeft: padding,
            paddingRight: padding,
          } }
        >
          { children }
        </motion.div>
      </Box>
    </Box>
  );
}

/**
 * HorizontalScrollContainer.Slide - slide item
 *
 * Props:
 * @param {React.ReactNode} children - Content inside the slide [Required]
 */
function Slide({ children }) {
  return (
    <Box
      sx={ {
        position: 'relative',
        width: 'fit-content',
        height: 'fit-content',
        flexShrink: 0,
      } }
    >
      { children }
    </Box>
  );
}

HorizontalScrollContainer.Slide = Slide;

export { HorizontalScrollContainer };
