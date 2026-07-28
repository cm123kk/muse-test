import { useState, useRef, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Indicator } from '../../common/ui/Indicator';

/**
 * ImageCarousel component
 *
 * A component that displays multiple images as a carousel within a single image area.
 * Supports swipe gestures, keyboard navigation, and autoplay.
 *
 * How it works:
 * 1. Images are laid out horizontally and shift based on the current index
 * 2. Swiping is possible via touch/mouse drag
 * 3. When autoplay is on, it advances to the next image at a fixed interval
 * 4. A built-in Indicator shows the current position and lets you jump directly
 *
 * Props:
 * @param {Array} images - Array of images [{ src, alt }] or string[] [Required]
 * @param {string} aspectRatio - Container aspect ratio [Optional, default: '16/9']
 * @param {string} transition - Transition type ('slide' | 'fade') [Optional, default: 'slide']
 * @param {number} transitionDuration - Transition time (ms) [Optional, default: 300]
 * @param {boolean} isAutoPlay - Autoplay [Optional, default: false]
 * @param {number} autoPlayInterval - Autoplay interval (ms) [Optional, default: 5000]
 * @param {boolean} isLoop - Infinite loop [Optional, default: true]
 * @param {boolean} hasIndicator - Show indicator [Optional, default: true]
 * @param {string} indicatorType - Indicator type [Optional, default: 'dot']
 * @param {string} indicatorPosition - Indicator position [Optional, default: 'bottom']
 * @param {boolean} hasArrows - Show arrow buttons [Optional, default: true]
 * @param {boolean} isPausedOnHover - Pause autoplay on hover [Optional, default: true]
 * @param {function} onSlideChange - Slide change callback (index) => void [Optional]
 * @param {object} sx - Additional styles [Optional]
 *
 * Example usage:
 * <ImageCarousel
 *   images={['img1.jpg', 'img2.jpg', 'img3.jpg']}
 *   aspectRatio="16/9"
 *   isAutoPlay
 *   autoPlayInterval={4000}
 *   hasIndicator
 *   indicatorType="line"
 * />
 */
