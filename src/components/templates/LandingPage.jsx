import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';

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
 * 랜딩 페이지 템플릿
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
      {/* 상단 바 */}
      <Box
        component="header"
        sx={{
          px: { xs: 3, md: 6 },
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
          MUSE.
        </Typography>
        <Button variant="text" size="small" onClick={onNavigateToLogin}>
          로그인
        </Button>
      </Box>

      {/* Hero */}
      <Box
        sx={{
          px: { xs: 3, md: 8 },
          pt: { xs: 10, md: 14 },
          pb: { xs: 8, md: 12 },
          maxWidth: 900,
          mx: 'auto',
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2.75rem', md: '4.5rem' },
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
            mb: 3,
          }}
        >
          영감을 수집하고,<br />
          AI가 디자인 토큰으로 만든다.
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontSize: { xs: '1rem', md: '1.125rem' }, mb: 5, maxWidth: 560 }}
        >
          레퍼런스 이미지를 올리면 Claude가 색상, 레이아웃, 타이포그래피를 분석해
          바로 쓸 수 있는 MUI 테마를 만들어줍니다.
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            size="large"
            onClick={onNavigateToSignUp}
            sx={{ px: 4 }}
          >
            무료로 시작하기
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={onNavigateToLogin}
            sx={{ px: 4 }}
          >
            로그인
          </Button>
        </Stack>
      </Box>

      {/* Features */}
      <Box
        sx={{
          px: { xs: 3, md: 8 },
          pb: { xs: 10, md: 14 },
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
