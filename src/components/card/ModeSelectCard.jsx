import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/**
 * ModeSelectCard component (TP2)
 *
 * A card for selecting one of three modes (concept/system/direct-to-code) on the first screen of project creation.
 * A single mode selection branches T2 recommendation ordering + T3 synthesis tone + the Export default all at once.
 *
 * How it works:
 * 1. Calls onSelect(mode) when the card is clicked
 * 2. Shows the active visual (border + bg emphasis) when it matches selectedMode
 * 3. Applies a subtle lift effect on hover
 *
 * Props:
 * @param {string} mode - 'concept' | 'system' [Required]
 * @param {string} title - Card title (e.g. "Explore a concept") [Required]
 * @param {string} subtitle - Card subtitle (e.g. "I want to find my direction") [Required]
 * @param {string} description - Card description (e.g. "Fast variety first") [Required]
 * @param {boolean} isSelected - Current selection state [Optional, default: false]
 * @param {function} onSelect - (mode) => void click callback [Required]
 * @param {object} sx - Additional styles [Optional]
 *
 * Example usage:
 * <ModeSelectCard
 *   mode="concept"
 *   title="Explore a concept"
 *   subtitle="I want to find my direction"
 *   description="Fast variety first"
 *   isSelected={ mode === 'concept' }
 *   onSelect={ setMode }
 * />
 */
export function ModeSelectCard({
  mode,
  title,
  subtitle,
  description,
  isSelected = false,
  onSelect,
  sx,
}) {
  return (
    <Box
      role="button"
      tabIndex={ 0 }
      aria-pressed={ isSelected }
      onClick={ () => onSelect?.(mode) }
      onKeyDown={ (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect?.(mode);
        }
      } }
      sx={ {
        cursor: 'pointer',
        p: { xs: 3, md: 4 },
        borderRadius: 2,
        border: isSelected ? '2px solid' : '1px solid',
        borderColor: isSelected ? 'primary.main' : 'divider',
        bgcolor: isSelected ? 'primary.50' : 'background.paper',
        transition: 'border-color 150ms, background-color 150ms, transform 150ms',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        minHeight: 260,
        boxSizing: 'border-box',
        '&:hover': {
          borderColor: isSelected ? 'primary.main' : 'text.secondary',
          transform: 'translateY(-2px)',
        },
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: 2,
        },
        ...sx,
      } }
    >
      <Typography variant="h5" sx={ { fontWeight: 700, letterSpacing: '-0.01em' } }>
        { title }
      </Typography>
      <Typography variant="body2" sx={ { color: 'text.primary', fontWeight: 500 } }>
        { subtitle }
      </Typography>
      { description && (
        <Typography
          variant="body2"
          sx={ {
            color: 'text.secondary',
            fontSize: '0.875rem',
            lineHeight: 1.6,
            mt: 1,
          } }
        >
          { description }
        </Typography>
      ) }
    </Box>
  );
}