export function ImageCarousel({
  images = [],
  aspectRatio = '16/9',
  transition = 'slide',
  transitionDuration = 300,
  isAutoPlay = false,
  autoPlayInterval = 5000,
  isLoop = true,
  hasIndicator = true,
  indicatorType = 'dot',
  indicatorPosition = 'bottom',
  hasArrows = true,
  isPausedOnHover = true,
  onSlideChange,
  sx,
  ...props
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  const containerRef = useRef(null);
  const autoPlayRef = useRef(null);

  /**
   * Normalize image data
   */
  const normalizedImages = images.map((img, idx) => {
    if (typeof img === 'string') {
      return { src: img, alt: `Image ${idx + 1}` };
    }
    return img;
  });

  const totalImages = normalizedImages.length;

  /**
   * Move to the next slide
   */
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev >= totalImages - 1) {
        return isLoop ? 0 : prev;
      }
      return prev + 1;
    });
  }, [totalImages, isLoop]);

  /**
   * Move to the previous slide
   */
  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev <= 0) {
        return isLoop ? totalImages - 1 : prev;
      }
      return prev - 1;
    });
  }, [totalImages, isLoop]);

  /**
   * Move to a specific index
   */
  const goToIndex = useCallback((index) => {
    if (index >= 0 && index < totalImages) {
      setCurrentIndex(index);
    }
  }, [totalImages]);

  /**
   * Call the callback when the slide changes
   */
  useEffect(() => {
    onSlideChange?.(currentIndex);
  }, [currentIndex, onSlideChange]);

  /**
   * Autoplay logic
   */
  useEffect(() => {
    if (isAutoPlay && !isPaused && !isDragging) {
      autoPlayRef.current = setInterval(goToNext, autoPlayInterval);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlay, isPaused, isDragging, autoPlayInterval, goToNext]);

  /**
   * Keyboard navigation
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('keydown', handleKeyDown);
      return () => container.removeEventListener('keydown', handleKeyDown);
    }
  }, [goToNext, goToPrev]);

  /**
   * Drag/swipe handlers
   */
  const handleDragStart = (clientX) => {
    setIsDragging(true);
    setDragStart(clientX);
  };

  const handleDragMove = (clientX) => {
    if (!isDragging) return;
    const offset = clientX - dragStart;
    setDragOffset(offset);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;

    const threshold = 50; // Minimum drag distance
    if (dragOffset > threshold) {
      goToPrev();
    } else if (dragOffset < -threshold) {
      goToNext();
    }

    setIsDragging(false);
    setDragOffset(0);
  };

  // Mouse events
  const handleMouseDown = (e) => handleDragStart(e.clientX);
  const handleMouseMove = (e) => handleDragMove(e.clientX);
  const handleMouseUp = () => handleDragEnd();
  const handleMouseLeave = () => {
    if (isDragging) handleDragEnd();
  };

  // Touch events
  const handleTouchStart = (e) => handleDragStart(e.touches[0].clientX);
  const handleTouchMove = (e) => handleDragMove(e.touches[0].clientX);
  const handleTouchEnd = () => handleDragEnd();

  /**
   * Indicator position styles
   */
  const getIndicatorPositionStyles = () => {
    const base = { position: 'absolute', zIndex: 2 };
    switch (indicatorPosition) {
      case 'top':
        return { ...base, top: 16, left: '50%', transform: 'translateX(-50%)' };
      case 'left':
        return { ...base, left: 16, top: '50%', transform: 'translateY(-50%)' };
      case 'right':
        return { ...base, right: 16, top: '50%', transform: 'translateY(-50%)' };
      case 'bottom':
      default:
        return { ...base, bottom: 16, left: '50%', transform: 'translateX(-50%)' };
    }
  };

  /**
   * Compute the slide container transform.
   * Since the container width is totalImages * 100%,
   * one slide step = (100 / totalImages)%
   */
  const getSlideTransform = () => {
    if (transition === 'fade') {
      return 'none';
    }

    // slide transition
    // Compute the move ratio relative to the container width
    const slidePercent = 100 / totalImages;
    const dragPercent = isDragging ? (dragOffset / 300) * slidePercent : 0;
    const translateX = -(currentIndex * slidePercent) + dragPercent;
    return `translateX(${translateX}%)`;
  };

  if (totalImages === 0) return null;

  return (
    <Box
      ref={ containerRef }
      tabIndex={ 0 }
      onMouseEnter={ isPausedOnHover ? () => setIsPaused(true) : undefined }
      onMouseLeave={ isPausedOnHover ? () => setIsPaused(false) : undefined }
      sx={ {
        position: 'relative',
        width: '100%',
        aspectRatio,
        overflow: 'hidden',
        backgroundColor: 'grey.900',
        outline: 'none',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        ...sx,
      } }
      { ...props }
    >
      {/* Slide container */}
      <Box
        onMouseDown={ handleMouseDown }
        onMouseMove={ handleMouseMove }
        onMouseUp={ handleMouseUp }
        onMouseLeave={ handleMouseLeave }
        onTouchStart={ handleTouchStart }
        onTouchMove={ handleTouchMove }
        onTouchEnd={ handleTouchEnd }
        sx={ {
          display: transition === 'fade' ? 'block' : 'flex',
          width: transition === 'fade' ? '100%' : `${totalImages * 100}%`,
          height: '100%',
          transform: getSlideTransform(),
          transition: isDragging ? 'none' : `transform ${transitionDuration}ms ease-out`,
        } }
      >
        { normalizedImages.map((image, index) => (
          <Box
            key={ index }
            sx={ {
              width: transition === 'fade' ? '100%' : `${100 / totalImages}%`,
              height: '100%',
              flexShrink: 0,
              position: transition === 'fade' ? 'absolute' : 'relative',
              top: 0,
              left: 0,
              opacity: transition === 'fade' ? (index === currentIndex ? 1 : 0) : 1,
              transition: transition === 'fade' ? `opacity ${transitionDuration}ms ease-out` : 'none',
            } }
          >
            <Box
              component="img"
              src={ image.src }
              alt={ image.alt }
              draggable={ false }
              sx={ {
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                pointerEvents: 'none',
              } }
            />
          </Box>
        )) }
      </Box>

      {/* Arrow buttons */}
      { hasArrows && totalImages > 1 && (
        <>
          <IconButton
            onClick={ goToPrev }
            disabled={ !isLoop && currentIndex === 0 }
            sx={ {
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255,255,255,0.9)',
              color: 'grey.800',
              zIndex: 2,
              '&:hover': { backgroundColor: 'white' },
              '&:disabled': { opacity: 0.3 },
            } }
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            onClick={ goToNext }
            disabled={ !isLoop && currentIndex === totalImages - 1 }
            sx={ {
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255,255,255,0.9)',
              color: 'grey.800',
              zIndex: 2,
              '&:hover': { backgroundColor: 'white' },
              '&:disabled': { opacity: 0.3 },
            } }
          >
            <ChevronRightIcon />
          </IconButton>
        </>
      ) }

      {/* Indicator */}
      { hasIndicator && totalImages > 1 && (
        <Box sx={ getIndicatorPositionStyles() }>
          <Indicator
            total={ totalImages }
            current={ currentIndex }
            variant={ indicatorType }
            direction={ indicatorPosition === 'left' || indicatorPosition === 'right' ? 'vertical' : 'horizontal' }
            activeColor="common.white"
            inactiveColor="rgba(255,255,255,0.5)"
            onClick={ goToIndex }
          />
        </Box>
      ) }
    </Box>
  );
}
