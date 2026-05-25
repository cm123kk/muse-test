import { useNavigate, Navigate } from 'react-router-dom';
import SignUpPage from '../components/templates/SignUpPage';
import { useAuthContext } from '../contexts/AuthContext';

export function SignUpRoute() {
  const navigate = useNavigate();
  const { user, loading } = useAuthContext();

  if (!loading && user) {
    return <Navigate to="/archive" replace />;
  }

  return (
    <SignUpPage
      onSignUpSuccess={() => navigate('/archive', { replace: true })}
      onNavigateToLogin={() => navigate('/login')}
    />
  );
}
