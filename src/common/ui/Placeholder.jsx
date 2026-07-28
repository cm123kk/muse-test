import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { testImages } from '../../utils/pexels-test-data';

/**
 * Placeholder component system
 *
 * FPO (For Position Only) blocks used in place of real content in Storybook examples.
 * Adopts the composable subcomponent pattern of Semantic UI Placeholder.
 *
 * How it works:
 * 1. Compose subcomponents (Box, Image, Text, Line, Paragraph, Card, Media)
 * 2. Uses a neutral visual tone (grey family, dashed border, grayscale) to keep attention on the component structure
 * 3. Expresses content types declaratively via props such as label, ratio, and length
 *
 * Example usage:
 * <Placeholder.Box label="Sidebar" height={300} />
 * <Placeholder.Image ratio="16/9" />
 * <Placeholder.Media index={0} />
 * <Placeholder.Paragraph lines={3} />
 * <Placeholder.Card ratio="4/3" lines={2} />
 */

/** Shared label style */
const labelSx = {
  fontSize: '0.75rem',
  color: 'text.disabled',
  fontFamily: 'monospace',
  userSelect: 'none',
  lineHeight: 1,
};

// ============================================================
// placeholderSvg - Generate a dot pattern SVG data URI
// ============================================================

/**
 * Generates an SVG data URI that represents a placeholder space using a dot grid.
 * Can be used in other components as <img src={placeholderSvg(800, 450)} />.
 *
 * @param {number} width - SVG width [Optional, default: 400]
 * @param {number} height - SVG height [Optional, default: 300]
 * @returns {string} data:image/svg+xml data URI
 *
 * Example usage:
 * <img src={placeholderSvg(800, 450)} alt="placeholder" />
 */
function placeholderSvg(width = 400, height = 300) {
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    `<rect fill="#f5f5f5" width="${width}" height="${height}"/>`,
    '<defs>',
    '<pattern id="d" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">',
    '<circle cx="8" cy="8" r="1" fill="#bdbdbd"/>',
    '</pattern>',
    '</defs>',
    `<rect fill="url(#d)" width="${width}" height="${height}"/>`,
    '</svg>',
  ].join('');
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// ============================================================
// Placeholder.Box - General-purpose area block
// ============================================================

/**
 * Placeholder.Box
 *
 * A general-purpose placeholder block representing a layout area.
 * Used for space demos such as grid cells, sidebars, and panels.
 *
 * Props:
 * @param {string} label - Area label text [Optional]
 * @param {number|string} width - Width [Optional, default: '100%']
 * @param {number|string} height - Height [Optional, default: 120]
 * @param {object} sx - Additional styles [Optional]
 *
 * Example usage:
 * <Placeholder.Box label="Content Area" height={200} />
 */
function PlaceholderBox({ label, width = '100%', height = 120, sx, ...props }) {
  return (
    <Box
      sx={ {
        width,
        height,
        backgroundColor: 'grey.100',
        border: '1px dashed',
        borderColor: 'grey.300',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...sx,
      } }
      { ...props }
    >
      { label && (
        <Typography sx={ labelSx }>
          { label }
        </Typography>
      ) }
    </Box>
  );
}

// ============================================================
// Placeholder.Image - Dot pattern SVG image slot
// ============================================================

/**
 * Placeholder.Image
 *
 * An image placeholder that represents a placeholder space with a dot grid SVG.
 * Maintains the ratio via aspect-ratio, and since it is based on the <img> tag it can be used the same way in other components.
 *
 * Props:
 * @param {string} ratio - Aspect ratio ('16/9' | '4/3' | '1/1' | '3/4' | '9/16') [Optional, default: '16/9']
 * @param {number|string} width - Width [Optional, default: '100%']
 * @param {number|string} height - Height (when used with ratio, ratio takes precedence) [Optional]
 * @param {object} sx - Additional styles [Optional]
 *
 * Example usage:
 * <Placeholder.Image ratio="16/9" />
 * <Placeholder.Image ratio="1/1" width={120} />
 */
function PlaceholderImage({ ratio = '16/9', width = '100%', height, sx, ...props }) {
  return (
    <Box
      component="img"
      src={ placeholderSvg(400, 300) }
      alt=""
      sx={ {
        width,
        height: height || 'auto',
        aspectRatio: ratio,
        objectFit: 'cover',
        display: 'block',
        ...sx,
      } }
      { ...props }
    />
  );
}

// ============================================================
// Placeholder.Text - Text block
// ============================================================

/** Size map per text variant */
const textVariants = {
  heading: { height: 24, width: '60%' },
  body: { height: 14, width: '100%' },
  caption: { height: 10, width: '40%' },
};

/**
 * Placeholder.Text
 *
 * A solid bar placeholder representing a single line of text.
 * Provides size presets per text type such as heading, body, and caption.
 *
 * Props:
 * @param {string} variant - Text type ('heading' | 'body' | 'caption') [Optional, default: 'body']
 * @param {number|string} width - Width (overrides the variant default) [Optional]
 * @param {object} sx - Additional styles [Optional]
 *
 * Example usage:
 * <Placeholder.Text variant="heading" />
 * <Placeholder.Text variant="body" />
 */
function PlaceholderText({ variant = 'body', width, sx, ...props }) {
  const preset = textVariants[variant] || textVariants.body;

  return (
    <Box
      sx={ {
        height: preset.height,
        width: width || preset.width,
        backgroundColor: 'grey.300',
        borderRadius: '2px',
        ...sx,
      } }
      { ...props }
    />
  );
}

// ============================================================
// Placeholder.Line - Single line
// ============================================================

/** Length presets */
const lengthMap = {
  full: '100%',
  long: '85%',
  medium: '65%',
  short: '45%',
};

