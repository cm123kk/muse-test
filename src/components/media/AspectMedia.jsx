import { forwardRef } from 'react';
import Box from '@mui/material/Box';

/**
 * AspectMedia Component
 *
 * A general-purpose media component that displays an image or video at a fixed ratio.
 * Uses the CSS aspect-ratio property to maintain a responsive ratio.
 *
 * ## How it works
 * 1. The type prop determines whether an image or video is rendered
 * 2. The aspectRatio prop keeps a fixed ratio (e.g. '16/9', '4/3', '1/1')
 * 3. The objectFit prop controls how the media fits within the container
 * 4. For videos, autoPlay, muted, loop, controls, and more can be controlled
 *
 * Props:
 * @param {string} src - Media source URL [Required]
 * @param {string} alt - Alternative text (for images) [Optional, default: '']
 * @param {string} type - Media type ('image' | 'video') [Optional, default: 'image']
 * @param {string} aspectRatio - CSS aspect-ratio value [Optional, default: '16/9']
 * @param {string} objectFit - CSS object-fit value [Optional, default: 'cover']
 * @param {boolean} isLazy - Enable lazy loading [Optional, default: true]
 * @param {string} poster - Video poster image URL [Optional]
 * @param {boolean} isAutoPlay - Autoplay video [Optional, default: false]
 * @param {boolean} isMuted - Mute video [Optional, default: true]
 * @param {boolean} isLoop - Loop video [Optional, default: false]
 * @param {boolean} hasControls - Show video controls [Optional, default: false]
 * @param {boolean} isPlaysInline - Inline playback (mobile) [Optional, default: true]
 * @param {Object} sx - Additional MUI sx styles [Optional]
 *
 * Example usage:
 * // Image
 * <AspectMedia
 *   src="/photo.jpg"
 *   alt="Photo description"
 *   aspectRatio="4/3"
 * />
 *
 * // Video
 * <AspectMedia
 *   type="video"
 *   src="/video.mp4"
 *   aspectRatio="16/9"
 *   isAutoPlay
 *   isMuted
 *   isLoop
 * />
 */
const AspectMedia = forwardRef(function AspectMedia(
  {
    src,
    alt = '',
    type = 'image',
    aspectRatio = '16/9',
    objectFit = 'cover',
    isLazy = true,
    poster,
    isAutoPlay = false,
    isMuted = true,
    isLoop = false,
    hasControls = false,
    isPlaysInline = true,
    sx = {},
    ...props
  },
  ref
) {
  // Shared styles
  const commonStyles = {
    width: '100%',
    height: 'auto',
    aspectRatio,
    objectFit,
    display: 'block',
    ...sx,
  };

  // Image rendering
  if (type === 'image') {
    return (
      <Box
        ref={ref}
        component="img"
        src={src}
        alt={alt}
        loading={isLazy ? 'lazy' : 'eager'}
        sx={commonStyles}
        {...props}
      />
    );
  }

  // Video rendering
  if (type === 'video') {
    return (
      <Box
        ref={ref}
        component="video"
        src={src}
        poster={poster}
        autoPlay={isAutoPlay}
        muted={isMuted}
        loop={isLoop}
        controls={hasControls}
        playsInline={isPlaysInline}
        sx={commonStyles}
        {...props}
      />
    );
  }

  return null;
});

export default AspectMedia;
