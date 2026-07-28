import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Grid from '@mui/material/Grid';
import { DocumentTitle, PageContainer, SectionTitle } from '../storybookDocumentation';
import { RatioContainer, PHI } from './RatioContainer';
import Placeholder from '../../common/ui/Placeholder';

export default {
  title: 'Component/2. Container/RatioContainer',
  component: RatioContainer,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## RatioContainer

A container component that maintains a fixed aspect ratio.

### Use cases
- Fixed ratio media containers such as 16:9, 4:3
- Golden ratio based layout areas
- Consistent card and thumbnail ratios
        `,
      },
    },
  },
  argTypes: {
    ratio: {
      control: 'select',
      options: ['16:9', '4:3', '1:1', '3:2', '21:9', 'phi', 'phi-vertical'],
      description: 'Aspect ratio',
    },
    isContained: {
      control: 'boolean',
      description: 'Apply overflow hidden',
    },
    align: {
      control: 'select',
      options: ['center', 'start', 'end', 'stretch'],
      description: 'Vertical align',
    },
    justify: {
      control: 'select',
      options: ['center', 'start', 'end', 'stretch'],
      description: 'Horizontal align',
    },
  },
};

/** Basic usage */
export const Default = {
  args: {
    ratio: '16:9',
    isContained: true,
    align: 'center',
    justify: 'center',
    children: (
      <Typography variant="h5" sx={ { color: 'text.secondary' } }>
        16:9 Ratio
      </Typography>
    ),
    background: '#f5f5f5',
  },
};

/** Documentation and demos */
export const Documentation = {
  render: () => (
    <>
      <DocumentTitle
        title="RatioContainer"
        status="Available"
        note="Fixed aspect ratio container component"
        brandName="Layout"
        systemName="Starter Kit"
        version="1.0"
      />
      <PageContainer>
        <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
          RatioContainer
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={ { mb: 4 } }>
          A container that maintains a fixed aspect ratio using CSS aspect-ratio.
          It supports various ratios including 16:9, 4:3, and the golden ratio.
        </Typography>

        <SectionTitle title="Props" description="List of props for the RatioContainer component." />
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
                <TableCell sx={ { fontFamily: 'monospace' } }>ratio</TableCell>
                <TableCell>string | number</TableCell>
                <TableCell>&apos;16:9&apos;</TableCell>
                <TableCell>Aspect ratio (Example: &apos;16:9&apos;, &apos;phi&apos;, 1.5)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>maxWidth</TableCell>
                <TableCell>string</TableCell>
                <TableCell>-</TableCell>
                <TableCell>Maximum width</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>minHeight</TableCell>
                <TableCell>string</TableCell>
                <TableCell>-</TableCell>
                <TableCell>Minimum height</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>isContained</TableCell>
                <TableCell>boolean</TableCell>
                <TableCell>true</TableCell>
                <TableCell>Whether overflow hidden is applied</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>align</TableCell>
                <TableCell>&apos;center&apos; | &apos;start&apos; | &apos;end&apos; | &apos;stretch&apos;</TableCell>
                <TableCell>&apos;center&apos;</TableCell>
                <TableCell>Vertical align</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>justify</TableCell>
                <TableCell>&apos;center&apos; | &apos;start&apos; | &apos;end&apos; | &apos;stretch&apos;</TableCell>
                <TableCell>&apos;center&apos;</TableCell>
                <TableCell>Horizontal align</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>background</TableCell>
                <TableCell>string</TableCell>
                <TableCell>-</TableCell>
                <TableCell>Background color or gradient</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle title="Standard Ratios" description="Commonly used standard ratios." />
        <Grid container spacing={ 3 }>
          <Grid size={ { xs: 12, md: 6 } }>
            <Typography variant="subtitle2" sx={ { mb: 1, color: 'text.secondary' } }>
              16:9 - Video, widescreen
            </Typography>
            <RatioContainer ratio="16:9" background="#e0e0e0">
              <Typography sx={ { color: 'text.secondary' } }>16:9</Typography>
            </RatioContainer>
          </Grid>
          <Grid size={ { xs: 12, md: 6 } }>
            <Typography variant="subtitle2" sx={ { mb: 1, color: 'text.secondary' } }>
              4:3 - Classic, documents
            </Typography>
            <RatioContainer ratio="4:3" background="#eeeeee">
              <Typography sx={ { color: 'text.secondary' } }>4:3</Typography>
            </RatioContainer>
          </Grid>
          <Grid size={ { xs: 12, md: 6 } }>
            <Typography variant="subtitle2" sx={ { mb: 1, color: 'text.secondary' } }>
              1:1 - Square, profile
            </Typography>
            <RatioContainer ratio="1:1" background="#e0e0e0" maxWidth="300px">
              <Typography sx={ { color: 'text.secondary' } }>1:1</Typography>
            </RatioContainer>
          </Grid>
          <Grid size={ { xs: 12, md: 6 } }>
            <Typography variant="subtitle2" sx={ { mb: 1, color: 'text.secondary' } }>
              21:9 - Ultrawide, cinema
            </Typography>
            <RatioContainer ratio="21:9" background="#eeeeee">
              <Typography sx={ { color: 'text.secondary' } }>21:9</Typography>
            </RatioContainer>
          </Grid>
        </Grid>

        <SectionTitle title="Golden Ratio" description={ `PHI = ${PHI.toFixed(6)} (about 1.618:1)` } />
        <Stack spacing={ 4 }>
          <Box>
            <Typography variant="subtitle2" sx={ { mb: 1, color: 'text.secondary' } }>
              phi - Horizontal golden ratio (1.618:1)
            </Typography>
            <RatioContainer
              ratio="phi"
              background="#e0e0e0"
            >
              <Typography sx={ { color: 'text.secondary', fontWeight: 600 } }>
                φ (Golden Ratio)
              </Typography>
            </RatioContainer>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={ { mb: 1, color: 'text.secondary' } }>
              phi-vertical - Vertical golden ratio (1:1.618)
            </Typography>
            <RatioContainer
              ratio="phi-vertical"
              background="#eeeeee"
              maxWidth="400px"
            >
              <Typography sx={ { color: 'text.secondary', fontWeight: 600 } }>
                1/φ (Vertical Golden)
              </Typography>
            </RatioContainer>
          </Box>
        </Stack>

        <SectionTitle title="With Images" description="Used with images to maintain a consistent ratio." />
        <Grid container spacing={ 3 }>
          <Grid size={ { xs: 12, md: 4 } }>
            <RatioContainer ratio="1:1">
              <Placeholder.Image ratio="1/1" />
            </RatioContainer>
          </Grid>
          <Grid size={ { xs: 12, md: 4 } }>
            <RatioContainer ratio="1:1">
              <Placeholder.Image ratio="1/1" />
            </RatioContainer>
          </Grid>
          <Grid size={ { xs: 12, md: 4 } }>
            <RatioContainer ratio="1:1">
              <Placeholder.Image ratio="1/1" />
            </RatioContainer>
          </Grid>
        </Grid>

        <SectionTitle title="Alignment Options" description="Alignment options for the inner content." />
        <Grid container spacing={ 3 }>
          <Grid size={ { xs: 12, md: 4 } }>
            <Typography variant="caption" sx={ { mb: 1, display: 'block', color: 'text.secondary' } }>
              align=&quot;start&quot;, justify=&quot;start&quot;
            </Typography>
            <RatioContainer
              ratio="16:9"
              align="start"
              justify="start"
              background="#f5f5f5"
              sx={ { border: '1px solid', borderColor: 'divider' } }
            >
              <Box sx={ { p: 2, backgroundColor: 'primary.main', color: 'white' } }>
                Top Left
              </Box>
            </RatioContainer>
          </Grid>
          <Grid size={ { xs: 12, md: 4 } }>
            <Typography variant="caption" sx={ { mb: 1, display: 'block', color: 'text.secondary' } }>
              align=&quot;center&quot;, justify=&quot;center&quot;
            </Typography>
            <RatioContainer
              ratio="16:9"
              align="center"
              justify="center"
              background="#f5f5f5"
              sx={ { border: '1px solid', borderColor: 'divider' } }
            >
              <Box sx={ { p: 2, backgroundColor: 'primary.main', color: 'white' } }>
                Center
              </Box>
            </RatioContainer>
          </Grid>
          <Grid size={ { xs: 12, md: 4 } }>
            <Typography variant="caption" sx={ { mb: 1, display: 'block', color: 'text.secondary' } }>
              align=&quot;end&quot;, justify=&quot;end&quot;
            </Typography>
            <RatioContainer
              ratio="16:9"
              align="end"
              justify="end"
              background="#f5f5f5"
              sx={ { border: '1px solid', borderColor: 'divider' } }
            >
              <Box sx={ { p: 2, backgroundColor: 'primary.main', color: 'white' } }>
                Bottom Right
              </Box>
            </RatioContainer>
          </Grid>
        </Grid>

        <SectionTitle title="Custom Numeric Ratio" description="You can specify the ratio directly with a number." />
        <Box sx={ { maxWidth: 500 } }>
          <Typography variant="caption" sx={ { mb: 1, display: 'block', color: 'text.secondary' } }>
            ratio={ 2.35 } (Cinemascope 2.35:1)
          </Typography>
          <RatioContainer
            ratio={ 2.35 }
            background="#e0e0e0"
          >
            <Typography sx={ { color: 'text.secondary', letterSpacing: 4 } }>CINEMASCOPE</Typography>
          </RatioContainer>
        </Box>

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
          { `// Default 16:9 ratio
<RatioContainer ratio="16:9">
  <img src="hero.jpg" alt="Hero" />
</RatioContainer>

// Golden ratio container
<RatioContainer ratio="phi" background="#f0f0f0">
  <Typography>Golden Ratio Content</Typography>
</RatioContainer>

// Alignment and max width
<RatioContainer
  ratio="1:1"
  maxWidth="300px"
  align="center"
  justify="center"
>
  <Avatar src="profile.jpg" />
</RatioContainer>

// Custom numeric ratio
<RatioContainer ratio={2.35}>
  <CinemaScopeContent />
</RatioContainer>` }
        </Box>
      </PageContainer>
    </>
  ),
};
