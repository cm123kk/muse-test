import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuthContext } from '../../contexts/AuthContext';

/**
 * Protection layer for routes that require authentication
 *
 * - While checking the session: full-screen spinner
 * - Not logged in: redirect to /login (preserving the original path in state.from)
 * - Logged in: render the Outlet
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
