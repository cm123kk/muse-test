import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';

import { defaultTheme, darkTheme } from './styles/themes';
import { MuseStoreProvider, useSettingsSlice } from './store';
import { AuthProvider } from './contexts/AuthContext';
import AuthGuard from './components/layout/AuthGuard';
import {
  ArchiveRoute,
  ProjectListRoute,
  ProjectCreateRoute,
  ProjectDetailRoute,
  SettingsRoute,
  AppShellLayout,
  LandingRoute,
  LoginRoute,
  SignUpRoute,
} from './pages';

/** Subscribes to settings.themeMode to select the light/dark/system theme (system: follows the OS prefers-color-scheme) */
function ThemedApp({ children }) {
  const { settings } = useSettingsSlice();
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const mode = settings?.themeMode || 'system';
  const resolvedDark = mode === 'system' ? prefersDark : mode === 'dark';
  const theme = resolvedDark ? darkTheme : defaultTheme;
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

function App() {
  return (
    <MuseStoreProvider>
      <ThemedApp>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public routes (no authentication required) */}
              <Route path="/" element={<LandingRoute />} />
              <Route path="/login" element={<LoginRoute />} />
              <Route path="/signup" element={<SignUpRoute />} />

              {/* Protected routes (login required) */}
              <Route element={<AuthGuard />}>
                <Route element={<AppShellLayout />}>
                  {/* /archive and /projects are keep-alive mounted inside AppShellLayout, so no element is specified here */}
                  <Route path="/archive" element={null} />
                  <Route path="/projects" element={null} />
                  <Route path="/projects/new" element={<ProjectCreateRoute />} />
                  <Route path="/projects/:id" element={<ProjectDetailRoute />} />
                  <Route path="/settings" element={<SettingsRoute />} />
                </Route>
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ThemedApp>
    </MuseStoreProvider>
  );
}

export default App;
