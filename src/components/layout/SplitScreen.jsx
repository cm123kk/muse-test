import { Box } from '@mui/material';

/**
 * SplitScreen component
 *
 * A layout component that splits the screen into two regions.
 * Supports everything from a default 50:50 split to custom ratios.
 *
 * How it works:
 * 1. Splits horizontally (row) or vertically (column) based on direction
 * 2. Adjusts the split ratio via ratio (default 50:50)
 * 3. Switches to a stacked layout at the stackAt breakpoint
 * 4. Each region can have its own background and styles
 *
 * Props:
 * @param {ReactNode} left - Content for the left (or top) region [Required]
 * @param {ReactNode} right - Content for the right (or bottom) region [Required]
 * @param {string} direction - Split direction ('row' | 'column') [Optional, default: 'row']
 * @param {string|number[]} ratio - Split ratio ('50:50' | '60:40' | '70:30' | [number, number]) [Optional, default: '50:50']
 * @param {number} gap - Gap between regions [Optional, default: 0]
 * @param {string} stackAt - Stacking breakpoint ('xs' | 'sm' | 'md' | 'lg' | 'none') [Optional, default: 'sm']
 * @param {string} stackOrder - Order when stacked ('normal' | 'reverse') [Optional, default: 'normal']
 * @param {string} minHeight - Minimum height [Optional]
 * @param {boolean} isFullHeight - Apply 100vh height [Optional, default: false]
 * @param {object} leftSx - Additional styles for the left region [Optional]
 * @param {object} rightSx - Additional styles for the right region [Optional]
 * @param {object} sx - Additional container styles [Optional]
 *
 * Example usage:
 * <SplitScreen
 *   left={<ImageSection />}
 *   right={<ContentSection />}
 *   ratio="60:40"
 * />
 * <SplitScreen
 *   direction="column"
 *   left={<Header />}
 *   right={<Main />}
 *   ratio={[30, 70]}
 *   isFullHeight
 * />
 */
export function SplitScreen({
  left,
  right,
  direction = 'row',
  ratio = '50:50',
  gap = 0,
  stackAt = 'sm',
  stackOrder = 'normal',
  minHeight,
  isFullHeight = false,
  leftSx,
  rightSx,
  sx,
  ...props
}) {
  /**
   * Convert the ratio prop to a flex ratio
   * - string ('50:50') -> [50, 50]
   * - array -> used as is
   */
  const getRatios = () => {
    if (Array.isArray(ratio)) {
      return ratio;
    }

    // Preset ratios
    const presets = {
      '50:50': [50, 50],
      '60:40': [60, 40],
      '40:60': [40, 60],
      '70:30': [70, 30],
      '30:70': [30, 70],
      '75:25': [75, 25],
      '25:75': [25, 75],
    };

    if (presets[ratio]) {
      return presets[ratio];
    }

    // Parse custom string
    if (typeof ratio === 'string' && ratio.includes(':')) {
      return ratio.split(':').map(Number);
    }

    return [50, 50];
  };

  const [leftRatio, rightRatio] = getRatios();

  /**
   * Set responsive flex-direction
   */
  const getResponsiveDirection = () => {
    if (stackAt === 'none') {
      return direction;
    }

    const stackDirection = stackOrder === 'reverse' ? 'column-reverse' : 'column';

    const breakpoints = {
      xs: { xs: stackDirection, sm: direction },
      sm: { xs: stackDirection, sm: stackDirection, md: direction },
      md: { xs: stackDirection, sm: stackDirection, md: stackDirection, lg: direction },
      lg: { xs: stackDirection, sm: stackDirection, md: stackDirection, lg: stackDirection, xl: direction },
    };

    return breakpoints[stackAt] || direction;
  };

  /**
   * Set responsive flex values
   */
  const getResponsiveFlex = (ratioValue) => {
    if (stackAt === 'none') {
      return `0 0 ${ratioValue}%`;
    }

    const stackValue = '0 0 auto';
    const normalValue = `0 0 ${ratioValue}%`;

    const breakpoints = {
      xs: { xs: stackValue, sm: normalValue },
      sm: { xs: stackValue, sm: stackValue, md: normalValue },
      md: { xs: stackValue, sm: stackValue, md: stackValue, lg: normalValue },
      lg: { xs: stackValue, sm: stackValue, md: stackValue, lg: stackValue, xl: normalValue },
    };

    return breakpoints[stackAt] || normalValue;
  };

  return (
    <Box
      sx={ {
        display: 'flex',
        flexDirection: getResponsiveDirection(),
        gap: gap,
        minHeight: minHeight,
        height: isFullHeight ? '100svh' : undefined,
        width: '100%',
        ...sx,
      } }
      { ...props }
    >
      <Box
        sx={ {
          flex: getResponsiveFlex(leftRatio),
          minWidth: 0,
          minHeight: 0,
          ...leftSx,
        } }
      >
        { left }
      </Box>
      <Box
        sx={ {
          flex: getResponsiveFlex(rightRatio),
          minWidth: 0,
          minHeight: 0,
          ...rightSx,
        } }
      >
        { right }
      </Box>
    </Box>
  );
}

