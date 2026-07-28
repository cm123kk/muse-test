/**
 * Bento grid preset layouts
 * Defines commonly used layout patterns
 */
export const BENTO_PRESETS = {
  /**
   * 2x2 + 1 layout
   * [2x2] [1x1]
   *       [1x1]
   */
  featured: [
    { colSpan: 2, rowSpan: 2 },
    { colSpan: 1, rowSpan: 1 },
    { colSpan: 1, rowSpan: 1 },
  ],

  /**
   * Equal split layout
   * [1x1] [1x1] [1x1] [1x1]
   */
  equal: [
    { colSpan: 1, rowSpan: 1 },
    { colSpan: 1, rowSpan: 1 },
    { colSpan: 1, rowSpan: 1 },
    { colSpan: 1, rowSpan: 1 },
  ],

  /**
   * Hero layout
   * [4x1]
   * [1x1] [1x1] [2x1]
   */
  hero: [
    { colSpan: 4, rowSpan: 1 },
    { colSpan: 1, rowSpan: 1 },
    { colSpan: 1, rowSpan: 1 },
    { colSpan: 2, rowSpan: 1 },
  ],

  /**
   * Mosaic layout
   * [2x2] [1x1] [1x1]
   *       [2x1]
   */
  mosaic: [
    { colSpan: 2, rowSpan: 2 },
    { colSpan: 1, rowSpan: 1 },
    { colSpan: 1, rowSpan: 1 },
    { colSpan: 2, rowSpan: 1 },
  ],
};
