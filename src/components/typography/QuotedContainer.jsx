import { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { keyframes } from '@mui/material/styles';

/**
 * Material Symbols icon component
 * Uses the Icons.stories.jsx pattern from the project design system
 */
function MaterialSymbol({ name, size = 24, fill = false, weight = 400, color = 'inherit', sx = {} }) {
  return (
    <Box
      component="span"
      className="material-symbols-rounded"
      sx={{
        fontSize: size,
        color,
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}`,
        lineHeight: 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...sx,
      }}
    >
      {name}
    </Box>
  );
}

/**
 * Animation keyframe definitions
 */
const fadeInScale = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

/**
 * QuotedContainer component
 *
 * A component that smartly places quote marks at the start/end positions of text.
 * Visually emphasizes a quotation with large decorative quote marks.
 *
 * How it works:
 * 1. Decorative quote marks are placed around the text
 * 2. Different quote mark characters are used depending on quoteStyle
 * 3. The position of the quote marks is adjusted based on position
 * 4. When animated is true, the animation runs upon entering the viewport
 *
 * Props:
 * @param {string} children - Text to quote [Required]
 * @param {string} quoteSize - Quote mark size ('sm' | 'md' | 'lg' | 'xl') [Optional, default: 'lg']
 * @param {string} quoteColor - Quote mark color [Optional, default: 'text.disabled']
 * @param {string} position - Quote mark position ('outside' | 'inside' | 'overlay') [Optional, default: 'outside']
 * @param {boolean} animated - Entrance animation [Optional, default: false]
 * @param {string} author - Quote source/author [Optional]
 * @param {string} variant - Typography variant [Optional, default: 'h4']
 * @param {string} align - Text alignment ('left' | 'center' | 'right') [Optional, default: 'left']
 * @param {object} sx - Additional style overrides [Optional]
 *
 * Example usage:
 * <QuotedContainer>Design is how it works.</QuotedContainer>
 * <QuotedContainer author="Steve Jobs">
 *   Design is not just what it looks like.
 * </QuotedContainer>
 */
export function QuotedContainer({
  children,
  quoteSize = 'lg',
  quoteColor = 'text.disabled',
  position = 'outside',
  animated = false,
  author,
  variant = 'h4',
  align = 'left',
  sx,
  ...props
}) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(!animated);

  // Detect viewport entry
  useEffect(() => {
    if (!animated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    const container = containerRef.current;
    if (container) {
      observer.observe(container);
    }

    return () => observer.disconnect();
  }, [animated]);

  // Icon size mapping (px)
  const iconSizes = {
    sm: 20,
    md: 28,
    lg: 36,
    xl: 48,
  };

  const iconSize = iconSizes[quoteSize];

  // Common icon style
  const baseIconSx = {
    opacity: animated && !isVisible ? 0 : (position === 'overlay' ? 0.12 : 0.3),
    animation: animated && isVisible ? `${fadeInScale} 0.4s ease-out forwards` : 'none',
    flexShrink: 0,
  };

  // Position: outside (default - inline placement, first character top-left, last character bottom-right)
  if (position === 'outside') {
    return (
      <Box
        ref={containerRef}
        sx={{
          textAlign: align,
          ...sx,
        }}
        {...props}
      >
        <Typography
          variant={variant}
          component="blockquote"
          sx={{
            fontWeight: 400,
            lineHeight: 1.6,
            textAlign: align,
            m: 0,
            position: 'relative',
          }}
        >
          {/* Opening quote mark - top-left of the first character */}
          <MaterialSymbol
            name="format_quote"
            size={iconSize}
            fill
            color={quoteColor}
            sx={{
              ...baseIconSx,
              transform: 'scaleX(-1) translateY(-0.15em)',
              verticalAlign: 'top',
              mr: '0.1em',
              ml: '-0.1em',
            }}
          />
          {children}
          {/* Closing quote mark - bottom-right of the last character */}
          <MaterialSymbol
            name="format_quote"
            size={iconSize}
            fill
            color={quoteColor}
            sx={{
              ...baseIconSx,
              transform: 'translateY(0.15em)',
              verticalAlign: 'bottom',
              ml: '0.1em',
              mr: '-0.1em',
              animationDelay: '0.15s',
            }}
          />
        </Typography>

        {author && (
          <Typography
            variant="body2"
            component="cite"
            sx={{
              display: 'block',
              mt: 2,
              fontStyle: 'normal',
              color: 'text.secondary',
              textAlign: align,
              '&::before': {
                content: '"- "',
              },
            }}
          >
            {author}
          </Typography>
        )}
      </Box>
    );
  }

  // Position: inside (smaller icon, tight against the text)
  if (position === 'inside') {
    return (
      <Box
        ref={containerRef}
        sx={{
          textAlign: align,
          ...sx,
        }}
        {...props}
      >
        <Typography
          variant={variant}
          component="blockquote"
          sx={{
            fontWeight: 400,
            lineHeight: 1.6,
            m: 0,
          }}
        >
          {/* Opening quote mark - top-left of the first character */}
          <MaterialSymbol
            name="format_quote"
            size="0.8em"
            fill
            color={quoteColor}
            sx={{
              ...baseIconSx,
              transform: 'scaleX(-1) translateY(-0.2em)',
              verticalAlign: 'top',
              mr: '0.05em',
            }}
          />
          {children}
          {/* Closing quote mark - bottom-right of the last character */}
          <MaterialSymbol
            name="format_quote"
            size="0.8em"
            fill
            color={quoteColor}
            sx={{
              ...baseIconSx,
              transform: 'translateY(0.2em)',
              verticalAlign: 'bottom',
              ml: '0.05em',
              animationDelay: '0.15s',
            }}
          />
        </Typography>
        {author && (
          <Typography
            variant="body2"
            component="cite"
            sx={{
              display: 'block',
              mt: 2,
              fontStyle: 'normal',
              color: 'text.secondary',
              '&::before': {
                content: '"- "',
              },
            }}
          >
            {author}
          </Typography>
        )}
      </Box>
    );
  }

  // Position: overlay (large fill icon behind the text as a background)
  if (position === 'overlay') {
    return (
      <Box
        ref={containerRef}
        sx={{
          position: 'relative',
          textAlign: align,
          py: 3,
          ...sx,
        }}
        {...props}
      >
        {/* Background quote mark icon */}
        <MaterialSymbol
          name="format_quote"
          size={iconSize * 4}
          fill
          color={quoteColor}
          sx={{
            position: 'absolute',
            left: align === 'right' ? 'auto' : 0,
            right: align === 'right' ? 0 : 'auto',
            top: 0,
            transform: 'scaleX(-1)',
            opacity: animated && !isVisible ? 0 : 0.06,
            animation: animated && isVisible ? `${fadeInScale} 0.4s ease-out forwards` : 'none',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Text */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant={variant}
            component="blockquote"
            sx={{
              fontWeight: 400,
              lineHeight: 1.6,
              m: 0,
            }}
          >
            {children}
          </Typography>
          {author && (
            <Typography
              variant="body2"
              component="cite"
              sx={{
                display: 'block',
                mt: 2,
                fontStyle: 'normal',
                color: 'text.secondary',
                '&::before': {
                  content: '"- "',
                },
              }}
            >
              {author}
            </Typography>
          )}
        </Box>
      </Box>
    );
  }

  return null;
}
