import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme, alpha } from '@mui/material/styles';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

/**
 * SlidingHighlightMenu - sliding highlight menu
 *
 * A series container that holds multiple action / navigation items.
 * On hover, a background / underline indicator glides smoothly between items.
 * Each item has its own independent onClick handler (no selected state).
 *
 * How it works:
 * 1. hoveredId updates when the mouse enters an item
 * 2. A motion.span (layoutId) is rendered inside that item
 * 3. Framer Motion runs a spring animation from the previous position -> the new position
 * 4. When the mouse leaves the container, the indicator fades out via AnimatePresence
 *
 * Props:
 * @param {Array} items - List of items [{ id, label, onClick }] [Required]
 * @param {string} indicator - Indicator style ('background' | 'underline') [Optional, default: 'background']
 * @param {string} direction - Menu direction ('horizontal' | 'vertical') [Optional, default: 'horizontal']
 * @param {object} sx - Additional styles [Optional]
 *
 * Example usage:
 * <SlidingHighlightMenu
 *   items={[
 *     { id: 'about', label: 'About', onClick: () => navigate('/about') },
 *     { id: 'work', label: 'Work', onClick: () => navigate('/work') },
 *   ]}
 * />
 */
function SlidingHighlightMenu({
  items = [],
  indicator = 'background',
  direction = 'horizontal',
  sx,
}) {
  const [hoveredId, setHoveredId] = useState(null);
  const theme = useTheme();

  const isVertical = direction === 'vertical';
  const isUnderline = indicator === 'underline';
  const highlightColor = theme.palette.text.primary;

  return (
    <Box
      sx={ {
        display: 'inline-flex',
        flexDirection: isVertical ? 'column' : 'row',
        position: 'relative',
        gap: isVertical ? 0 : 0.5,
        ...(isUnderline && !isVertical && {
          borderBottom: '1px solid',
          borderColor: 'divider',
        }),
        ...(isUnderline && isVertical && {
          borderRight: '1px solid',
          borderColor: 'divider',
        }),
        ...sx,
      } }
      onMouseLeave={ () => setHoveredId(null) }
    >
      { items.map((item) => (
        <Box
          key={ item.id }
          component="button"
          onClick={ item.onClick }
          onMouseEnter={ () => setHoveredId(item.id) }
          sx={ {
            position: 'relative',
            px: 2,
            py: 1,
            cursor: 'pointer',
            border: 'none',
            backgroundColor: 'transparent',
            zIndex: 1,
            '&:focus-visible': {
              outline: '2px solid',
              outlineColor: 'primary.main',
              outlineOffset: -2,
            },
          } }
        >
          {/* Hover indicator: layoutId automatically animates the position transition between items */}
          { hoveredId === item.id && (
            <motion.div
              layoutId="hover-highlight"
              initial={ { opacity: 0 } }
              animate={ { opacity: 1 } }
              transition={ { type: 'spring', stiffness: 500, damping: 35, opacity: { duration: 0.15 } } }
              style={ isUnderline
                ? {
                  position: 'absolute',
                  ...(isVertical
                    ? { right: -1, top: 0, width: 2, height: '100%' }
                    : { bottom: -1, left: 0, width: '100%', height: 2 }
                  ),
                  backgroundColor: highlightColor,
                }
                : {
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: alpha(highlightColor, 0.06),
                  borderRadius: 4,
                }
              }
            />
          ) }

          {/* Label */}
          <Typography
            variant="body2"
            sx={ {
              position: 'relative',
              zIndex: 1,
              color: 'text.primary',
              whiteSpace: 'nowrap',
              userSelect: 'none',
            } }
          >
            { item.label }
          </Typography>
        </Box>
      )) }
    </Box>
  );
}

export { SlidingHighlightMenu };
