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
import { HighlightedTypography, Highlight } from '.';

export default {
  title: 'Component/1. Typography/HighlightedTypography',
  component: HighlightedTypography,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## HighlightedTypography

A component that emphasizes specific words or phrases within text using various styles.

### Use Cases
- Emphasize important words or phrases
- Apply underline, background, marker, or circle effects
- Scroll triggered animations
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['body1', 'body2', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    },
    component: {
      control: { type: 'text' },
    },
    animated: {
      control: { type: 'boolean' },
    },
    threshold: {
      control: { type: 'number', min: 0, max: 1, step: 0.1 },
    },
  },
};

/** Basic usage - adjust HighlightedTypography props */
export const Default = {
  args: {
    variant: 'h4',
    component: 'p',
    animated: false,
    threshold: 0.5,
  },
  render: (args) => (
    <HighlightedTypography
      variant={args.variant}
      component={args.component}
      animated={args.animated}
      threshold={args.threshold}
    >
      This is a <Highlight type="background">highlighted</Highlight> text example.
    </HighlightedTypography>
  ),
};

/** Adjust Highlight component props */
export const HighlightPlayground = {
  args: {
    type: 'background',
    color: 'primary.main',
    textColor: 'auto',
    animated: false,
    delay: 0,
    duration: 600,
  },
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['underline', 'background', 'marker', 'circle'],
    },
    color: {
      control: { type: 'select' },
      options: ['primary.main', 'secondary.main', 'error.main', 'warning.main', 'success.main', '#FF0000', '#00FF00', '#0000FF', '#000000', '#FFFF00'],
    },
    textColor: {
      control: { type: 'select' },
      options: ['auto', '#FFFFFF', 'inherit'],
    },
    animated: {
      control: { type: 'boolean' },
    },
    delay: {
      control: { type: 'number', min: 0, max: 2000, step: 100 },
    },
    duration: {
      control: { type: 'number', min: 100, max: 2000, step: 100 },
    },
  },
  render: (args) => (
    <HighlightedTypography variant="h4" animated={args.animated}>
      This text has a{' '}
      <Highlight
        type={args.type}
        color={args.color}
        textColor={args.textColor}
        animated={args.animated}
        delay={args.delay}
        duration={args.duration}
      >
        highlighted word
      </Highlight>{' '}
      in it.
    </HighlightedTypography>
  ),
};

/** Documentation and demo */
export const Documentation = {
  render: () => (
    <>
      <DocumentTitle
        title="HighlightedTypography"
        status="Available"
        note="Text highlighting effect component"
        brandName="Typography"
        systemName="Starter Kit"
        version="1.0"
      />
      <PageContainer>
        <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
          HighlightedTypography
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={ { mb: 4 } }>
          Emphasizes specific words or phrases within text using various styles.
          Used together with the Highlight component in a compound component pattern.
        </Typography>

        <SectionTitle title="Props" description="List of props for the HighlightedTypography component." />
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
                <TableCell sx={ { fontFamily: 'monospace' } }>children</TableCell>
                <TableCell>ReactNode</TableCell>
                <TableCell>-</TableCell>
                <TableCell>Combination of text and Highlight components</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>variant</TableCell>
                <TableCell>string</TableCell>
                <TableCell>&apos;body1&apos;</TableCell>
                <TableCell>Typography variant</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>animated</TableCell>
                <TableCell>boolean</TableCell>
                <TableCell>false</TableCell>
                <TableCell>Enable animation when entering the viewport</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>threshold</TableCell>
                <TableCell>number</TableCell>
                <TableCell>0.5</TableCell>
                <TableCell>Intersection Observer threshold</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle title="Highlight Props" description="Props for the Highlight sub component." />
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
                <TableCell sx={ { fontFamily: 'monospace' } }>type</TableCell>
                <TableCell>&apos;underline&apos; | &apos;background&apos; | &apos;marker&apos; | &apos;circle&apos;</TableCell>
                <TableCell>-</TableCell>
                <TableCell>Highlight type (required)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>color</TableCell>
                <TableCell>string</TableCell>
                <TableCell>&apos;primary.main&apos;</TableCell>
                <TableCell>Highlight color</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>animated</TableCell>
                <TableCell>boolean</TableCell>
                <TableCell>false</TableCell>
                <TableCell>Enable draw animation</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>delay</TableCell>
                <TableCell>number</TableCell>
                <TableCell>0</TableCell>
                <TableCell>Animation delay (ms)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>duration</TableCell>
                <TableCell>number</TableCell>
                <TableCell>600</TableCell>
                <TableCell>Animation duration (ms)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>textColor</TableCell>
                <TableCell>string</TableCell>
                <TableCell>&apos;auto&apos;</TableCell>
                <TableCell>Text color (&apos;auto&apos;: determined automatically by background brightness)</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle title="Highlight Types" description="Provides four highlight styles." />
        <Stack spacing={ 4 }>
          <Box>
            <Typography variant="subtitle2" sx={ { mb: 1, color: 'text.secondary' } }>
              Underline - underline effect
            </Typography>
            <HighlightedTypography variant="h5">
              We believe in <Highlight type="underline">innovation</Highlight> and <Highlight type="underline">creativity</Highlight>.
            </HighlightedTypography>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={ { mb: 1, color: 'text.secondary' } }>
              Background - background color effect
            </Typography>
            <HighlightedTypography variant="h5">
              Our <Highlight type="background">mission</Highlight> is to build <Highlight type="background">better products</Highlight>.
            </HighlightedTypography>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={ { mb: 1, color: 'text.secondary' } }>
              Marker - marker pen effect
            </Typography>
            <HighlightedTypography variant="h5">
              This feature is <Highlight type="marker">absolutely essential</Highlight> for our users.
            </HighlightedTypography>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={ { mb: 1, color: 'text.secondary' } }>
              Circle - hand drawn circle effect
            </Typography>
            <HighlightedTypography variant="h5">
              The <Highlight type="circle">key insight</Highlight> changed everything.
            </HighlightedTypography>
          </Box>
        </Stack>

        <SectionTitle title="Animated Examples" description="Scroll to see the animation." />
        <Box sx={ { height: 100 } } />
        <Stack spacing={ 6 }>
          <Box sx={ { p: 4, border: '1px solid', borderColor: 'divider' } }>
            <HighlightedTypography variant="h4" animated>
              We are <Highlight type="underline" animated delay={ 0 }>passionate</Highlight> about
              creating <Highlight type="marker" animated delay={ 300 }>exceptional</Highlight> experiences
              that <Highlight type="circle" animated delay={ 600 }>inspire</Highlight> people.
            </HighlightedTypography>
          </Box>

          <Box sx={ { p: 4, border: '1px solid', borderColor: 'divider' } }>
            <HighlightedTypography variant="body1" animated>
              A design system enables <Highlight type="underline" animated delay={ 200 }>efficient</Highlight> development
              while maintaining <Highlight type="background" animated>consistency</Highlight>.
              This improves the <Highlight type="marker" animated delay={ 400 }>user experience</Highlight> and
              strengthens the <Highlight type="circle" animated delay={ 600 }>brand identity</Highlight>.
            </HighlightedTypography>
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
          {`<HighlightedTypography variant="h4" animated>
  We are <Highlight type="underline" animated delay={0}>passionate</Highlight> about
  creating <Highlight type="marker" animated delay={300}>exceptional</Highlight> experiences
  that <Highlight type="circle" animated delay={600}>inspire</Highlight> people.
</HighlightedTypography>`}
        </Box>
      </PageContainer>
    </>
  ),
};
