import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import MarqueeContainer from '../motion/MarqueeContainer';

/*
 * The tag vocabulary used by T1 auto-tagging (based on the SolutionOneSection FIXTURES).
 * Split into 3 rows that flow in alternating directions.
 */
const TAG_ROWS = [
  ['Brutalist', 'High-contrast', 'Typography-Hero', 'Full-bleed', 'All-caps', 'Display'],
  ['Swiss', 'Grid', 'Modular', 'Monospace', 'Mono', 'UI-Mockup', 'Cool'],
  ['Risograph', 'Editorial', 'Serif', 'Asymmetric', 'Faded', 'Earth', 'Condensed', 'Vivid'],
];

/* Alternating direction for rows 1, 2, 3 (left / right / left) */
const ROW_DIRECTIONS = ['left', 'right', 'left'];
/* One-cycle duration per row (seconds). Larger is slower. */
const ROW_SPEEDS = [64, 76, 56];

/**
 * TagPill component
 *
 * A single oversized rounded chip tag flowing inside the marquee. Outlined only, no background.
 *
 * Props:
 * @param {string} label - tag text [Required]
 */
function TagPill({ label }) {
  return (
    <Chip
      label={label}
      variant="outlined"
      sx={{
        /* borderRadius is already rounded by the theme MuiChip (999px).
           Passing a number again in sx would multiply with shape.borderRadius(0) to become 0px, so leave it untouched. */
        height: 'auto',
        borderColor: 'divider',
        bgcolor: 'transparent',
        color: 'text.primary',
        px: { xs: 0.75, sm: 1.5, md: 3 },
        py: { xs: 0.5, sm: 1, md: 2 },
        '& .MuiChip-label': {
          px: { xs: 0.5, sm: 1, md: 2 },
          fontWeight: 500,
          fontSize: { xs: '1rem', sm: '2rem', md: '4rem' },
          /* Prevent vertical clipping of descenders (g, p, y) at large font sizes: generous lineHeight + released overflow */
          lineHeight: 1.3,
          letterSpacing: '-0.02em',
          overflow: 'visible',
          textOverflow: 'clip',
        },
      }}
    />
  );
}

/**
 * TagMarqueeSection component
 *
 * The section between Solution 1 and Solution 2 on the landing page.
 * Flows the T1 analysis tags through a 3-row marquee. Each row alternates direction (left/right/left)
 * and the tags render oversized, crossing the screen full-bleed.
 *
 * Props: none
 *
 * Example usage:
 * <TagMarqueeSection />
 */
function TagMarqueeSection() {
  return (
    <Box
      sx={{
        py: { xs: 10, md: 16 },
        overflow: 'hidden',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 1.5, md: 3 },
      }}
    >
      {TAG_ROWS.map((row, rowIdx) => (
        <MarqueeContainer
          key={rowIdx}
          direction={ROW_DIRECTIONS[rowIdx]}
          speed={ROW_SPEEDS[rowIdx]}
          gap={3}
          isPauseOnHover={false}
        >
          {row.map((tag) => (
            <TagPill key={tag} label={tag} />
          ))}
        </MarqueeContainer>
      ))}
    </Box>
  );
}

export default TagMarqueeSection;
