import { Box } from '@mui/material';

/**
 * Golden ratio constant
 */
const PHI = 1.618033988749895;

/**
 * RatioContainer component
 *
 * A container component that maintains a fixed aspect ratio.
 * Uses the CSS aspect-ratio property to support various ratios such as 16:9, 4:3, 1:1, and the golden ratio.
 *
 * How it works:
 * 1. The container aspect ratio is set based on the ratio prop
 * 2. The ratio is preserved even when the container width changes
 * 3. children are positioned inside the container according to the align prop
 * 4. overflow: hidden is applied when contain is true
 *
 * Props:
 * @param {ReactNode} children - Container content [Required]
 * @param {string|number} ratio - Ratio ('16:9' | '4:3' | '1:1' | '3:2' | '21:9' | 'phi' | 'phi-vertical' | number) [Optional, default: '16:9']
 * @param {string} maxWidth - Maximum width [Optional]
 * @param {string} minHeight - Minimum height [Optional]
 * @param {boolean} isContained - overflow hidden so content does not exceed the container [Optional, default: true]
 * @param {string} align - Content alignment ('center' | 'start' | 'end' | 'stretch') [Optional, default: 'center']
 * @param {string} justify - Horizontal alignment ('center' | 'start' | 'end' | 'stretch') [Optional, default: 'center']
 * @param {string} background - Background color or gradient [Optional]
 * @param {object} sx - Additional style overrides [Optional]
 *
 * Example usage:
 * <RatioContainer ratio="16:9">
 *   <img src="hero.jpg" alt="Hero" />
 * </RatioContainer>
 * <RatioContainer ratio="phi" align="center">
 *   <Typography>Golden Ratio Container</Typography>
 * </RatioContainer>
 */
export function RatioContainer({
  children,
  ratio = '16:9',
  maxWidth,
  minHeight,
  isContained = true,
  align = 'center',
  justify = 'center',
  background,
  sx,
  ...props
}) {
  /**
   * Convert the ratio prop into a CSS aspect-ratio value
   * - String ratio (e.g. '16:9') -> '16/9'
   * - Preset keyword (e.g. 'phi') -> golden ratio value
   * - Number -> used as is (width/height ratio)
   */
  const getAspectRatio = () => {
    // Return as is when it is a number
    if (typeof ratio === 'number') {
      return ratio;
    }

    // Handle preset keywords
    const presets = {
      'phi': PHI,           // 1.618:1 (wide golden ratio)
      'phi-vertical': 1 / PHI,  // 1:1.618 (tall golden ratio)
      'square': 1,          // 1:1
      'golden': PHI,        // same as phi
    };

    if (presets[ratio]) {
      return presets[ratio];
    }

    // Parse string ratio (e.g. '16:9' -> '16/9')
    if (typeof ratio === 'string' && ratio.includes(':')) {
      const [width, height] = ratio.split(':').map(Number);
      if (!isNaN(width) && !isNaN(height) && height !== 0) {
        return width / height;
      }
    }

    // Default value
    return 16 / 9;
  };

  // Alignment value mapping
  const alignMap = {
    center: 'center',
    start: 'flex-start',
    end: 'flex-end',
    stretch: 'stretch',
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: maxWidth,
        minHeight: minHeight,
        aspectRatio: getAspectRatio(),
        overflow: isContained ? 'hidden' : 'visible',
        display: 'flex',
        alignItems: alignMap[align] || 'center',
        justifyContent: alignMap[justify] || 'center',
        background: background,
        // Make images fill the container
        '& > img, & > video': {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

/**
 * Golden ratio constant export (used by other components)
 */
export { PHI };
