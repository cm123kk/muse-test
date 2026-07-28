import { useEffect, useState, useMemo } from 'react';
import Box from '@mui/material/Box';

/**
 * RandomRevealText component
 *
 * Kinetic typography that reveals each character in a random order, transitioning from blur to sharp.
 * Generates a random order with a Fisher-Yates shuffle and reveals characters sequentially at the stagger interval.
 *
 * Behavior:
 * 1. When the component mounts, it generates a random order of characters (excluding spaces)
 * 2. After the delay, each character appears sequentially at the stagger interval
 * 3. Each character transitions from blur(12px) + opacity(0) -> blur(0) + opacity(1)
 * 4. The animation completes once all characters are revealed
 *
 * Props:
 * @param {string} text - Text to display [Required]
 * @param {number} delay - Delay before the animation starts (ms) [Optional, default: 300]
 * @param {number} stagger - Reveal interval between characters (ms) [Optional, default: 80]
 * @param {string} variant - MUI Typography variant [Optional, default: 'body1']
 * @param {object} sx - MUI sx style [Optional]
 *
 * Example usage:
 * <RandomRevealText text="Hello World" delay={500} stagger={60} />
 */
function RandomRevealText({
  text,
  delay = 300,
  stagger = 80,
  variant = 'body1',
  sx = {},
}) {
  const [revealedIndices, setRevealedIndices] = useState(new Set());

  /** Generate a random order of characters, excluding spaces (Fisher-Yates shuffle) */
  const randomOrder = useMemo(() => {
    const indices = text
      .split('')
      .map((char, i) => (char !== ' ' ? i : -1))
      .filter((i) => i !== -1);

    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  }, [text]);

  /** Set up sequential reveal timers at the stagger interval */
  useEffect(() => {
    const timeouts = [];

    randomOrder.forEach((charIndex, orderIndex) => {
      const timeout = setTimeout(() => {
        setRevealedIndices((prev) => new Set([...prev, charIndex]));
      }, delay + orderIndex * stagger);
      timeouts.push(timeout);
    });

    return () => timeouts.forEach((t) => clearTimeout(t));
  }, [randomOrder, delay, stagger]);

  return (
    <Box
      component="span"
      sx={ {
        typography: variant,
        ...sx,
      } }
    >
      { text.split('').map((char, index) => {
        const isRevealed = char === ' ' || revealedIndices.has(index);
        return (
          <Box
            component="span"
            key={ index }
            sx={ {
              display: 'inline-block',
              opacity: isRevealed ? 1 : 0,
              filter: isRevealed ? 'blur(0px)' : 'blur(12px)',
              transition: 'opacity 1.2s ease-out, filter 1.2s ease-out',
              minWidth: char === ' ' ? '0.3em' : undefined,
            } }
          >
            { char }
          </Box>
        );
      }) }
    </Box>
  );
}

export default RandomRevealText;
