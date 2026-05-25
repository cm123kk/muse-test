import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import HeroSection from './HeroSection';

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
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero */}
      <HeroSection
        onNavigateToSignUp={onNavigateToSignUp}
        onNavigateToLogin={onNavigateToLogin}
      />

      {/* Features */}
      <Box
        sx={{
          px: { xs: 3, md: 8 },
          py: { xs: 10, md: 14 },
          maxWidth: 900,
          mx: 'auto',
        }}
      >
        <Box
          sx={{
            borderTop: '1px solid',
            borderColor: 'divider',
            pt: 6,
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
      </Box>
    </Box>
  );
}

export default LandingPage;
