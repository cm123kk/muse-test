import { forwardRef, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { keyframes } from '@mui/material/styles';

/**
 * Active indicator pulse animation
 */
const pulseKeyframe = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;

/**
 * Progress bar shimmer effect
 */
const shimmerKeyframe = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

/**
 * Indicator component
 *
 * An indicator that shows the current position in carousels, sliders, pagination, and similar UI.
 * Supports a variety of visual styles and interactions.
 *
 * How it works:
 * 1. Displays the total count and current position via total and current
 * 2. Applies different visual styles based on variant (dot, line, dash, fraction, progress)
 * 3. Allows navigating to a specific index via onClick
 * 4. Supports keyboard accessibility (arrow keys for navigation)
 *
 * Props:
 * @param {number} total - Total number of items [Required]
 * @param {number} current - Current active index (0-based) [Required]
 * @param {string} variant - Indicator style ('dot' | 'line' | 'dash' | 'fraction' | 'progress') [Optional, default: 'dot']
 * @param {string} direction - Layout direction ('horizontal' | 'vertical') [Optional, default: 'horizontal']
 * @param {string} size - Size ('sm' | 'md' | 'lg') [Optional, default: 'md']
 * @param {string} activeColor - Active color [Optional, default: 'common.white']
 * @param {string} inactiveColor - Inactive color [Optional, default: 'rgba(255,255,255,0.4)']
 * @param {number} gap - Spacing between items (spacing unit) [Optional, default: 1]
 * @param {boolean} hasAnimation - Enable animation [Optional, default: true]
 * @param {boolean} hasHoverEffect - Enable hover effect [Optional, default: true]
 * @param {function} onClick - Click handler (index) => void [Optional]
 * @param {function} onKeyNavigate - Keyboard navigation handler (direction: 'prev' | 'next') => void [Optional]
 * @param {object} sx - Additional styles [Optional]
 *
 * Example usage:
 * <Indicator
 *   total={5}
 *   current={2}
 *   variant="dot"
 *   onClick={(index) => setCurrentSlide(index)}
 * />
 */
const Indicator = forwardRef(function Indicator({
  total,
  current,
  variant = 'dot',
  direction = 'horizontal',
  size = 'md',
  activeColor = 'common.white',
  inactiveColor = 'rgba(255,255,255,0.4)',
  gap = 1,
  hasAnimation = true,
  hasHoverEffect = true,
  onClick,
  onKeyNavigate,
  sx,
  ...props
}, ref) {
  /**
   * Dimension definitions per size
   */
  const sizeMap = {
    sm: {
      dot: 6,
      line: { width: 16, height: 2 },
      dash: { width: 12, height: 2, activeWidth: 24 },
      fontSize: 11,
      progressHeight: 2,
    },
    md: {
      dot: 8,
      line: { width: 24, height: 3 },
      dash: { width: 16, height: 3, activeWidth: 32 },
      fontSize: 13,
      progressHeight: 3,
    },
    lg: {
      dot: 10,
      line: { width: 32, height: 4 },
      dash: { width: 20, height: 4, activeWidth: 40 },
      fontSize: 15,
      progressHeight: 4,
    },
  };

  const dimensions = sizeMap[size] || sizeMap.md;
  const isVertical = direction === 'vertical';
  const isInteractive = Boolean(onClick);

  /**
   * Keyboard navigation handler
   */
  const handleKeyDown = useCallback((e) => {
    if (!onKeyNavigate) return;

    const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft';
    const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight';

    if (e.key === prevKey) {
      e.preventDefault();
      onKeyNavigate('prev');
    } else if (e.key === nextKey) {
      e.preventDefault();
      onKeyNavigate('next');
    }
  }, [isVertical, onKeyNavigate]);

  /**
   * Shared interaction styles
   */
  const getInteractionStyles = (isActive) => {
    if (!isInteractive) return {};

    return {
      cursor: 'pointer',
      '&:hover': hasHoverEffect ? {
        transform: isActive ? 'scale(1.15)' : 'scale(1.25)',
        opacity: 1,
      } : {},
      '&:focus-visible': {
        outline: '2px solid',
        outlineColor: activeColor,
        outlineOffset: 2,
      },
    };
  };

  /**
   * Fraction type rendering (e.g. "02 / 05")
   */
  if (variant === 'fraction') {
    const formatNumber = (n) => String(n).padStart(2, '0');

    return (
      <Box
        ref={ref}
        role="status"
        aria-label={`${current + 1} of ${total}`}
        sx={{
          display: 'inline-flex',
          alignItems: 'baseline',
          gap: 0.75,
          fontFamily: '"JetBrains Mono", "SF Mono", monospace',
          fontSize: dimensions.fontSize,
          fontWeight: 500,
          letterSpacing: '0.05em',
          ...sx,
        }}
        {...props}
      >
        <Typography
          component="span"
          sx={{
            color: activeColor,
            fontWeight: 600,
            fontSize: 'inherit',
            fontFamily: 'inherit',
            letterSpacing: 'inherit',
          }}
        >
          {formatNumber(current + 1)}
        </Typography>
        <Typography
          component="span"
          sx={{
            color: inactiveColor,
            fontSize: '0.85em',
            fontFamily: 'inherit',
          }}
        >
          /
        </Typography>
        <Typography
          component="span"
          sx={{
            color: inactiveColor,
            fontSize: 'inherit',
            fontFamily: 'inherit',
            letterSpacing: 'inherit',
          }}
        >
          {formatNumber(total)}
        </Typography>
      </Box>
    );
  }

  /**
   * Progress type rendering (progress bar)
   */
  if (variant === 'progress') {
    const progressPercent = ((current + 1) / total) * 100;

    return (
      <Box
        ref={ref}
        role="progressbar"
        aria-valuenow={current + 1}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Progress: ${current + 1} of ${total}`}
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: 180,
          height: dimensions.progressHeight,
          backgroundColor: inactiveColor,
          borderRadius: dimensions.progressHeight / 2,
          overflow: 'hidden',
          ...sx,
        }}
        {...props}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${progressPercent}%`,
            height: '100%',
            backgroundColor: activeColor,
            borderRadius: 'inherit',
            transition: hasAnimation ? 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
            // Shimmer effect
            '&::after': hasAnimation ? {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(
                90deg,
                transparent 0%,
                rgba(255,255,255,0.3) 50%,
                transparent 100%
              )`,
              backgroundSize: '200% 100%',
              animation: `${shimmerKeyframe} 2s ease-in-out infinite`,
            } : {},
          }}
        />
      </Box>
    );
  }

  /**
   * Dot / Line / Dash type rendering
   */
  const items = Array.from({ length: total }, (_, index) => index);

  return (
    <Box
      ref={ref}
      role="tablist"
      aria-label="Slide indicators"
      tabIndex={onKeyNavigate ? 0 : undefined}
      onKeyDown={handleKeyDown}
      sx={{
        display: 'inline-flex',
        flexDirection: isVertical ? 'column' : 'row',
        alignItems: 'center',
        gap: gap,
        outline: 'none',
        ...sx,
      }}
      {...props}
    >
      {items.map((index) => {
        const isActive = index === current;

        // Dot variant
        if (variant === 'dot') {
          return (
            <Box
              key={index}
              role="tab"
              aria-selected={isActive}
              aria-label={`Go to slide ${index + 1}`}
              tabIndex={isInteractive ? 0 : -1}
              onClick={onClick ? () => onClick(index) : undefined}
              sx={{
                width: dimensions.dot,
                height: dimensions.dot,
                borderRadius: '50%',
                backgroundColor: isActive ? activeColor : inactiveColor,
                opacity: isActive ? 1 : 0.6,
                transition: hasAnimation
                  ? 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                  : 'none',
                transform: isActive ? 'scale(1.15)' : 'scale(1)',
                animation: isActive && hasAnimation
                  ? `${pulseKeyframe} 2s ease-in-out infinite`
                  : 'none',
                ...getInteractionStyles(isActive),
              }}
            />
          );
        }

        // Line variant
        if (variant === 'line') {
          return (
            <Box
              key={index}
              role="tab"
              aria-selected={isActive}
              aria-label={`Go to slide ${index + 1}`}
              tabIndex={isInteractive ? 0 : -1}
              onClick={onClick ? () => onClick(index) : undefined}
              sx={{
                width: isVertical ? dimensions.line.height : dimensions.line.width,
                height: isVertical ? dimensions.line.width : dimensions.line.height,
                borderRadius: dimensions.line.height / 2,
                backgroundColor: isActive ? activeColor : inactiveColor,
                opacity: isActive ? 1 : 0.5,
                transition: hasAnimation
                  ? 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  : 'none',
                transform: isActive
                  ? (isVertical ? 'scaleY(1.3)' : 'scaleX(1.3)')
                  : 'scale(1)',
                transformOrigin: 'center',
                ...getInteractionStyles(isActive),
              }}
            />
          );
        }

        // Dash variant (expands when active)
        if (variant === 'dash') {
          const baseWidth = isVertical ? dimensions.dash.height : dimensions.dash.width;
          const activeWidth = isVertical ? dimensions.dash.height : dimensions.dash.activeWidth;
          const baseHeight = isVertical ? dimensions.dash.width : dimensions.dash.height;
          const activeHeight = isVertical ? dimensions.dash.activeWidth : dimensions.dash.height;

          return (
            <Box
              key={index}
              role="tab"
              aria-selected={isActive}
              aria-label={`Go to slide ${index + 1}`}
              tabIndex={isInteractive ? 0 : -1}
              onClick={onClick ? () => onClick(index) : undefined}
              sx={{
                width: isActive ? activeWidth : baseWidth,
                height: isActive ? activeHeight : baseHeight,
                borderRadius: dimensions.dash.height / 2,
                backgroundColor: isActive ? activeColor : inactiveColor,
                opacity: isActive ? 1 : 0.5,
                transition: hasAnimation
                  ? 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)'
                  : 'none',
                ...getInteractionStyles(isActive),
              }}
            />
          );
        }

        return null;
      })}
    </Box>
  );
});

export { Indicator };
