import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import { keyframes } from '@mui/material/styles';

/**
 * Transition keyframe definitions
 */
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const slideInLeft = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

const slideOutLeft = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
`;

const slideInRight = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
`;

const slideOutRight = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
`;

const zoomIn = keyframes`
  from { transform: scale(1.2); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

const zoomOut = keyframes`
  from { transform: scale(1); opacity: 1; }
  to { transform: scale(0.8); opacity: 0; }
`;

const revealLeft = keyframes`
  from { clip-path: inset(0 100% 0 0); }
  to { clip-path: inset(0 0 0 0); }
`;

const revealRight = keyframes`
  from { clip-path: inset(0 0 0 100%); }
  to { clip-path: inset(0 0 0 0); }
`;

const flipIn = keyframes`
  from { transform: perspective(1000px) rotateY(-90deg); opacity: 0; }
  to { transform: perspective(1000px) rotateY(0); opacity: 1; }
`;

const flipOut = keyframes`
  from { transform: perspective(1000px) rotateY(0); opacity: 1; }
  to { transform: perspective(1000px) rotateY(90deg); opacity: 0; }
`;

/**
 * ImageTransition component
 *
 * An index-based image transition component.
 * Supports various transition effects (fade, slide, zoom, reveal, flip).
 *
 * How it works:
 * 1. When activeIndex changes, a transition runs between the previous and new image
 * 2. The previous/next direction is auto-detected and the appropriate animation is applied
 * 3. The onTransitionEnd callback is called after the transition completes
 *
 * Props:
 * @param {Array} images - Array of image sources [{ src, alt }] or string[] [Required]
 * @param {number} activeIndex - Current active image index [Required]
 * @param {string} transition - Transition effect ('fade' | 'slide' | 'zoom' | 'reveal' | 'flip') [Optional, default: 'fade']
 * @param {number} duration - Transition duration (ms) [Optional, default: 500]
 * @param {string} easing - CSS easing function [Optional, default: 'ease-out']
 * @param {string} aspectRatio - Container aspect ratio [Optional, default: '16/9']
 * @param {string} objectFit - Image fit mode [Optional, default: 'cover']
 * @param {function} onTransitionEnd - Transition complete callback [Optional]
 * @param {object} sx - Additional styles [Optional]
 *
 * Example usage:
 * <ImageTransition
 *   images={['img1.jpg', 'img2.jpg', 'img3.jpg']}
 *   activeIndex={currentIndex}
 *   transition="fade"
 *   duration={500}
 * />
 */
export function ImageTransition({
  images = [],
  activeIndex = 0,
  transition = 'fade',
  duration = 500,
  easing = 'ease-out',
  aspectRatio = '16/9',
  objectFit = 'cover',
  onTransitionEnd,
  sx,
  ...props
}) {
  const [displayedIndex, setDisplayedIndex] = useState(activeIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState('next'); // 'next' | 'prev'
  const prevIndexRef = useRef(activeIndex);

  /**
   * Normalize image data
   * Convert string[] -> [{ src, alt }] form
   */
  const normalizedImages = images.map((img, idx) => {
    if (typeof img === 'string') {
      return { src: img, alt: `Image ${idx + 1}` };
    }
    return img;
  });

  /**
   * Detect activeIndex changes and start the transition
   */
  useEffect(() => {
    if (activeIndex !== prevIndexRef.current) {
      // Defer determining the direction and starting the animation to the next frame
      const newDirection = activeIndex > prevIndexRef.current ? 'next' : 'prev';

      const startTimer = requestAnimationFrame(() => {
        setDirection(newDirection);
        setIsTransitioning(true);
      });

      // Update state after the transition completes
      const endTimer = setTimeout(() => {
        setDisplayedIndex(activeIndex);
        setIsTransitioning(false);
        prevIndexRef.current = activeIndex;
        onTransitionEnd?.();
      }, duration);

      return () => {
        cancelAnimationFrame(startTimer);
        clearTimeout(endTimer);
      };
    }
  }, [activeIndex, duration, onTransitionEnd]);

  /**
   * Return animation styles based on the transition type
   */
  const getAnimationStyles = (isEntering) => {
    const animationBase = {
      animationDuration: `${duration}ms`,
      animationTimingFunction: easing,
      animationFillMode: 'forwards',
    };

    switch (transition) {
      case 'slide':
        if (isEntering) {
          return {
            ...animationBase,
            animationName: `${direction === 'next' ? slideInLeft : slideInRight}`,
          };
        }
        return {
          ...animationBase,
          animationName: `${direction === 'next' ? slideOutLeft : slideOutRight}`,
        };

      case 'zoom':
        return {
          ...animationBase,
          animationName: `${isEntering ? zoomIn : zoomOut}`,
        };

      case 'reveal':
        if (isEntering) {
          return {
            ...animationBase,
            animationName: `${direction === 'next' ? revealLeft : revealRight}`,
          };
        }
        return {
          opacity: isTransitioning ? 1 : 0,
          transition: `opacity ${duration}ms ${easing}`,
        };

      case 'flip':
        return {
          ...animationBase,
          animationName: `${isEntering ? flipIn : flipOut}`,
        };

      case 'fade':
      default:
        return {
          ...animationBase,
          animationName: `${isEntering ? fadeIn : fadeOut}`,
        };
    }
  };

  /**
   * Current image and next image
   */
  const currentImage = normalizedImages[displayedIndex];
  const nextImage = normalizedImages[activeIndex];

  if (!currentImage) return null;

  return (
    <Box
      sx={ {
        position: 'relative',
        width: '100%',
        aspectRatio,
        overflow: 'hidden',
        backgroundColor: 'grey.900',
        ...sx,
      } }
      { ...props }
    >
      {/* Current image (exit animation during a transition) */}
      <Box
        component="img"
        src={ currentImage.src }
        alt={ currentImage.alt }
        sx={ {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit,
          ...(isTransitioning && getAnimationStyles(false)),
        } }
      />

      {/* Next image (enter animation during a transition) */}
      { isTransitioning && nextImage && displayedIndex !== activeIndex && (
        <Box
          component="img"
          src={ nextImage.src }
          alt={ nextImage.alt }
          sx={ {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit,
            ...getAnimationStyles(true),
          } }
        />
      ) }
    </Box>
  );
}
