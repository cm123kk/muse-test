import { Box } from '@mui/material';

/**
 * FullPageContainer component
 *
 * A full-screen section container with a height of 100vh or 100svh.
 * Used for hero sections, full-screen galleries, and scroll-snap layouts.
 *
 * How it works:
 * 1. Sets the height by choosing among vh, svh, and dvh based on heightMode
 * 2. Content is aligned according to the align and justify props
 * 3. A background image or gradient can be applied via background
 * 4. A dark overlay can be added via overlay
 *
 * Props:
 * @param {ReactNode} children - Section content [Required]
 * @param {string} heightMode - Height mode ('vh' | 'svh' | 'dvh') [Optional, default: 'svh']
 * @param {number} heightRatio - Height ratio (0.5 = 50vh) [Optional, default: 1]
 * @param {string} minHeight - Minimum height [Optional]
 * @param {string} maxHeight - Maximum height [Optional]
 * @param {string} align - Vertical alignment ('start' | 'center' | 'end' | 'stretch') [Optional, default: 'center']
 * @param {string} justify - Horizontal alignment ('start' | 'center' | 'end' | 'between' | 'around') [Optional, default: 'center']
 * @param {string} background - Background image URL or CSS value [Optional]
 * @param {string|number} overlay - Overlay color or opacity [Optional]
 * @param {boolean} isContained - Apply overflow hidden [Optional, default: true]
 * @param {string} snap - Scroll snap alignment ('start' | 'center' | 'end') [Optional]
 * @param {object} sx - Additional styles [Optional]
 *
 * Example usage:
 * <FullPageContainer background="hero.jpg" overlay={0.5}>
 *   <HeroContent />
 * </FullPageContainer>
 * <FullPageContainer heightRatio={0.5} align="end">
 *   <CtaSection />
 * </FullPageContainer>
 */
export function FullPageContainer({
  children,
  heightMode = 'svh',
  heightRatio = 1,
  minHeight,
  maxHeight,
  align = 'center',
  justify = 'center',
  background,
  overlay,
  isContained = true,
  snap,
  sx,
  ...props
}) {
  /**
   * Generate the height CSS value based on heightMode
   * - vh: viewport height (including the address bar)
   * - svh: small viewport height (when the address bar is shown)
   * - dvh: dynamic viewport height (address bar dynamic)
   */
  const getHeight = () => {
    const value = heightRatio * 100;
    return `${value}${heightMode}`;
  };

  /**
   * Convert the align value to a CSS align-items value
   */
  const alignMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: 'stretch',
  };

  /**
   * Convert the justify value to a CSS justify-content value
   */
  const justifyMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    between: 'space-between',
    around: 'space-around',
  };

  /**
   * Generate the background style
   * - URL: handled as background-image
   * - Otherwise: handled as background (color, gradient)
   */
  const getBackgroundStyle = () => {
    if (!background) return {};

    // Detect URL pattern
    if (background.startsWith('http') || background.startsWith('/') || background.startsWith('data:')) {
      return {
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      };
    }

    return { background };
  };

  /**
   * Generate the overlay style
   * - number: black opacity
   * - string: CSS color
   */
  const getOverlayStyle = () => {
    if (!overlay) return null;

    let overlayColor;
    if (typeof overlay === 'number') {
      overlayColor = `rgba(0, 0, 0, ${overlay})`;
    } else {
      overlayColor = overlay;
    }

    return {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: overlayColor,
      pointerEvents: 'none',
    };
  };

  return (
    <Box
      sx={ {
        position: 'relative',
        width: '100%',
        height: getHeight(),
        minHeight: minHeight,
        maxHeight: maxHeight,
        display: 'flex',
        flexDirection: 'column',
        alignItems: alignMap[align] || 'center',
        justifyContent: justifyMap[justify] || 'center',
        overflow: isContained ? 'hidden' : 'visible',
        scrollSnapAlign: snap,
        ...getBackgroundStyle(),
        // Overlay pseudo element
        ...(overlay && {
          '&::before': getOverlayStyle(),
        }),
        ...sx,
      } }
      { ...props }
    >
      { /* Place content above the overlay */ }
      <Box sx={ { position: 'relative', zIndex: 1, width: '100%', height: '100%', display: 'contents' } }>
        { children }
      </Box>
    </Box>
  );
}

/**
 * FullPageSection component
 *
 * An individual section used within a scroll-snap container.
 * Extends FullPageContainer to include scroll-snap functionality by default.
 *
 * Props:
 * Inherits all FullPageContainer props
 *
 * Example usage:
 * <FullPageSnap>
 *   <FullPageSection background="section1.jpg">
 *     <Section1Content />
 *   </FullPageSection>
 *   <FullPageSection background="section2.jpg">
 *     <Section2Content />
 *   </FullPageSection>
 * </FullPageSnap>
 */
export function FullPageSection(props) {
  return <FullPageContainer snap="start" { ...props } />;
}

/**
 * FullPageSnap component
 *
 * A full-screen section container with scroll snap applied.
 * Arrange FullPageSection components inside it to implement a full-page scroll effect.
 *
 * Props:
 * @param {ReactNode} children - FullPageSection components [Required]
 * @param {string} snapType - Snap type ('mandatory' | 'proximity') [Optional, default: 'mandatory']
 * @param {object} sx - Additional styles [Optional]
 *
 * Example usage:
 * <FullPageSnap>
 *   <FullPageSection>Section 1</FullPageSection>
 *   <FullPageSection>Section 2</FullPageSection>
 * </FullPageSnap>
 */
export function FullPageSnap({
  children,
  snapType = 'mandatory',
  sx,
  ...props
}) {
  return (
    <Box
      sx={ {
        height: '100svh',
        overflowY: 'scroll',
        scrollSnapType: `y ${snapType}`,
        ...sx,
      } }
      { ...props }
    >
      { children }
    </Box>
  );
}
