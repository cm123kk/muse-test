import { useEffect, useMemo, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const imageModules = import.meta.glob('/src/assets/example/*.{jpg,jpeg}', { eager: true });
const EXAMPLE_IMAGES = Object.values(imageModules).map((m) => m.default);

function mulberry32(seed) {
  let t = seed >>> 0;
  return function rand() {
    t = (t + 0x6D2B79F5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * 겹침 없는 scatter 좌표 생성.
 * rejection sampling: 60회 시도 후 비겹침 위치 없으면 첫 번째 비-keepout 위치 사용.
 */
function generatePositions(count, w, h) {
  const rng = mulberry32(42);
  const MIN = 80;
  const MAX = 150;
  const GAP = 14;
  const KEEPOUT = 210;
  const cx = w / 2;
  const cy = h / 2;
  const list = [];

  for (let i = 0; i < count; i++) {
    const size = MIN + rng() * (MAX - MIN);
    const rotate = (rng() - 0.5) * 22;
    const depth = (size - MIN) / (MAX - MIN);
    let chosen = null;
    let fallback = null;

    for (let a = 0; a < 60; a++) {
      const x = rng() * (w - size);
      const y = rng() * (h - size);
      const icx = x + size / 2;
      const icy = y + size / 2;

      if (Math.hypot(icx - cx, icy - cy) < KEEPOUT) continue;
      if (!fallback) fallback = { x, y, size, rotate, depth };

      const overlaps = list.some((p) => {
        const dx = icx - (p.x + p.size / 2);
        const dy = icy - (p.y + p.size / 2);
        return Math.hypot(dx, dy) < (size + p.size) / 2 + GAP;
      });

      if (!overlaps) { chosen = { x, y, size, rotate, depth }; break; }
    }

    list.push(chosen || fallback || { x: rng() * (w - size), y: rng() * (h - size), size, rotate, depth });
  }

  return list;
}

/**
 * HeroSection 컴포넌트
 * 이미지 hover 시 해당 이미지 블러 배경 fade-in,
 * 마우스 이동 방향으로 depth parallax 적용.
 *
 * Props:
 * @param {function} onNavigateToSignUp - 시작하기 버튼 클릭 시 콜백 [Optional]
 * @param {function} onNavigateToLogin - 로그인 버튼 클릭 시 콜백 [Optional]
 *
 * Example usage:
 * <HeroSection
 *   onNavigateToSignUp={() => navigate('/signup')}
 *   onNavigateToLogin={() => navigate('/login')}
 * />
 */
function HeroSection({ onNavigateToSignUp, onNavigateToLogin }) {
  const containerRef = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [hoverIdx, setHoverIdx] = useState(-1);
  const itemRefs = useRef([]);
  const frameRef = useRef(null);

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

  const positions = useMemo(() => {
    if (!size.w || !size.h) return [];
    return generatePositions(EXAMPLE_IMAGES.length, size.w, size.h);
  }, [size.w, size.h]);

  /* depth parallax RAF */
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !positions.length) return;

    let targetX = 0.5;
    let targetY = 0.5;
    let curX = 0.5;
    let curY = 0.5;
    let active = true;

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      targetX = (e.clientX - r.left) / r.width;
      targetY = (e.clientY - r.top) / r.height;
    };
    const onLeave = () => { targetX = 0.5; targetY = 0.5; };

    el.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', onLeave);

    const tick = () => {
      if (!active) return;
      curX += (targetX - curX) * 0.07;
      curY += (targetY - curY) * 0.07;
      const nx = curX - 0.5;
      const ny = curY - 0.5;

      positions.forEach((pos, i) => {
        const node = itemRefs.current[i];
        if (!node) return;
        const strength = 0.3 + pos.depth * 0.7;
        const dx = nx * 40 * strength;
        const dy = ny * 40 * strength;
        node.style.transform = `translate(${dx}px, ${dy}px) rotate(${pos.rotate}deg)`;
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
  }, [positions]);

  return (
    <Box
      ref={containerRef}
      sx={{ position: 'relative', height: '100vh', overflow: 'hidden' }}
    >
      {/* Layer 1: hover된 이미지 블러 배경 */}
      {EXAMPLE_IMAGES.map((src, i) => (
        <Box
          key={src}
          component="img"
          src={src}
          alt=""
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(32px)',
            transform: 'scale(1.08)',
            opacity: hoverIdx === i ? 0.55 : 0,
            transition: 'opacity 0.4s ease',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Layer 2: scattered 이미지들 */}
      {positions.map((pos, i) => (
        <Box
          key={i}
          ref={(el) => { itemRefs.current[i] = el; }}
          onMouseEnter={() => setHoverIdx(i)}
          onMouseLeave={() => setHoverIdx((h) => (h === i ? -1 : h))}
          component="img"
          src={EXAMPLE_IMAGES[i]}
          alt=""
          sx={{
            position: 'absolute',
            left: Math.round(pos.x),
            top: Math.round(pos.y),
            width: Math.round(pos.size),
            height: Math.round(pos.size),
            objectFit: 'cover',
            borderRadius: 1,
            boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
            willChange: 'transform',
            zIndex: 2,
            userSelect: 'none',
            pointerEvents: 'auto',
            cursor: 'pointer',
          }}
        />
      ))}

      {/* Layer 3: center content */}
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
            variant="h1"
            sx={{
              fontSize: { xs: '4.5rem', md: '8rem' },
              fontWeight: 900,
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
            바이브 디자인을 위한 영감을 관리하세요.
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="contained" size="large" onClick={onNavigateToSignUp} sx={{ px: 5 }}>
              시작하기
            </Button>
            <Button variant="outlined" size="large" onClick={onNavigateToLogin} sx={{ px: 5 }}>
              로그인
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

export default HeroSection;
