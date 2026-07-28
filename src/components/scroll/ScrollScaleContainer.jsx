import React, { useRef } from 'react';
import Box from '@mui/material/Box';
// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * ScrollScaleContainer - scroll-linked scale container
 *
 * A container that scales its content based on how much of it is visible in the viewport.
 * The outer wrapper keeps the original (maximum) size, so it does not affect the surrounding layout.
 *
 * How it works:
 * 1. The outer Box reserves space equal to the original size of the children
 * 2. Framer Motion useScroll tracks the element's scroll progress within the viewport (0 -> 1)
 * 3. useTransform linearly maps the progress to the scaleFrom -> scaleTo range
 * 4. transform: scale() is applied to the inner motion.div (no effect on layout flow)
 * 5. When the element enters the viewport it starts small, and reaches its original size when it hits the center
 *
 * Props:
 * @param {React.ReactNode} children - Inner content [Required]
 * @param {number} scaleFrom - Minimum scale (outside the viewport) [Optional, default: 0.85]
 * @param {number} scaleTo - Maximum scale (fully visible in the viewport) [Optional, default: 1]
 * @param {string} transformOrigin - Scale origin point [Optional, default: 'center center']
 * @param {string[]} offset - Framer Motion useScroll offset array [Optional, default: ['start end', 'center center']]
 * @param {object} sx - Additional styles for the outer container [Optional]
 *
 * Example usage:
 * <ScrollScaleContainer scaleFrom={0.8}>
 *   <Card>Content</Card>
 * </ScrollScaleContainer>
 */
function ScrollScaleContainer({
  children,
  scaleFrom = 0.85,
  scaleTo = 1,
  transformOrigin = 'center center',
  offset = ['start end', 'center center'],
  sx,
}) {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset,
  });

  const scale = useTransform(scrollYProgress, [0, 1], [scaleFrom, scaleTo]);

  return (
    <Box
      ref={ containerRef }
      sx={ {
        overflow: 'hidden',
        ...sx,
      } }
    >
      <motion.div
        style={ {
          scale,
          transformOrigin,
          width: '100%',
          height: '100%',
        } }
      >
        { children }
      </motion.div>
    </Box>
  );
}

export { ScrollScaleContainer };
