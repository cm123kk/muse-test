import { useEffect, useRef, useState, useCallback } from 'react';
import { Box } from '@mui/material';

/**
 * FitText component
 *
 * A responsive typography component whose text size automatically adjusts to fill the container width.
 *
 * Visual behavior:
 * 1. The text automatically scales up or down to match the container width
 * 2. Resizing the browser window changes the text size in real time
 * 3. Setting variant to 'headline' switches to the Chillax font with a tighter line height
 * 4. Increasing letterSpacing or wordSpacing widens the spacing between letters/words
 * 5. minFontSize and maxFontSize can constrain the text size to a minimum/maximum range
 *
 * Props:
 * @param {string} text - Text to display [Required]
 * @param {string} variant - Typography variant ('body' | 'h1' | 'headline') [Optional, default: 'body']
 * @param {number} minFontSize - Minimum font size (px) [Optional, default: 0]
 * @param {number} maxFontSize - Maximum font size (px) [Optional, default: 9999]
 * @param {number} letterSpacing - Letter spacing multiplier [Optional, default: 1]
 * @param {number} wordSpacing - Word spacing multiplier [Optional, default: 1]
 * @param {number} fontWeight - Font weight [Optional]
 *
 * Example usage:
 * <FitText text="Hello World" variant="headline" />
 * <FitText text="Responsive Text" minFontSize={ 16 } maxFontSize={ 120 } />
 */
export function FitText({
  text,
  variant = 'body',
  minFontSize = 0,
  maxFontSize = 9999,
  letterSpacing = 1,
  wordSpacing = 1,
  fontWeight,
  ...props
}) {
  const containerRef = useRef(null);
  const measureRef = useRef(null);
  const [fontSize, setFontSize] = useState(minFontSize);

  /**
   * Determine the font style based on variant
   * - headline/h1: Chillax font, tight line height (0.9), default weight 400
   * - body: Inter font, relaxed line height (1.3), default weight 300
   */
  const isHeadline = variant === 'h1' || variant === 'headline';
  const fontFamily = isHeadline ? '"Chillax", sans-serif' : '"Inter", sans-serif';
  const lineHeight = isHeadline ? 0.9 : 1.3;
  const defaultFontWeight = isHeadline ? 400 : 300;
  const finalFontWeight = fontWeight !== undefined ? fontWeight : defaultFontWeight;

  /**
   * Calculate letter/word spacing
   * - At the default value (1): letter spacing 0.02em, word spacing 0.2em
   * - Setting the value to 2 doubles the spacing
   */
  const baseLetterSpacing = 0.02;
  const baseWordSpacing = 0.2;
  const finalLetterSpacing = `${ baseLetterSpacing * letterSpacing }em`;
  const finalWordSpacing = `${ baseWordSpacing * wordSpacing }em`;

  /**
   * Font size calculation function
   * - Computes the ratio by comparing the hidden measurement element (based on 100px) with the container width
   * - Clamps the calculated size to the min/max range if it falls outside
   */
  const updateFontSize = useCallback(() => {
    if (!containerRef.current || !measureRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const measureWidth = measureRef.current.offsetWidth;

    if (measureWidth === 0) return;

    // 0.98 buffer: prevents slight overflow caused by rendering differences
    const ratio = (containerWidth * 0.98) / measureWidth;
    const calculatedFontSize = 100 * ratio;
    const finalSize = Math.min(Math.max(calculatedFontSize, minFontSize), maxFontSize);

    setFontSize(finalSize);
  }, [minFontSize, maxFontSize]);

  /**
   * Detect size changes and update automatically
   * - Detects container size changes with ResizeObserver
   * - Also recalculates when text, letterSpacing, or wordSpacing change
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      updateFontSize();
    });

    observer.observe(container);
    updateFontSize();

    return () => observer.disconnect();
  }, [text, letterSpacing, wordSpacing, updateFontSize]);

  return (
    <Box
      ref={ containerRef }
      className="text-fit"
      sx={ {
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        ...props.sx
      } }
      { ...props }
    >
      {/* The visible text */}
      <Box
        component="span"
        sx={ {
          display: 'block',
          fontFamily,
          lineHeight,
          fontWeight: finalFontWeight,
          fontSize: `${ fontSize }px`,
          letterSpacing: finalLetterSpacing,
          wordSpacing: finalWordSpacing,
          whiteSpace: 'nowrap',
          textAlign: 'center',
          transition: 'font-size 0.1s ease-out',
        } }
      >
        { text }
      </Box>

      {/* Hidden measurement element - measures text width based on 100px */}
      <Box
        ref={ measureRef }
        component="span"
        aria-hidden="true"
        sx={ {
          position: 'absolute',
          left: '-9999px',
          top: 0,
          visibility: 'hidden',
          whiteSpace: 'nowrap',
          fontFamily,
          fontWeight: finalFontWeight,
          fontSize: '100px',
          letterSpacing: finalLetterSpacing,
          wordSpacing: finalWordSpacing,
          pointerEvents: 'none',
        } }
      >
        { text }
      </Box>
    </Box>
  );
}
