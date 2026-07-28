import { forwardRef } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

/**
 * StickyAsideCenterLayout component
 *
 * A symmetric three-column grid layout.
 * The left aside is pinned as sticky, and the main content is visually centered relative to the page.
 * An empty region the same size as the aside is placed on the right to maintain left-right symmetry.
 *
 * Behavior:
 * 1. The left aside content stays fixed as sticky while scrolling
 * 2. The center children content is placed at the exact center of the page
 * 3. The empty region on the right matches the aside size for visual balance
 * 4. On mobile (below md), the aside stacks on top and children below
 *
 * Props:
 * @param {React.ReactNode} aside - Left sidebar content [Required]
 * @param {React.ReactNode} children - Center main content [Required]
 * @param {number} centerSize - Grid size of the center content (1-12) [Optional, default: 8]
 *   - The aside and empty region are calculated automatically as (12 - centerSize) / 2
 *   - Example: centerSize=8 -> aside:2, center:8, empty:2
 *   - Example: centerSize=6 -> aside:3, center:6, empty:3
 * @param {number} stickyTop - Sticky position of the aside (px) [Optional, default: 88]
 * @param {number} spacing - Grid spacing [Optional, default: 2]
 * @param {object} asideSx - Additional styles for the aside region [Optional]
 * @param {object} contentSx - Additional styles for the content region [Optional]
 * @param {object} sx - Additional container styles [Optional]
 *
 * Example usage:
 * <StickyAsideCenterLayout aside={<FilterMenu />} centerSize={6}>
 *   <ProductGrid products={products} />
 * </StickyAsideCenterLayout>
 */
const StickyAsideCenterLayout = forwardRef(function StickyAsideCenterLayout({
  aside,
  children,
  centerSize = 8,
  stickyTop = 88,
  spacing = 2,
  asideSx,
  contentSx,
  sx,
  ...props
}, ref) {
  /** Calculate the aside and empty region sizes (symmetric) */
  const sideSize = (12 - centerSize) / 2;

  return (
    <Box ref={ ref } sx={ sx } { ...props }>
      <Grid container spacing={ spacing }>
        {/* Left: Aside (sticky) */}
        <Grid size={ { xs: 12, md: sideSize } }>
          <Box
            sx={ {
              position: 'sticky',
              top: stickyTop,
              alignSelf: 'flex-start',
              ...asideSx,
            } }
          >
            { aside }
          </Box>
        </Grid>

        {/* Center: Content (visually centered relative to the page) */}
        <Grid size={ { xs: 12, md: centerSize } }>
          <Box sx={ contentSx }>
            { children }
          </Box>
        </Grid>

        {/* Right: empty region (symmetric with the aside), hidden on mobile */}
        <Grid
          size={ { md: sideSize } }
          sx={ { display: { xs: 'none', md: 'block' } } }
        />
      </Grid>
    </Box>
  );
});

export default StickyAsideCenterLayout;
