import { useEffect, useRef, useState, Children, cloneElement, isValidElement } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { keyframes } from '@mui/material/styles';

/**
 * Color brightness calculation function
 * Uses the WCAG relative luminance formula
 * @param {string} hexColor - HEX color code (#RRGGBB)
 * @returns {number} Brightness value in the 0-255 range
 */
const getColorBrightness = (hexColor) => {
  // Convert HEX to RGB
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate relative luminance (WCAG formula)
  return (r * 299 + g * 587 + b * 114) / 1000;
};

/**
 * Resolve the actual color value from a theme color path
 * @param {object} theme - MUI theme object
 * @param {string} colorPath - Color path in 'primary.main' format
 * @returns {string} HEX color code
 */
const resolveThemeColor = (theme, colorPath) => {
  if (!colorPath) return theme.palette.primary.main;
  if (colorPath.startsWith('#')) return colorPath;

  const parts = colorPath.split('.');
  let result = theme.palette;
  for (const part of parts) {
    result = result?.[part];
  }
  return result || theme.palette.primary.main;
};

/**
 * Animation keyframe definitions
 */
const drawUnderline = keyframes`
  from {
    background-size: 0% 2px;
  }
  to {
    background-size: 100% 2px;
  }
`;

const drawMarker = keyframes`
  from {
    background-size: 0% 100%;
  }
  to {
    background-size: 100% 100%;
  }
`;

const fadeInBackground = keyframes`
  from {
    background-color: transparent;
  }
  to {
    background-color: var(--highlight-color);
  }
`;

const drawCircle = keyframes`
  from {
    stroke-dashoffset: var(--circle-length);
  }
  to {
    stroke-dashoffset: 0;
  }
`;

/**
 * Highlight component (subcomponent)
 *
 * Applies a style that emphasizes a specific portion of text.
 * For the background type, the text color is automatically determined by the background brightness.
 *
 * Props:
 * @param {ReactNode} children - Text to emphasize [Required]
 * @param {string} type - Emphasis type ('underline' | 'background' | 'marker' | 'circle') [Required]
 * @param {string} color - Emphasis color ('primary.main', 'secondary.main', '#FF0000', etc.) [Optional, default: 'primary.main']
 * @param {boolean} animated - Enable the draw animation [Optional, default: false]
 * @param {number} delay - Animation delay (ms) [Optional, default: 0]
 * @param {number} duration - Animation duration (ms) [Optional, default: 600]
 * @param {string} textColor - Force the text color ('auto' | 'white' | 'inherit', etc.) [Optional, default: 'auto']
 *
 * Example usage:
 * <Highlight type="background" color="primary.main">Automatic color</Highlight>
 * <Highlight type="background" color="#000000" textColor="white">Forced white</Highlight>
 */
