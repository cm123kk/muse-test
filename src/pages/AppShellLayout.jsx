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
 * GNB 우측 사용자 메뉴
 *
 * 표시: 라이트/다크 토글 아이콘 + 아바타.
 * 아바타 클릭 시 메뉴(로그인 계정 + 설정 + 로그아웃) 노출.
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
    updateSettings({ themeMode: next });      // 즉시 반영 (store)
    updateUserSettings({ theme_mode: next }); // DB 영속 (리로드 후 유지)
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
      {/* 라이트/다크 토글 */}
      <Tooltip title={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}>
        <IconButton size="small" onClick={handleToggleTheme} aria-label="테마 전환">
          {/* 현재 모드를 표시: 라이트면 해, 다크면 달 */}
          {isDark ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
        </IconButton>
      </Tooltip>

      {/* 아바타 → 계정 메뉴 */}
      <Tooltip title="계정">
        <IconButton
          size="small"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          aria-label="계정 메뉴 열기"
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
            로그인 계정
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
          설정
        </MenuItem>
        <MenuItem onClick={handleSignOut} disabled={loading}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          {loading ? '로그아웃 중…' : '로그아웃'}
        </MenuItem>
      </Menu>
    </Box>
  );
}

/**
 * AppShellLayout — 라우트 공통 레이아웃 + keep-alive
 *
 * 라우트 이동마다 컴포넌트가 unmount/remount 되며 발생하는 이미지 깜빡임을 막기 위해
 * 핵심 탐색 라우트(/archive, /projects)를 항상 마운트한 상태로 두고 display 만 토글한다.
 * 그 외 라우트(/projects/new, /projects/:id, /settings)는 일반 Outlet 으로 흐른다.
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
