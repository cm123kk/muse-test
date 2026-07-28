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
import { StretchedHeadline, StretchedHeadlineMultiline } from '.';

export default {
  title: 'Component/1. Typography/StretchedHeadline',
  component: StretchedHeadline,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## StretchedHeadline

A hero typography component that dynamically stretches word spacing to fill the entire container width.

### Use Cases
- Impactful headlines for hero sections
- Full width typography design
- Scroll triggered animations
        `,
      },
    },
  },
  argTypes: {
    text: {
      control: 'text',
      description: 'Text to display',
    },
    fillWidth: {
      control: 'boolean',
      description: 'Fill the entire width',
    },
    variant: {
      control: 'select',
      options: ['static', 'animated'],
      description: 'Animation variant',
    },
    textTransform: {
      control: 'select',
      options: ['none', 'uppercase', 'lowercase'],
      description: 'Text transform',
    },
  },
};

/** Basic usage */
export const Default = {
  args: {
    text: 'DESIGN SYSTEM',
    fillWidth: true,
    variant: 'static',
    textTransform: 'uppercase',
  },
};

/** Documentation and demo */
export const Documentation = {
  render: () => (
    <>
      <DocumentTitle
        title="StretchedHeadline"
        status="Available"
        note="Hero typography that fills container width"
        brandName="Typography"
        systemName="Starter Kit"
        version="1.0"
      />
      <PageContainer>
        <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
          StretchedHeadline
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={ { mb: 4 } }>
          A hero typography component that dynamically stretches word spacing to fill the entire container width.
          Each word is split into an individual span and arranged with flexbox space-between.
        </Typography>

        <SectionTitle title="Props" description="List of props for the StretchedHeadline component." />
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
                <TableCell sx={ { fontFamily: 'monospace' } }>text</TableCell>
                <TableCell>string</TableCell>
                <TableCell>-</TableCell>
                <TableCell>Text to display (required)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>fillWidth</TableCell>
                <TableCell>boolean</TableCell>
                <TableCell>true</TableCell>
                <TableCell>Fill the entire width (space-between)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>variant</TableCell>
                <TableCell>&apos;static&apos; | &apos;animated&apos;</TableCell>
                <TableCell>&apos;static&apos;</TableCell>
                <TableCell>Animation variant</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>fontSize</TableCell>
                <TableCell>string | number</TableCell>
                <TableCell>clamp(2rem, 8vw, 6rem)</TableCell>
                <TableCell>Font size</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>fontWeight</TableCell>
                <TableCell>number</TableCell>
                <TableCell>900</TableCell>
                <TableCell>Font weight</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>textTransform</TableCell>
                <TableCell>&apos;none&apos; | &apos;uppercase&apos; | &apos;lowercase&apos;</TableCell>
                <TableCell>&apos;uppercase&apos;</TableCell>
                <TableCell>Text transform</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle title="Fill Width Mode" description="When fillWidth={true}, words are evenly distributed across the entire width." />
        <Stack spacing={ 4 }>
          <Box sx={ { p: 4, backgroundColor: 'grey.50' } }>
            <StretchedHeadline text="DESIGN SYSTEM" />
          </Box>
          <Box sx={ { p: 4, backgroundColor: 'grey.900', color: 'white' } }>
            <StretchedHeadline text="WE CREATE EXPERIENCES" sx={ { color: 'white' } } />
          </Box>
          <Box sx={ { p: 4, backgroundColor: 'primary.main', color: 'white' } }>
            <StretchedHeadline text="BOLD TYPOGRAPHY" sx={ { color: 'white' } } />
          </Box>
        </Stack>

        <SectionTitle title="Word Spacing Mode" description="When fillWidth={false}, spacing is controlled with word-spacing." />
        <Stack spacing={ 4 }>
          <Box sx={ { p: 4, border: '1px solid', borderColor: 'divider' } }>
            <StretchedHeadline
              text="Hello World"
              fillWidth={ false }
              minWordSpacing={ 0.5 }
              textTransform="none"
            />
          </Box>
          <Box sx={ { p: 4, border: '1px solid', borderColor: 'divider' } }>
            <StretchedHeadline
              text="Creative Studio"
              fillWidth={ false }
              minWordSpacing={ 2 }
              textTransform="none"
            />
          </Box>
        </Stack>

        <SectionTitle title="Multiline Headlines" description="Arrange multiple lines with StretchedHeadlineMultiline." />
        <Stack spacing={ 4 }>
          <Box sx={ { p: 4, backgroundColor: 'grey.50' } }>
            <StretchedHeadlineMultiline
              lines={ ['WE CREATE', 'DIGITAL', 'EXPERIENCES'] }
              gap={ 0 }
            />
          </Box>
          <Box sx={ { p: 4, backgroundColor: 'grey.900' } }>
            <StretchedHeadlineMultiline
              lines={ ['INNOVATION', 'MEETS', 'DESIGN'] }
              gap={ 1 }
              headlineProps={ { sx: { color: 'white' } } }
            />
          </Box>
        </Stack>

        <SectionTitle title="Font Size Variations" description="Various font size options." />
        <Stack spacing={ 3 }>
          <Box sx={ { p: 2, border: '1px solid', borderColor: 'divider' } }>
            <StretchedHeadline text="SMALL SIZE" fontSize="1.5rem" />
          </Box>
          <Box sx={ { p: 2, border: '1px solid', borderColor: 'divider' } }>
            <StretchedHeadline text="MEDIUM SIZE" fontSize="3rem" />
          </Box>
          <Box sx={ { p: 2, border: '1px solid', borderColor: 'divider' } }>
            <StretchedHeadline text="LARGE SIZE" fontSize="5rem" />
          </Box>
        </Stack>

        <SectionTitle title="Animated Variant" description="Scroll to see the animation." />
        <Box sx={ { height: 100 } } />
        <Stack spacing={ 6 }>
          <Box sx={ { p: 6, backgroundColor: 'grey.900' } }>
            <StretchedHeadline
              text="SCROLL TRIGGERED"
              variant="animated"
              sx={ { color: 'white' } }
            />
          </Box>
          <Box sx={ { p: 6, backgroundColor: 'primary.main' } }>
            <StretchedHeadlineMultiline
              lines={ ['FUTURE', 'OF', 'DESIGN'] }
              gap={ 0 }
              headlineProps={ {
                variant: 'animated',
                sx: { color: 'white' },
              } }
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
          {`// Basic usage
<StretchedHeadline text="DESIGN SYSTEM" />

// Multiple lines
<StretchedHeadlineMultiline
  lines={['WE CREATE', 'DIGITAL', 'EXPERIENCES']}
  gap={0}
/>

// Animation
<StretchedHeadline
  text="SCROLL TRIGGERED"
  variant="animated"
/>`}
        </Box>
      </PageContainer>
    </>
  ),
};
