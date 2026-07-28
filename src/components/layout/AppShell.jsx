import { forwardRef } from 'react';
import Box from '@mui/material/Box';
import { GNB } from '../navigation/GNB';

/**
 * AppShell component
 *
 * A responsive layout shell composed of the GNB (header) and a main area.
 * The GNB handles the responsive navigation (Header + Drawer).
 *
 * Props:
 * @param {node} logo - Logo area (always visible) [Optional]
 * @param {node} headerPersistent - Element always shown in the header [Optional]
 * @param {node} headerCollapsible - Element that moves into the drawer on mobile [Optional]
 * @param {node} drawerHeader - Custom element at the top of the drawer [Optional]
 * @param {node} drawerFooter - Custom element at the bottom of the drawer [Optional]
 * @param {node} children - Main content area [Required]
 * @param {string} breakpoint - Responsive switch breakpoint ('sm' | 'md' | 'lg') [Optional, default: 'md']
 * @param {number} headerHeight - Header height (px) [Optional, default: 64]
 * @param {number} drawerWidth - Drawer width (px) [Optional, default: 280]
 * @param {boolean} hasHeaderBorder - Header bottom border [Optional, default: true]
 * @param {boolean} isHeaderSticky - Sticky header [Optional, default: true]
 * @param {boolean} isHeaderTransparent - Transparent header background [Optional, default: false]
 * @param {boolean} isHeaderGhost - Header ghost mode (removes background, border, and blur) [Optional, default: false]
 * @param {object} sx - Additional styles [Optional]
 *
 * Example usage:
 * <AppShell
 *   logo={<Logo />}
 *   headerPersistent={<SearchBar />}
 *   headerCollapsible={<NavMenu items={menuItems} />}
 *   breakpoint="md"
 * >
 *   <MainContent />
 * </AppShell>
 */
const AppShell = forwardRef(function AppShell({
  logo,
  headerPersistent,
  headerCollapsible,
  drawerHeader,
  drawerFooter,
  children,
  breakpoint = 'md',
  headerHeight = 64,
  drawerWidth = 280,
  hasHeaderBorder = true,
  isHeaderSticky = true,
  isHeaderTransparent = false,
  isHeaderGhost = false,
  sx,
  ...props
}, ref) {
  return (
    <Box
      ref={ref}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        ...sx,
      }}
      {...props}
    >
      {/* GNB */}
      <GNB
        logo={logo}
        navContent={headerCollapsible}
        persistent={headerPersistent}
        drawerHeader={drawerHeader}
        drawerFooter={drawerFooter}
        breakpoint={breakpoint}
        height={headerHeight}
        drawerWidth={drawerWidth}
        hasBorder={hasHeaderBorder}
        isSticky={isHeaderSticky}
        isTransparent={isHeaderTransparent}
        isGhost={isHeaderGhost}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </Box>
    </Box>
  );
});

export { AppShell };
