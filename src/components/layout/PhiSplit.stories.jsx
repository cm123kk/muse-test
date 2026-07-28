import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { DocumentTitle, PageContainer, SectionTitle } from '../storybookDocumentation';
import { PhiSplit, PHI } from './PhiSplit';
import Placeholder from '../../common/ui/Placeholder';

export default {
  title: 'Component/8. Layout/PhiSplit',
  component: PhiSplit,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## PhiSplit

Layout component that splits two areas based on the golden ratio (φ = 1.618).

### Use cases
- Image/text split for Hero sections
- Sidebar and main content Layout
- Visually balanced two-column Layout
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
    isReversed: {
      control: 'boolean',
      description: 'Reverse the ratio',
    },
    gap: {
      control: { type: 'range', min: 0, max: 8 },
      description: 'Spacing between areas',
    },
    stackAt: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'none'],
      description: 'Stack Transition breakpoint',
    },
  },
};

/** Basic usage */
export const Default = {
  args: {
    direction: 'row',
    isReversed: false,
    gap: 2,
    stackAt: 'sm',
  },
  render: (args) => (
    <PhiSplit
      { ...args }
      primary={
        <Placeholder.Box label="Primary (61.8%)" height={ 200 } />
      }
      secondary={
        <Placeholder.Box label="Secondary (38.2%)" height={ 200 } />
      }
    />
  ),
};

