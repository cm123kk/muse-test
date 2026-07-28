import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CollectionsIcon from '@mui/icons-material/Collections';
import { CustomCard } from './CustomCard';
import { ImageTransition } from '../media/ImageTransition';

/**
 * MoodboardCard component
 *
 * A card that displays a moodboard collection. Implemented by extending CustomCard.
 * Provides a collection preview via a 2×2 thumbnail grid and
 * displays the moodboard's metadata (name, description, item count, creation date).
 *
 * How it works:
 * 1. Default state: shows the first 4 images from the items array in a 2×2 grid
 * 2. When there are fewer than 4 images: empty slots are shown with a grey background
 * 3. When there are 0 images: shows a full placeholder icon
 * 4. On hover: images fade-transition one at a time in a cycle at 0.3s intervals
 * 5. On hover release: returns to the 2×2 grid
 *
 * Props:
 * @param {string} id - Moodboard ID [Required]
 * @param {string} name - Moodboard name [Required]
 * @param {string} description - Moodboard description [Optional]
 * @param {Array} items - Array of items in the moodboard [Required]
 * @param {string} createdAt - Creation date (YYYY-MM-DD) [Optional]
 * @param {function} onClick - Card click handler [Optional]
 * @param {function} onEdit - Edit button handler [Optional]
 * @param {function} onDelete - Delete button handler [Optional]
 * @param {object} sx - Additional styles [Optional]
 *
 * Example usage:
 * <MoodboardCard
 *   id="board-1"
 *   name="Abstract Art"
 *   description="Abstract and geometric artwork collection"
 *   items={moodboard.items}
 *   createdAt="2024-10-15"
 *   onClick={() => navigate(`/moodboards/${id}`)}
 *   onEdit={() => handleEdit(id)}
 * />
 */
