import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ScatterGallery } from '../media/ScatterGallery.jsx';

const imageModules = import.meta.glob('/src/assets/example/*.{jpg,jpeg}', { eager: true });
const EXAMPLE_IMAGES = Object.values(imageModules).map((m) => m.default);

/**
 * HeroSection 컴포넌트
 * Scattered layout 배경 위에 MUSE 브랜드 카피와 CTA를 표시하는 랜딩 히어로 섹션.
 * 개별 이미지 hover 시 해당 이미지의 블러 버전이 배경 전체에 fade-in된다.
 *
 * Props:
 * @param {function} onNavigateToSignUp - 시작하기 버튼 클릭 시 콜백 [Optional]
 * @param {function} onNavigateToLogin - 로그인 버튼 클릭 시 콜백 [Optional]
 * @param {number} centerKeepout - 중앙 텍스트 보호 반경(px) [Optional, 기본값: 240]
 *
 * Example usage:
 * <HeroSection
 *   onNavigateToSignUp={() => navigate('/signup')}
 *   onNavigateToLogin={() => navigate('/login')}
 * />
 */
function HeroSection({ onNavigateToSignUp, onNavigateToLogin, centerKeepout = 240 }) {
  const [hoveredSrc, setHoveredSrc] = useState(null);

  const handleHoverSrc = useCallback((src) => {
    setHoveredSrc(src);
  }, []);

  return (
    <Box sx={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      {/* Layer 1: 개별 hover 이미지 블러 배경 */}
      <Box sx={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
        {EXAMPLE_IMAGES.map((src) => (
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
              opacity: hoveredSrc === src ? 0.5 : 0,
              transition: 'opacity 0.4s ease',
            }}
          />
        ))}
      </Box>

      {/* Layer 2: Scattered 이미지 */}
      <Box sx={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <ScatterGallery
          images={EXAMPLE_IMAGES}
          centerKeepout={centerKeepout}
          thumbnailMin={80}
          thumbnailMax={160}
          cursorRadius={300}
          maxShift={18}
          gridCols={6}
          gridRows={5}
          onHoverSrc={handleHoverSrc}
          sx={{ width: '100%', height: '100%' }}
        />
      </Box>

      {/* Layer 3: Center content */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
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
            sx={{
              fontSize: { xs: '1rem', md: '1.25rem' },
              mb: 5,
              maxWidth: 480,
              mx: 'auto',
            }}
          >
            바이브 디자인을 위한 영감을 관리하세요.
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              onClick={onNavigateToSignUp}
              sx={{ px: 5 }}
            >
              시작하기
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={onNavigateToLogin}
              sx={{ px: 5 }}
            >
              로그인
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

export default HeroSection;
