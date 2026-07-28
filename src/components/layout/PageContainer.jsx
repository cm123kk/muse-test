import Container from '@mui/material/Container';

/**
 * PageContainer
 *
 * A container that wraps a page's main content.
 *
 * Use variant to choose one of two page width modes: fluid or focus.
 * - fluid: uses the full viewport width (image-first / browsing pages). Only the horizontal padding is applied via clamp.
 * - focus: centers content with a narrow maxWidth (narrow form pages such as create/input/settings).
 * When neither is specified, the existing behavior (MUI Container with `maxWidth='xl'`) is preserved.
 *
 * Props:
 * @param {node} children - Content [Required]
 * @param {'fluid'|'focus'} [variant] - Page width mode [Optional]
 * @param {number} [focusMaxWidth] - max-width (px) used when variant is focus [Optional, default: 720]
 * @param {string|bool} [maxWidth] - MUI Container maxWidth (for compatibility when variant is unspecified) [Optional, default: 'xl']
 * @param {boolean} [disableGutters] - Disable horizontal padding [Optional, default: false]
 * @param {object} [sx] - Additional styles [Optional]
 *
 * Example usage:
 * <PageContainer variant="fluid"> ... </PageContainer>
 * <PageContainer variant="focus" focusMaxWidth={ 640 }> ... </PageContainer>
 */
export const PageContainer = ({
  children,
  variant,
  focusMaxWidth = 720,
  maxWidth = 'xl',
  disableGutters = false,
  sx,
  ...props
}) => {
  const isFluid = variant === 'fluid';
  const isFocus = variant === 'focus';
  const isVariantMode = isFluid || isFocus;

  const variantSx = isFluid
    ? {
      width: '100%',
      mx: 'auto',
      px: { xs: 2, md: 'clamp(16px, 2.5vw, 40px)' },
    }
    : isFocus
      ? {
        width: '100%',
        maxWidth: focusMaxWidth,
        mx: 'auto',
        px: { xs: 2.5, md: 4 },
      }
      : null;

  return (
    <Container
      maxWidth={ isVariantMode ? false : maxWidth }
      disableGutters={ isVariantMode ? true : disableGutters }
      sx={ {
        ...(variantSx || {}),
        ...sx,
      } }
      { ...props }
    >
      { children }
    </Container>
  );
};
