import { useEffect, useMemo, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const imageModules = import.meta.glob('/src/assets/example/*.{jpg,jpeg}', { eager: true });
const EXAMPLE_IMAGES = Object.values(imageModules).map((m) => m.default);

const MARQUEE_SIZE = 64;
const MARQUEE_SPEED = 60; // px/s (한 방향 이동 속도)

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

/* 마퀴 타겟 위치: 3행, 트랙 너비 = w + MARQUEE_SIZE (out-of-screen 랩어라운드 기준) */
function generateMarqueePositions(count, w, h) {
  const ROW_Y = [h * 0.22, h * 0.5, h * 0.78];
  const rowCounts = [0, 0, 0];
  for (let i = 0; i < count; i++) rowCounts[i % 3]++;

  const colIdx = [0, 0, 0];
  return Array.from({ length: count }, (_, i) => {
    const row = i % 3;
    const col = colIdx[row]++;
    const n = rowCounts[row];
    /* 트랙 = w + MARQUEE_SIZE → 이미지가 완전히 화면 밖에서 랩어라운드 */
    const trackW = w + MARQUEE_SIZE;
    const spacing = trackW / n;
    const x = col * spacing + (spacing - MARQUEE_SIZE) / 2;
    const y = ROW_Y[row] - MARQUEE_SIZE / 2;
    return { x, y, row, n };
  });
}

/**
 * HeroSection 컴포넌트
 *
 * Props:
 * @param {function} onNavigateToSignUp - 시작하기 버튼 클릭 시 콜백 [Optional]
 * @param {number} scrollProgress - 0~1 스크롤 진행도 (LandingPage에서 전달) [Optional]
 *
 * Example usage:
 * <HeroSection onNavigateToSignUp={() => navigate('/signup')} scrollProgress={sp} />
 */
function HeroSection({ onNavigateToSignUp, scrollProgress = 0 }) {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [hoverIdx, setHoverIdx] = useState(-1);

  const containerRef = useRef(null);
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
    /* 행별 마퀴 오프셋 (px, 부호가 방향 결정) */
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
      const h = window.innerHeight;

      /* sp 구간별 파생 값 */
      const lerpSp = Math.min(sp / 0.8, 1);          // 0→1 as sp 0→0.8 (위치 이동)
      const marqueeSp = Math.max(0, (sp - 0.75) / 0.25); // 0→1 as sp 0.75→1.0 (마퀴 속도 램프업)

      /* 행별 마퀴 오프셋 누적 */
      const speed = MARQUEE_SPEED * marqueeSp;
      marqueeOffsets[0] -= speed * dt; // 좌
      marqueeOffsets[1] += speed * dt; // 우
      marqueeOffsets[2] -= speed * dt; // 좌

      /* 마우스 속도 */
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

        /* 마우스 proximity 효과 (scatter 구간에서만) */
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

        /* 마퀴 X: 오프셋 적용 후 out-of-screen 랩어라운드 */
        const trackW = w + MARQUEE_SIZE;
        const dir = mPos.row === 1 ? 1 : -1;
        let rawMarqX = mPos.x + marqueeOffsets[mPos.row];

        if (dir < 0) {
          /* 좌: 완전히 화면 밖 왼쪽 → 화면 밖 오른쪽에서 등장 */
          while (rawMarqX < -MARQUEE_SIZE) rawMarqX += trackW;
          while (rawMarqX > w) rawMarqX -= trackW;
        } else {
          /* 우: 완전히 화면 밖 오른쪽 → 화면 밖 왼쪽에서 등장 */
          while (rawMarqX > w) rawMarqX -= trackW;
          while (rawMarqX < -MARQUEE_SIZE) rawMarqX += trackW;
        }

        /* scatter → marquee 위치 lerp */
        const staticTargetDx = mPos.x - sPos.x;
        const staticTargetDy = mPos.y - sPos.y;
        const movingTargetDx = rawMarqX - sPos.x;
        const movingTargetDy = mPos.y - sPos.y;

        const finalDx = (staticTargetDx + (movingTargetDx - staticTargetDx) * marqueeSp) * lerpSp;
        const finalDy = (staticTargetDy + (movingTargetDy - staticTargetDy) * marqueeSp) * lerpSp;

        const rotate = sPos.rotate * (1 - lerpSp);

        node.style.transform = `translate(${(finalDx + offsX[i]).toFixed(2)}px, ${(finalDy + offsY[i]).toFixed(2)}px) rotate(${rotate.toFixed(2)}deg)`;
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

  const heroOpacity = Math.max(0, 1 - scrollProgress * 5);
  const bridgeOpacity = Math.max(0, (scrollProgress - 0.45) / 0.35);

  return (
    <Box
      ref={containerRef}
      sx={{ position: 'relative', height: '100vh', overflow: 'hidden', bgcolor: 'background.default' }}
    >
      {/* Layer 1: 호버 블러 배경 */}
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
            opacity: hoverIdx === i ? 0.35 * (1 - scrollProgress * 3) : 0,
            transition: 'opacity 0.4s ease',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Layer 2: 이미지들 (scatter → marquee) */}
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

      {/* Layer 3: 히어로 중앙 텍스트 */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          opacity: heroOpacity,
          pointerEvents: heroOpacity > 0.05 ? 'auto' : 'none',
        }}
      >
        <Box sx={{ textAlign: 'center', px: 3 }}>
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
          <Button variant="contained" size="large" onClick={onNavigateToSignUp} sx={{ px: 5 }}>
            시작하기
          </Button>
        </Box>
      </Box>

      {/* Layer 4: 브릿지 텍스트 */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          opacity: bridgeOpacity,
          pointerEvents: 'none',
        }}
      >
        <Typography
          sx={{
            textAlign: 'center',
            fontSize: { xs: '1.5rem', md: '2.5rem' },
            fontWeight: 700,
            lineHeight: 1.4,
            color: 'text.primary',
            px: 3,
          }}
        >
          레퍼런스로 만든 ai의 디자인,<br />얼마나 이해하고 계신가요?
        </Typography>
      </Box>
    </Box>
  );
}

export default HeroSection;
