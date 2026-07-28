import { Box, Typography } from '@mui/material';

/**
 * Title component
 *
 * A component that provides a hierarchical title system for sections/items.
 * Builds a clear information hierarchy from a combination of overline, main title, and subtitle.
 *
 * How it works:
 * 1. An appropriate semantic HTML tag (h1-h4) is applied automatically based on the level prop
 * 2. If overline is provided, it appears as a small label above the main title
 * 3. If subtitle is provided, it appears as supporting text below the main title
 * 4. The arrangement of the elements changes depending on layout
 * 5. When divider is true, a visual divider is added at the bottom
 *
 * Props:
 * @param {string} title - Main title text [Required]
 * @param {string} overline - Small label text above [Optional]
 * @param {string} subtitle - Subtitle text below [Optional]
 * @param {string} level - Semantic level ('h1' | 'h2' | 'h3' | 'h4') [Optional, default: 'h2']
 * @param {string} align - Text alignment ('left' | 'center' | 'right') [Optional, default: 'left']
 * @param {string} layout - Layout mode ('stack' | 'inline' | 'split') [Optional, default: 'stack']
 * @param {boolean} divider - Whether to show a bottom divider [Optional, default: false]
 * @param {string} dividerStyle - Divider style ('line' | 'dot' | 'gradient') [Optional, default: 'line']
 * @param {object} sx - Additional style overrides [Optional]
 *
 * Example usage:
 * <Title title="Section Heading" />
 * <Title title="About Us" overline="Company" subtitle="Our story" />
 * <Title title="Features" layout="inline" divider dividerStyle="gradient" />
 */
export function Title({
  title,
  overline,
  subtitle,
  level = 'h2',
  align = 'left',
  layout = 'stack',
  divider = false,
  dividerStyle = 'line',
  sx,
  ...props
}) {
  // Typography variant mapping by level
  const variantMap = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
  };

  // Subtitle variant mapping by level
  const subtitleVariantMap = {
    h1: 'subtitle1',
    h2: 'subtitle1',
    h3: 'subtitle2',
    h4: 'body2',
  };

  // Flexbox alignment based on text alignment
  const alignmentMap = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
  };

  // Divider style definitions
  const dividerStyles = {
    line: {
      width: '100%',
      maxWidth: align === 'center' ? 120 : '100%',
      height: 1,
      backgroundColor: 'divider',
      mt: 2,
    },
    dot: {
      display: 'flex',
      gap: 1,
      mt: 2,
      '& > span': {
        width: 6,
        height: 6,
        borderRadius: '50%',
        backgroundColor: 'primary.main',
      },
    },
    gradient: {
      width: '100%',
      maxWidth: align === 'center' ? 200 : '100%',
      height: 2,
      background: 'linear-gradient(90deg, transparent 0%, currentColor 50%, transparent 100%)',
      color: 'primary.main',
      mt: 2,
      opacity: 0.6,
    },
  };

  // Stack layout (default - vertical arrangement)
  if (layout === 'stack') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: alignmentMap[align],
          textAlign: align,
          ...sx,
        }}
        {...props}
      >
        {overline && (
          <Typography
            variant="overline"
            component="span"
            sx={{
              color: 'primary.main',
              fontWeight: 600,
              letterSpacing: '0.1em',
              mb: 0.5,
            }}
          >
            {overline}
          </Typography>
        )}

        <Typography
          variant={variantMap[level]}
          component={level}
          sx={{
            fontWeight: level === 'h1' ? 900 : level === 'h2' ? 800 : 700,
          }}
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography
            variant={subtitleVariantMap[level]}
            component="p"
            sx={{
              color: 'text.secondary',
              mt: 1,
              maxWidth: '60ch',
            }}
          >
            {subtitle}
          </Typography>
        )}

        {divider && (
          dividerStyle === 'dot' ? (
            <Box sx={dividerStyles.dot}>
              <span />
              <span />
              <span />
            </Box>
          ) : (
            <Box sx={dividerStyles[dividerStyle]} />
          )
        )}
      </Box>
    );
  }

  // Inline layout (overline and title arranged horizontally)
  if (layout === 'inline') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: alignmentMap[align],
          textAlign: align,
          ...sx,
        }}
        {...props}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          {overline && (
            <Typography
              variant="overline"
              component="span"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                letterSpacing: '0.1em',
              }}
            >
              {overline}
            </Typography>
          )}

          <Typography
            variant={variantMap[level]}
            component={level}
            sx={{
              fontWeight: level === 'h1' ? 900 : level === 'h2' ? 800 : 700,
            }}
          >
            {title}
          </Typography>
        </Box>

        {subtitle && (
          <Typography
            variant={subtitleVariantMap[level]}
            component="p"
            sx={{
              color: 'text.secondary',
              mt: 1,
              maxWidth: '60ch',
            }}
          >
            {subtitle}
          </Typography>
        )}

        {divider && (
          dividerStyle === 'dot' ? (
            <Box sx={dividerStyles.dot}>
              <span />
              <span />
              <span />
            </Box>
          ) : (
            <Box sx={dividerStyles[dividerStyle]} />
          )
        )}
      </Box>
    );
  }

  // Split layout (title and subtitle separated to opposite sides)
  if (layout === 'split') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          ...sx,
        }}
        {...props}
      >
        {overline && (
          <Typography
            variant="overline"
            component="span"
            sx={{
              color: 'primary.main',
              fontWeight: 600,
              letterSpacing: '0.1em',
            }}
          >
            {overline}
          </Typography>
        )}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography
            variant={variantMap[level]}
            component={level}
            sx={{
              fontWeight: level === 'h1' ? 900 : level === 'h2' ? 800 : 700,
              flex: '1 1 auto',
            }}
          >
            {title}
          </Typography>

          {subtitle && (
            <Typography
              variant={subtitleVariantMap[level]}
              component="p"
              sx={{
                color: 'text.secondary',
                maxWidth: '40ch',
                textAlign: 'right',
                flex: '0 1 auto',
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {divider && (
          dividerStyle === 'dot' ? (
            <Box sx={{ ...dividerStyles.dot, justifyContent: 'flex-start' }}>
              <span />
              <span />
              <span />
            </Box>
          ) : (
            <Box sx={dividerStyles[dividerStyle]} />
          )
        )}
      </Box>
    );
  }

  return null;
}
