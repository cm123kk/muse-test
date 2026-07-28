import { useEffect, useMemo, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import { ReferenceAnnotationOverlay } from './ReferenceAnnotationOverlay.jsx';

/**
 * ScatterGallery component
 *
 * A 2D moodboard that scatters images across the whole container. Additionally, when an external
 * progressRef (0~1) is provided, it continuously lerps between a jittered scatter and a two-row
 * horizontal flow based on the progress (unified within a single RAF).
 *
 * - Distribution: jittered grid + seeded RNG (deterministic)
 * - Flow: two rows (top/bottom) via i % 2, each row flowing infinitely in the opposite direction + at a different speed
 * - Mouse parallax: fully applied only at progress 0, weakening as progress increases
 *
 * Props:
 * @param {string[]} images - Array of image URLs [Required]
 * @param {React.MutableRefObject<number>} progressRef - External progress ref (0~1). Always 0 if absent (scatter only) [Optional]
 * @param {number} cursorRadius - Mouse influence falloff scale (px). A thumbnail at distance = cursorRadius shifts by maxShift x 0.5 (every thumbnail responds proportionally) [Optional, default: 220]
 * @param {number} maxShift - Maximum shift (px): the displacement upper bound at the mouse position (distance 0) [Optional, default: 14]
 * @param {number} seed - Distribution seed [Optional, default: 42]
 * @param {number} gridCols - jittered grid columns [Optional, default: 6]
 * @param {number} gridRows - jittered grid rows [Optional, default: 5]
 * @param {number} thumbnailMin - Minimum thumbnail side (px) [Optional, default: 64]
 * @param {number} thumbnailMax - Maximum thumbnail side (px) [Optional, default: 132]
 * @param {number} centerKeepout - Center keepout radius (px). No thumbnails are placed inside it [Optional, default: 0]
 * @param {boolean} hasTooltip - Extracted-token (color) tooltip on hover [Optional, default: false]
 * @param {number} tooltipDelay - Tooltip entry delay (ms) [Optional, default: 200]
 * @param {Object<string,{title?:string,colors?:string[],tags?:string[]}>} tokensBySrc - Static token mapping [Optional]
 * @param {number} flowGap - Spacing between images within a flow-mode row (px) [Optional, default: 24]
 * @param {number} flowRows - Number of flow-mode rows (4 recommended to fill the screen) [Optional, default: 4]
 * @param {number[]} flowSpeeds - Speed per row (px/s, positive = rightward). Length matches flowRows [Optional, default: [-34, 42, -38, 46]]
 * @param {node} children - Center overlay slot [Optional]
 * @param {object} sx - Additional styles [Optional]
 *
 * Example usage:
 *   const progressRef = useScrollProgress(wrapperRef);
 *   <ScatterGallery images={ urls } progressRef={ progressRef } />
 */
export function ScatterGallery({
  images,
  progressRef,
  cursorRadius = 220,
  maxShift = 14,
  seed = 42,
  gridCols = 6,
  gridRows = 5,
  thumbnailMin = 48,
  thumbnailMax = 96,
  centerKeepout = 0,
  hasTooltip = false,
  tooltipDelay = 200,
  tokensBySrc,
  flowGap = 24,
  flowRows = 4,
  flowSpeeds = [-34, 42, -38, 46],
  onHoverIndex,
  depthParallax = false,
  noOverlap = false,
  children,
  sx,
}) {
  const containerRef = useRef(null);
  const itemRefs = useRef([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [hoverIdx, setHoverIdx] = useState(-1);
  const [tooltipIdx, setTooltipIdx] = useState(-1);
  const tooltipTimerRef = useRef(0);
  const onHoverIndexRef = useRef(onHoverIndex);
  useEffect(() => { onHoverIndexRef.current = onHoverIndex; }, [onHoverIndex]);

  /* Track container size */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* Compute placements: 1 image = 1 placement (no duplicates).
   *   1) Compute scatter coordinates via jittered grid + centerKeepout
   *   2) Distribute into rows round-robin (i % flowRows)
   *   3) Compute an even gap per row so that laneSpan >= size.w + 2 x thumbnailMax
   *      -> images within a row spread out sparsely, and wrap always happens off-screen
   */
  const placements = useMemo(() => {
    if (!size.w || !size.h || !images?.length) return [];
    const rng = mulberry32(seed);
    const cellW = size.w / gridCols;
    const cellH = size.h / gridRows;
    const cx = size.w / 2;
    const cy = size.h / 2;

    const out = [];
    let imgIdx = 0;
    for (let row = 0; row < gridRows && imgIdx < images.length; row += 1) {
      for (let col = 0; col < gridCols && imgIdx < images.length; col += 1) {
        const pad = 0.12;
        const jxRaw = pad + rng() * (1 - pad * 2);
        const jyRaw = pad + rng() * (1 - pad * 2);
        const sz = thumbnailMin + rng() * (thumbnailMax - thumbnailMin);
        /* noOverlap: clamp jitter so thumbnails don't spill outside the cell */
        const mX = noOverlap ? Math.min((sz / 2 + 8) / cellW, 0.4) : pad;
        const mY = noOverlap ? Math.min((sz / 2 + 8) / cellH, 0.4) : pad;
        const jx = noOverlap ? Math.max(mX, Math.min(1 - mX, jxRaw)) : jxRaw;
        const jy = noOverlap ? Math.max(mY, Math.min(1 - mY, jyRaw)) : jyRaw;
        const x = col * cellW + jx * cellW;
        const y = row * cellH + jy * cellH;
        if (centerKeepout > 0 && Math.hypot(x - cx, y - cy) < centerKeepout) continue;
        out.push({
          src: images[imgIdx],
          imgIdx,
          x: x - sz / 2,
          y: y - sz / 2,
          size: sz,
          row: out.length % flowRows,
        });
        imgIdx += 1;
      }
    }
    if (!out.length) return [];

    /* Per-row laneSpan / even gap. Guarantees wrap stays off-screen. */
    const minLaneSpan = size.w + 2 * thumbnailMax;
    for (let r = 0; r < flowRows; r += 1) {
      const ofRow = out.filter((p) => p.row === r);
      if (!ofRow.length) continue;
      const sumSizes = ofRow.reduce((s, p) => s + p.size, 0);
      const laneSpan = Math.max(minLaneSpan, sumSizes + ofRow.length * flowGap);
      const gap = (laneSpan - sumSizes) / ofRow.length;
      let cursor = 0;
      ofRow.forEach((p) => {
        p.flowLaneStart = cursor + p.size / 2;
        cursor += p.size + gap;
        p.flowLaneSpan = laneSpan;
      });
    }
    return out;
  }, [size.w, size.h, images, seed, gridCols, gridRows, thumbnailMin, thumbnailMax, centerKeepout, flowGap, flowRows, noOverlap]);

  const hoverIdxRef = useRef(-1);
  useEffect(() => { hoverIdxRef.current = hoverIdx; }, [hoverIdx]);

  /* Single RAF: scatter <-> flow lerp + cursor parallax */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    let raf = 0;
    let mx = -9999;
    let my = -9999;
    let active = true;
    const startT = performance.now();

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
    };
    const onLeave = () => { mx = -9999; my = -9999; };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);

    const cur = placements.map(() => ({ dx: 0, dy: 0 }));
    const lerp = 0.15;

    const tick = () => {
      if (!active) return;
      const p = progressRef?.current ?? 0;
      // Elastic ease: the scatter <-> flow interpolation pulls back slightly, overshoots, then settles
      const easedP = easeInOutBack(p);
      const t = (performance.now() - startT) / 1000;

      placements.forEach((pl, i) => {
        const node = itemRefs.current[i];
        if (!node) return;

        // Flow position (the cursor within the lane flows over time), wrapped by laneSpan
        const speed = flowSpeeds[pl.row] ?? 0;
        const span = pl.flowLaneSpan || 1;
        const rawPos = pl.flowLaneStart + t * speed;
        const wrapped = ((rawPos % span) + span) % span;
        // Place the lane at the viewport center -> since laneSpan >= W + 2*tileMax, wrap is always off-screen
        const flowX = wrapped - span / 2 + size.w / 2 - pl.size / 2;
        const rowY = ((pl.row + 0.5) / flowRows) * size.h;
        const flowY = rowY - pl.size / 2;

        // scatter <-> flow interpolation (only the delta goes into transform); top/left stay static at scatter
        const deltaX = (flowX - pl.x) * easedP;
        const deltaY = (flowY - pl.y) * easedP;

        let tx = 0;
        let ty = 0;
        if (mx > -9000) {
          if (depthParallax) {
            /* depth parallax: move images toward the mouse; larger (closer) ones move more */
            const normX = mx / size.w - 0.5;
            const normY = my / size.h - 0.5;
            const depth = (pl.size - thumbnailMin) / Math.max(thumbnailMax - thumbnailMin, 1);
            const k = maxShift * (0.4 + depth * 0.6) * (1 - p);
            tx = normX * k;
            ty = normY * k;
          } else {
            /* repulsion parallax (existing): distance-based repulsion */
            const ccx = pl.x + deltaX + pl.size / 2;
            const ccy = pl.y + deltaY + pl.size / 2;
            const ddx = ccx - mx;
            const ddy = ccy - my;
            const dist = Math.hypot(ddx, ddy);
            const fall = cursorRadius / (cursorRadius + dist);
            const k = fall * maxShift * (1 - p);
            const inv = dist === 0 ? 0 : 1 / dist;
            tx = ddx * inv * k;
            ty = ddy * inv * k;
          }
        }
        cur[i].dx += (tx - cur[i].dx) * lerp;
        cur[i].dy += (ty - cur[i].dy) * lerp;
        node.style.transform = `translate3d(${ deltaX + cur[i].dx }px, ${ deltaY + cur[i].dy }px, 0)`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      active = false;
      cancelAnimationFrame(raf);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [placements, cursorRadius, maxShift, size.w, size.h, flowSpeeds, flowRows, progressRef, depthParallax, thumbnailMin, thumbnailMax]);

  /* hoverIdx -> external onHoverIndex callback (passes the placement's imgIdx, or -1 if none) */
  useEffect(() => {
    if (!onHoverIndexRef.current) return;
    const imgIdx = hoverIdx >= 0 && placements[hoverIdx] ? placements[hoverIdx].imgIdx : -1;
    onHoverIndexRef.current(imgIdx);
  }, [hoverIdx, placements]);

  /* tooltip delay: disabled in flow mode (p > 0.5) */
  useEffect(() => {
    if (!hasTooltip) return undefined;
    const p = progressRef?.current ?? 0;
    if (hoverIdx < 0 || p > 0.5) {
      if (tooltipTimerRef.current) {
        clearTimeout(tooltipTimerRef.current);
        tooltipTimerRef.current = 0;
      }
      const id = window.setTimeout(() => setTooltipIdx(-1), 0);
      return () => clearTimeout(id);
    }
    tooltipTimerRef.current = window.setTimeout(() => {
      setTooltipIdx(hoverIdx);
    }, tooltipDelay);
    return () => {
      if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
    };
  }, [hoverIdx, hasTooltip, tooltipDelay, progressRef]);

  return (
    <Box
      ref={ containerRef }
      sx={ {
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        ...sx,
      } }
    >
      {/* scattered thumbnails: move via transform during flow.
          The outer wrapper releases overflow (annotation chips attach outside the image) */}
      { placements.map((p, i) => {
        const tokens = tokensBySrc?.[p.src];
        const isAnnotated = hasTooltip && tooltipIdx === i && tokens;
        return (
          <Box
            key={ `${ p.src }-${ i }` }
            ref={ (n) => { itemRefs.current[i] = n; } }
            onMouseEnter={ () => setHoverIdx(i) }
            onMouseLeave={ () => setHoverIdx((curr) => (curr === i ? -1 : curr)) }
            sx={ {
              position: 'absolute',
              top: p.y,
              left: p.x,
              width: p.size,
              height: p.size,
              willChange: 'transform',
              zIndex: isAnnotated ? 6 : 1,
              cursor: 'pointer',
            } }
          >
            <Box
              sx={ {
                position: 'absolute',
                inset: 0,
                borderRadius: 1.5,
                overflow: 'hidden',
                backgroundImage: `url(${ p.src })`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'filter 220ms ease',
                ...(hoverIdx === i && { filter: 'brightness(1.05)' }),
              } }
            />
            { hasTooltip && tokens && (
              <ReferenceAnnotationOverlay
                tokens={ tokens }
                isActive={ isAnnotated }
                size={ p.size }
              />
            ) }
          </Box>
        );
      }) }

      {/* center slot */}
      { children && (
        <Box
          sx={ {
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            pointerEvents: 'none',
          } }
        >
          { children }
        </Box>
      ) }
    </Box>
  );
}

/* ============================================
 * easeInOutBack: slight overshoot at both ends. https://easings.net/#easeInOutBack
 * Used to give the scatter <-> flow interpolation an elastic feel.
 * ============================================ */
function easeInOutBack(x) {
  const c1 = 1.70158;
  const c2 = c1 * 1.525;
  return x < 0.5
    ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
    : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
}

/* ============================================
 * Small seeded RNG: Mulberry32
 * https://stackoverflow.com/a/47593316
 * ============================================ */
function mulberry32(seed) {
  let t = seed >>> 0;
  return function rand() {
    t = (t + 0x6D2B79F5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

