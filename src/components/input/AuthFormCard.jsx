import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/**
 * Shared wrapper card for auth forms
 *
 * Props:
 * @param {string} title - form title (e.g. 'Sign in') [Required]
 * @param {string} subtitle - form subtitle [Optional]
 * @param {React.ReactNode} children - form content [Required]
 * @param {React.ReactNode} footer - slot for bottom link/text [Optional]
 *
 * Example usage:
 * <AuthFormCard title="Sign in" subtitle="Welcome to MUSE">
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
