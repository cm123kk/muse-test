import { useEffect, useMemo, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const imageModules = import.meta.glob('/src/assets/example/*.{jpg,jpeg}', { eager: true });
const EXAMPLE_IMAGES = Object.values(imageModules).map((m) => m.default);

/* HeroSection 과 동일한 seeded RNG + scatter 생성 로직 */
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
  /* 이미지 크기: 모바일에서 화면 너비 비례로 축소 */
  const SIZE_MIN = Math.min(60, Math.round(w * 0.1));
  const SIZE_MAX = Math.min(95, Math.round(w * 0.14));
  const PAD = 14;
  const PAD_TOP = 72;
  /* 직사각형 keepout: 텍스트 블록 영역만 정확히 제외, 좌우에도 이미지 배치 가능 */
  /* KEEPOUT_X/Y: 뷰포트 비례로 계산해 어떤 화면 크기에서도 균등 배치 보장 */
  const KEEPOUT_X = Math.min(Math.round(w * 0.22), 320);
  const KEEPOUT_Y = Math.min(Math.round(h * 0.25), 195);
  const COLS = 8;
  const ROWS = 5;
  const cx = w / 2;
  const cy = h / 2;

  const cellW = (w - PAD * 2) / COLS;
  const cellH = (h - PAD_TOP - PAD) / ROWS;

  /* keepout 제외 셀 수집 (raster 순서 유지 = 그리드 전체에 고르게 분포) */
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

  /* 고른 배치: 전체 셀을 count 개 버킷으로 나눠 버킷당 1개 선택 */
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
 * FooterCtaSection 컴포넌트
 *
 * 랜딩페이지 최하단 CTA 섹션. HeroSection 이미지 scatter + 마우스 parallax 응용.
 * hover 배경 블러 없음. scrollProgress 없음(이미지가 scatter 위치에 고정).
 *
 * Props:
 * @param {function} onNavigateToSignUp - 지금 시작하기 버튼 콜백 [Optional]
 * @param {function} onNavigateToLogin - 이미 계정이 있나요 콜백 [Optional]
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

      itemRefs.current.forEach((node, i) => {
        if (!node || !sPositions[i]) return;
        const sPos = sPositions[i];
        if (!offsX[i]) { offsX[i] = 0; offsY[i] = 0; }

        /* 마우스 proximity parallax */
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
      {/* 이미지 scatter (마우스 parallax만, 배경 hover 없음) */}
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

      {/* CTA 텍스트 + 버튼 */}
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
            오늘 본 레퍼런스,<br />그대로 흘려보내지 마세요.
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: { xs: '0.8rem', md: '0.95rem' }, mb: 5, maxWidth: 420, mx: 'auto', lineHeight: 1.7 }}
          >
            이메일 하나면 충분합니다. 첫 프로젝트의 결정 로그까지 30 초 안에 받아보실 수 있어요.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={onNavigateToSignUp}
              sx={{ px: 5 }}
            >
              지금 시작하기
            </Button>
            <Button
              variant="text"
              size="small"
              onClick={onNavigateToLogin}
              sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
            >
              이미 계정이 있나요?
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default FooterCtaSection;
