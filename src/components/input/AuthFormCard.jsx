import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/**
 * 인증 폼 공통 래퍼 카드
 *
 * Props:
 * @param {string} title - 폼 제목 (예: '로그인') [Required]
 * @param {string} subtitle - 폼 부제목 [Optional]
 * @param {React.ReactNode} children - 폼 내용 [Required]
 * @param {React.ReactNode} footer - 하단 링크/텍스트 슬롯 [Optional]
 *
 * Example usage:
 * <AuthFormCard title="로그인" subtitle="MUSE에 오신 것을 환영합니다">
 *   <LoginForm />
 * </AuthFormCard>
 */
function AuthFormCard({ title, subtitle, children, footer }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        px: 2,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 440,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          p: { xs: 3, sm: 4 },
          bgcolor: 'background.paper',
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 800, letterSpacing: '-0.02em', mb: 3 }}
        >
          MUSE.
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
          {title}
        </Typography>

        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {subtitle}
          </Typography>
        )}

        {children}

        {footer && (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            {footer}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default AuthFormCard;
