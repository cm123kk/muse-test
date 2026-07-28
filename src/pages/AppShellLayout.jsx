import { useEffect, useState } from 'react';
import { Outlet, useMatch, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { AppShell } from '../components/layout/AppShell.jsx';
import { MuseNav } from './MuseNav.jsx';
import { useSettingsSlice } from '../store';
import { useUpdateUserSettings } from '../hooks/data/useUserSettings.js';
import { ArchiveRoute } from './ArchiveRoute.jsx';
import { ProjectListRoute } from './ProjectListRoute.jsx';
import { preloadImages, evictUnused } from '../utils/imagePreloadCache.js';
import { useReferences } from '../hooks/data/useReferences.js';
import { useAuthContext } from '../contexts/AuthContext.jsx';
import { useSignOut } from '../hooks/auth/useSignOut.js';

/**
 * User menu on the right side of the GNB
 *
 * Displays: light/dark toggle icon + avatar.
 * Clicking the avatar reveals a menu (signed-in account + settings + sign out).
 */
function UserMenu() {
  const { user } = useAuthContext();
  const { signOut, loading } = useSignOut();
  const navigate = useNavigate();
  const { settings, updateSettings } = useSettingsSlice();
  const { updateUserSettings } = useUpdateUserSettings();
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const [anchorEl, setAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const mode = settings?.themeMode || 'system';
  const isDark = mode === 'system' ? prefersDark : mode === 'dark';

  const handleToggleTheme = () => {
    const next = isDark ? 'light' : 'dark';
    updateSettings({ themeMode: next });      // apply immediately (store)
    updateUserSettings({ theme_mode: next }); // persist to DB (survives reload)
  };

  const handleNavigateSettings = () => {
    setAnchorEl(null);
    navigate('/settings');
  };

  const handleSignOut = async () => {
    setAnchorEl(null);
    await signOut();
    navigate('/login', { replace: true });
  };

  const displayEmail = user?.email || '';
  const avatarUrl = user?.user_metadata?.avatar_url || undefined;
  const initial = displayEmail.charAt(0).toUpperCase() || '?';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {/* Light/dark toggle */}
      <Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
        <IconButton size="small" onClick={handleToggleTheme} aria-label="Toggle theme">
          {/* Show the current mode: sun for light, moon for dark */}
          {isDark ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
        </IconButton>
      </Tooltip>

      {/* Avatar -> account menu */}
      <Tooltip title="Account">
        <IconButton
          size="small"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          aria-label="Open account menu"
          aria-haspopup="true"
          aria-expanded={isMenuOpen}
        >
          <Avatar
            src={avatarUrl}
            sx={{ width: 32, height: 32, fontSize: 14, bgcolor: 'primary.main' }}
          >
            {initial}
          </Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { minWidth: 220, mt: 1 } } }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>
            Signed in as
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: 'break-all' }}>
            {displayEmail}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleNavigateSettings}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleSignOut} disabled={loading}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          {loading ? 'Signing out…' : 'Sign out'}
        </MenuItem>
      </Menu>
    </Box>
  );
}

/**
 * AppShellLayout: shared route layout + keep-alive
 *
 * To prevent image flicker caused by components unmounting/remounting on every route change,
 * the core navigation routes (/archive, /projects) are kept always mounted and only their
 * display is toggled. Other routes (/projects/new, /projects/:id, /settings) flow through the
 * regular Outlet.
 */
export function AppShellLayout() {
  const { data: references } = useReferences();

  useEffect(() => {
    const urls = (references || []).map((r) => r.thumbnail_url).filter(Boolean);
    preloadImages(urls);
    evictUnused(urls);
  }, [references]);

  const isArchive = !!useMatch('/archive');
  const isProjectList = !!useMatch('/projects');
  const showOutlet = !isArchive && !isProjectList;

  return (
    <AppShell
      logo={<MuseNav />}
      headerPersistent={<UserMenu />}
    >
      <Box sx={{ display: isArchive ? 'block' : 'none' }}>
        <ArchiveRoute />
      </Box>
      <Box sx={{ display: isProjectList ? 'block' : 'none' }}>
        <ProjectListRoute />
      </Box>
      {showOutlet && <Outlet />}
    </AppShell>
  );
}
