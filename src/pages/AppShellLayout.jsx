import { useEffect } from 'react';
import { Outlet, useMatch, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import LogoutIcon from '@mui/icons-material/Logout';
import { AppShell } from '../components/layout/AppShell.jsx';
import { MuseNav } from './MuseNav.jsx';
import { ArchiveRoute } from './ArchiveRoute.jsx';
import { ProjectListRoute } from './ProjectListRoute.jsx';
import { preloadImages, evictUnused } from '../utils/imagePreloadCache.js';
import { useReferences } from '../hooks/data/useReferences.js';
import { useAuthContext } from '../contexts/AuthContext.jsx';
import { useSignOut } from '../hooks/auth/useSignOut.js';

/**
 * GNB 우측 사용자 메뉴: 이메일 + 로그아웃 버튼
 */
function UserMenu() {
  const { user } = useAuthContext();
  const { signOut, loading } = useSignOut();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  const displayEmail = user?.email || '';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: { xs: 'none', sm: 'block' } }}
      >
        {displayEmail}
      </Typography>
      <Tooltip title="로그아웃">
        <IconButton
          size="small"
          onClick={handleSignOut}
          disabled={loading}
          aria-label="로그아웃"
        >
          <LogoutIcon fontSize="small" />
        </IconButton>
      </Tooltip>
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
