import Box from '@mui/material/Box';

/**
 * SectionContainer
 *
 * A container that separates each section within a page. Defaults to 100% width with responsive vertical padding.
 *
 * Use variant to choose the width mode of the inner content.
 * - fluid: 100% width (browse/grid/full-bleed sections). Same as the default behavior.
 * - focus: centered with a narrow maxWidth (narrow form and settings sections).
 * When variant is unspecified, the existing behavior (width 100%) is kept for backward compatibility.
 *
 * Props:
 * @param {node} children - Content [Required]
 * @param {'fluid'|'focus'} [variant] - Section width mode [Optional]
 * @param {number} [focusMaxWidth] - max-width (px) for the focus variant [Optional, default: 720]
 * @param {object} [sx] - Additional styles [Optional]
 *
 * Example usage:
 * <SectionContainer variant="focus" focusMaxWidth={ 640 }> ... </SectionContainer>
 */
export const SectionContainer = ({
  children,
  variant,
  focusMaxWidth = 720,
  sx,
  ...props
}) => {
  const isFocus = variant === 'focus';

  return (
    <Box
      component="section"
      sx={ {
        width: '100%',
        py: { xs: 4, md: 6 },
        ...(isFocus
          ? { maxWidth: focusMaxWidth, mx: 'auto', px: { xs: 2.5, md: 4 } }
          : null),
        ...sx,
      } }
      { ...props }
    >
      { children }
    </Box>
  );
};
