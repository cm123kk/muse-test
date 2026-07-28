import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import AuthFormCard from '../input/AuthFormCard';
import LoginForm from '../input/LoginForm';

/**
 * Login page template (AuthFormCard + LoginForm combination)
 *
 * Props:
 * @param {function} onLoginSuccess - Callback on successful login [Optional]
 * @param {function} onNavigateToSignUp - Callback when the sign-up link is clicked [Optional]
 *
 * Example usage:
 * <LoginPage
 *   onLoginSuccess={() => navigate('/archive')}
 *   onNavigateToSignUp={() => navigate('/signup')}
 * />
 */
function LoginPage({ onLoginSuccess, onNavigateToSignUp }) {
  return (
    <AuthFormCard
      title="Sign in"
      subtitle="Welcome to MUSE."
      footer={
        <Typography variant="body2" color="text.secondary">
          Don't have an account?{' '}
          <Link
            component="button"
            type="button"
            variant="body2"
            onClick={onNavigateToSignUp}
            sx={{ cursor: 'pointer' }}
          >
            Sign up
          </Link>
        </Typography>
      }
    >
      <LoginForm onSuccess={onLoginSuccess} />
    </AuthFormCard>
  );
}

export default LoginPage;
