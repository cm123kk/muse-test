import { useEffect, useMemo, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const imageModules = import.meta.glob('/src/assets/example/*.{jpg,jpeg}', { eager: true });
const EXAMPLE_IMAGES = Object.values(imageModules).map((m) => m.default);

const MARQUEE_SIZE = 64;
const MARQUEE_SPEED = 60; // px/s (one-directional travel speed)

function mulberry32(seed) {
  let t = seed >>> 0;
  return function rand() {
    t = (t + 0x6D2B79F5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function generatePositions(count, w, h) {
  const rng = mulberry32(42);
  const SIZE_MIN = 44;
  const SIZE_MAX = 68;
  const PAD = 14;
  const PAD_TOP = 72;
  const KEEPOUT = 190;
  const COLS = 6;
  const ROWS = 4;
  const cx = w / 2;
  const cy = h / 2;

  const cellW = (w - PAD * 2) / COLS;
  const cellH = (h - PAD_TOP - PAD) / ROWS;

  const cells = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cellCx = PAD + col * cellW + cellW / 2;
      const cellCy = PAD_TOP + row * cellH + cellH / 2;
      if (Math.hypot(cellCx - cx, cellCy - cy) > KEEPOUT) {
        cells.push({ cellCx, cellCy });
      }
    }
  }

  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = cells[i]; cells[i] = cells[j]; cells[j] = tmp;
  }

  const list = [];
  const total = Math.min(count, cells.length);

  for (let i = 0; i < total; i++) {
    const { cellCx, cellCy } = cells[i];
    const size = SIZE_MIN + rng() * (SIZE_MAX - SIZE_MIN);
    const rotate = (rng() - 0.5) * 22;
    const depth = (size - SIZE_MIN) / (SIZE_MAX - SIZE_MIN);
    const offX = (rng() - 0.5) * cellW * 0.6;
    const offY = (rng() - 0.5) * cellH * 0.9;
    const x = Math.max(PAD, Math.min(w - PAD - size, cellCx - size / 2 + offX));
    const y = Math.max(PAD_TOP, Math.min(h - PAD - size, cellCy - size / 2 + offY));
    list.push({ x, y, size, rotate, depth });
  }

  return list;
}

/* Marquee target positions: 3 rows, track width = w + MARQUEE_SIZE (based on out-of-screen wraparound) */
function generateMarqueePositions(count, w, h) {
  const ROW_Y = [h * 0.22, h * 0.5, h * 0.78];
  const rowCounts = [0, 0, 0];
  for (let i = 0; i < count; i++) rowCounts[i % 3]++;

  const colIdx = [0, 0, 0];
  return Array.from({ length: count }, (_, i) => {
    const row = i % 3;
    const col = colIdx[row]++;
    const n = rowCounts[row];
    /* Track = w + MARQUEE_SIZE -> images wrap around fully off-screen */
    const trackW = w + MARQUEE_SIZE;
    const spacing = trackW / n;
    const x = col * spacing + (spacing - MARQUEE_SIZE) / 2;
    const y = ROW_Y[row] - MARQUEE_SIZE / 2;
    return { x, y, row, n };
  });
}

/**
 * HeroSection component
 *
 * Props:
 * @param {function} onNavigateToSignUp - Callback when the get started button is clicked [Optional]
 * @param {number} scrollProgress - Scroll progress from 0 to 1 (passed from LandingPage) [Optional]
 *
 * Example usage:
 * <HeroSection onNavigateToSignUp={() => navigate('/signup')} scrollProgress={sp} />
 */
function HeroSection({ onNavigateToSignUp, scrollProgress = 0 }) {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [hoverIdx, setHoverIdx] = useState(-1);
  /* Actual height of the hero content (title + body + CTA), used to compute the exit distance */
  const [heroContentH, setHeroContentH] = useState(0);

  const containerRef = useRef(null);
  const heroContentRef = useRef(null);
  const itemRefs = useRef([]);
  const positionsRef = useRef([]);
  const marqueePositionsRef = useRef([]);
  const frameRef = useRef(null);
  const scrollProgressRef = useRef(0);

  scrollProgressRef.current = scrollProgress;

  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* Measure hero content height (handles responsive fonts / resize) */
  useEffect(() => {
    const el = heroContentRef.current;
    if (!el) return;
    const measure = () => setHeroContentH(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const positions = useMemo(
    () => generatePositions(EXAMPLE_IMAGES.length, size.w, size.h),
    [size.w, size.h],
  );

  const marqueePositions = useMemo(
    () => generateMarqueePositions(EXAMPLE_IMAGES.length, size.w, size.h),
    [size.w, size.h],
  );

  positionsRef.current = positions;
  marqueePositionsRef.current = marqueePositions;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let mouseX = -99999, mouseY = -99999;
    let prevMouseX = -99999, prevMouseY = -99999;
    let velX = 0, velY = 0;
    const offsX = [], offsY = [];
    /* Per-row marquee offset (px, sign determines direction) */
    const marqueeOffsets = [0, 0, 0];
    let lastTime = performance.now();
    let active = true;

    const RADIUS = 130, STRENGTH = 0.22, DECAY = 0.84;

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      mouseX = e.clientX - r.left;
      mouseY = e.clientY - r.top;
    };
    const onLeave = () => {
      mouseX = -99999; mouseY = -99999;
      velX = 0; velY = 0;
    };

    el.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', onLeave);

    const tick = (now) => {
      if (!active) return;

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const sp = scrollProgressRef.current;
      const w = window.innerWidth;

      /* Values derived per sp range */
      const lerpSp = Math.min(sp / 0.8, 1);          // 0->1 as sp 0->0.8 (position movement)
      const marqueeSp = Math.max(0, (sp - 0.75) / 0.25); // 0->1 as sp 0.75->1.0 (marquee speed ramp-up)

      /* Accumulate per-row marquee offset */
      const speed = MARQUEE_SPEED * marqueeSp;
      marqueeOffsets[0] -= speed * dt; // left
      marqueeOffsets[1] += speed * dt; // right
      marqueeOffsets[2] -= speed * dt; // left

      /* Mouse velocity */
      if (prevMouseX > -9000 && mouseX > -9000) {
        velX = velX * 0.55 + (mouseX - prevMouseX) * 0.45;
        velY = velY * 0.55 + (mouseY - prevMouseY) * 0.45;
      } else {
        velX *= 0.8; velY *= 0.8;
      }
      prevMouseX = mouseX; prevMouseY = mouseY;
      const mouseSpeed = Math.hypot(velX, velY);

      const sPositions = positionsRef.current;
      const mPositions = marqueePositionsRef.current;

      itemRefs.current.forEach((node, i) => {
        if (!node || !sPositions[i] || !mPositions[i]) return;

        const sPos = sPositions[i];
        const mPos = mPositions[i];

        if (!offsX[i]) { offsX[i] = 0; offsY[i] = 0; }

        /* Mouse proximity effect (scatter phase only) */
        if (sp < 0.3 && mouseSpeed > 0.4 && mouseX > -9000) {
          const imgCx = sPos.x + sPos.size / 2;
          const imgCy = sPos.y + sPos.size / 2;
          const dist = Math.hypot(imgCx - mouseX, imgCy - mouseY);
          const t = Math.max(0, 1 - dist / RADIUS);
          offsX[i] += velX * t * t * STRENGTH;
          offsY[i] += velY * t * t * STRENGTH;
        }
        offsX[i] *= DECAY;
        offsY[i] *= DECAY;

        /* Marquee X: apply the wraparound to the "final coordinate" -> jumps always happen only at off-screen boundaries.
           (Use the marquee offset as the raw accumulated value. Wrapping early causes on-screen jitter due to marqueeSp weighting during the transition) */
        const trackW = w + MARQUEE_SIZE;
        const marqX = mPos.x + marqueeOffsets[mPos.row];

        /* Separate the position blend (lerpSp, scroll-linked) from the marquee flow (marqueeOffsets, time-accumulated).
           Multiplying the flow offset by marqueeSp again would carry the scroll speed directly into the on-screen speed
           (offset x d(marqueeSp)/dt), making the image jump sharply during the transition.
           Instead, carry the flow on lerpSp only (near 1, changing slowly), and handle the acceleration ramp-up only in
           speed = MARQUEE_SPEED * marqueeSp (offset accumulation speed). */
        const finalDx = (marqX - sPos.x) * lerpSp;
        const finalDy = (mPos.y - sPos.y) * lerpSp;

        /* Wrap the final left coordinate into the off-screen safe range (-MARQUEE_SIZE, w].
           During the transition the coordinate stays in range -> no action. In normal flow, when it disappears off one
           side of the screen it reappears off the opposite side, so the "added image" is never exposed on screen. */
        let finalX = sPos.x + finalDx;
        while (finalX < -MARQUEE_SIZE) finalX += trackW;
        while (finalX > w) finalX -= trackW;
        const wrappedDx = finalX - sPos.x;

        const rotate = sPos.rotate * (1 - lerpSp);

        node.style.transform = `translate(${(wrappedDx + offsX[i]).toFixed(2)}px, ${(finalDy + offsY[i]).toFixed(2)}px) rotate(${rotate.toFixed(2)}deg)`;
      });

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      active = false;
      cancelAnimationFrame(frameRef.current);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  /* Minimum distance to push from the center of the container (100vh) out past the screen */
  const halfVh = window.innerHeight / 2 + 60;

  /* Hero text + CTA: slides up and out over the sp 0->0.4 range (fully exits above the screen).
     Since the block is vertically centered, pushing even the bottom CTA above the screen
     requires moving up by (half the viewport + half the block + margin). */
  const heroExit = Math.min(1, scrollProgress / 0.4);
  const heroExitDist = window.innerHeight / 2 + heroContentH / 2 + 40;
  const heroTranslateY = -heroExit * heroExitDist;

  /* Bridge text: slides in bottom-to-top over the sp 0.45->0.8 range (enters from below the screen) */
  const bridgeEnter = Math.max(0, Math.min(1, (scrollProgress - 0.45) / 0.35));
  const bridgeTranslateY = (1 - bridgeEnter) * halfVh;

  return (
    <Box
      ref={containerRef}
      sx={{ position: 'relative', height: '100vh', overflow: 'hidden', bgcolor: 'background.default' }}
    >
      {/* Layer 1: hover blur background.
         With position: fixed it covers the whole viewport (y=0), so the area behind the transparent
         ghost GNB that overlaps the hero via sticky transitions the same way. (With absolute, the hero
         container starts below by the GNB height, leaving the top band empty so the transition behind
         the GNB was not visible) */}
      {EXAMPLE_IMAGES.map((src, i) => (
        <Box
          key={src}
          component="img"
          src={src}
          alt=""
          sx={{
            position: 'fixed',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(32px)',
            transform: 'scale(1.08)',
            opacity: hoverIdx === i ? 0.35 * (1 - scrollProgress * 3) : 0,
            transition: 'opacity 0.4s ease',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Layer 2: images (scatter -> marquee) */}
      {positions.map((pos, i) => (
        <Box
          key={i}
          ref={(el) => { itemRefs.current[i] = el; }}
          onMouseEnter={() => scrollProgress < 0.1 && setHoverIdx(i)}
          onMouseLeave={() => setHoverIdx((h) => (h === i ? -1 : h))}
          component="img"
          src={EXAMPLE_IMAGES[i]}
          alt=""
          sx={{
            position: 'absolute',
            left: `${Math.round(pos.x)}px`,
            top: `${Math.round(pos.y)}px`,
            width: `${Math.round(pos.size)}px`,
            height: `${Math.round(pos.size)}px`,
            objectFit: 'cover',
            borderRadius: 1,
            boxShadow: 'none',
            willChange: 'transform',
            zIndex: 2,
            userSelect: 'none',
            cursor: scrollProgress < 0.1 ? 'pointer' : 'default',
          }}
        />
      ))}

      {/* Layer 3: hero centered text */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          transform: `translateY(${heroTranslateY.toFixed(2)}px)`,
          pointerEvents: 'none',
        }}
      >
        <Box ref={heroContentRef} sx={{ textAlign: 'center', px: 3, pointerEvents: scrollProgress < 0.3 ? 'auto' : 'none' }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '4.5rem', md: '8rem' },
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1,
              mb: 3,
              color: 'primary.main',
            }}
          >
            MUSE
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: { xs: '1rem', md: '1.25rem' }, mb: 5, maxWidth: 480, mx: 'auto' }}
          >
            Curate the inspiration behind your vibe design.
          </Typography>
          <Button variant="contained" size="large" onClick={onNavigateToSignUp} sx={{ px: 5 }}>
            Get Started
          </Button>
        </Box>
      </Box>

      {/* Layer 4: bridge text */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          transform: `translateY(${bridgeTranslateY.toFixed(2)}px)`,
          pointerEvents: 'none',
        }}
      >
        <Typography
          variant="sectionHeading"
          sx={{
            textAlign: 'center',
            fontSize: { xs: '1.5rem', md: '2.5rem' },
            lineHeight: 1.4,
            color: 'text.primary',
            px: 3,
          }}
        >
          How well do you really understand<br />the designs AI builds from your references?
        </Typography>
      </Box>
    </Box>
  );
}

export default HeroSection;
