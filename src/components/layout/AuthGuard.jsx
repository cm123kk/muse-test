import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuthContext } from '../../contexts/AuthContext';

/**
 * 인증 필요 라우트 보호 레이어
 *
 * - 세션 확인 중: 전체화면 스피너
 * - 비로그인: /login 리다이렉트 (원래 경로를 state.from 에 보존)
 * - 로그인: Outlet 렌더
 *
 * Example usage:
 * <Route element={<AuthGuard />}>
 *   <Route path="/archive" element={<ArchiveRoute />} />
 * </Route>
 */
function AuthGuard() {
  const { user, loading } = useAuthContext();
  const location = useLocation();

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export default AuthGuard;
