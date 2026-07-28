import { createContext, useContext } from 'react';
import { useAuth } from '../hooks/auth/useAuth';

const AuthContext = createContext({ user: null, session: null, loading: true });

export function AuthProvider({ children }) {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => useContext(AuthContext);

/** Storybook / test only. Injects a mock user without a real Supabase session. */
const MOCK_USER = { id: 'mock-uid-0001', email: 'demo@muse.test' };
const MOCK_AUTH = { user: MOCK_USER, session: { user: MOCK_USER }, loading: false };

export function MockAuthProvider({ children }) {
  return (
    <AuthContext.Provider value={MOCK_AUTH}>
      {children}
    </AuthContext.Provider>
  );
}
