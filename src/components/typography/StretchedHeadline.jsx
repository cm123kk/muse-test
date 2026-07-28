import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';

/**
 * StretchedHeadline component
 *
 * A hero typography component that dynamically stretches word spacing to fill the entire container width.
 * Splits each word into an individual span and lays them out with flexbox space-between.
 *
 * How it works:
 * 1. Splits the text into words by whitespace
 * 2. Wraps each word in an individual span element
 * 3. Distributes them evenly across the full width with flexbox justify-content: space-between
 * 4. Detects container size changes with ResizeObserver for a responsive layout
 * 5. When fillWidth is false, adjusts spacing with regular word-spacing
 *
 * Props:
 * @param {string} text - Text to display [Required]
 * @param {string} variant - 'static' | 'animated' [Optional, default: 'static']
 * @param {boolean} fillWidth - Fill the full width [Optional, default: true]
 * @param {number} minWordSpacing - Minimum word spacing when fillWidth is false (em) [Optional, default: 0.5]
 * @param {string} fontFamily - Font family [Optional, default: 'Outfit']
 * @param {number} fontSize - Font size (px or rem) [Optional, default: 'clamp(2rem, 8vw, 6rem)']
 * @param {number} fontWeight - Font weight [Optional, default: 900]
 * @param {number} lineHeight - Line height [Optional, default: 1]
 * @param {string} textTransform - Text transform ('none' | 'uppercase' | 'lowercase') [Optional, default: 'uppercase']
 * @param {object} sx - Additional style overrides [Optional]
 *
 * Example usage:
 * <StretchedHeadline text="DESIGN SYSTEM" />
 * <StretchedHeadline text="Hello World" fillWidth={false} minWordSpacing={2} />
 */
export function StretchedHeadline({
  text,
  variant = 'static',
  fillWidth = true,
  minWordSpacing = 0.5,
  fontFamily = '"Outfit", "Pretendard Variable", sans-serif',
  fontSize = 'clamp(2rem, 8vw, 6rem)',
  fontWeight = 900,
  lineHeight = 1,
  textTransform = 'uppercase',
  sx,
  ...props
}) {
  const containerRef = useRef(null);
  const [isAnimated, setIsAnimated] = useState(false);

  // Split into words
  const words = text.trim().split(/\s+/);

  // Animation trigger (upon entering the viewport)
  useEffect(() => {
    if (variant !== 'animated') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsAnimated(true);
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
  }, [variant]);

  // When fillWidth is true - space-between approach
  if (fillWidth) {
    return (
      <Box
        ref={containerRef}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          fontFamily,
          fontSize,
          fontWeight,
          lineHeight,
          textTransform,
          letterSpacing: '-0.02em',
          ...sx,
        }}
        {...props}
      >
        {words.map((word, index) => (
          <Box
            component="span"
            key={index}
            sx={{
              display: 'inline-block',
              opacity: variant === 'animated' ? (isAnimated ? 1 : 0) : 1,
              transform: variant === 'animated'
                ? (isAnimated ? 'translateY(0)' : 'translateY(20px)')
                : 'none',
              transition: variant === 'animated'
                ? `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`
                : 'none',
            }}
          >
            {word}
          </Box>
        ))}
      </Box>
    );
  }

  // When fillWidth is false - word-spacing approach
  return (
    <Box
      ref={containerRef}
      sx={{
        display: 'block',
        width: '100%',
        fontFamily,
        fontSize,
        fontWeight,
        lineHeight,
        textTransform,
        letterSpacing: '-0.02em',
        wordSpacing: `${minWordSpacing}em`,
        textAlign: 'center',
        ...sx,
      }}
      {...props}
    >
      {variant === 'animated' ? (
        words.map((word, index) => (
          <Box
            component="span"
            key={index}
            sx={{
              display: 'inline-block',
              opacity: isAnimated ? 1 : 0,
              transform: isAnimated ? 'translateY(0)' : 'translateY(20px)',
              transition: `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`,
              mr: index < words.length - 1 ? `${minWordSpacing}em` : 0,
            }}
          >
            {word}
          </Box>
        ))
      ) : (
        text
      )}
    </Box>
  );
}

/**
 * StretchedHeadlineMultiline component
 *
 * A wrapper component that stacks multiple StretchedHeadline lines vertically.
 * Each line independently fills the full width.
 *
 * Props:
 * @param {string[]} lines - Array of text for each line [Required]
 * @param {number} gap - Line spacing [Optional, default: 0]
 * @param {object} headlineProps - Props to pass to each StretchedHeadline [Optional]
 * @param {object} sx - Additional style overrides [Optional]
 *
 * Example usage:
 * <StretchedHeadlineMultiline
 *   lines={['WE CREATE', 'DIGITAL', 'EXPERIENCES']}
 *   gap={1}
 * />
 */
export function StretchedHeadlineMultiline({
  lines,
  gap = 0,
  headlineProps = {},
  sx,
  ...props
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap,
        width: '100%',
        ...sx,
      }}
      {...props}
    >
      {lines.map((line, index) => (
        <StretchedHeadline
          key={index}
          text={line}
          {...headlineProps}
          sx={{
            ...(headlineProps.variant === 'animated' && {
              '--animation-delay': `${index * 0.2}s`,
            }),
            ...headlineProps.sx,
          }}
        />
      ))}
    </Box>
  );
}
