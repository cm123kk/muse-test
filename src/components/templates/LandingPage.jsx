import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import HeroSection from './HeroSection';
import AuthModal from '../overlay-feedback/AuthModal';

const FEATURES = [
  {
    label: '레퍼런스 수집',
    description: '이미지를 드래그하거나 붙여넣어 영감 아카이브를 만든다.',
  },
  {
    label: 'AI 자동 태깅',
    description: 'Claude가 색상, 레이아웃, 타이포그래피 등 5개 레이어를 자동 분석한다.',
  },
  {
    label: '디자인 토큰 추출',
    description: '레퍼런스 묶음에서 바로 쓸 수 있는 MUI 테마 토큰을 생성한다.',
  },
];

/**
 * LandingPage 템플릿
 *
 * Props:
 * @param {function} onNavigateToSignUp - 회원가입 버튼 클릭 시 콜백 [Optional]
 * @param {function} onNavigateToLogin - 로그인 버튼 클릭 시 콜백 [Optional]
 *
 * Example usage:
 * <LandingPage
 *   onNavigateToSignUp={() => navigate('/signup')}
 *   onNavigateToLogin={() => navigate('/login')}
 * />
 */
function LandingPage({ onNavigateToSignUp, onNavigateToLogin }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [authModal, setAuthModal] = useState({ open: false, tab: 'signup' });
  const scrollRef = useRef(null);

  const openSignUp = () => setAuthModal({ open: true, tab: 'signup' });
  const openLogin = () => setAuthModal({ open: true, tab: 'login' });
  const closeModal = () => setAuthModal((s) => ({ ...s, open: false }));

  useEffect(() => {
    const onScroll = () => {
      /* scrollProgress: 0 = hero top, 1 = bridge fully transitioned */
      const sp = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
      setScrollProgress(sp);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {/* 히어로 + 브릿지 전환 구간: 200vh 스크롤 공간, hero는 sticky */}
      <Box sx={{ height: '200vh', position: 'relative' }} ref={scrollRef}>
        <Box sx={{ position: 'sticky', top: 0, height: '100vh' }}>
          <HeroSection
            onNavigateToSignUp={openSignUp}
            scrollProgress={scrollProgress}
          />
        </Box>
      </Box>

      {/* Features */}
      <Box
        sx={{
          px: { xs: 3, md: 8 },
          py: { xs: 10, md: 14 },
          maxWidth: 900,
          mx: 'auto',
        }}
      >
        <Grid container spacing={4}>
          {FEATURES.map((feature, index) => (
            <Grid key={index} size={{ xs: 12, md: 4 }}>
              <Typography
                variant="overline"
                color="text.disabled"
                sx={{ letterSpacing: '0.08em' }}
              >
                0{index + 1}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 0.5, mb: 1 }}>
                {feature.label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {feature.description}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
      <AuthModal
        isOpen={authModal.open}
        initialTab={authModal.tab}
        onClose={closeModal}
        onSuccess={onNavigateToSignUp}
      />
    </Box>
  );
}

export default LandingPage;
