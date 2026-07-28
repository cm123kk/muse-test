/**
 * Layout Components
 *
 * Collection of layout-related components
 * Provides various layout patterns such as golden ratio, grids, and screen splits
 */

// PhiSplit - golden ratio two-way split layout
export { PhiSplit } from './PhiSplit.jsx';

// BentoGrid - bento box grid layout
export { BentoGrid, BentoItem } from './BentoGrid.jsx';
export { BENTO_PRESETS } from './bentoPresets.js';

// FullPageContainer - full-screen section container
export {
  FullPageContainer,
  FullPageSection,
  FullPageSnap,
} from './FullPageContainer.jsx';

// SplitScreen - screen split layout
export {
  SplitScreen,
  StickySection,
  SplitOverlay,
} from './SplitScreen.jsx';

// PageContainer - responsive page container
export { PageContainer } from './PageContainer.jsx';

// AppShell - responsive app shell
export { AppShell } from './AppShell.jsx';
export { useAppShell } from './useAppShell.js';

// InfiniteMasonry - infinite scroll Masonry wrapper + hook
export { InfiniteMasonry } from './InfiniteMasonry.jsx';
export { useInfiniteScroll } from './useInfiniteScroll.js';