/**
 * StickySection component
 *
 * Used together with SplitScreen to make one region sticky.
 * Stays fixed while the content on the opposite side scrolls.
 *
 * Props:
 * @param {ReactNode} children - Section content [Required]
 * @param {string} position - Sticky position ('top' | 'bottom') [Optional, default: 'top']
 * @param {string|number} offset - Top/bottom offset [Optional, default: 0]
 * @param {string} height - Section height [Optional, default: '100vh']
 * @param {object} sx - Additional styles [Optional]
 *
 * Example usage:
 * <SplitScreen
 *   left={
 *     <StickySection>
 *       <FixedImage />
 *     </StickySection>
 *   }
 *   right={<ScrollingContent />}
 * />
 */
export function StickySection({
  children,
  position = 'top',
  offset = 0,
  height = '100vh',
  sx,
  ...props
}) {
  const offsetValue = typeof offset === 'number' ? `${offset}px` : offset;

  return (
    <Box
      sx={ {
        position: 'sticky',
        [position]: offsetValue,
        height: height,
        overflow: 'hidden',
        ...sx,
      } }
      { ...props }
    >
      { children }
    </Box>
  );
}

/**
 * SplitOverlay component
 *
 * A wrapper that applies an overlay effect to a SplitScreen region.
 *
 * Props:
 * @param {ReactNode} children - Content [Required]
 * @param {string} background - Background image URL or CSS value [Optional]
 * @param {string|number} overlay - Overlay color or opacity [Optional]
 * @param {string} align - Vertical alignment of content [Optional, default: 'center']
 * @param {string} justify - Horizontal alignment of content [Optional, default: 'center']
 * @param {object} sx - Additional styles [Optional]
 *
 * Example usage:
 * <SplitScreen
 *   left={
 *     <SplitOverlay background="hero.jpg" overlay={0.4}>
 *       <Content />
 *     </SplitOverlay>
 *   }
 *   right={<FormSection />}
 * />
 */
export function SplitOverlay({
  children,
  background,
  overlay,
  align = 'center',
  justify = 'center',
  sx,
  ...props
}) {
  const alignMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
  };

  const getBackgroundStyle = () => {
    if (!background) return {};

    if (background.startsWith('http') || background.startsWith('/') || background.startsWith('data:')) {
      return {
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }

    return { background };
  };

  const getOverlayStyle = () => {
    if (!overlay) return null;

    return {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: typeof overlay === 'number' ? `rgba(0,0,0,${overlay})` : overlay,
      pointerEvents: 'none',
    };
  };

  return (
    <Box
      sx={ {
        position: 'relative',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: alignMap[align] || 'center',
        justifyContent: alignMap[justify] || 'center',
        ...getBackgroundStyle(),
        ...(overlay && { '&::before': getOverlayStyle() }),
        ...sx,
      } }
      { ...props }
    >
      <Box sx={ { position: 'relative', zIndex: 1 } }>
        { children }
      </Box>
    </Box>
  );
}
