/**
 * Media Components
 *
 * Collection of media-related components
 * Provides various components for handling media such as images and videos
 */

// AspectMedia - fixed-ratio image/video
export { default as AspectMedia } from './AspectMedia.jsx';

// ImageTransition - index-based image transition
export { ImageTransition } from './ImageTransition.jsx';

// ImageCarousel - image carousel + indicator
export { ImageCarousel } from './ImageCarousel.jsx';

// Indicator - general-purpose indicator (re-exported from common/ui)
export { Indicator } from '../../common/ui/Indicator.jsx';

// CarouselIndicator - for legacy compatibility (use Indicator instead)
export { CarouselIndicator } from './CarouselIndicator.jsx';

// FloatingImageGallery - Three.js z-depth infinite gallery (for hero/background)
export { FloatingImageGallery } from './FloatingImageGallery.jsx';

// ScatterGallery - jittered grid distribution + cursor parallax + continuous scatter <-> two-row flow lerp (for hero)
export { ScatterGallery } from './ScatterGallery.jsx';

// ReferenceAnnotationOverlay - corner brackets + scan + edge annotations on reference hover
export { ReferenceAnnotationOverlay } from './ReferenceAnnotationOverlay.jsx';

// RefImage - image with automatic re-signing on signed URL expiry
export { RefImage } from './RefImage.jsx';
