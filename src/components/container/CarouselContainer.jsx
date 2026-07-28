import { forwardRef, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

/**
 * CarouselContainer component
 *
 * Responsive multi-item carousel container.
 * Adjusts the number of items visible at once per breakpoint,
 * and navigates through items with left/right controls.
 *
 * How it works:
 * 1. Determines the number of visible items per breakpoint based on the visible prop
 * 2. Automatically detects the container width to calculate item width
 * 3. Slides by step units when the left/right arrows are clicked
 * 4. Applies smooth animation via transform translate
 *
 * Props:
 * @param {Array} items - Array of items to render [Required]
 * @param {function} renderItem - Item renderer (item, index) => ReactNode [Required]
 * @param {object} visible - Number of items visible per breakpoint {xs, sm, md, lg, xl} [Optional, default: {xs:1, sm:2, md:3, lg:4}]
 * @param {number} gap - Gap between items (px) [Optional, default: 16]
 * @param {number} step - Number of items to move at once [Optional, default: 1]
 * @param {boolean} hasNavigation - Whether to show navigation buttons [Optional, default: true]
 * @param {boolean} hasDivider - Whether to show a divider between items [Optional, default: false]
 * @param {string} dividerColor - Divider color [Optional, default: 'divider']
 * @param {string} navPosition - Navigation position ('inside' | 'outside') [Optional, default: 'inside']
 * @param {function} onIndexChange - Index change callback (index) => void [Optional]
 * @param {object} sx - Additional styles [Optional]
 *
 * Example usage:
 * <CarouselContainer
 *   items={products}
 *   renderItem={(item, idx) => <ProductCard {...item} />}
 *   visible={{ xs: 1, sm: 2, md: 3, lg: 4 }}
 *   gap={24}
 * />
 */
const CarouselContainer = forwardRef(function CarouselContainer({
  items = [],
  renderItem,
  visible = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap = 16,
  step = 1,
  hasNavigation = true,
  hasDivider = false,
  dividerColor = 'divider',
  navPosition = 'inside',
  onIndexChange,
  sx,
  ...props
}, ref) {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));

  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  /**
   * Calculate the number of items visible at the current breakpoint
   */
  const visibleCount = useMemo(() => {
    if (isLgUp) return visible.lg ?? visible.xl ?? 4;
    if (isMd) return visible.md ?? 3;
    if (isSm) return visible.sm ?? 2;
    return visible.xs ?? 1;
  }, [isSm, isMd, isLgUp, visible]);

  /**
   * Maximum movable index
   */
  const maxIndex = Math.max(0, (items.length || 0) - visibleCount);

  /**
   * Clamp the index range when the breakpoint changes
   * Automatically adjusts currentIndex when maxIndex shrinks
   */
  const clampedIndex = Math.min(currentIndex, maxIndex);

  /**
   * Detect container width (ResizeObserver)
   */
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;

    const updateWidth = () => setContainerWidth(el.clientWidth);
    updateWidth();

    let resizeObserver;
    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(updateWidth);
      resizeObserver.observe(el);
    } else {
      window.addEventListener('resize', updateWidth);
    }

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      else window.removeEventListener('resize', updateWidth);
    };
  }, []);

  /**
   * Calculate item width
   * Subtract the gap from the container width, then divide by visibleCount
   */
  const itemWidth = useMemo(() => {
    if (containerWidth <= 0 || visibleCount <= 0) return 0;

    const totalGap = gap * (visibleCount - 1);
    const availableWidth = containerWidth - totalGap;
    const calculatedWidth = Math.floor(availableWidth / visibleCount);

    return Math.max(50, calculatedWidth);
  }, [containerWidth, visibleCount, gap]);

  /**
   * Move to the previous slide
   */
  const handlePrev = useCallback(() => {
    const newIndex = Math.max(0, clampedIndex - step);
    setCurrentIndex(newIndex);
    onIndexChange?.(newIndex);
  }, [clampedIndex, step, onIndexChange]);

  /**
   * Move to the next slide
   */
  const handleNext = useCallback(() => {
    const newIndex = Math.min(maxIndex, clampedIndex + step);
    setCurrentIndex(newIndex);
    onIndexChange?.(newIndex);
  }, [clampedIndex, maxIndex, step, onIndexChange]);

  /**
   * Calculate track travel distance
   */
  const translateX = -(clampedIndex * (itemWidth + gap));

  /**
   * Disabled state of the previous/next buttons
   */
  const isPrevDisabled = clampedIndex <= 0;
  const isNextDisabled = clampedIndex >= maxIndex;

  /**
   * Shared navigation button styles
   */
  const getNavButtonStyles = (isDisabled) => ({
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'background.paper',
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: 0,
    p: { xs: 0.75, sm: 1 },
    minWidth: 'auto',
    color: isDisabled ? 'text.disabled' : 'text.primary',
    opacity: isDisabled ? 0.4 : 1,
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: 2,
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: isDisabled ? 'background.paper' : 'action.hover',
      borderColor: isDisabled ? 'divider' : 'text.primary',
      boxShadow: 'none',
    },
    '&.Mui-disabled': {
      color: 'text.disabled',
      backgroundColor: 'background.paper',
    },
  });

  /**
   * Navigation button position (inside/outside)
   */
  const navOffset = navPosition === 'inside'
    ? { xs: 8, sm: 12, md: 16 }
    : { xs: -40, sm: -48, md: -56 };

  /**
   * Icon size (responsive)
   */
  const iconSize = isXs ? 18 : isSm ? 20 : isMd ? 22 : 24;

  return (
    <Box
      ref={ref}
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        overflow: navPosition === 'outside' ? 'visible' : 'hidden',
        ...sx,
      }}
      {...props}
    >
      {/* Slide track area */}
      <Box
        ref={containerRef}
        sx={{
          overflow: 'hidden',
          width: '100%',
          maxWidth: '100%',
          minWidth: 0,
          position: 'relative',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: `${gap}px`,
            transform: `translate3d(${translateX}px, 0, 0)`,
            transition: 'transform 350ms cubic-bezier(0.4, 0, 0.2, 1)',
            willChange: 'transform',
            width: `${(itemWidth + gap) * items.length - gap}px`,
            maxWidth: `${(itemWidth + gap) * items.length - gap}px`,
          }}
        >
          {items.map((item, idx) => {
            const isLastVisible = idx === Math.min(clampedIndex + visibleCount - 1, items.length - 1);

            return (
              <Box
                key={idx}
                sx={{
                  flex: '0 0 auto',
                  width: itemWidth,
                  maxWidth: itemWidth,
                  minWidth: itemWidth,
                  position: 'relative',
                  overflow: 'hidden',
                  // Divider
                  '&::after': hasDivider && !isLastVisible ? {
                    content: '""',
                    position: 'absolute',
                    right: `-${gap / 2}px`,
                    top: 0,
                    bottom: 0,
                    width: '1px',
                    backgroundColor: dividerColor,
                  } : {},
                }}
              >
                {renderItem(item, idx)}
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Navigation buttons */}
      {hasNavigation && items.length > visibleCount && (
        <>
          <IconButton
            onClick={handlePrev}
            disabled={isPrevDisabled}
            aria-label="Previous slide"
            sx={{
              ...getNavButtonStyles(isPrevDisabled),
              left: navOffset,
            }}
          >
            <ChevronLeftIcon sx={{ fontSize: iconSize }} />
          </IconButton>

          <IconButton
            onClick={handleNext}
            disabled={isNextDisabled}
            aria-label="Next slide"
            sx={{
              ...getNavButtonStyles(isNextDisabled),
              right: navOffset,
            }}
          >
            <ChevronRightIcon sx={{ fontSize: iconSize }} />
          </IconButton>
        </>
      )}
    </Box>
  );
});

export { CarouselContainer };
