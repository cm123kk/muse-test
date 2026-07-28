import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Checkbox from '@mui/material/Checkbox';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { CustomCard } from './CustomCard';

/**
 * ImageCard component
 *
 * The default grid item. Implemented by extending CustomCard.
 * On hover, applies a position-shift effect and shows action buttons / a selection checkbox.
 *
 * How it works:
 * 1. When the user hovers over the card, the card moves slightly upward
 * 2. On hover, shows the default action (like) or customOverlay in the top-right
 * 3. If `isSelectable`, shows a selection checkbox in the top-left (always visible when selected)
 * 4. When `isSelected`, emphasizes the selected state with a primary color ring
 * 5. The title/tag info is always shown at the bottom of the card
 *
 * Props:
 * @param {string} src - Image URL [Required]
 * @param {string} title - Image title/description [Optional]
 * @param {string[]} tags - List of related tags (top 3 shown) [Optional]
 * @param {string[]} dominantColors - Array of HEX colors (top 5 shown as small circular swatches) [Optional, default: []]
 * @param {function} onLike - Like button click handler [Optional]
 * @param {boolean} hideActions - Whether to hide the default action buttons [Optional, default: false]
 * @param {node} customOverlay - Custom overlay element (used together with hideActions) [Optional]
 * @param {boolean} isSelectable - Whether to show the selection checkbox [Optional, default: false]
 * @param {boolean} isSelected - Current selection state [Optional, default: false]
 * @param {function} onToggleSelect - Selection toggle handler (nextSelected) => void [Optional]
 * @param {object} sx - Additional styles [Optional]
 *
 * Example usage:
 * <ImageCard
 *   src="/image.jpg"
 *   title="Beautiful landscape"
 *   tags={ ['nature', 'landscape'] }
 *   onLike={ () => handleLike() }
 * />
 *
 * // Selectable mode (ReferencePicker, etc.)
 * <ImageCard
 *   src="/image.jpg"
 *   tags={ ['Minimal', 'Blue'] }
 *   isSelectable
 *   isSelected={ picked.has(id) }
 *   onToggleSelect={ (next) => toggle(id, next) }
 * />
 */
export function ImageCard({
  src,
  title,
  tags = [],
  dominantColors = [],
  mediaRatio = 'auto',
  onLike,
  hideActions = false,
  customOverlay,
  isSelectable = false,
  isSelected = false,
  onToggleSelect,
  sx,
  ...props
}) {
  const handleToggle = (e) => {
    e.stopPropagation();
    onToggleSelect?.(!isSelected);
  };

  /** Top-right action button (default: like) */
  const ActionButtons = (
    <Box
      className="action-buttons"
      sx={ {
        position: 'absolute',
        top: 8,
        right: 8,
        display: 'flex',
        gap: 0.5,
        opacity: 0,
        transition: 'opacity 0.2s',
      } }
    >
      <IconButton
        size="small"
        onClick={ (e) => {
          e.stopPropagation();
          onLike?.();
        } }
        sx={ {
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          '&:hover': { bgcolor: 'background.default' },
        } }
      >
        <FavoriteBorderIcon fontSize="small" />
      </IconButton>
    </Box>
  );

  /** Top-left selection checkbox (only when isSelectable) */
  const SelectCheckbox = isSelectable ? (
    <Box
      className="select-checkbox"
      onClick={ handleToggle }
      sx={ {
        position: 'absolute',
        top: 8,
        left: 8,
        // Visible when selected or hovered
        opacity: isSelected ? 1 : 0,
        transition: 'opacity 0.2s',
      } }
    >
      <Checkbox
        checked={ isSelected }
        onChange={ (e) => {
          e.stopPropagation();
          onToggleSelect?.(e.target.checked);
        } }
        size="small"
        sx={ {
          p: 0.5,
          bgcolor: 'background.paper',
          borderRadius: '50%',
          boxShadow: 1,
          '&:hover': { bgcolor: 'background.default' },
        } }
      />
    </Box>
  ) : null;

  /** Determine the overlay slot: isSelectable takes priority, otherwise keep the existing logic */
  const overlaySlot = (
    <>
      { SelectCheckbox }
      { hideActions ? customOverlay : ActionButtons }
    </>
  );

  const hasContent = title || tags.length > 0 || dominantColors.length > 0;

  return (
    <CustomCard
      layout="vertical"
      mediaSrc={ src }
      mediaAlt={ title || 'Image asset' }
      mediaRatio={ mediaRatio }
      contentPadding={ hasContent ? 'sm' : 'none' }
      overlaySlot={ overlaySlot }
      onClick={ isSelectable ? handleToggle : props.onClick }
      sx={ {
        cursor: 'pointer',
        transition: 'outline-color 150ms',
        outline: '2px solid',
        outlineOffset: 0,
        outlineColor: isSelected ? 'info.main' : 'transparent',
        '&:hover': {
          '& .action-buttons': { opacity: 1 },
          '& .select-checkbox': { opacity: 1 },
        },
        border: 'none',
        boxShadow: 'none',
        ...sx,
      } }
      { ...props }
    >
      { hasContent && (
        <>
          { title && (
            <Typography
              variant="body2"
              sx={ {
                fontWeight: 600,
                wordBreak: 'break-word',
              } }
            >
              { title }
            </Typography>
          ) }
          { dominantColors.length > 0 && (
            <Box
              sx={ {
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                mt: title ? 2 : 0,
              } }
            >
              { dominantColors.slice(0, 5).map((hex, i) => (
                <Box
                  key={ `${hex}-${i}` }
                  title={ hex }
                  sx={ {
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    bgcolor: hex,
                    border: '1px solid',
                    borderColor: 'divider',
                    flexShrink: 0,
                  } }
                />
              )) }
            </Box>
          ) }
          { tags.length > 0 && (
            <Box
              sx={ {
                display: 'flex',
                flexWrap: 'wrap',
                gap: 0.5,
                mt: (title || dominantColors.length) ? 2 : 0,
              } }
            >
              { tags.slice(0, 3).map((tag) => (
                <Chip
                  key={ tag }
                  label={ tag }
                  size="small"
                  sx={ {
                    height: 20,
                    fontSize: '0.7rem',
                  } }
                />
              )) }
            </Box>
          ) }
        </>
      ) }
    </CustomCard>
  );
}