/**
 * Placeholder.Line
 *
 * The same pattern as Semantic UI Placeholder.Line.
 * Controls line width declaratively via the length prop.
 *
 * Props:
 * @param {string} length - Line length ('full' | 'long' | 'medium' | 'short') [Optional, default: 'full']
 * @param {object} sx - Additional styles [Optional]
 *
 * Example usage:
 * <Placeholder.Line length="long" />
 */
function PlaceholderLine({ length = 'full', sx, ...props }) {
  return (
    <Box
      sx={ {
        height: 14,
        width: lengthMap[length] || length,
        backgroundColor: 'grey.300',
        borderRadius: '2px',
        ...sx,
      } }
      { ...props }
    />
  );
}

// ============================================================
// Placeholder.Paragraph - Multi-line text block
// ============================================================

/** Natural line-length pattern */
const linePattern = ['full', 'long', 'full', 'long', 'full'];

/**
 * Placeholder.Paragraph
 *
 * A placeholder representing multiple lines of text.
 * The last line is automatically shortened for a natural paragraph feel.
 *
 * Props:
 * @param {number} lines - Number of lines [Optional, default: 3]
 * @param {number} gap - Line spacing (theme.spacing unit) [Optional, default: 1]
 * @param {object} sx - Additional styles [Optional]
 *
 * Example usage:
 * <Placeholder.Paragraph lines={4} />
 */
function PlaceholderParagraph({ lines = 3, gap = 1, sx, ...props }) {
  return (
    <Box sx={ { display: 'flex', flexDirection: 'column', gap, ...sx } } { ...props }>
      { Array.from({ length: lines }, (_, i) => {
        const isLast = i === lines - 1;
        const length = isLast ? 'medium' : linePattern[i % linePattern.length];
        return <PlaceholderLine key={ i } length={ length } />;
      }) }
    </Box>
  );
}

// ============================================================
// Placeholder.Media - Media placeholder based on real images
// ============================================================

/** Full image pool (category-agnostic, accessed by index) */
const allImages = Object.values(testImages).flat();

/**
 * Placeholder.Media
 *
 * A media placeholder that uses real stock images.
 * Keeps a neutral tone via a grayscale filter, used in demos that require images.
 * Selects a deterministic image by index so that story rendering is stable.
 *
 * How it works:
 * 1. Selects an image from the pexels test image pool by index
 * 2. If category is specified, selects within that category
 * 3. Maintains an achromatic tone via the grayscale(1) filter
 * 4. Controls aspect-ratio via ratio
 *
 * Props:
 * @param {number} index - Image index (same index = same image) [Optional, default: 0]
 * @param {string} category - Image category ('abstract' | 'fineart' | 'illustration' | 'poster' | 'gradient' | 'photography' | 'portrait' | 'spatial') [Optional]
 * @param {string} ratio - Aspect ratio ('16/9' | '4/3' | '1/1' | '3/4' | '9/16') [Optional]
 * @param {string} size - Image size ('small' | 'medium' | 'large') [Optional, default: 'medium']
 * @param {number|string} width - Width [Optional, default: '100%']
 * @param {number|string} height - Height (used when ratio is not specified) [Optional]
 * @param {object} sx - Additional styles [Optional]
 *
 * Example usage:
 * <Placeholder.Media />
 * <Placeholder.Media index={2} ratio="16/9" />
 * <Placeholder.Media category="spatial" index={1} size="large" />
 */
function PlaceholderMedia({
  index = 0,
  category,
  ratio,
  size = 'medium',
  width = '100%',
  height,
  sx,
  ...props
}) {
  const pool = category && testImages[category] ? testImages[category] : allImages;
  const safeIndex = ((index % pool.length) + pool.length) % pool.length;
  const image = pool[safeIndex];

  return (
    <Box
      component="img"
      src={ image.src[size] || image.src.medium }
      alt={ image.alt }
      sx={ {
        width,
        height: height || 'auto',
        ...(ratio && { aspectRatio: ratio }),
        objectFit: 'cover',
        display: 'block',
        filter: 'grayscale(1)',
        ...sx,
      } }
      { ...props }
    />
  );
}

// ============================================================
// Placeholder.Card - Composite image + text block
// ============================================================

/**
 * Placeholder.Card
 *
 * A composite placeholder representing card-style content.
 * Combines Image + Paragraph to express a card slot in a single line.
 *
 * Props:
 * @param {string} ratio - Image aspect ratio [Optional, default: '16/9']
 * @param {number} lines - Number of body lines [Optional, default: 2]
 * @param {object} sx - Additional styles [Optional]
 *
 * Example usage:
 * <Placeholder.Card ratio="4/3" lines={3} />
 */
function PlaceholderCard({ ratio = '16/9', lines = 2, sx, ...props }) {
  return (
    <Box
      sx={ {
        border: '1px dashed',
        borderColor: 'grey.300',
        overflow: 'hidden',
        ...sx,
      } }
      { ...props }
    >
      <PlaceholderImage ratio={ ratio } />
      <Box sx={ { p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 } }>
        <PlaceholderText variant="heading" />
        <PlaceholderParagraph lines={ lines } />
      </Box>
    </Box>
  );
}

// ============================================================
// Namespace export
// ============================================================

const Placeholder = {
  Box: PlaceholderBox,
  Image: PlaceholderImage,
  Media: PlaceholderMedia,
  Text: PlaceholderText,
  Line: PlaceholderLine,
  Paragraph: PlaceholderParagraph,
  Card: PlaceholderCard,
  svg: placeholderSvg,
};

export default Placeholder;
export {
  placeholderSvg,
  PlaceholderBox,
  PlaceholderImage,
  PlaceholderMedia,
  PlaceholderText,
  PlaceholderLine,
  PlaceholderParagraph,
  PlaceholderCard,
};
