import { Box } from '@mui/material';

/**
 * BentoGrid component
 *
 * An Apple-style bento box grid layout.
 * Uses CSS Grid to flexibly arrange cells of varying sizes.
 *
 * How it works:
 * 1. The base number of grid columns is set by the columns prop
 * 2. Each cell's span is specified individually via BentoItem
 * 3. rowHeight sets the base row height, and height is applied as a multiple based on span
 * 4. The number of columns adjusts automatically at responsive breakpoints
 *
 * Props:
 * @param {ReactNode} children - BentoItem components [Required]
 * @param {number} columns - Base number of columns [Optional, default: 4]
 * @param {number|string} gap - Gap between cells [Optional, default: 2]
 * @param {number|string} rowHeight - Base row height [Optional, default: '200px']
 * @param {boolean} isAutoRows - Whether to use automatic row height [Optional, default: false]
 * @param {object} sx - Additional styles [Optional]
 *
 * Example usage:
 * <BentoGrid columns={4} gap={2}>
 *   <BentoItem colSpan={2} rowSpan={2}>
 *     <FeaturedCard />
 *   </BentoItem>
 *   <BentoItem>
 *     <SmallCard />
 *   </BentoItem>
 * </BentoGrid>
 */
export function BentoGrid({
  children,
  columns = 4,
  gap = 2,
  rowHeight = '200px',
  isAutoRows = false,
  sx,
  ...props
}) {
  /**
   * Convert rowHeight to a CSS value
   */
  const getRowHeight = () => {
    if (typeof rowHeight === 'number') {
      return `${rowHeight}px`;
    }
    return rowHeight;
  };

  /**
   * Set the responsive number of columns
   * - xs: 1 column
   * - sm: 2 columns
   * - md: columns / 2 (minimum 2 columns)
   * - lg+: columns
   */
  const getResponsiveColumns = () => {
    const halfColumns = Math.max(2, Math.floor(columns / 2));
    return {
      xs: 1,
      sm: 2,
      md: halfColumns,
      lg: columns,
      xl: columns,
    };
  };

  const responsiveColumns = getResponsiveColumns();

  return (
    <Box
      sx={ {
        display: 'grid',
        gridTemplateColumns: {
          xs: `repeat(${responsiveColumns.xs}, 1fr)`,
          sm: `repeat(${responsiveColumns.sm}, 1fr)`,
          md: `repeat(${responsiveColumns.md}, 1fr)`,
          lg: `repeat(${responsiveColumns.lg}, 1fr)`,
        },
        gridAutoRows: isAutoRows ? 'auto' : `minmax(${getRowHeight()}, auto)`,
        gap: gap,
        width: '100%',
        ...sx,
      } }
      { ...props }
    >
      { children }
    </Box>
  );
}

/**
 * BentoItem component
 *
 * A component that specifies the size and span of an individual cell within a BentoGrid.
 *
 * How it works:
 * 1. colSpan specifies the horizontal span (1-4)
 * 2. rowSpan specifies the vertical span (1-3)
 * 3. The span adjusts automatically at responsive breakpoints
 *
 * Props:
 * @param {ReactNode} children - Cell content [Required]
 * @param {number|object} colSpan - Column span (1-4) or a responsive object [Optional, default: 1]
 * @param {number|object} rowSpan - Row span (1-3) or a responsive object [Optional, default: 1]
 * @param {string} background - Background color [Optional]
 * @param {boolean} isContained - Apply overflow hidden [Optional, default: true]
 * @param {object} sx - Additional styles [Optional]
 *
 * Example usage:
 * <BentoItem colSpan={2} rowSpan={2} background="primary.main">
 *   <FeaturedContent />
 * </BentoItem>
 * <BentoItem colSpan={{ xs: 1, md: 2 }}>
 *   <ResponsiveContent />
 * </BentoItem>
 */
export function BentoItem({
  children,
  colSpan = 1,
  rowSpan = 1,
  background,
  isContained = true,
  sx,
  ...props
}) {
  /**
   * Convert a span value to a CSS grid-column/row value
   * - number: span N
   * - object: responsive span
   */
  const getSpanValue = (span) => {
    if (typeof span === 'number') {
      return span > 1 ? `span ${span}` : undefined;
    }

    if (typeof span === 'object') {
      const result = {};
      Object.keys(span).forEach(breakpoint => {
        result[breakpoint] = span[breakpoint] > 1 ? `span ${span[breakpoint]}` : undefined;
      });
      return result;
    }

    return undefined;
  };

  return (
    <Box
      sx={ {
        gridColumn: getSpanValue(colSpan),
        gridRow: getSpanValue(rowSpan),
        backgroundColor: background,
        overflow: isContained ? 'hidden' : 'visible',
        borderRadius: 2,
        position: 'relative',
        ...sx,
      } }
      { ...props }
    >
      { children }
    </Box>
  );
}
