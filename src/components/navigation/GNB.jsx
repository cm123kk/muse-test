import { useState, forwardRef, createContext, useContext } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

/**
 * GNB Context
 */
const GNBContext = createContext({
  isDrawerOpen: false,
  toggleDrawer: () => {},
  closeDrawer: () => {},
  isMobile: false,
});

export const useGNB = () => useContext(GNBContext);

/**
 * GNB component
 *
 * Responsive GNB (Global Navigation Bar).
 * On desktop it shows the navigation in the header,
 * and on mobile it switches to a hamburger menu plus a drawer.
 *
 * Props:
 * @param {node} logo - Logo area (always visible) [Optional]
 * @param {node} navContent - Navigation content (target of the responsive switch) [Optional]
 * @param {node} persistent - Element that is always shown in the header [Optional]
 * @param {node} drawerHeader - Custom element at the top of the drawer [Optional]
 * @param {node} drawerFooter - Custom element at the bottom of the drawer [Optional]
 * @param {string} breakpoint - Responsive switch breakpoint ('sm' | 'md' | 'lg') [Optional, default: 'md']
 * @param {number} height - Header height (px) [Optional, default: 64]
 * @param {number} drawerWidth - Drawer width (px) [Optional, default: 280]
 * @param {boolean} hasBorder - Header bottom border [Optional, default: true]
 * @param {boolean} isSticky - Sticky header [Optional, default: true]
 * @param {boolean} isTransparent - Transparent header background [Optional, default: false]
 * @param {boolean} isGhost - Ghost mode (removes background, border, and blur so only the content floats) [Optional, default: false]
 * @param {object} sx - Additional styles [Optional]
 *
 * Example usage:
 * <GNB
 *   logo={<Logo />}
 *   navContent={<NavMenu items={menuItems} />}
 *   persistent={<SearchBar />}
 * />
 */
const GNB = forwardRef(function GNB({
  logo,
  navContent,
  persistent,
  drawerHeader,
  drawerFooter,
  breakpoint = 'md',
  height = 64,
  drawerWidth = 280,
  hasBorder = true,
  isSticky = true,
  isTransparent = false,
  isGhost = false,
  sx,
  ...props
}, ref) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(breakpoint));

  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);
  const closeDrawer = () => setIsDrawerOpen(false);

  /**
   * Header styles
   */
  const headerStyles = {
    position: isSticky ? 'sticky' : 'relative',
    top: 0,
    left: 0,
    right: 0,
    zIndex: theme.zIndex.appBar,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height,
    px: { xs: 2, sm: 3, md: 4 },
    backgroundColor: isGhost ? 'transparent' : (isTransparent ? 'transparent' : 'background.paper'),
    borderBottom: !isGhost && hasBorder ? '1px solid' : 'none',
    borderColor: 'divider',
    backdropFilter: isGhost ? 'none' : (isTransparent ? 'blur(12px)' : 'none'),
    ...sx,
  };

  /**
   * Drawer content
   */
  const renderDrawerContent = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: drawerWidth,
      }}
    >
      {/* Drawer Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height,
          px: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          flexShrink: 0,
        }}
      >
        {drawerHeader || logo}
        <IconButton
          onClick={closeDrawer}
          size="small"
          aria-label="Close menu"
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Drawer Content */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          py: 2,
          px: 2,
        }}
      >
        {navContent}
      </Box>

      {/* Drawer Footer */}
      {drawerFooter && (
        <Box
          sx={{
            p: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            flexShrink: 0,
          }}
        >
          {drawerFooter}
        </Box>
      )}
    </Box>
  );

  return (
    <GNBContext.Provider value={{ isDrawerOpen, toggleDrawer, closeDrawer, isMobile }}>
      {/* Header */}
      <Box ref={ref} component="header" sx={headerStyles} {...props}>
        {/* Left: Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {logo}
        </Box>

        {/* Right: Navigation */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Persistent (always visible) */}
          {persistent}

          {/* Desktop: Show navContent */}
          {!isMobile && navContent}

          {/* Mobile: Hamburger menu */}
          {isMobile && navContent && (
            <IconButton
              onClick={toggleDrawer}
              size="medium"
              aria-label="Open menu"
              aria-expanded={isDrawerOpen}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={closeDrawer}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        {renderDrawerContent()}
      </Drawer>
    </GNBContext.Provider>
  );
});

export { GNB };
