/**
 * MUSE - Tag Preset helper
 *
 * Reads `muse_tags_preset.json` and provides simple access to the tag lists and
 * descriptions per layer/category. The T1 prompt / tool schema / Reference tagging UI all pull from this helper.
 *
 * Layer structure:
 *  - output_target: 'token'     -> color / typography / layout / gradient
 *  - output_target: 'markdown'  -> visual_direction (genre / style / subject subcategories)
 */

import preset from './muse_tags_preset.json';

/** the raw preset object */
export const MUSE_TAGS_PRESET = preset;

export const TOKEN_LAYERS = ['color', 'typography', 'layout', 'gradient'];
export const VISUAL_DIRECTION_CATEGORIES = ['genre', 'style', 'subject'];

/** layer -> array of tag objects ({ tag, description }) */
export function getLayerTagObjects(layer) {
  const data = preset.layers?.[layer];
  if (!data) return [];
  if (data.tags) return data.tags;
  // visual_direction lives under categories
  if (data.categories) {
    return Object.values(data.categories).flatMap((c) => c.tags);
  }
  return [];
}

/** layer -> array of tag names */
export function getLayerTags(layer) {
  return getLayerTagObjects(layer).map((t) => t.tag);
}

/** enum array for the tool schema (same as getLayerTags) */
export const getLayerEnum = getLayerTags;

/** visual_direction.categories.{genre|style|subject} -> array of tag objects */
export function getVisualDirectionTagObjects(category) {
  return preset.layers?.visual_direction?.categories?.[category]?.tags || [];
}

export function getVisualDirectionTags(category) {
  return getVisualDirectionTagObjects(category).map((t) => t.tag);
}

/** layer+tag -> one-line description */
export function getTagDescription(layer, tag) {
  // token layer
  const fromTokenLayer = preset.layers?.[layer]?.tags?.find((t) => t.tag === tag);
  if (fromTokenLayer) return fromTokenLayer.description;
  // visual_direction - search everything when the category is unknown
  if (layer === 'visual_direction' || VISUAL_DIRECTION_CATEGORIES.includes(layer)) {
    for (const cat of VISUAL_DIRECTION_CATEGORIES) {
      const match = getVisualDirectionTagObjects(cat).find((t) => t.tag === tag);
      if (match) return match.description;
    }
  }
  return null;
}

/**
 * Build a per-layer vocabulary block to insert into the Claude system prompt.
 * @param {string[]} layers - layers to include (default: all)
 * @returns {string}
 */
export function renderVocabularyPrompt(layers = [...TOKEN_LAYERS, 'visual_direction']) {
  const blocks = layers.map((layer) => {
    const data = preset.layers?.[layer];
    if (!data) return '';

    if (data.tags) {
      const lines = data.tags.map((t) => `  - ${t.tag}: ${t.description}`).join('\n');
      return `### ${layer} (output: ${data.output_target})\n${lines}`;
    }
    if (data.categories) {
      const catBlocks = Object.entries(data.categories).map(([catName, cat]) => {
        const lines = cat.tags.map((t) => `  - ${t.tag}: ${t.description}`).join('\n');
        return `  [${catName}] ${cat.description}\n${lines}`;
      }).join('\n');
      return `### ${layer} (output: ${data.output_target})\n${catBlocks}`;
    }
    return '';
  });
  return blocks.filter(Boolean).join('\n\n');
}
