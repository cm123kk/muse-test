import { Box, Typography } from '@mui/material';

/**
 * InlineObject component (subcomponent)
 *
 * A wrapper for inserting an image, icon, or another component into the text flow.
 * Controls the vertical alignment and size of the inline element.
 *
 * Props:
 * @param {ReactNode} children - Element to insert (img, icon, component) [Required]
 * @param {number|string} size - Element size (number in em units or a CSS value) [Optional, default: 1]
 * @param {string} align - Vertical alignment ('baseline' | 'middle' | 'top' | 'bottom') [Optional, default: 'middle']
 * @param {boolean} rounded - Apply rounded corners [Optional, default: false]
 * @param {boolean} hover - Enable hover effect [Optional, default: false]
 * @param {number} spacing - Horizontal spacing (em units) [Optional, default: 0.2]
 * @param {object} sx - Additional style overrides [Optional]
 *
 * Example usage:
 * <InlineObject size={1.2} rounded>
 *   <img src="avatar.jpg" alt="avatar" />
 * </InlineObject>
 */
export function InlineObject({
  children,
  size = 1,
  align = 'middle',
  rounded = false,
  hover = false,
  spacing = 0.2,
  sx,
  ...props
}) {
  // Alignment mapping
  const alignMap = {
    baseline: 'baseline',
    middle: 'middle',
    top: 'text-top',
    bottom: 'text-bottom',
  };

  // Handle size (em units if a number, used as-is if a string)
  const sizeValue = typeof size === 'number' ? `${size}em` : size;

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        verticalAlign: alignMap[align],
        width: sizeValue,
        height: sizeValue,
        mx: `${spacing}em`,
        borderRadius: rounded ? '50%' : 0,
        overflow: 'hidden',
        transition: hover ? 'opacity 150ms' : 'none',
        cursor: hover ? 'pointer' : 'inherit',
        '&:hover': hover ? { opacity: 0.8 } : {},
        '& > img, & > svg': {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

/**
 * InlineTypography component
 *
 * A component that lets you naturally insert an image, icon, or another component into the text flow.
 * Used together with InlineObject in a compound component pattern.
 *
 * How it works:
 * 1. Pass a combination of plain text and InlineObject components as children
 * 2. The text and inline elements are laid out naturally on a single line
 * 3. The align prop of InlineObject controls the vertical alignment
 * 4. An appropriate font style is applied based on variant
 *
 * Props:
 * @param {ReactNode} children - Combination of text and InlineObject [Required]
 * @param {string} variant - Typography variant ('body1' | 'body2' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6') [Optional, default: 'body1']
 * @param {string} component - HTML tag [Optional, default: 'p']
 * @param {string} align - Text alignment ('left' | 'center' | 'right' | 'justify') [Optional, default: 'left']
 * @param {object} sx - Additional style overrides [Optional]
 *
 * Example usage:
 * <InlineTypography variant="h3">
 *   We build <InlineObject size={1.2} rounded><img src="icon.png" /></InlineObject> amazing products.
 * </InlineTypography>
 */
export function InlineTypography({
  children,
  variant = 'body1',
  component = 'p',
  align = 'left',
  sx,
  ...props
}) {
  return (
    <Typography
      variant={variant}
      component={component}
      sx={{
        textAlign: align,
        lineHeight: 1.6,
        '& > span': {
          // Adjust the default style of InlineObject
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Typography>
  );
}

/**
 * InlineIcon component (convenience component)
 *
 * A specialized wrapper for inserting a MUI icon inline.
 *
 * Props:
 * @param {ReactNode} icon - MUI Icon component [Required]
 * @param {string} color - Icon color [Optional, default: 'inherit']
 * @param {number} size - Icon size (em units) [Optional, default: 1]
 * @param {string} align - Vertical alignment [Optional, default: 'middle']
 *
 * Example usage:
 * <InlineIcon icon={<StarIcon />} color="primary.main" size={1.2} />
 */
export function InlineIcon({
  icon,
  color = 'inherit',
  size = 1,
  align = 'middle',
  sx,
  ...props
}) {
  const alignMap = {
    baseline: 'baseline',
    middle: 'middle',
    top: 'text-top',
    bottom: 'text-bottom',
  };

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        verticalAlign: alignMap[align],
        fontSize: `${size}em`,
        color,
        mx: '0.1em',
        '& > svg': {
          fontSize: 'inherit',
        },
        ...sx,
      }}
      {...props}
    >
      {icon}
    </Box>
  );
}

/**
 * InlineImage component (convenience component)
 *
 * A specialized wrapper for inserting an image inline.
 *
 * Props:
 * @param {string} src - Image URL [Required]
 * @param {string} alt - Image alt text [Required]
 * @param {number|string} size - Image size [Optional, default: 1.5]
 * @param {boolean} rounded - Rounded corners [Optional, default: false]
 * @param {boolean} circle - Circular shape [Optional, default: false]
 * @param {string} align - Vertical alignment [Optional, default: 'middle']
 * @param {boolean} hover - Hover effect [Optional, default: false]
 *
 * Example usage:
 * <InlineImage src="photo.jpg" alt="Photo" size={2} circle hover />
 */
export function InlineImage({
  src,
  alt,
  size = 1.5,
  rounded = false,
  circle = false,
  align = 'middle',
  hover = false,
  sx,
  ...props
}) {
  const sizeValue = typeof size === 'number' ? `${size}em` : size;
  const alignMap = {
    baseline: 'baseline',
    middle: 'middle',
    top: 'text-top',
    bottom: 'text-bottom',
  };

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-block',
        verticalAlign: alignMap[align],
        width: sizeValue,
        height: sizeValue,
        mx: '0.2em',
        borderRadius: circle ? '50%' : rounded ? '4px' : 0,
        overflow: 'hidden',
        transition: hover ? 'transform 0.2s ease-out' : 'none',
        '&:hover': hover ? {
          transform: 'scale(1.1)',
        } : {},
        ...sx,
      }}
      {...props}
    >
      <Box
        component="img"
        src={src}
        alt={alt}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />
    </Box>
  );
}

// Static assignment for the compound component pattern
InlineTypography.Object = InlineObject;
InlineTypography.Icon = InlineIcon;
InlineTypography.Image = InlineImage;
