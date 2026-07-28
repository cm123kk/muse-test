/**
 * Single source of truth for MUSE layer definitions
 *
 * Consolidates the layer label / key definitions that were scattered across 5 files (2026-04-30).
 *  - Absorbs the LAYER_LABEL / LAYERS / LAYER_DEFS that ProjectCreateWizard, ProjectDetailPage,
 *    LandingSolutionStage2, ReferenceNotesDialog, and ReferenceLayerChipRow each defined separately.
 */

/** Short label (for chip / compact UI) */
export const LAYER_LABEL = {
  color: 'Color',
  typography: 'Typography',
  layout: 'Layout',
  gradient: 'Gradient',
  visualDirection: 'Mood',
  components: 'Component',
};

/**
 * The 4 analysis-result layers + visualDirection (category array for CategoryTab).
 *  Used in the left tabs of ProjectDetailPage / LandingSolutionStage2.
 *  Use LAYERS_WITH_DESIGN_MD when a designMd tab is needed.
 */
export const ANALYSIS_LAYERS = [
  { id: 'color', label: 'Color' },
  { id: 'typography', label: 'Typography' },
  { id: 'layout', label: 'Layout' },
  { id: 'gradient', label: 'Gradient' },
  { id: 'visualDirection', label: 'Visual Direction' },
];

/** The above + a DESIGN.md tab (system mode result screen / landing stage 2) */
export const ANALYSIS_LAYERS_WITH_DESIGN_MD = [
  ...ANALYSIS_LAYERS,
  { id: 'designMd', label: 'DESIGN.md' },
];

/**
 * Layer-borrowing chip definitions for ReferenceLayerChipRow.
 *  label is short (1-2 words), short is identical (both are the same for now but kept separate - differentiated labels possible later)
 */
export const LAYER_CHIP_DEFS_BASE = [
  { key: 'color', label: 'Color', short: 'Color' },
  { key: 'typography', label: 'Typography', short: 'Typography' },
  { key: 'layout', label: 'Layout', short: 'Layout' },
  { key: 'gradient', label: 'Gradient', short: 'Gradient' },
  { key: 'visualDirection', label: 'Mood', short: 'Mood' },
];

/** system mode only - component-combination borrowing chip (DESIGN.md components axis) */
export const LAYER_CHIP_DEF_COMPONENTS = {
  key: 'components',
  label: 'Component',
  short: 'Component',
};

/** Token editing panel category definitions (key + label, the old name of MUSE_LAYERS) */
export const TOKEN_LAYER_CATEGORIES = [
  { key: 'color', label: 'Color' },
  { key: 'typography', label: 'Typography' },
  { key: 'layout', label: 'Layout' },
  { key: 'gradient', label: 'Gradient' },
  { key: 'visualDirection', label: 'Visual Direction' },
];
