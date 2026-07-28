/**
 * Data Display Components
 *
 * A collection of structured data visualization components.
 * In the MUSE project, the per-layer token editing UI primitives live here.
 */

// TokenListItem - shared token editing row (preview + label + value + emphasis + on/off)
export { TokenListItem } from './TokenListItem.jsx';

// MUSE per-layer previews - high-level components that reuse TokenListItem
export { ColorSwatchList } from './ColorSwatchList.jsx';
export { TypographyPreview } from './TypographyPreview.jsx';
export { LayoutTokenPreview } from './LayoutTokenPreview.jsx';
export { GradientPreview } from './GradientPreview.jsx';

// DESIGN.md (Google Labs alpha spec) preview. system result screen + live component render + scale visualization
export { DesignMdPreview } from './DesignMdPreview.jsx';

// AnalysisLayerTabs - a composite component that bundles T3 system analysis results into layer tabs (CategoryTab + 5 previews)
export { AnalysisLayerTabs } from './AnalysisLayerTabs.jsx';

// LayerAnalysisStrip - T1 per-layer progress strip (stack flow, not an overlay)
export { LayerAnalysisStrip } from './LayerAnalysisStrip.jsx';
