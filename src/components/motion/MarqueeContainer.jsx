import * as React from 'react';
import { keyframes } from '@mui/material/styles';
import Box from '@mui/material/Box';

const scrollLeftKf = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`;

const scrollRightKf = keyframes`
  from { transform: translateX(-50%); }
  to { transform: translateX(0); }
`;

/**
 * MarqueeContainer component
 *
 * An infinite-loop horizontal flow animation container.
 * Continuously flows child elements such as text, images, and cards.
 * CSS keyframes-based GPU acceleration (translateX).
 *
 * How it works:
 * 1. Measures the container width and repeatedly fills items with no gaps
 * 2. Scrolls infinitely via a translateX animation
 * 3. Implements a seamless loop with duplicated elements
 * 4. (Optional) Pause on hover / switch to scroll scrubbing mode
 *
 * Props:
 * @param {React.ReactNode} children - Content to display inside the marquee [Required]
 * @param {number} speed - Time to complete one cycle (seconds, larger is slower) [Optional, default: 20]
 * @param {string} direction - Scroll direction ('left' | 'right') [Optional, default: 'left']
 * @param {boolean} isPauseOnHover - Whether to pause on hover [Optional, default: true]
 * @param {number} gap - Spacing between items (theme.spacing units) [Optional, default: 4]
 * @param {boolean} isScrollScrub - Scroll scrubbing mode [Optional, default: false]
 *
 * Example usage:
 * <MarqueeContainer speed={15} direction="left">
 *   <Chip label="React" />
 *   <Chip label="MUI" />
 * </MarqueeContainer>
 */
function MarqueeContainer({
  children,
  speed = 20,
  direction = 'left',
  isPauseOnHover = true,
  gap = 4,
  isScrollScrub = false,
}) {
  const containerRef = React.useRef(null);
  const measureRef = React.useRef(null);
  const trackRef = React.useRef(null);
  const [fillCount, setFillCount] = React.useState(1);

  const items = React.Children.toArray(children);
  const animation = direction === 'left' ? scrollLeftKf : scrollRightKf;

  /** Compute how many times the item set repeats relative to the container width */
  React.useEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return;

    const calculate = () => {
      const containerW = container.offsetWidth;
      const setW = measure.scrollWidth;
      if (setW === 0) return;
      setFillCount(Math.max(1, Math.ceil(containerW / setW)));
    };

    calculate();
    const ro = new ResizeObserver(calculate);
    ro.observe(container);
    return () => ro.disconnect();
  }, [children, gap]);

  /** Scroll scrubbing: control translateX by the element's viewport-pass progress */
  React.useEffect(() => {
    if (!isScrollScrub) return;
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const onScroll = () => {
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.max(0, Math.min(1,
        (vh - rect.top) / (vh + rect.height)
      ));

      const halfWidth = track.scrollWidth / 2;
      const mult = direction === 'left' ? -1 : 1;
      const offset = (progress * halfWidth) % halfWidth;
      track.style.transform = `translateX(${mult * offset}px)`;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [isScrollScrub, direction, fillCount]);

  /** Render one item set (repeated fillCount times) */
  const renderHalf = (prefix) =>
    Array.from({ length: fillCount }, (_, rep) =>
      items.map((child, i) => (
        <Box key={ `${prefix}-${rep}-${i}` } sx={ { flexShrink: 0, mr: gap } }>
          { child }
        </Box>
      ))
    ).flat();

  return (
    <Box
      ref={ containerRef }
      sx={ {
        overflow: 'hidden',
        width: '100%',
        position: 'relative',
        ...(isPauseOnHover && !isScrollScrub && {
          '&:hover > [data-marquee-track]': {
            animationPlayState: 'paused',
          },
        }),
      } }
    >
      {/* Hidden element for measurement: computes the actual width of one item set */}
      <Box
        ref={ measureRef }
        aria-hidden="true"
        sx={ {
          display: 'flex',
          position: 'absolute',
          visibility: 'hidden',
          pointerEvents: 'none',
        } }
      >
        { items.map((child, i) => (
          <Box key={ i } sx={ { flexShrink: 0, mr: gap } }>{ child }</Box>
        )) }
      </Box>

      {/* Track: two identical copies -> a seamless loop via translateX(-50%) */}
      <Box
        ref={ trackRef }
        data-marquee-track=""
        sx={ {
          display: 'flex',
          alignItems: 'center',
          width: 'max-content',
          ...(!isScrollScrub && {
            animation: `${animation} ${speed}s linear infinite`,
          }),
          '@media (prefers-reduced-motion: reduce)': {
            animation: 'none',
            transform: 'none !important',
          },
        } }
      >
        { renderHalf('a') }
        { renderHalf('b') }
      </Box>
    </Box>
  );
}

export default MarqueeContainer;
