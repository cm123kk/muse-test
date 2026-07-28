import { forwardRef } from 'react';
import Box from '@mui/material/Box';
import { CardContainer } from './CardContainer';

/**
 * CustomCard component
 *
 * A custom card component made up of a media area and a content area.
 * Supports a variety of layouts (vertical, horizontal, overlay).
 *
 * How it works:
 * 1. Determines the placement of media and content based on layout
 * 2. The media area displays visual content such as images and video
 * 3. The content area displays information such as text and buttons
 * 4. overlaySlot allows overlaying action buttons, badges, and more on top of the media
 *
 * Props:
 * @param {string} layout - Layout type ('vertical' | 'horizontal' | 'overlay') [Optional, default: 'vertical']
 * @param {string} mediaPosition - Media position ('start' | 'end') [Optional, default: 'start']
 * @param {string} mediaRatio - Media area ratio ('1/1' | '4/3' | '16/9' | '21/9' | 'auto') [Optional, default: '16/9']
 * @param {string} mediaSrc - Media source URL [Optional]
 * @param {string} mediaAlt - Media alt text [Optional, default: '']
 * @param {node} mediaSlot - Custom media element (takes precedence over mediaSrc) [Optional]
 * @param {node} overlaySlot - Overlay element to display on top of the media area (action buttons, badges, etc.) [Optional]
 * @param {node} children - Content area contents [Optional]
 * @param {string} contentPadding - Content padding ('none' | 'sm' | 'md' | 'lg') [Optional, default: 'md']
 * @param {string} contentAlign - Content alignment ('start' | 'center' | 'end') [Optional, default: 'start']
 * @param {boolean} isInteractive - Hover effect [Optional, default: false]
 * @param {function} onClick - Click handler [Optional]
 * @param {object} sx - Additional styles [Optional]
 *
 * Example usage:
 * <CustomCard
 *   layout="horizontal"
 *   mediaSrc="/image.jpg"
 *   mediaRatio="4/3"
 *   overlaySlot={<ActionButtons />}
 * >
 *   <Typography variant="h6">Title</Typography>
 *   <Typography>Description</Typography>
 * </CustomCard>
 */
const CustomCard = forwardRef(function CustomCard({
  layout = 'vertical',
  mediaPosition = 'start',
  mediaRatio = '16/9',
  mediaSrc,
  mediaAlt = '',
  mediaSlot,
  overlaySlot,
  children,
  contentPadding = 'md',
  contentAlign = 'start',
  isInteractive = false,
  onClick,
  sx,
  ...props
}, ref) {
  /**
   * Padding map
   */
  const paddingMap = {
    none: 0,
    sm: 2,
    md: 3,
    lg: 4,
  };

  /**
   * Alignment map
   */
  const alignMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
  };

  /**
   * Container styles per layout
   */
  const getLayoutStyles = () => {
    switch (layout) {
      case 'horizontal':
        return {
          display: 'flex',
          flexDirection: mediaPosition === 'end' ? 'row-reverse' : 'row',
        };

      case 'overlay':
        return {
          position: 'relative',
        };

      case 'vertical':
      default:
        return {
          display: 'flex',
          flexDirection: mediaPosition === 'end' ? 'column-reverse' : 'column',
        };
    }
  };

  /**
   * Media area styles
   * - 'auto' ratio: preserves the original image ratio (aspectRatio not applied)
   */
  const getMediaStyles = () => {
    const base = {
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: 'grey.200',
    };

    if (layout === 'horizontal') {
      return {
        ...base,
        width: '40%',
        flexShrink: 0,
        ...(mediaRatio !== 'auto' && { aspectRatio: mediaRatio }),
      };
    }

    if (layout === 'overlay') {
      return {
        ...base,
        position: 'absolute',
        inset: 0,
        aspectRatio: 'unset',
      };
    }

    return {
      ...base,
      width: '100%',
      ...(mediaRatio !== 'auto' && { aspectRatio: mediaRatio }),
    };
  };

  /**
   * Content area styles
   */
  const getContentStyles = () => {
    const base = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: alignMap[contentAlign],
      p: paddingMap[contentPadding],
    };

    if (layout === 'horizontal') {
      return {
        ...base,
        flex: 1,
        justifyContent: 'center',
      };
    }

    if (layout === 'overlay') {
      return {
        ...base,
        position: 'relative',
        zIndex: 1,
        minHeight: 200,
        justifyContent: 'flex-end',
        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
        color: 'common.white',
      };
    }

    return base;
  };

  /**
   * Media rendering
   * - mediaSlot: custom media element (takes precedence)
   * - mediaSrc: image URL
   * - overlaySlot: overlay element on top of the media (action buttons, badges, etc.)
   */
  const renderMedia = () => {
    const hasMedia = mediaSlot || mediaSrc;
    if (!hasMedia && !overlaySlot) return null;

    // Image styles (auto ratio: preserves original ratio)
    const imgStyles = mediaRatio === 'auto'
      ? {
          display: 'block',
          width: '100%',
          height: 'auto',
          objectFit: 'cover',
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }
      : {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        };

    return (
      <Box className="custom-card-media" sx={getMediaStyles()}>
        {/* Custom media slot (takes precedence) */}
        {mediaSlot}

        {/* Default image rendering */}
        {!mediaSlot && mediaSrc && (
          <Box
            component="img"
            src={mediaSrc}
            alt={mediaAlt}
            decoding="async"
            sx={imgStyles}
          />
        )}

        {/* Overlay slot (action buttons, badges, etc.) */}
        {overlaySlot}
      </Box>
    );
  };

  return (
    <CardContainer
      ref={ref}
      variant="outlined"
      padding="none"
      radius="md"
      onClick={onClick}
      isInteractive={isInteractive}
      sx={{
        ...getLayoutStyles(),
        ...sx,
      }}
      {...props}
    >
      {renderMedia()}
      {children && (
        <Box sx={getContentStyles()}>
          {children}
        </Box>
      )}
    </CardContainer>
  );
});

export { CustomCard };
