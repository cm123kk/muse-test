import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { DocumentTitle, PageContainer, SectionTitle } from '../storybookDocumentation';
import {
  SplitScreen,
  StickySection,
  SplitOverlay,
} from './SplitScreen';
import Placeholder, { placeholderSvg } from '../../common/ui/Placeholder';

export default {
  title: 'Component/8. Layout/SplitScreen',
  component: SplitScreen,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## SplitScreen

Layout component that splits the screen into two areas.

### Use cases
- Login/sign-up pages
- Comparison Layouts
- Image/content split sections
        `,
      },
    },
  },
  argTypes: {
    direction: {
      control: 'select',
      options: ['row', 'column'],
      description: 'Split Direction',
    },
    ratio: {
      control: 'select',
      options: ['50:50', '60:40', '40:60', '70:30', '30:70'],
      description: 'Split ratio',
    },
    stackAt: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'none'],
      description: 'Stack Transition breakpoint',
    },
    isFullHeight: {
      control: 'boolean',
      description: 'Apply 100vh height',
    },
  },
};

/** Basic usage */
export const Default = {
  args: {
    direction: 'row',
    ratio: '50:50',
    stackAt: 'sm',
    isFullHeight: false,
    gap: 0,
  },
  render: (args) => (
    <SplitScreen
      { ...args }
      left={ <Placeholder.Box label="Left" height={ 300 } /> }
      right={ <Placeholder.Box label="Right" height={ 300 } /> }
    />
  ),
};

/** Documentation and demo */
export const Documentation = {
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <>
      <DocumentTitle
        title="SplitScreen"
        status="Available"
        note="Screen split layout component"
        brandName="Layout"
        systemName="Starter Kit"
        version="1.0"
      />
      <PageContainer>
        <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
          SplitScreen
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={ { mb: 4 } }>
          Layout component that splits the screen into two areas.
          It supports various ratios and responsive Transitions.
        </Typography>

        <SectionTitle title="Props" description="Props for the SplitScreen Component." />
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={ { fontWeight: 600 } }>Prop</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>Type</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>Default</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>left</TableCell>
                <TableCell>ReactNode</TableCell>
                <TableCell>-</TableCell>
                <TableCell>Content for the left (top) area</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>right</TableCell>
                <TableCell>ReactNode</TableCell>
                <TableCell>-</TableCell>
                <TableCell>Content for the right (bottom) area</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>ratio</TableCell>
                <TableCell>string | number[]</TableCell>
                <TableCell>&apos;50:50&apos;</TableCell>
                <TableCell>Split ratio</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>direction</TableCell>
                <TableCell>&apos;row&apos; | &apos;column&apos;</TableCell>
                <TableCell>&apos;row&apos;</TableCell>
                <TableCell>Split Direction</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>stackAt</TableCell>
                <TableCell>&apos;xs&apos; | &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos; | &apos;none&apos;</TableCell>
                <TableCell>&apos;sm&apos;</TableCell>
                <TableCell>Stack Transition breakpoint</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>stackOrder</TableCell>
                <TableCell>&apos;normal&apos; | &apos;reverse&apos;</TableCell>
                <TableCell>&apos;normal&apos;</TableCell>
                <TableCell>Order when stacked</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>isFullHeight</TableCell>
                <TableCell>boolean</TableCell>
                <TableCell>false</TableCell>
                <TableCell>Apply 100vh height</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle title="Ratio Presets" description="Commonly used split ratios." />
        <Stack spacing={ 3 }>
          { ['50:50', '60:40', '70:30'].map((r) => (
            <Box key={ r }>
              <Typography variant="subtitle2" sx={ { mb: 1, color: 'text.secondary' } }>
                ratio=&quot;{ r }&quot;
              </Typography>
              <SplitScreen
                ratio={ r }
                stackAt="none"
                left={ <Placeholder.Box label={ r.split(':')[0] + '%' } height={ 80 } /> }
                right={ <Placeholder.Box label={ r.split(':')[1] + '%' } height={ 80 } /> }
              />
            </Box>
          )) }
        </Stack>

        <SectionTitle title="Sub Components" description="Components used together." />
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={ { fontWeight: 600 } }>Component</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>StickySection</TableCell>
                <TableCell>Section that stays fixed while scrolling</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>SplitOverlay</TableCell>
                <TableCell>Area with a background image plus overlay</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle title="Usage Example" description="Code usage example." />
        <Box
          component="pre"
          sx={ {
            backgroundColor: 'grey.100',
            p: 3,
            fontSize: 13,
            fontFamily: 'monospace',
            overflow: 'auto',
            lineHeight: 1.6,
          } }
        >
          { `// Default 50:50 split
<SplitScreen
  left={<ImageSection />}
  right={<ContentSection />}
/>

// 60:40 ratio
<SplitScreen
  ratio="60:40"
  left={<LargeSection />}
  right={<SmallSection />}
/>

// Background image plus form
<SplitScreen
  isFullHeight
  ratio="60:40"
  stackAt="md"
  left={
    <SplitOverlay
      background="https://example.com/bg.jpg"
      overlay={0.4}
    >
      <Typography variant="h2" sx={{ color: 'white' }}>
        Welcome
      </Typography>
    </SplitOverlay>
  }
  right={
    <Box sx={{ p: 4 }}>
      <LoginForm />
    </Box>
  }
/>

// Sticky section
<SplitScreen
  left={
    <StickySection>
      <FixedImage />
    </StickySection>
  }
  right={<ScrollingContent />}
/>` }
        </Box>
      </PageContainer>
    </>
  ),
};

/** Login page example */
export const LoginPageExample = {
  render: () => (
    <SplitScreen
      isFullHeight
      ratio="55:45"
      stackAt="md"
      left={
        <SplitOverlay
          background={ placeholderSvg(1200, 800) }
          overlay={ 0.4 }
        >
          <Stack spacing={ 2 } sx={ { textAlign: 'center', px: 4 } }>
            <Typography variant="h3" sx={ { color: 'white', fontWeight: 700 } }>
              Welcome Back
            </Typography>
            <Typography variant="body1" sx={ { color: 'rgba(255,255,255,0.9)' } }>
              Sign in to continue your journey
            </Typography>
          </Stack>
        </SplitOverlay>
      }
      right={
        <Box
          sx={ {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            p: { xs: 4, md: 8 },
            backgroundColor: 'background.paper',
          } }
        >
          <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
            Sign In
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={ { mb: 4 } }>
            Enter your credentials to access your account
          </Typography>
          <Stack spacing={ 3 }>
            <TextField label="Email" fullWidth />
            <TextField label="Password" type="password" fullWidth />
            <Button variant="contained" size="large" fullWidth>
              Sign In
            </Button>
            <Typography variant="body2" color="text.secondary" sx={ { textAlign: 'center' } }>
              Don&apos;t have an account? Sign up
            </Typography>
          </Stack>
        </Box>
      }
    />
  ),
};

/** Comparison layout example */
export const ComparisonExample = {
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <SplitScreen
      ratio="50:50"
      gap={ 2 }
      stackAt="md"
      minHeight="400px"
      left={
        <Box sx={ { p: 4, backgroundColor: 'grey.50', height: '100%' } }>
          <Typography variant="h5" sx={ { fontWeight: 700, mb: 2 } }>
            Free Plan
          </Typography>
          <Stack spacing={ 1 }>
            <Typography variant="body2">✓ 5 projects</Typography>
            <Typography variant="body2">✓ Basic analytics</Typography>
            <Typography variant="body2">✓ Email support</Typography>
            <Typography variant="body2" color="text.disabled">✗ Custom domain</Typography>
            <Typography variant="body2" color="text.disabled">✗ Priority support</Typography>
          </Stack>
          <Button variant="outlined" fullWidth sx={ { mt: 4 } }>
            Get Started
          </Button>
        </Box>
      }
      right={
        <Box sx={ { p: 4, backgroundColor: 'primary.main', color: 'white', height: '100%' } }>
          <Typography variant="h5" sx={ { fontWeight: 700, mb: 2 } }>
            Pro Plan
          </Typography>
          <Stack spacing={ 1 }>
            <Typography variant="body2">✓ Unlimited projects</Typography>
            <Typography variant="body2">✓ Advanced analytics</Typography>
            <Typography variant="body2">✓ Priority support</Typography>
            <Typography variant="body2">✓ Custom domain</Typography>
            <Typography variant="body2">✓ API access</Typography>
          </Stack>
          <Button
            variant="contained"
            fullWidth
            sx={ { mt: 4, backgroundColor: 'white', color: 'primary.main' } }
          >
            Upgrade Now
          </Button>
        </Box>
      }
    />
  ),
};

/** Sticky section example */
export const StickySectionExample = {
  render: () => (
    <Box sx={ { height: '200vh' } }>
      <SplitScreen
        ratio="50:50"
        stackAt="md"
        left={
          <StickySection height="100vh">
            <Placeholder.Media index={ 1 } sx={ { height: '100%', width: '100%', objectFit: 'cover' } } />
          </StickySection>
        }
        right={
          <Box sx={ { p: 6 } }>
            <Stack spacing={ 8 }>
              { [1, 2, 3, 4].map((section) => (
                <Box key={ section }>
                  <Typography variant="h4" sx={ { fontWeight: 700, mb: 2 } }>
                    Section { section }
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    This is the content for section { section }. The left side image stays fixed
                    while this content scrolls. This creates an engaging storytelling experience
                    that keeps the visual context while progressing through content.
                  </Typography>
                </Box>
              )) }
            </Stack>
          </Box>
        }
      />
    </Box>
  ),
};
