import Box from '@mui/material/Box';

/**
 * CarouselIndicator component
 *
 * An indicator component that shows the current position in a carousel, slider, and so on.
 * Supports various styles such as dot, line, and fraction.
 *
 * How it works:
 * 1. total and current show the total count and the current position
 * 2. A different visual style is applied depending on type
 * 3. onClick lets you jump to a specific index when clicked
 *
 * Props:
 * @param {number} total - Total number of items [Required]
 * @param {number} current - Current active index (0-based) [Required]
 * @param {string} type - Indicator type ('dot' | 'line' | 'fraction' | 'progress') [Optional, default: 'dot']
 * @param {string} direction - Layout direction ('horizontal' | 'vertical') [Optional, default: 'horizontal']
 * @param {string} size - Size ('sm' | 'md' | 'lg') [Optional, default: 'md']
 * @param {string} activeColor - Active color [Optional, default: 'primary.main']
 * @param {string} inactiveColor - Inactive color [Optional, default: 'grey.400']
 * @param {number} gap - Spacing between items [Optional, default: 1]
 * @param {function} onClick - Click handler (index) => void [Optional]
 * @param {object} sx - Additional styles [Optional]
 *
 * Example usage:
 * <CarouselIndicator
 *   total={5}
 *   current={2}
 *   type="dot"
 *   onClick={(index) => setCurrentSlide(index)}
 * />
 */
export function CarouselIndicator({
  total,
  current,
  type = 'dot',
  direction = 'horizontal',
  size = 'md',
  activeColor = 'primary.main',
  inactiveColor = 'grey.400',
  gap = 1,
  onClick,
  sx,
  ...props
}) {
  /**
   * Dimensions per size
   */
  const sizes = {
    sm: { dot: 6, line: { width: 16, height: 2 } },
    md: { dot: 8, line: { width: 24, height: 3 } },
    lg: { dot: 10, line: { width: 32, height: 4 } },
  };

  const currentSize = sizes[size] || sizes.md;

  /**
   * Fraction type rendering (e.g. "2 / 5")
   */
  if (type === 'fraction') {
    return (
      <Box
        sx={ {
          display: 'flex',
          alignItems: 'center',
          fontFamily: 'monospace',
          fontSize: size === 'sm' ? 12 : size === 'lg' ? 16 : 14,
          color: 'text.secondary',
          ...sx,
        } }
        { ...props }
      >
        <Box component="span" sx={ { color: activeColor, fontWeight: 700 } }>
          { current + 1 }
        </Box>
        <Box component="span" sx={ { mx: 0.5, opacity: 0.5 } }>/</Box>
        <Box component="span">{ total }</Box>
      </Box>
    );
  }

  /**
   * Progress type rendering (progress bar)
   */
  if (type === 'progress') {
    const progressPercent = ((current + 1) / total) * 100;

    return (
      <Box
        sx={ {
          width: '100%',
          maxWidth: 200,
          height: currentSize.line.height,
          backgroundColor: inactiveColor,
          borderRadius: 1,
          overflow: 'hidden',
          ...sx,
        } }
        { ...props }
      >
        <Box
          sx={ {
            width: `${progressPercent}%`,
            height: '100%',
            backgroundColor: activeColor,
            transition: 'width 0.3s ease-out',
          } }
        />
      </Box>
    );
  }

  /**
   * Dot / Line type rendering
   */
  const items = Array.from({ length: total }, (_, index) => index);
  const isVertical = direction === 'vertical';

  return (
    <Box
      sx={ {
        display: 'flex',
        flexDirection: isVertical ? 'column' : 'row',
        alignItems: 'center',
        gap: gap,
        ...sx,
      } }
      { ...props }
    >
      { items.map((index) => {
        const isActive = index === current;

        if (type === 'line') {
          return (
            <Box
              key={ index }
              onClick={ onClick ? () => onClick(index) : undefined }
              sx={ {
                width: isVertical ? currentSize.line.height : currentSize.line.width,
                height: isVertical ? currentSize.line.width : currentSize.line.height,
                backgroundColor: isActive ? activeColor : inactiveColor,
                borderRadius: 0.5,
                cursor: onClick ? 'pointer' : 'default',
                transition: 'all 0.2s ease-out',
                transform: isActive ? 'scaleX(1.2)' : 'scaleX(1)',
                transformOrigin: 'center',
                '&:hover': onClick ? {
                  backgroundColor: isActive ? activeColor : 'grey.500',
                } : {},
              } }
            />
          );
        }

        // Dot type (default)
        return (
          <Box
            key={ index }
            onClick={ onClick ? () => onClick(index) : undefined }
            sx={ {
              width: currentSize.dot,
              height: currentSize.dot,
              borderRadius: '50%',
              backgroundColor: isActive ? activeColor : inactiveColor,
              cursor: onClick ? 'pointer' : 'default',
              transition: 'all 0.2s ease-out',
              transform: isActive ? 'scale(1.2)' : 'scale(1)',
              '&:hover': onClick ? {
                backgroundColor: isActive ? activeColor : 'grey.500',
                transform: 'scale(1.3)',
              } : {},
            } }
          />
        );
      }) }
    </Box>
  );
}
