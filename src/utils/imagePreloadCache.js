/**
 * imagePreloadCache
 *
 * A client-side memory cache to prevent the "images flickering and refilling"
 * effect that happens when the <img> DOM unmounts -> remounts during route changes.
 *
 * Behavior:
 * - Keeps Image objects in a module-level Map<url, HTMLImageElement> to prevent GC.
 * - When the same URL is used again in the next route's <img src=...>, already-decoded
 *   pixels are drawn immediately from the browser memory cache, with no empty frame.
 * - Orthogonal to HTTP Cache-Control (7 days): that is the disk cache after a reload, this is the memory cache within an SPA session.
 *
 * Usage:
 *   preloadImage(url)      // single URL
 *   preloadImages(urls[])  // array - already-cached URLs are ignored
 *   evictUnused(active)    // free memory for items not in active
 */

const cache = new Map(); // url -> HTMLImageElement

export function preloadImage(url) {
  if (!url) return null;
  const cached = cache.get(url);
  if (cached) return cached;
  const img = new Image();
  img.decoding = 'async';
  img.src = url;
  cache.set(url, img);
  return img;
}

export function preloadImages(urls) {
  if (!urls) return;
  urls.forEach((u) => preloadImage(u));
}

export function evictUnused(activeUrls) {
  const active = new Set(activeUrls || []);
  for (const url of cache.keys()) {
    if (!active.has(url)) cache.delete(url);
  }
}

export function getImagePreloadCacheSize() {
  return cache.size;
}
