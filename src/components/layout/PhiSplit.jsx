import { Box } from '@mui/material';

/**
 * Golden ratio constant
 */
const PHI = 1.618033988749895;

/**
 * PhiSplit component
 *
 * A layout component that splits two regions based on the golden ratio (phi = 1.618).
 * Uses CSS Flexbox to arrange content at roughly a 61.8% : 38.2% ratio.
 *
 * How it works:
 * 1. direction prop determines a horizontal (row) or vertical (column) split
 * 2. The primary and secondary regions are arranged by the golden ratio
 * 3. When reversed is true, the ratio is inverted so the smaller region comes first
 * 4. Automatically switches to a stacked layout at responsive breakpoints
 *
 * Props:
 * @param {ReactNode} primary - Content placed in the larger region of the golden ratio [Required]
 * @param {ReactNode} secondary - Content placed in the smaller region of the golden ratio [Required]
 * @param {string} direction - Split direction ('row' | 'column') [Optional, default: 'row']
 * @param {boolean} isReversed - Invert the ratio (smaller region first) [Optional, default: false]
 * @param {number} gap - Gap between regions (theme spacing units) [Optional, default: 0]
 * @param {string} stackAt - Breakpoint at which it switches to stacked ('xs' | 'sm' | 'md' | 'lg' | 'none') [Optional, default: 'sm']
 * @param {string} minHeight - Minimum container height [Optional]
 * @param {object} primarySx - Additional styles for the primary region [Optional]
 * @param {object} secondarySx - Additional styles for the secondary region [Optional]
 * @param {object} sx - Additional container styles [Optional]
 *
 * Example usage:
 * <PhiSplit
 *   primary={<HeroImage />}
 *   secondary={<HeroText />}
 *   gap={4}
 * />
 * <PhiSplit
 *   direction="column"
 *   isReversed
 *   primary={<MainContent />}
 *   secondary={<Sidebar />}
 * />
 */
export function PhiSplit({
  primary,
  secondary,
  direction = 'row',
  isReversed = false,
  gap = 0,
  stackAt = 'sm',
  minHeight,
  primarySx,
  secondarySx,
  sx,
  ...props
}) {
  /**
   * Golden ratio calculation
   * - Larger region: phi / (phi + 1) ~= 61.8%
   * - Smaller region: 1 / (phi + 1) ~= 38.2%
   */
  const primaryRatio = PHI / (PHI + 1); // ~= 0.618
  const secondaryRatio = 1 / (PHI + 1); // ~= 0.382

  /**
   * Set flex-direction per breakpoint
   * Switches to column at and below the breakpoint given by stackAt
   */
  const getResponsiveDirection = () => {
    if (stackAt === 'none') {
      return direction;
    }

    const breakpoints = {
      xs: { xs: 'column', sm: direction, md: direction, lg: direction, xl: direction },
      sm: { xs: 'column', sm: 'column', md: direction, lg: direction, xl: direction },
      md: { xs: 'column', sm: 'column', md: 'column', lg: direction, xl: direction },
      lg: { xs: 'column', sm: 'column', md: 'column', lg: 'column', xl: direction },
    };

    return breakpoints[stackAt] || direction;
  };

  /**
   * Adjust flex-basis in stacked mode
   * In the stacked (column) state, each region switches to auto
   */
  const getResponsiveFlex = (ratio) => {
    if (stackAt === 'none') {
      return `0 0 ${ratio * 100}%`;
    }

    const stackValue = '0 0 auto';
    const normalValue = `0 0 ${ratio * 100}%`;

    const breakpoints = {
      xs: { xs: stackValue, sm: normalValue },
      sm: { xs: stackValue, sm: stackValue, md: normalValue },
      md: { xs: stackValue, sm: stackValue, md: stackValue, lg: normalValue },
      lg: { xs: stackValue, sm: stackValue, md: stackValue, lg: stackValue, xl: normalValue },
    };

    return breakpoints[stackAt] || normalValue;
  };

  // Determine the actual placement order
  const firstContent = isReversed ? secondary : primary;
  const secondContent = isReversed ? primary : secondary;
  const firstRatio = isReversed ? secondaryRatio : primaryRatio;
  const secondRatio = isReversed ? primaryRatio : secondaryRatio;
  const firstSx = isReversed ? secondarySx : primarySx;
  const secondSx = isReversed ? primarySx : secondarySx;

  return (
    <Box
      sx={ {
        display: 'flex',
        flexDirection: getResponsiveDirection(),
        gap: gap,
        minHeight: minHeight,
        width: '100%',
        ...sx,
      } }
      { ...props }
    >
      <Box
        sx={ {
          flex: getResponsiveFlex(firstRatio),
          minWidth: 0, // prevent flex item overflow
          ...firstSx,
        } }
      >
        { firstContent }
      </Box>
      <Box
        sx={ {
          flex: getResponsiveFlex(secondRatio),
          minWidth: 0,
          ...secondSx,
        } }
      >
        { secondContent }
      </Box>
    </Box>
  );
}

/**
 * Export the golden ratio constant (for use in other components)
 */
export { PHI };
