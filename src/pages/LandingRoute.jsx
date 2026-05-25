import { useNavigate } from 'react-router-dom';
import LandingPage from '../components/templates/LandingPage';

export function LandingRoute() {
  const navigate = useNavigate();
  return (
    <LandingPage
      onNavigateToSignUp={() => navigate('/signup')}
      onNavigateToLogin={() => navigate('/login')}
    />
  );
}
