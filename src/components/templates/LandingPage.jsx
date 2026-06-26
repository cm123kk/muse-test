import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { GNB } from '../navigation/GNB';
import HeroSection from './HeroSection';
import SolutionOneSection from './SolutionOneSection';
import TagMarqueeSection from './TagMarqueeSection';
import SolutionTwoSection from './SolutionTwoSection';
import FooterCtaSection from './FooterCtaSection';
import AuthModal from '../overlay-feedback/AuthModal';

/**
 * LandingPage 템플릿
 *
 * Props:
 * @param {function} onNavigateToSignUp - 회원가입/시작하기 성공 시 콜백 [Optional]
 *
 * Example usage:
 * <LandingPage onNavigateToSignUp={() => navigate('/signup')} />
 */
function LandingPage({ onNavigateToSignUp }) {
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
      {/* 전역 GNB: 랜딩 전체 sticky. ghost 모드(배경/보더 제거) + 로고 + 시작하기 CTA */}
      <GNB
        isGhost
        logo={
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: 'text.primary', letterSpacing: '-0.02em' }}
          >
            MUSE
          </Typography>
        }
        persistent={
          <Button variant="contained" onClick={openSignUp}>
            시작하기
          </Button>
        }
      />

      {/* 히어로 + 브릿지 전환 구간: 200vh 스크롤 공간, hero는 sticky */}
      <Box sx={{ height: '200vh', position: 'relative' }} ref={scrollRef}>
        <Box sx={{ position: 'sticky', top: 0, height: '100vh' }}>
          <HeroSection
            onNavigateToSignUp={openSignUp}
            scrollProgress={scrollProgress}
          />
        </Box>
      </Box>

      {/* Solution 1 */}
      <SolutionOneSection />

      {/* T1 태그 마퀴 (3행 교차 방향) */}
      <TagMarqueeSection />

      {/* Solution 2 */}
      <SolutionTwoSection />

      {/* Footer CTA */}
      <FooterCtaSection
        onNavigateToSignUp={openSignUp}
        onNavigateToLogin={openLogin}
      />

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