/** Documentation and demo */
export const Documentation = {
  render: () => (
    <>
      <DocumentTitle
        title="PhiSplit"
        status="Available"
        note="Golden ratio based two-column layout"
        brandName="Layout"
        systemName="Starter Kit"
        version="1.0"
      />
      <PageContainer>
        <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
          PhiSplit
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={ { mb: 4 } }>
          Layout component that splits two areas based on the golden ratio (φ = 1.618).
          It provides visual balance at roughly a 61.8% : 38.2% ratio.
        </Typography>

        <SectionTitle title="Golden Ratio" description={ `PHI = ${PHI.toFixed(6)}` } />
        <Box sx={ { p: 3, backgroundColor: 'grey.50', mb: 4 } }>
          <Typography variant="body2" sx={ { mb: 2 } }>
            The golden ratio is a mathematical proportion found in nature and art:
          </Typography>
          <Stack direction="row" spacing={ 4 }>
            <Box>
              <Typography variant="caption" color="text.secondary">Primary area</Typography>
              <Typography variant="h6">
                { ((PHI / (PHI + 1)) * 100).toFixed(1) }%
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Secondary area</Typography>
              <Typography variant="h6">
                { ((1 / (PHI + 1)) * 100).toFixed(1) }%
              </Typography>
            </Box>
          </Stack>
        </Box>

        <SectionTitle title="Props" description="List of Props for the PhiSplit Component." />
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
                <TableCell sx={ { fontFamily: 'monospace' } }>primary</TableCell>
                <TableCell>ReactNode</TableCell>
                <TableCell>-</TableCell>
                <TableCell>Content for the larger area (61.8%)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>secondary</TableCell>
                <TableCell>ReactNode</TableCell>
                <TableCell>-</TableCell>
                <TableCell>Content for the smaller area (38.2%)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>direction</TableCell>
                <TableCell>&apos;row&apos; | &apos;column&apos;</TableCell>
                <TableCell>&apos;row&apos;</TableCell>
                <TableCell>Split Direction</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>isReversed</TableCell>
                <TableCell>boolean</TableCell>
                <TableCell>false</TableCell>
                <TableCell>Reverse the ratio (smaller area first)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>gap</TableCell>
                <TableCell>number</TableCell>
                <TableCell>0</TableCell>
                <TableCell>Spacing between areas (spacing units)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>stackAt</TableCell>
                <TableCell>&apos;xs&apos; | &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos; | &apos;none&apos;</TableCell>
                <TableCell>&apos;sm&apos;</TableCell>
                <TableCell>Stack Transition breakpoint</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>primarySx</TableCell>
                <TableCell>object</TableCell>
                <TableCell>-</TableCell>
                <TableCell>Additional styles for the Primary area</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>secondarySx</TableCell>
                <TableCell>object</TableCell>
                <TableCell>-</TableCell>
                <TableCell>Additional styles for the Secondary area</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle title="Horizontal Split" description="Horizontal split (Default)" />
        <Stack spacing={ 4 }>
          <Box>
            <Typography variant="subtitle2" sx={ { mb: 1, color: 'text.secondary' } }>
              Default: Primary on the left
            </Typography>
            <PhiSplit
              gap={ 2 }
              stackAt="none"
              primary={
                <Placeholder.Box label="Primary (61.8%)" height={ 150 } />
              }
              secondary={
                <Placeholder.Box label="Secondary (38.2%)" height={ 150 } />
              }
            />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={ { mb: 1, color: 'text.secondary' } }>
              isReversed: Secondary on the left
            </Typography>
            <PhiSplit
              gap={ 2 }
              isReversed
              stackAt="none"
              primary={
                <Placeholder.Box label="Primary (61.8%)" height={ 150 } />
              }
              secondary={
                <Placeholder.Box label="Secondary (38.2%)" height={ 150 } />
              }
            />
          </Box>
        </Stack>

        <SectionTitle title="Vertical Split" description="Vertical split" />
        <Box sx={ { maxWidth: 400 } }>
          <PhiSplit
            direction="column"
            gap={ 2 }
            stackAt="none"
            primary={
              <Placeholder.Box label="Primary (61.8%)" height={ 180 } />
            }
            secondary={
              <Placeholder.Box label="Secondary (38.2%)" height={ 110 } />
            }
          />
        </Box>

        <SectionTitle title="Real-World Examples" description="Real usage examples." />
        <Stack spacing={ 5 }>
          <Box>
            <Typography variant="subtitle2" sx={ { mb: 1, color: 'text.secondary' } }>
              Hero Section: image and text
            </Typography>
            <PhiSplit
              gap={ 4 }
              stackAt="md"
              primary={
                <Placeholder.Media index={ 0 } sx={ { height: 300, width: '100%' } } />
              }
              secondary={
                <Box sx={ { p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center' } }>
                  <Typography variant="overline" color="primary">Featured</Typography>
                  <Typography variant="h4" sx={ { fontWeight: 700, mb: 2 } }>
                    Explore the Mountains
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Discover breathtaking landscapes and embark on adventures that will stay with you forever.
                  </Typography>
                </Box>
              }
            />
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={ { mb: 1, color: 'text.secondary' } }>
              Sidebar Layout: content and sidebar
            </Typography>
            <PhiSplit
              gap={ 3 }
              stackAt="md"
              primary={
                <Placeholder.Box label="Main Content" height={ 200 } />
              }
              secondary={
                <Placeholder.Box label="Sidebar" height={ 200 } />
              }
            />
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={ { mb: 1, color: 'text.secondary' } }>
              Reversed: sidebar on the left
            </Typography>
            <PhiSplit
              gap={ 3 }
              isReversed
              stackAt="md"
              primary={
                <Placeholder.Box label="Main Content" height={ 200 } />
              }
              secondary={
                <Placeholder.Box label="Sidebar" height={ 200 } />
              }
            />
          </Box>
        </Stack>

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
          { `// Default horizontal split
<PhiSplit
  primary={<HeroImage />}
  secondary={<HeroText />}
  gap={4}
/>

// Reversed layout (sidebar on the left)
<PhiSplit
  isReversed
  primary={<MainContent />}
  secondary={<Sidebar />}
  gap={3}
  stackAt="md"
/>

// Vertical split
<PhiSplit
  direction="column"
  primary={<MainSection />}
  secondary={<Footer />}
/>` }
        </Box>
      </PageContainer>
    </>
  ),
};
