import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/**
 * ScrollRevealText component
 *
 * A scroll reveal effect where each character of the text appears sequentially as the user scrolls.
 * Splits the text into sentences and displays each sentence as a separate block.
 *
 * Behavior:
 * 1. When the component enters the viewport, it starts tracking the scroll position
 * 2. Based on the scroll progress (0 to 1), characters appear sequentially from the left
 * 3. Inactive characters have lower opacity, and active characters are fully displayed
 * 4. Once past the center of the viewport, all characters are active
 *
 * Props:
 * @param {string} text - Text to display [Required]
 * @param {string} activeColor - Color of active characters [Optional, default: 'text.primary']
 * @param {string} inactiveColor - Color of inactive characters [Optional, default: 'text.disabled']
 * @param {string} variant - MUI Typography variant [Optional, default: 'h4']
 * @param {object} sx - MUI sx style [Optional]
 *
 * Example usage:
 * <ScrollRevealText text="Text appears as you scroll. It is split by sentence." />
 */
function ScrollRevealText({
  text,
  activeColor = 'text.primary',
  inactiveColor = 'text.disabled',
  variant = 'h4',
  sx = {},
}) {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);

  /** Calculate progress based on scroll position (throttled with requestAnimationFrame) */
  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const start = windowHeight * 0.8;
      const end = -rect.height * 0.3;
      const current = rect.top;

      let newProgress = (start - current) / (start - end);
      newProgress = Math.max(0, Math.min(1, newProgress));

      setProgress(newProgress);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateProgress);
      }
    };

    updateProgress();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /** Split into sentences (by '. ') */
  const sentences = text.split('. ').map((s, i, arr) =>
    i < arr.length - 1 ? s + '.' : s
  );

  /** Calculate the total character count */
  const totalChars = sentences.reduce((sum, s) => sum + s.length, 0);
  const revealedCount = Math.floor(totalChars * progress);

  let charCounter = 0;

  return (
    <Box ref={ containerRef } sx={ sx }>
      { sentences.map((sentence, sIdx) => (
        <Typography
          key={ sIdx }
          variant={ variant }
          sx={ {
            lineHeight: 1.9,
            mb: { xs: 2, md: 3 },
            wordBreak: 'keep-all',
          } }
        >
          { sentence.split('').map((char, cIdx) => {
            const isRevealed = charCounter < revealedCount;
            charCounter++;
            return (
              <Box
                component="span"
                key={ cIdx }
                sx={ {
                  color: isRevealed ? activeColor : inactiveColor,
                  transition: 'color 0.15s ease-out',
                } }
              >
                { char }
              </Box>
            );
          }) }
        </Typography>
      )) }
    </Box>
  );
}

export default ScrollRevealText;
