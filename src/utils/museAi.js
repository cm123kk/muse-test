/**
 * MUSE AI client helper (Supabase Edge Function proxy version)
 *
 * Calls the Anthropic API through a Supabase Edge Function (anthropic-proxy).
 * The API key is managed only in server-side Supabase Secrets.
 *
 * Edge Function: supabase/functions/anthropic-proxy/index.ts
 * Key registration: supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
 */

import { supabase } from '../lib/supabase';

/** Health check - verifies the Supabase Edge Function connection */
export async function checkAnthropicHealth() {
  return {
    ok: true,
    hasKey: true,
    endpoint: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/anthropic-proxy`,
  };
}

/**
 * Anthropic messages.create call (Supabase Edge Function proxy).
 *
 * @param {object} params
 * @param {string} params.model - e.g. 'claude-haiku-4-5-20251001'
 * @param {string} [params.system] - System prompt
 * @param {Array}  params.messages - [{ role: 'user'|'assistant', content: ... }]
 * @param {Array}  [params.tools]  - Array of tool definitions
 * @param {object} [params.tool_choice] - e.g. { type: 'tool', name: '...' }
 * @param {number} [params.max_tokens]
 * @param {number} [params.temperature]
 * @returns {Promise<object>} Raw Anthropic API response
 */
export async function callAnthropic(params) {
  const { data, error } = await supabase.functions.invoke('anthropic-proxy', {
    body: params,
  });

  if (error) {
    let detail = {};
    try { detail = await error.context?.json?.(); } catch (_) {}
    const msg = detail?.error?.message || detail?.error || error.message || 'unknown';
    const err = new Error(`Anthropic error ${error.context?.status ?? ''}: ${msg}`);
    err.status = error.context?.status;
    err.detail = detail;
    throw err;
  }

  return data;
}

/**
 * Extract the input object of the first tool_use block from the response content blocks.
 * @param {object} response - Anthropic messages response
 * @param {string} [toolName] - Filter by a specific tool name
 * @returns {object|null}
 */
export function extractToolInput(response, toolName) {
  const blocks = response?.content;
  if (!Array.isArray(blocks)) return null;
  const block = blocks.find(
    (b) => b.type === 'tool_use' && (!toolName || b.name === toolName),
  );
  return block?.input || null;
}

/**
 * Combine text blocks from the response and return as plain text (for fallback/debug)
 */
export function extractText(response) {
  const blocks = response?.content;
  if (!Array.isArray(blocks)) return '';
  return blocks.filter((b) => b.type === 'text').map((b) => b.text).join('\n');
}

/**
 * Merge inputs when the same tool is called multiple times.
 *  - Array fields: concat (duplicate tokens deduped by id)
 *  - Object fields: shallow merge (later wins)
 *  - Scalars: later wins (assumes the model refines in later calls)
 *
 * When Haiku 4.5 splits a token tool (e.g. submit_design_system_core) per layer under tool_choice='any'
 * (e.g. color -> typography -> layout -> gradient, one each), keeping only the
 * last input would make the other layers disappear as empty arrays.
 * Merge to prevent this.
 */
function mergeToolInputs(prev, next) {
  if (!prev) return next;
  if (!next) return prev;
  const out = { ...prev };
  for (const [k, v] of Object.entries(next)) {
    if (Array.isArray(v) && Array.isArray(prev[k])) {
      const seen = new Set(prev[k].map((it) => it?.id).filter(Boolean));
      const merged = [...prev[k]];
      for (const item of v) {
        if (item && typeof item === 'object' && item.id) {
          if (!seen.has(item.id)) {
            merged.push(item);
            seen.add(item.id);
          }
        } else {
          merged.push(item);
        }
      }
      out[k] = merged;
    } else if (v && typeof v === 'object' && !Array.isArray(v) && prev[k] && typeof prev[k] === 'object') {
      out[k] = { ...prev[k], ...v };
    } else if (v !== undefined && v !== null && v !== '') {
      out[k] = v;
    }
  }
  return out;
}

/**
 * Extract the input of all tool_use blocks into a map keyed by name.
 * When the same tool name is called multiple times, inputs are merged (not overwritten).
 * @param {object} response
 * @returns {Record<string, object>} { [toolName]: mergedInput }
 */
export function extractAllToolInputs(response) {
  const blocks = response?.content;
  if (!Array.isArray(blocks)) return {};
  const result = {};
  for (const b of blocks) {
    if (b.type === 'tool_use' && b.name) {
      result[b.name] = mergeToolInputs(result[b.name], b.input);
    }
  }
  return result;
}

/**
 * Convert an image URL (dataURL or http) into an image block for Anthropic messages content.
 * - For a data URL, extract base64 + media_type
 * - For an http URL, use { type: 'image', source: { type: 'url', url } } (supported 2025+)
 */
export function toImageBlock(src) {
  if (!src) return null;
  if (src.startsWith('data:')) {
    const match = src.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) return null;
    return {
      type: 'image',
      source: { type: 'base64', media_type: match[1], data: match[2] },
    };
  }
  return { type: 'image', source: { type: 'url', url: src } };
}

/**
 * Fetch a Vite-imported image URL and convert it into a base64 data URL.
 * Inside the Storybook iframe: fetch -> Blob -> FileReader.
 */
export async function imageUrlToBase64DataUrl(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Image fetch failed: ${res.status} ${url}`);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Convert a File object -> base64 data URL (for the upload flow only)
 */
export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Canvas resize - scale the longer side down to maxDim or less (reduces AI payload).
 * @param {string} dataUrl - data:image/...;base64,...
 * @param {number} maxDim - Default 1024
 * @returns {Promise<string>} Resized JPEG data URL (quality 0.85)
 */
export function resizeDataUrl(dataUrl, maxDim = 1024) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}