export function Highlight({
  children,
  type = 'background',
  color = 'primary.main',
  animated = false,
  delay = 0,
  duration = 600,
  isVisible = true,
  textColor = 'auto',
}) {
  const theme = useTheme();
  const ref = useRef(null);
  const [circleLength, setCircleLength] = useState(300);

  // Resolve the actual color value
  const resolvedColor = resolveThemeColor(theme, color);

  // Determine the text color based on the background brightness
  const getTextColor = () => {
    if (textColor !== 'auto') return textColor;

    // Only the background type changes the text color (opaque background)
    if (type === 'background') {
      const brightness = getColorBrightness(resolvedColor);
      // Brightness threshold: 128 (midpoint of 0-255)
      // Dark background -> white text, light background -> default text
      return brightness < 128 ? '#FFFFFF' : 'inherit';
    }

    return 'inherit';
  };

  // Calculate the Circle SVG length
  useEffect(() => {
    if (type === 'circle' && ref.current) {
      const width = ref.current.offsetWidth;
      const height = ref.current.offsetHeight;
      // Approximate ellipse perimeter
      const a = width / 2 + 8;
      const b = height / 2 + 6;
      const perimeter = Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
      setCircleLength(perimeter);
    }
  }, [type, children]);

  const shouldAnimate = animated && isVisible;

  // Underline style
  if (type === 'underline') {
    return (
      <Box
        component="span"
        sx={{
          position: 'relative',
          display: 'inline',
          backgroundImage: `linear-gradient(${resolvedColor}, ${resolvedColor})`,
          backgroundSize: shouldAnimate ? '0% 2px' : '100% 2px',
          backgroundPosition: 'left bottom',
          backgroundRepeat: 'no-repeat',
          paddingBottom: '2px',
          animation: shouldAnimate
            ? `${drawUnderline} ${duration}ms ease-out ${delay}ms forwards`
            : 'none',
        }}
      >
        {children}
      </Box>
    );
  }

  // Background style
  if (type === 'background') {
    return (
      <Box
        component="span"
        sx={{
          '--highlight-color': resolvedColor,
          display: 'inline',
          backgroundColor: shouldAnimate ? 'transparent' : 'var(--highlight-color)',
          color: getTextColor(),
          padding: '0.1em 0.2em',
          borderRadius: '2px',
          animation: shouldAnimate
            ? `${fadeInBackground} ${duration}ms ease-out ${delay}ms forwards`
            : 'none',
        }}
      >
        {children}
      </Box>
    );
  }

  // Marker style (highlighter effect - semi-transparent)
  if (type === 'marker') {
    return (
      <Box
        component="span"
        sx={{
          position: 'relative',
          display: 'inline',
          backgroundImage: `linear-gradient(120deg, ${resolvedColor}40 0%, ${resolvedColor}40 100%)`,
          backgroundSize: shouldAnimate ? '0% 100%' : '100% 100%',
          backgroundPosition: 'left center',
          backgroundRepeat: 'no-repeat',
          animation: shouldAnimate
            ? `${drawMarker} ${duration}ms ease-out ${delay}ms forwards`
            : 'none',
        }}
      >
        {children}
      </Box>
    );
  }

  // Circle style (hand-drawn circle)
  if (type === 'circle') {
    return (
      <Box
        component="span"
        ref={ref}
        sx={{
          '--circle-length': circleLength,
          position: 'relative',
          display: 'inline-block',
          padding: '0.1em 0.3em',
        }}
      >
        {children}
        <Box
          component="svg"
          viewBox="0 0 100 50"
          preserveAspectRatio="none"
          sx={{
            position: 'absolute',
            left: '-8px',
            top: '-6px',
            width: 'calc(100% + 16px)',
            height: 'calc(100% + 12px)',
            overflow: 'visible',
            pointerEvents: 'none',
          }}
        >
          <Box
            component="ellipse"
            cx="50"
            cy="25"
            rx="48"
            ry="22"
            sx={{
              fill: 'none',
              stroke: resolvedColor,
              strokeWidth: 2,
              strokeLinecap: 'round',
              strokeDasharray: circleLength,
              strokeDashoffset: shouldAnimate ? circleLength : 0,
              animation: shouldAnimate
                ? `${drawCircle} ${duration}ms ease-out ${delay}ms forwards`
                : 'none',
              transform: 'rotate(-2deg)',
              transformOrigin: 'center',
            }}
          />
        </Box>
      </Box>
    );
  }

  return <span>{children}</span>;
}

/**
 * HighlightedTypography component
 *
 * A component that lets you emphasize specific words or phrases within text using various styles.
 * Used together with the Highlight component in a compound component pattern.
 *
 * How it works:
 * 1. Pass a combination of plain text and Highlight components as children
 * 2. Emphasis styles are applied to the parts wrapped in Highlight components
 * 3. When animated is true, the draw animation runs upon entering the viewport
 * 4. Setting an individual delay on each Highlight enables sequential animation
 *
 * Props:
 * @param {ReactNode} children - Combination of text and Highlight components [Required]
 * @param {string} variant - Typography variant ('body1' | 'body2' | 'h1' | 'h2' | 'h3' | 'h4') [Optional, default: 'body1']
 * @param {string} component - HTML tag [Optional, default: 'p']
 * @param {boolean} animated - Enable the overall animation [Optional, default: false]
 * @param {number} threshold - Intersection Observer threshold [Optional, default: 0.5]
 * @param {object} sx - Additional style overrides [Optional]
 *
 * Example usage:
 * <HighlightedTypography animated>
 *   This is <Highlight type="underline">important</Highlight> text with
 *   <Highlight type="marker" delay={300}>highlighted</Highlight> words.
 * </HighlightedTypography>
 */
export function HighlightedTypography({
  children,
  variant = 'body1',
  component = 'p',
  animated = false,
  threshold = 0.5,
  sx,
  ...props
}) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(!animated);

  // Detect viewport entry with Intersection Observer
  useEffect(() => {
    if (!animated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    const container = containerRef.current;
    if (container) {
      observer.observe(container);
    }

    return () => observer.disconnect();
  }, [animated, threshold]);

  // Pass the isVisible prop to children
  const enhancedChildren = Children.map(children, (child) => {
    if (isValidElement(child) && child.type === Highlight) {
      return cloneElement(child, { isVisible });
    }
    return child;
  });

  return (
    <Typography
      ref={containerRef}
      variant={variant}
      component={component}
      sx={{
        ...sx,
      }}
      {...props}
    >
      {enhancedChildren}
    </Typography>
  );
}

// Static assignment for the compound component pattern
HighlightedTypography.Highlight = Highlight;
