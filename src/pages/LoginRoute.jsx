import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import LoginPage from '../components/templates/LoginPage';
import { useAuthContext } from '../contexts/AuthContext';

export function LoginRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuthContext();

  if (!loading && user) {
    const from = location.state?.from?.pathname || '/archive';
    return <Navigate to={from} replace />;
  }

  return (
    <LoginPage
      onLoginSuccess={() => {
        const from = location.state?.from?.pathname || '/archive';
        navigate(from, { replace: true });
      }}
      onNavigateToSignUp={() => navigate('/signup')}
    />
  );
}
