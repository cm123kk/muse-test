/**
 * exampleImageTokens
 *
 * Builds the 19 images in `src/assets/example/*` together with the T1 results in
 * `exampleTokens.json` in one place, so the landing / demo / Storybook can all import the same pool.
 *
 * Consolidates the identical Vite glob + mapping logic that was scattered across 5 files (2026-04-30).
 */

import exampleTokensJson from '../data/exampleTokens.json';

/* Vite glob - bundles the example images at build time */
const imageModules = import.meta.glob('../assets/example/*.{jpg,jpeg,png}', {
  eager: true,
  query: '?url',
  import: 'default',
});

/** basename -> bundled URL */
export const URL_BY_BASENAME = (() => {
  const out = {};
  for (const [filePath, url] of Object.entries(imageModules)) {
    out[filePath.split('/').pop()] = url;
  }
  return out;
})();

/** Array of bundled URLs for all example images */
export const ALL_IMAGES = Object.values(imageModules);

/**
 * Bundled URL -> { title, colors, tags } mapping (T1 result lookup).
 * tags is sliced to 4 entries.
 */
export const TOKENS_BY_SRC = (() => {
  const out = {};
  for (const [filePath, url] of Object.entries(imageModules)) {
    const basename = filePath.split('/').pop();
    const t = exampleTokensJson[basename];
    if (!t) continue;
    out[url] = {
      title: t.title,
      colors: t.dominantColors,
      tags: (t.tags || []).slice(0, 4),
    };
  }
  return out;
})();

/** Extract a single demo entry from one basename (for building landing stage 1 / stage 2 demo cards). */
export function getExampleByBasename(basename) {
  const t = exampleTokensJson[basename];
  const src = URL_BY_BASENAME[basename];
  if (!t || !src) return null;
  return {
    src,
    title: t.title,
    tags: (t.tags || []).slice(0, 3),
    dominantColors: (t.dominantColors || []).slice(0, 5),
  };
}
