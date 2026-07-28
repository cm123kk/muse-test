import { useEffect, useState, useRef } from 'react';
import Box from '@mui/material/Box';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const INITIAL_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';

/**
 * ScrambleText component
 *
 * Kinetic typography where characters scramble into random characters and then settle sequentially when the text changes.
 * Implements a smooth scramble animation based on requestAnimationFrame.
 *
 * Behavior:
 * 1. (When isInitialScramble is enabled) scrambles with initialCharset characters right after mount, then settles
 * 2. When the text prop changes, the scramble animation starts using charset characters
 * 3. Each character is rapidly replaced with a random character
 * 4. Characters settle into their final form sequentially from the left
 * 5. Once the duration elapses, all characters are settled and the animation completes
 *
 * Props:
 * @param {string} text - Text to display [Required]
 * @param {number} duration - Duration of the scramble animation (ms) [Optional, default: 800]
 * @param {boolean} isTrigger - Whether to trigger the animation [Optional, default: true]
 * @param {boolean} isInitialScramble - Whether to apply the scramble effect on initial mount [Optional, default: false]
 * @param {string} initialCharset - Character set used for the initial appearance scramble [Optional, default: '!@#$%^&*()_+-=[]{}|;:,.<>?/~`']
 * @param {string} charset - Character set used for the text transition scramble [Optional, default: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ']
 * @param {string} variant - MUI Typography variant [Optional, default: 'body1']
 * @param {object} sx - MUI sx style [Optional]
 *
 * Example usage:
 * <ScrambleText text="Hello World" duration={1000} />
 * <ScrambleText text="Design" isInitialScramble initialCharset="※◆●▲■" />
 */
function ScrambleText({
  text,
  duration = 800,
  isTrigger = true,
  isInitialScramble = false,
  initialCharset = INITIAL_CHARS,
  charset = CHARS,
  variant = 'body1',
  sx = {},
}) {
  const [displayText, setDisplayText] = useState(
    isInitialScramble ? '' : text
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const prevTextRef = useRef(text);
  const frameRef = useRef(0);

  /** Shared scramble animation logic */
  const runScramble = (targetText, fromLength, chars) => {
    setIsAnimating(true);
    const startTime = performance.now();
    const maxLength = Math.max(fromLength, targetText.length);

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      /** Settle characters sequentially from the left */
      const settledCount = Math.floor(progress * targetText.length);

      let result = '';
      for (let i = 0; i < maxLength; i++) {
        if (i < settledCount) {
          result += targetText[i] || '';
        } else if (i < targetText.length) {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      setDisplayText(result);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayText(targetText);
        setIsAnimating(false);
        prevTextRef.current = targetText;
      }
    };

    frameRef.current = requestAnimationFrame(animate);
  };

  /** Scramble effect on initial mount */
  useEffect(() => {
    if (!isInitialScramble) return;
    runScramble(text, text.length, initialCharset);

    return () => {
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  /** Run the scramble animation when text changes */
  useEffect(() => {
    if (!isTrigger || text === prevTextRef.current) return;

    runScramble(text, prevTextRef.current.length, charset);

    return () => {
      cancelAnimationFrame(frameRef.current);
    };
  }, [text, isTrigger, duration, charset]);

  /** Set the text on initial render (when not using isInitialScramble) */
  useEffect(() => {
    if (!isAnimating && !isInitialScramble) {
      setDisplayText(text);
      prevTextRef.current = text;
    }
  }, []);

  return (
    <Box
      component="span"
      sx={ {
        typography: variant,
        ...sx,
      } }
    >
      { displayText }
    </Box>
  );
}

export default ScrambleText;
