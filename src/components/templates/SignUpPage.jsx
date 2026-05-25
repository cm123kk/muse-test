import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import AuthFormCard from '../input/AuthFormCard';
import SignUpForm from '../input/SignUpForm';

/**
 * 회원가입 페이지 템플릿 (AuthFormCard + SignUpForm 조합)
 *
 * Props:
 * @param {function} onSignUpSuccess - 가입 성공 시 콜백 [Optional]
 * @param {function} onNavigateToLogin - 로그인 링크 클릭 시 콜백 [Optional]
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
      title="회원가입"
      subtitle="무료로 시작하세요. 신용카드 없이."
      footer={
        <Typography variant="body2" color="text.secondary">
          이미 계정이 있으신가요?{' '}
          <Link
            component="button"
            type="button"
            variant="body2"
            onClick={onNavigateToLogin}
            sx={{ cursor: 'pointer' }}
          >
            로그인
          </Link>
        </Typography>
      }
    >
      <SignUpForm onSuccess={onSignUpSuccess} />
    </AuthFormCard>
  );
}

export default SignUpPage;
