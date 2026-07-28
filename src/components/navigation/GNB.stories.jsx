import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import SettingsIcon from '@mui/icons-material/Settings';
import { GNB } from './GNB';
import { NavMenu } from './NavMenu';
import { DocumentTitle, PageContainer } from '../storybookDocumentation';
import { SectionContainer } from '../container/SectionContainer';

export default {
  title: 'Component/10. Navigation/GNB',
  component: GNB,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { id: 'gallery', label: 'Gallery', icon: <PhotoLibraryIcon /> },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
];

const Logo = () => (
  <Typography variant="h6" fontWeight={700} sx={{ letterSpacing: '-0.5px' }}>
    STARTER.
  </Typography>
);

/**
 * ## Default
 * 
 * Default GNB. Includes the logo and navigation menu.
 * Below the breakpoint (md), it switches to a hamburger menu.
 */
export const Default = {
  render: () => (
    <PageContainer>
      <DocumentTitle
        title="GNB"
        status="Ready"
        note="Global Navigation Bar: responsive header and drawer"
        brandName="Navigation"
        systemName="GNB"
        version="1.0"
      />
      <SectionContainer sx={{ py: 0 }}>
        <GNB
          logo={<Logo />}
          navContent={
            <NavMenu
              items={navItems}
              activeId="dashboard"
              variant="underline"
            />
          }
        />
        <Box sx={{ p: 4, bgcolor: 'grey.50', minHeight: 300 }}>
          <Typography color="text.secondary">
            Reduce the browser width to see the responsive transition.
          </Typography>
        </Box>
      </SectionContainer>
    </PageContainer>
  ),
};

/**
 * ## Transparent Header
 * 
 * GNB with a transparent background. Use it when overlaying on top of a hero section.
 */
