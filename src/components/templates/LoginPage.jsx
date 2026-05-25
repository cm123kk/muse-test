import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import AuthFormCard from '../input/AuthFormCard';
import LoginForm from '../input/LoginForm';

/**
 * 로그인 페이지 템플릿 (AuthFormCard + LoginForm 조합)
 *
 * Props:
 * @param {function} onLoginSuccess - 로그인 성공 시 콜백 [Optional]
 * @param {function} onNavigateToSignUp - 회원가입 링크 클릭 시 콜백 [Optional]
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
      title="로그인"
      subtitle="MUSE에 오신 것을 환영합니다."
      footer={
        <Typography variant="body2" color="text.secondary">
          계정이 없으신가요?{' '}
          <Link
            component="button"
            type="button"
            variant="body2"
            onClick={onNavigateToSignUp}
            sx={{ cursor: 'pointer' }}
          >
            회원가입
          </Link>
        </Typography>
      }
    >
      <LoginForm onSuccess={onLoginSuccess} />
    </AuthFormCard>
  );
}

export default LoginPage;
