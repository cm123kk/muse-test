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
 * LandingPage template
 *
 * Props:
 * @param {function} onNavigateToSignUp - Callback on successful sign-up / get started [Optional]
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
      {/* Global GNB: sticky across the whole landing. Ghost mode (background/border removed) + logo + get started CTA */}
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
            Get Started
          </Button>
        }
      />

      {/* Hero + bridge transition zone: 200vh of scroll space, hero is sticky */}
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

      {/* T1 tag marquee (3 rows, alternating directions) */}
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
