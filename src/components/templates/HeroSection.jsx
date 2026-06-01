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

function generatePositions(count, w, h) {
  const rng = mulberry32(42);
  const SIZE_MIN = 50;
  const SIZE_MAX = 80;
  const GAP = 12;
  const PAD = 10;
  const PAD_TOP = 80;   // 헤더 근처 상단 여백
  const KEEPOUT = 170;
  const cx = w / 2;
  const cy = h / 2;
  const TAU = Math.PI * 2;
  const list = [];

  for (let i = 0; i < count; i++) {
    const size = SIZE_MIN + rng() * (SIZE_MAX - SIZE_MIN);
    const rotate = (rng() - 0.5) * 22;
    const depth = (size - SIZE_MIN) / (SIZE_MAX - SIZE_MIN);
    const half = size / 2;

    /* 섹터 전체를 균등 분할 후 섹터 내 완전 랜덤 각도 */
    const angle = (TAU / count) * i + rng() * (TAU / count);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    /* 이 각도에서 화면 경계까지 실제 거리 */
    let maxDist = Infinity;
    if (cos > 1e-9)  maxDist = Math.min(maxDist, (w - PAD - half - cx) / cos);
    if (cos < -1e-9) maxDist = Math.min(maxDist, (PAD + half - cx) / cos);
    if (sin > 1e-9)  maxDist = Math.min(maxDist, (h - PAD - half - cy) / sin);
    if (sin < -1e-9) maxDist = Math.min(maxDist, (PAD_TOP + half - cy) / sin);
    maxDist = Math.max(KEEPOUT, maxDist);

    let chosen = null;
    let fallback = null;

    for (let a = 0; a < 80; a++) {
      /* KEEPOUT ~ maxDist 균등 분포 — 편향 없이 화면 전체에 퍼짐 */
      const dist = KEEPOUT + rng() * (maxDist - KEEPOUT);
      const imgCx = cx + cos * dist;
      const imgCy = cy + sin * dist;
      const x = imgCx - half;
      const y = imgCy - half;

      if (x < PAD || y < PAD_TOP || x + size > w - PAD || y + size > h - PAD) continue;
      if (!fallback) fallback = { x, y, size, rotate, depth };

      const overlaps = list.some((p) => {
        const dx = imgCx - (p.x + p.size / 2);
        const dy = imgCy - (p.y + p.size / 2);
        return Math.hypot(dx, dy) < (size + p.size) / 2 + GAP;
      });

      if (!overlaps) { chosen = { x, y, size, rotate, depth }; break; }
    }

    if (chosen || fallback) list.push(chosen ?? fallback);
  }

  return list;
}

/**
 * HeroSection 컴포넌트
 *
 * Props:
 * @param {function} onNavigateToSignUp - 시작하기 버튼 클릭 시 콜백 [Optional]
 * @param {function} onNavigateToLogin - 로그인 버튼 클릭 시 콜백 [Optional]
 */
function HeroSection({ onNavigateToSignUp, onNavigateToLogin }) {
  /* size를 window로 즉시 초기화 → 첫 렌더에서 positions 비어있지 않음 */
  const [size, setSize] = useState({
    w: window.innerWidth,
    h: window.innerHeight,
  });
  const [hoverIdx, setHoverIdx] = useState(-1);

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

  /* 최신 positions를 ref로 유지 */
  positionsRef.current = positions;

  /* RAF — mount 시 한 번만 시작, positions는 positionsRef로 항상 최신 참조 */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    /* 마우스 위치 (컨테이너 기준) */
    let mouseX = -99999;
    let mouseY = -99999;
    let prevMouseX = -99999;
    let prevMouseY = -99999;

    /* 스무딩된 속도 */
    let velX = 0;
    let velY = 0;

    /* 이미지별 누적 오프셋 */
    const offsX = [];
    const offsY = [];

    let active = true;

    const RADIUS = 130;   // 영향 반경 (px) — 마우스 주변 좁은 범위만
    const STRENGTH = 0.22; // 속도 → 오프셋 변환 강도
    const DECAY = 0.84;   // 오프셋 감쇠율

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      mouseX = e.clientX - r.left;
      mouseY = e.clientY - r.top;
    };
    const onLeave = () => {
      mouseX = -99999;
      mouseY = -99999;
      velX = 0;
      velY = 0;
    };

    el.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', onLeave);

    const tick = () => {
      if (!active) return;

      /* 프레임마다 마우스 델타로 속도 계산 (스무딩) */
      if (prevMouseX > -9000 && mouseX > -9000) {
        const dxRaw = mouseX - prevMouseX;
        const dyRaw = mouseY - prevMouseY;
        velX = velX * 0.55 + dxRaw * 0.45;
        velY = velY * 0.55 + dyRaw * 0.45;
      } else {
        velX *= 0.8;
        velY *= 0.8;
      }
      prevMouseX = mouseX;
      prevMouseY = mouseY;

      const positions = positionsRef.current;
      const speed = Math.hypot(velX, velY);

      itemRefs.current.forEach((node, i) => {
        if (!node || !positions[i]) return;
        const pos = positions[i];

        if (!offsX[i]) { offsX[i] = 0; offsY[i] = 0; }

        /* 마우스가 실제로 움직일 때만 근처 이미지에 영향 */
        if (speed > 0.4 && mouseX > -9000) {
          const imgCx = pos.x + pos.size / 2;
          const imgCy = pos.y + pos.size / 2;
          const dist = Math.hypot(imgCx - mouseX, imgCy - mouseY);

          /* 2차 감쇠 — RADIUS 밖은 정확히 0 */
          const t = Math.max(0, 1 - dist / RADIUS);
          const influence = t * t;

          offsX[i] += velX * influence * STRENGTH;
          offsY[i] += velY * influence * STRENGTH;
        }

        /* 항상 감쇠해 원위치로 복귀 */
        offsX[i] *= DECAY;
        offsY[i] *= DECAY;

        node.style.transform = `translate(${offsX[i].toFixed(2)}px, ${offsY[i].toFixed(2)}px) rotate(${pos.rotate}deg)`;
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
  }, []); // mount 시 한 번

  return (
    <Box
      ref={containerRef}
      sx={{ position: 'relative', height: '100vh', overflow: 'hidden' }}
    >
      {/* Layer 1: 호버된 이미지 블러 배경 */}
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
            opacity: hoverIdx === i ? 0.35 : 0,
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