export function MoodboardCard({
  id,
  name,
  description,
  items = [],
  createdAt,
  onClick,
  onEdit,
  onDelete,
  sx,
  ...props
}) {
  // ============================================
  // State management
  // ============================================
  const [isHovered, setIsHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef(null);

  // Images to show in the thumbnail (up to 4)
  const thumbnailImages = items.slice(0, 4);
  const itemCount = items.length;

  /**
   * Auto image cycling on hover
   * - Mouse enter: increments the image index at 0.3s intervals
   * - Mouse leave: clears the interval and resets the index
   */
  useEffect(() => {
    if (isHovered && items.length > 1) {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % items.length);
      }, 300);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isHovered, items.length]);

  /**
   * Mouse event handlers
   */
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setActiveIndex(0);
  };

  /**
   * Build the image array for ImageTransition
   */
  const transitionImages = items.map((item) => ({
    src: item.thumbnail || item.src?.medium || item.src,
    alt: item.title || 'Moodboard image',
  }));

  /**
   * Date formatting (YYYY-MM-DD -> MMM DD, YYYY)
   */
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  /**
   * Media slot rendering
   * - Default state: 2×2 thumbnail grid
   * - Hover state: cycles a single image via ImageTransition
   * - No images: shows a placeholder icon
   */
  const renderMediaSlot = () => {
    // When there are no images: placeholder
    if (items.length === 0) {
      return (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'grey.100',
            color: 'grey.400',
          }}
        >
          <CollectionsIcon sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="caption" color="inherit">
            No images yet
          </Typography>
        </Box>
      );
    }

    // Hover state: cycle images via ImageTransition
    if (isHovered && items.length > 1) {
      return (
        <ImageTransition
          images={transitionImages}
          activeIndex={activeIndex}
          transition="fade"
          duration={300}
          aspectRatio="1/1"
          objectFit="cover"
          sx={{
            width: '100%',
            height: '100%',
          }}
        />
      );
    }

    // Default state: adaptive layout based on count, preventing empty slots
    //   1 image -> full bleed
    //   2 images -> left/right 50:50
    //   3 images -> 1 full on the left + 2 stacked on the right
    //   4+ images -> 2×2 grid (first 4)
    const renderImage = (image, idx) => (
      <Box
        component="img"
        key={ `${idx}-${image.thumbnail || image.src}` }
        src={ image.thumbnail || image.src?.medium || image.src }
        alt={ image.title || `Image ${idx + 1}` }
        sx={ {
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        } }
      />
    );

    const slotWrap = (children, key) => (
      <Box key={ key } sx={ { position: 'relative', overflow: 'hidden', bgcolor: 'grey.100' } }>
        { children }
      </Box>
    );

    if (thumbnailImages.length === 1) {
      return (
        <Box sx={ { width: '100%', height: '100%', position: 'relative', bgcolor: 'grey.100' } }>
          { renderImage(thumbnailImages[0], 0) }
        </Box>
      );
    }

    if (thumbnailImages.length === 2) {
      return (
        <Box sx={ {
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2px',
          width: '100%',
          height: '100%',
          backgroundColor: 'grey.200',
        } }>
          { thumbnailImages.map((img, i) => slotWrap(renderImage(img, i), i)) }
        </Box>
      );
    }

    if (thumbnailImages.length === 3) {
      return (
        <Box sx={ {
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: '2px',
          width: '100%',
          height: '100%',
          backgroundColor: 'grey.200',
        } }>
          <Box sx={ { gridRow: 'span 2', position: 'relative', overflow: 'hidden', bgcolor: 'grey.100' } }>
            { renderImage(thumbnailImages[0], 0) }
          </Box>
          { slotWrap(renderImage(thumbnailImages[1], 1), 1) }
          { slotWrap(renderImage(thumbnailImages[2], 2), 2) }
        </Box>
      );
    }

    // 4+ images: 2×2 grid (first 4)
    return (
      <Box
        className="thumbnail-grid"
        sx={ {
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gridTemplateRows: 'repeat(2, 1fr)',
          gap: '2px',
          width: '100%',
          height: '100%',
          backgroundColor: 'grey.200',
        } }
      >
        { thumbnailImages.map((img, i) => slotWrap(renderImage(img, i), i)) }
      </Box>
    );
  };

  /**
   * Overlay slot (action buttons + item count badge)
   * - Action buttons: shown only on hover
   * - Item count badge: always shown
   */
  const OverlayContent = (
    <>
      {/* Action buttons (shown on hover) */}
      <Box
        className="moodboard-actions"
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          display: 'flex',
          gap: 0.5,
          opacity: 0,
          transition: 'opacity 0.2s ease',
        }}
      >
        {onEdit && (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(id);
            }}
            sx={{
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              '&:hover': { bgcolor: 'white' },
            }}
          >
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
        )}
        {onDelete && (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
            sx={{
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              '&:hover': {
                bgcolor: 'error.light',
                color: 'white',
              },
            }}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Item count badge */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          left: 8,
          px: 1.5,
          py: 0.5,
          borderRadius: 1,
          bgcolor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: 'white',
            fontWeight: 600,
            fontSize: '0.7rem',
          }}
        >
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </Typography>
      </Box>
    </>
  );

  return (
    <CustomCard
      layout="vertical"
      mediaSlot={renderMediaSlot()}
      mediaRatio="1/1"
      contentPadding="md"
      overlaySlot={OverlayContent}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        cursor: 'pointer',
        transition: 'border-color 150ms',
        border: 'none',
        boxShadow: 'none',
        '&:hover': {
          '& .moodboard-actions': { opacity: 1 },
        },
        ...sx,
      }}
      {...props}
    >
      {/* Title */}
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 700,
          lineHeight: 1.3,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          mb: description ? 0.5 : 0,
        }}
      >
        {name}
      </Typography>

      {/* Description */}
      {description && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.4,
            mb: 1.5,
          }}
        >
          {description}
        </Typography>
      )}

      {/* Metadata */}
      {createdAt && (
        <Typography
          variant="caption"
          sx={{
            color: 'text.disabled',
            fontSize: '0.75rem',
          }}
        >
          Created {formatDate(createdAt)}
        </Typography>
      )}
    </CustomCard>
  );
}

export default MoodboardCard;
