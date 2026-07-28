import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import AuthFormCard from '../input/AuthFormCard';
import SignUpForm from '../input/SignUpForm';

/**
 * Sign-up page template (AuthFormCard + SignUpForm combination)
 *
 * Props:
 * @param {function} onSignUpSuccess - callback on successful sign-up [Optional]
 * @param {function} onNavigateToLogin - callback when the login link is clicked [Optional]
 *
 * Example usage:
 * <SignUpPage
 *   onSignUpSuccess={() => navigate('/archive')}
 *   onNavigateToLogin={() => navigate('/login')}
 * />
 */
function SignUpPage({ onSignUpSuccess, onNavigateToLogin }) {
  return (
    <AuthFormCard
      title="Sign up"
      subtitle="Start for free. No credit card required."
      footer={
        <Typography variant="body2" color="text.secondary">
          Already have an account?{' '}
          <Link
            component="button"
            type="button"
            variant="body2"
            onClick={onNavigateToLogin}
            sx={{ cursor: 'pointer' }}
          >
            Sign in
          </Link>
        </Typography>
      }
    >
      <SignUpForm onSuccess={onSignUpSuccess} />
    </AuthFormCard>
  );
}

export default SignUpPage;
