import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { AppShell } from './AppShell';
import { NavMenu } from '../navigation/NavMenu';
import { DocumentTitle, PageContainer } from '../storybookDocumentation';
import { SectionContainer } from '../container/SectionContainer';
import Placeholder from '../../common/ui/Placeholder';

// Navigation Items
const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'products', label: 'Products' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

export default {
  title: 'Component/8. Layout/AppShell',
  component: AppShell,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * ## Basic Usage
 *
 * A responsive application shell.
 * On mobile it automatically switches to a drawer menu.
 */
export const Default = {
  render: () => (
    <PageContainer>
      <DocumentTitle
        title="AppShell"
        status="Ready"
        note="Responsive application shell component"
        brandName="Navigation"
        systemName="AppShell"
        version="1.0"
      />
      <SectionContainer>
        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden', height: 400 }}>
          <AppShell
            logo={
              <Typography variant="h6" fontWeight={700} sx={{ letterSpacing: '-0.5px' }}>
                Brand
              </Typography>
            }
            headerPersistent={
              <IconButton size="small">
                <AccountCircleIcon />
              </IconButton>
            }
            headerCollapsible={
              <NavMenu
                items={navItems}
                activeId="home"
                variant="underline"
              />
            }
          >
            <Box sx={{ p: 4 }}>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Welcome to Dashboard
              </Typography>
              <Typography color="text.secondary">
                Try resizing the screen. On mobile, the navigation switches to a drawer menu.
              </Typography>
            </Box>
          </AppShell>
        </Box>
      </SectionContainer>
    </PageContainer>
  ),
};

/**
 * ## Combined Features
 *
 * A full feature example including search, CTA button, drawer footer, and more.
 */
export const FullFeatured = {
  render: () => (
    <PageContainer>
      <DocumentTitle
        title="AppShell - Full Featured"
        status="Ready"
        note="Full configuration example with various features"
        brandName="Navigation"
        systemName="AppShell"
        version="1.0"
      />
      <SectionContainer>
        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden', height: 500 }}>
          <AppShell
            logo={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1,
                    backgroundColor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  SK
                </Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  Starter Kit
                </Typography>
              </Box>
            }
            headerPersistent={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton size="small">
                  <SearchIcon />
                </IconButton>
                <Button variant="contained" size="small" sx={{ display: { xs: 'none', sm: 'flex' } }}>
                  Get Started
                </Button>
              </Box>
            }
            headerCollapsible={
              <NavMenu
                items={navItems}
                activeId="home"
                variant="underline"
              />
            }
            drawerFooter={
              <Button variant="contained" fullWidth>
                Get Started
              </Button>
            }
            breakpoint="lg"
          >
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'grey.50',
              }}
            >
              <Box sx={{ textAlign: 'center', p: 4 }}>
                <Typography variant="h3" fontWeight={700} gutterBottom>
                  Home Page
                </Typography>
                <Typography color="text.secondary" sx={{ maxWidth: 400 }}>
                  This is the main content area. AppShell provides a responsive header and automatic drawer conversion.
                </Typography>
              </Box>
            </Box>
          </AppShell>
        </Box>
      </SectionContainer>
    </PageContainer>
  ),
};

/**
 * ## Transparent Header
 *
 * A transparent header mode suitable for Hero sections.
 */
export const TransparentHeader = {
  render: () => (
    <PageContainer>
      <DocumentTitle
        title="AppShell - Transparent Header"
        status="Ready"
        note="Transparent header mode suitable for Hero sections"
        brandName="Navigation"
        systemName="AppShell"
        version="1.0"
      />
      <SectionContainer>
        <Box sx={{ borderRadius: 2, overflow: 'hidden', height: 400 }}>
          <AppShell
            logo={
              <Typography variant="h6" fontWeight={700} sx={{ color: 'white' }}>
                Brand
              </Typography>
            }
            headerCollapsible={
              <NavMenu
                items={navItems}
                activeId="home"
                sx={{ '& button': { color: 'white' } }}
              />
            }
            isHeaderTransparent
            hasHeaderBorder={false}
          >
            <Placeholder.Box
              label="Hero Section"
              sx={ {
                flex: 1,
                backgroundColor: 'grey.800',
                border: 'none',
                color: 'white',
                '& .MuiTypography-root': { color: 'white', fontSize: '1rem' },
              } }
            />
          </AppShell>
        </Box>
      </SectionContainer>
    </PageContainer>
  ),
};
