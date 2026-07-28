/**
 * Color similarity utilities
 *
 * Converts hex -> HSL, then matches by (hue distance + saturation/lightness tolerance).
 * Used in the color filter to "also filter neighboring colors when a representative color is selected".
 */

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

export function hexToRgb(hex) {
  if (!hex) return null;
  const h = hex.replace('#', '');
  if (h.length !== 6) return null;
  const n = parseInt(h, 16);
  if (Number.isNaN(n)) return null;
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function rgbToHsl({ r, g, b }) {
  const rn = r / 255; const gn = g / 255; const bn = b / 255;
  const max = Math.max(rn, gn, bn); const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0; let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn: h = (gn - bn) / d + (gn < bn ? 6 : 0); break;
      case gn: h = (bn - rn) / d + 2; break;
      case bn: h = (rn - gn) / d + 4; break;
      default: break;
    }
    h *= 60;
  }
  return { h, s, l };
}

export function hexToHsl(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return rgbToHsl(rgb);
}

/**
 * Whether two hex values are "similar" (hue distance + S/L tolerance).
 * For low-saturation (neutral) colors, hue is unstable, so judge by L only.
 */
export function isSimilarColor(a, b, { hueTolerance = 30, lightTolerance = 0.28, satTolerance = 0.35 } = {}) {
  const ah = hexToHsl(a); const bh = hexToHsl(b);
  if (!ah || !bh) return false;

  // Treat as neutral (achromatic) - if both are low-saturation, judge by lightness only
  const neutralThreshold = 0.12;
  if (ah.s < neutralThreshold && bh.s < neutralThreshold) {
    return Math.abs(ah.l - bh.l) <= lightTolerance;
  }

  // If only one side is achromatic, mismatch
  if ((ah.s < neutralThreshold) !== (bh.s < neutralThreshold)) return false;

  const hueDist = Math.min(Math.abs(ah.h - bh.h), 360 - Math.abs(ah.h - bh.h));
  if (hueDist > hueTolerance) return false;
  if (Math.abs(ah.s - bh.s) > satTolerance) return false;
  if (Math.abs(ah.l - bh.l) > lightTolerance) return false;
  return true;
}

/** Representative color wheel - 12 hue + 4 neutral */
export const REPRESENTATIVE_COLORS = [
  { hex: '#E53935', label: 'Red' },
  { hex: '#F4511E', label: 'Coral' },
  { hex: '#F9A825', label: 'Orange' },
  { hex: '#FDD835', label: 'Yellow' },
  { hex: '#7CB342', label: 'Lime' },
  { hex: '#2E7D32', label: 'Green' },
  { hex: '#00897B', label: 'Teal' },
  { hex: '#00ACC1', label: 'Cyan' },
  { hex: '#1E88E5', label: 'Blue' },
  { hex: '#3949AB', label: 'Indigo' },
  { hex: '#8E24AA', label: 'Purple' },
  { hex: '#D81B60', label: 'Pink' },
  { hex: '#1A1A1F', label: 'Black' },
  { hex: '#6B6B74', label: 'Gray' },
  { hex: '#C9BBA5', label: 'Beige' },
  { hex: '#F2F2F5', label: 'White' },
];

export { clamp };
