import { Box, Typography } from '@mui/material';

/**
 * StyledParagraph component
 *
 * A quote/emphasis paragraph component that supports a left decorative line and a drop cap.
 *
 * How it works:
 * 1. A vertical decorative line (3px) is shown on the left
 * 2. When dropCap is true, the first character is enlarged to exactly two line heights and floated
 * 3. styleColor sets the color of both the drop cap and the decorative line at once
 * 4. variant sets the Typography style
 * 5. maxWidth controls the optimal line length
 *
 * Props:
 * @param {string} children - Paragraph text [Required]
 * @param {string} variant - Typography variant ('h4' | 'h5' | 'h6' | 'body1' | 'body2') [Optional, default: 'h5']
 * @param {boolean} dropCap - Enlarge the first character (drop cap, two line heights, auto float) [Optional, default: false]
 * @param {string} styleColor - Color of the drop cap and decorative line (MUI color path or HEX) [Optional, default: 'primary.main']
 * @param {string} align - Text alignment ('left' | 'center' | 'right' | 'justify') [Optional, default: 'left']
 * @param {number|string} maxWidth - Maximum width (number in ch units or a CSS value) [Optional, default: 65]
 * @param {object} sx - Additional style overrides [Optional]
 *
 * Example usage:
 * <StyledParagraph>
 *   This is a styled paragraph with left border.
 * </StyledParagraph>
 * <StyledParagraph variant="h4" dropCap styleColor="secondary.main">
 *   Lorem ipsum dolor sit amet...
 * </StyledParagraph>
 */
export function StyledParagraph({
  children,
  variant = 'h5',
  dropCap = false,
  styleColor = 'primary.main',
  align = 'left',
  maxWidth = 65,
  sx,
  ...props
}) {
  // Handle maximum width
  const maxWidthValue = typeof maxWidth === 'number' ? `${maxWidth}ch` : maxWidth;

  // Decoration style (left border)
  const decorationStyle = {
    pl: 4,
    borderLeft: '3px solid',
    borderColor: styleColor,
    color: 'text.secondary',
  };

  // Drop cap style (always float, two line heights)
  // The first character occupies exactly two line heights and aligns to the second line's baseline
  const dropCapStyle = {
    '&::first-letter': {
      float: 'left',
      fontSize: '300%',
      fontWeight: 700,
      lineHeight: 0.8,
      mr: 1,
      mt: 1,
      fontFamily: '"Outfit", "Pretendard Variable", sans-serif',
      color: styleColor,
    },
  };

  return (
    <Typography
      variant={variant}
      component="p"
      sx={{
        maxWidth: maxWidthValue,
        textAlign: align,
        ...decorationStyle,
        ...(dropCap && dropCapStyle),
        ...sx,
      }}
      {...props}
    >
      {children}
    </Typography>
  );
}

/**
 * PullQuote component (convenience component)
 *
 * A component that displays a quotation together with its author.
 *
 * Props:
 * @param {string} children - Quote text [Required]
 * @param {string} author - Quote source/author [Optional]
 * @param {boolean} dropCap - Enlarge the first character (drop cap, two line heights) [Optional, default: false]
 * @param {string} styleColor - Color of the drop cap and decorative line [Optional, default: 'primary.main']
 * @param {object} sx - Additional style overrides [Optional]
 *
 * Example usage:
 * <PullQuote author="Steve Jobs">
 *   Design is not just what it looks like.
 * </PullQuote>
 */
export function PullQuote({ children, author, dropCap = false, styleColor = 'primary.main', sx, ...props }) {
  return (
    <Box sx={{ ...sx }} {...props}>
      <StyledParagraph maxWidth="none" dropCap={dropCap} styleColor={styleColor}>
        {children}
      </StyledParagraph>
      {author && (
        <Typography
          variant="caption"
          component="cite"
          sx={{
            display: 'block',
            mt: 2,
            pl: 4,
            fontStyle: 'normal',
            color: 'text.secondary',
            '&::before': {
              content: '"- "',
            },
          }}
        >
          {author}
        </Typography>
      )}
    </Box>
  );
}