export const Transparent = {
  render: () => (
    <PageContainer>
      <DocumentTitle
        title="GNB - Transparent"
        status="Ready"
        note="Transparent background with blur effect"
        brandName="Navigation"
        systemName="GNB"
        version="1.0"
      />
      <SectionContainer sx={{ py: 0 }}>
        <Box sx={{ position: 'relative' }}>
          <GNB
            logo={<Logo />}
            navContent={
              <NavMenu
                items={navItems}
                activeId="dashboard"
                variant="underline"
              />
            }
            isTransparent
            hasBorder={false}
          />
          <Box
            sx={{
              height: 400,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h3" color="white" fontWeight={700}>
              Hero Section
            </Typography>
          </Box>
        </Box>
      </SectionContainer>
    </PageContainer>
  ),
};

/**
 * ## Ghost
 *
 * Background, border, and blur all removed. Only the content (logo plus right slot) floats.
 * More minimal than the transparent overlay on a hero. Use it on landing pages.
 */
export const Ghost = {
  render: () => (
    <PageContainer>
      <DocumentTitle
        title="GNB - Ghost"
        status="Ready"
        note="Background, border, and blur all removed (content only)"
        brandName="Navigation"
        systemName="GNB"
        version="1.0"
      />
      <SectionContainer sx={{ py: 0 }}>
        <Box sx={{ position: 'relative' }}>
          <GNB
            logo={<Logo />}
            navContent={
              <NavMenu
                items={navItems}
                activeId="dashboard"
                variant="underline"
              />
            }
            isGhost
          />
          <Box
            sx={{
              height: 400,
              background: 'linear-gradient(135deg, #f5f5f4 0%, #e7e5e4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h3" color="text.secondary" fontWeight={700}>
              Hero Section
            </Typography>
          </Box>
        </Box>
      </SectionContainer>
    </PageContainer>
  ),
};

/**
 * ## With Persistent Elements
 *
 * Use it together with always-visible elements (search bar, profile, etc.).
 */
export const WithPersistent = {
  render: () => (
    <PageContainer>
      <DocumentTitle
        title="GNB - With Persistent"
        status="Ready"
        note="Includes persistent elements"
        brandName="Navigation"
        systemName="GNB"
        version="1.0"
      />
      <SectionContainer sx={{ py: 0 }}>
        <GNB
          logo={<Logo />}
          navContent={
            <NavMenu
              items={navItems}
              activeId="dashboard"
              variant="underline"
            />
          }
          persistent={
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              S
            </Box>
          }
        />
        <Box sx={{ p: 4, bgcolor: 'grey.50', minHeight: 300 }}>
          <Typography color="text.secondary">
            The profile avatar is always shown, even on mobile.
          </Typography>
        </Box>
      </SectionContainer>
    </PageContainer>
  ),
};

/**
 * ## Custom Breakpoint
 * 
 * Change the breakpoint to lg so it switches on wider screens.
 */
export const CustomBreakpoint = {
  render: () => (
    <PageContainer>
      <DocumentTitle
        title="GNB - Custom Breakpoint"
        status="Ready"
        note="breakpoint='lg' setting"
        brandName="Navigation"
        systemName="GNB"
        version="1.0"
      />
      <SectionContainer sx={{ py: 0 }}>
        <GNB
          logo={<Logo />}
          navContent={
            <NavMenu
              items={navItems}
              activeId="dashboard"
              variant="underline"
            />
          }
          breakpoint="lg"
        />
        <Box sx={{ p: 4, bgcolor: 'grey.50', minHeight: 300 }}>
          <Typography color="text.secondary">
            Below lg (1200px), it switches to a hamburger menu.
          </Typography>
        </Box>
      </SectionContainer>
    </PageContainer>
  ),
};

/**
 * ## Props
 */
export const Props = {
  render: () => (
    <PageContainer>
      <DocumentTitle
        title="GNB Props"
        status="Ready"
        note="GNB component props documentation"
        brandName="Navigation"
        systemName="GNB"
        version="1.0"
      />
      <SectionContainer>
        <Box sx={{ overflowX: 'auto' }}>
          <Box
            component="table"
            sx={{
              width: '100%',
              borderCollapse: 'collapse',
              '& th, & td': {
                p: 2,
                textAlign: 'left',
                borderBottom: '1px solid',
                borderColor: 'divider',
              },
              '& th': {
                bgcolor: 'grey.50',
                fontWeight: 600,
              },
            }}
          >
            <thead>
              <tr>
                <th>Prop</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>logo</code></td>
                <td>node</td>
                <td>-</td>
                <td>Logo area (always visible)</td>
              </tr>
              <tr>
                <td><code>navContent</code></td>
                <td>node</td>
                <td>-</td>
                <td>Navigation content (target of responsive transition)</td>
              </tr>
              <tr>
                <td><code>persistent</code></td>
                <td>node</td>
                <td>-</td>
                <td>Persistent elements (search, profile, etc.)</td>
              </tr>
              <tr>
                <td><code>drawerHeader</code></td>
                <td>node</td>
                <td>logo</td>
                <td>Custom element at the top of the drawer</td>
              </tr>
              <tr>
                <td><code>drawerFooter</code></td>
                <td>node</td>
                <td>-</td>
                <td>Custom element at the bottom of the drawer</td>
              </tr>
              <tr>
                <td><code>breakpoint</code></td>
                <td>'sm' | 'md' | 'lg'</td>
                <td>'md'</td>
                <td>Responsive transition breakpoint</td>
              </tr>
              <tr>
                <td><code>height</code></td>
                <td>number</td>
                <td>64</td>
                <td>Header height (px)</td>
              </tr>
              <tr>
                <td><code>drawerWidth</code></td>
                <td>number</td>
                <td>280</td>
                <td>Drawer width (px)</td>
              </tr>
              <tr>
                <td><code>hasBorder</code></td>
                <td>boolean</td>
                <td>true</td>
                <td>Header bottom border</td>
              </tr>
              <tr>
                <td><code>isSticky</code></td>
                <td>boolean</td>
                <td>true</td>
                <td>Whether the header is sticky</td>
              </tr>
              <tr>
                <td><code>isTransparent</code></td>
                <td>boolean</td>
                <td>false</td>
                <td>Transparent background with blur effect</td>
              </tr>
              <tr>
                <td><code>isGhost</code></td>
                <td>boolean</td>
                <td>false</td>
                <td>Background, border, and blur all removed (content only)</td>
              </tr>
            </tbody>
          </Box>
        </Box>
      </SectionContainer>
    </PageContainer>
  ),
};

