import { useEffect, useMemo, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const imageModules = import.meta.glob('/src/assets/example/*.{jpg,jpeg}', { eager: true });
const EXAMPLE_IMAGES = Object.values(imageModules).map((m) => m.default);

/* Same seeded RNG + scatter generation logic as HeroSection */
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
  const rng = mulberry32(99);
  /* Image size: scale down proportionally to screen width on mobile */
  const SIZE_MIN = Math.min(60, Math.round(w * 0.1));
  const SIZE_MAX = Math.min(95, Math.round(w * 0.14));
  const PAD = 14;
  const PAD_TOP = 72;
  /* Rectangular keepout: exclude only the text block area exactly, still allowing images on both sides */
  /* KEEPOUT_X/Y: computed proportionally to the viewport to guarantee even placement at any screen size */
  const KEEPOUT_X = Math.min(Math.round(w * 0.22), 320);
  const KEEPOUT_Y = Math.min(Math.round(h * 0.25), 195);
  const COLS = 8;
  const ROWS = 5;
  const cx = w / 2;
  const cy = h / 2;

  const cellW = (w - PAD * 2) / COLS;
  const cellH = (h - PAD_TOP - PAD) / ROWS;

  /* Collect cells outside the keepout (preserving raster order = evenly distributed across the grid) */
  const cells = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cellCx = PAD + col * cellW + cellW / 2;
      const cellCy = PAD_TOP + row * cellH + cellH / 2;
      const inKeepout = Math.abs(cellCx - cx) < KEEPOUT_X && Math.abs(cellCy - cy) < KEEPOUT_Y;
      if (!inKeepout) {
        cells.push({ cellCx, cellCy });
      }
    }
  }

  /* Even placement: split all cells into count buckets and pick one per bucket */
  const total = Math.min(count, cells.length);
  const selected = [];
  for (let i = 0; i < total; i++) {
    const start = Math.floor(i * cells.length / total);
    const end = Math.floor((i + 1) * cells.length / total);
    const idx = start + Math.floor(rng() * Math.max(1, end - start));
    selected.push(cells[Math.min(idx, cells.length - 1)]);
  }

  const list = [];
  for (let i = 0; i < selected.length; i++) {
    const { cellCx, cellCy } = selected[i];
    const size = SIZE_MIN + rng() * (SIZE_MAX - SIZE_MIN);
    const rotate = (rng() - 0.5) * 22;
    const offX = (rng() - 0.5) * cellW * 0.35;
    const offY = (rng() - 0.5) * cellH * 0.45;
    const x = Math.max(PAD, Math.min(w - PAD - size, cellCx - size / 2 + offX));
    const y = Math.max(PAD_TOP, Math.min(h - PAD - size, cellCy - size / 2 + offY));
    list.push({ x, y, size, rotate });
  }
  return list;
}

/**
 * FooterCtaSection component
 *
 * The bottommost CTA section of the landing page. An application of the HeroSection image scatter + mouse parallax.
 * No hover background blur. No scrollProgress (images are fixed at their scatter positions).
 *
 * Props:
 * @param {function} onNavigateToSignUp - Start now button callback [Optional]
 * @param {function} onNavigateToLogin - Already have an account callback [Optional]
 *
 * Example usage:
 * <FooterCtaSection onNavigateToSignUp={openSignUp} onNavigateToLogin={openLogin} />
 */
function FooterCtaSection({ onNavigateToSignUp, onNavigateToLogin }) {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });

  const containerRef = useRef(null);
  const itemRefs = useRef([]);
  const positionsRef = useRef([]);
  const frameRef = useRef(null);

  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const positions = useMemo(
    () => generatePositions(EXAMPLE_IMAGES.length, size.w, size.h),
    [size.w, size.h],
  );

  positionsRef.current = positions;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let mouseX = -99999, mouseY = -99999;
    let prevMouseX = -99999, prevMouseY = -99999;
    let velX = 0, velY = 0;
    const offsX = [], offsY = [];
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

      itemRefs.current.forEach((node, i) => {
        if (!node || !sPositions[i]) return;
        const sPos = sPositions[i];
        if (!offsX[i]) { offsX[i] = 0; offsY[i] = 0; }

        /* Mouse proximity parallax */
        if (mouseSpeed > 0.4 && mouseX > -9000) {
          const imgCx = sPos.x + sPos.size / 2;
          const imgCy = sPos.y + sPos.size / 2;
          const dist = Math.hypot(imgCx - mouseX, imgCy - mouseY);
          const t = Math.max(0, 1 - dist / RADIUS);
          offsX[i] += velX * t * t * STRENGTH;
          offsY[i] += velY * t * t * STRENGTH;
        }
        offsX[i] *= DECAY;
        offsY[i] *= DECAY;

        node.style.transform = `translate(${offsX[i].toFixed(2)}px, ${offsY[i].toFixed(2)}px) rotate(${sPos.rotate.toFixed(2)}deg)`;
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

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      {/* Image scatter (mouse parallax only, no background hover) */}
      {positions.map((pos, i) => (
        <Box
          key={i}
          ref={(el) => { itemRefs.current[i] = el; }}
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
            opacity: 0.45,
            willChange: 'transform',
            zIndex: 2,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* CTA text + button */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <Box sx={{ textAlign: 'center', px: 3, pointerEvents: 'auto' }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.75rem' },
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              mb: 3,
              color: 'text.primary',
            }}
          >
            Don't let today's references<br />slip away.
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: { xs: '0.8rem', md: '0.95rem' }, mb: 5, maxWidth: 420, mx: 'auto', lineHeight: 1.7 }}
          >
            All it takes is an email. Get your first project's decision log in under 30 seconds.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={onNavigateToSignUp}
              sx={{ px: 5 }}
            >
              Start Now
            </Button>
            <Button
              variant="text"
              size="small"
              onClick={onNavigateToLogin}
              sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
            >
              Already have an account?
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default FooterCtaSection;
