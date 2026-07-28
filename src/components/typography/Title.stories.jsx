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
import { Title } from '.';

export default {
  title: 'Component/1. Typography/Title',
  component: Title,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## Title

A component that provides a hierarchical title system for sections and items.

### Use Cases
- Display titles for page sections
- Build an information hierarchy with an Overline + Title + Subtitle combination
- Flexible placement with various layout options
        `,
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Main title text',
    },
    overline: {
      control: 'text',
      description: 'Small label above',
    },
    subtitle: {
      control: 'text',
      description: 'Subtitle below',
    },
    level: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4'],
      description: 'Semantic HTML level',
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right'],
      description: 'Text alignment',
    },
    layout: {
      control: 'select',
      options: ['stack', 'inline', 'split'],
      description: 'Layout method',
    },
    divider: {
      control: 'boolean',
      description: 'Show bottom divider',
    },
    dividerStyle: {
      control: 'select',
      options: ['line', 'dot', 'gradient'],
      description: 'Divider style',
    },
  },
};

/** Basic usage */
export const Default = {
  args: {
    title: 'Section Title',
    overline: 'Category',
    subtitle: 'A brief description of this section that provides context.',
    level: 'h2',
    align: 'left',
    layout: 'stack',
    divider: false,
  },
};

/** All layouts comparison */
export const Layouts = {
  render: () => (
    <>
      <DocumentTitle
        title="Title"
        status="Available"
        note="Hierarchical title system for sections and items"
        brandName="Typography"
        systemName="Starter Kit"
        version="1.0"
      />
      <PageContainer>
        <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
          Title Component
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={ { mb: 4 } }>
          Build a clear information hierarchy with a combination of Overline, main title, and subtitle.
        </Typography>

        <SectionTitle title="Props" description="List of props for the Title component." />
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
                <TableCell sx={ { fontFamily: 'monospace' } }>title</TableCell>
                <TableCell>string</TableCell>
                <TableCell>-</TableCell>
                <TableCell>Main title text (required)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>overline</TableCell>
                <TableCell>string</TableCell>
                <TableCell>-</TableCell>
                <TableCell>Small label above</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>subtitle</TableCell>
                <TableCell>string</TableCell>
                <TableCell>-</TableCell>
                <TableCell>Subtitle below</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>level</TableCell>
                <TableCell>&apos;h1&apos; | &apos;h2&apos; | &apos;h3&apos; | &apos;h4&apos;</TableCell>
                <TableCell>&apos;h2&apos;</TableCell>
                <TableCell>Semantic HTML level</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>align</TableCell>
                <TableCell>&apos;left&apos; | &apos;center&apos; | &apos;right&apos;</TableCell>
                <TableCell>&apos;left&apos;</TableCell>
                <TableCell>Text alignment</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>layout</TableCell>
                <TableCell>&apos;stack&apos; | &apos;inline&apos; | &apos;split&apos;</TableCell>
                <TableCell>&apos;stack&apos;</TableCell>
                <TableCell>Layout method</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>divider</TableCell>
                <TableCell>boolean</TableCell>
                <TableCell>false</TableCell>
                <TableCell>Show bottom divider</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>dividerStyle</TableCell>
                <TableCell>&apos;line&apos; | &apos;dot&apos; | &apos;gradient&apos;</TableCell>
                <TableCell>&apos;line&apos;</TableCell>
                <TableCell>Divider style</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle title="Layout Variants" description="Provides three layout options." />
        <Stack spacing={ 6 }>
          <Box>
            <Typography variant="subtitle2" sx={ { mb: 2, color: 'text.secondary' } }>
              Stack (default) - vertical arrangement
            </Typography>
            <Box sx={ { p: 3, border: '1px solid', borderColor: 'divider' } }>
              <Title
                title="Our Services"
                overline="What We Do"
                subtitle="We provide comprehensive solutions for your business needs."
                layout="stack"
              />
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={ { mb: 2, color: 'text.secondary' } }>
              Inline - Overline and Title arranged horizontally
            </Typography>
            <Box sx={ { p: 3, border: '1px solid', borderColor: 'divider' } }>
              <Title
                title="Our Services"
                overline="01"
                subtitle="We provide comprehensive solutions for your business needs."
                layout="inline"
              />
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={ { mb: 2, color: 'text.secondary' } }>
              Split - Title and Subtitle separated on both sides
            </Typography>
            <Box sx={ { p: 3, border: '1px solid', borderColor: 'divider' } }>
              <Title
                title="Our Services"
                overline="What We Do"
                subtitle="We provide comprehensive solutions for your business needs."
                layout="split"
              />
            </Box>
          </Box>
        </Stack>

        <SectionTitle title="Heading Levels" description="Size changes based on the semantic HTML level." />
        <Stack spacing={ 4 }>
          <Title title="Heading Level 1" level="h1" />
          <Title title="Heading Level 2" level="h2" />
          <Title title="Heading Level 3" level="h3" />
          <Title title="Heading Level 4" level="h4" />
        </Stack>

        <SectionTitle title="Divider Styles" description="Provides three divider styles." />
        <Stack spacing={ 6 }>
          <Box>
            <Title
              title="Line Divider"
              subtitle="Default line style"
              divider
              dividerStyle="line"
            />
          </Box>
          <Box>
            <Title
              title="Dot Divider"
              subtitle="Decorative style made of three dots"
              divider
              dividerStyle="dot"
            />
          </Box>
          <Box>
            <Title
              title="Gradient Divider"
              subtitle="Gradient that is dark in the center and transparent at both ends"
              divider
              dividerStyle="gradient"
            />
          </Box>
        </Stack>

        <SectionTitle title="Alignment" description="Text alignment options." />
        <Stack spacing={ 6 }>
          <Box sx={ { p: 3, border: '1px solid', borderColor: 'divider' } }>
            <Title
              title="Left Aligned"
              overline="Alignment"
              subtitle="Default left alignment."
              align="left"
              divider
              dividerStyle="gradient"
            />
          </Box>
          <Box sx={ { p: 3, border: '1px solid', borderColor: 'divider' } }>
            <Title
              title="Center Aligned"
              overline="Alignment"
              subtitle="Center alignment."
              align="center"
              divider
              dividerStyle="gradient"
            />
          </Box>
          <Box sx={ { p: 3, border: '1px solid', borderColor: 'divider' } }>
            <Title
              title="Right Aligned"
              overline="Alignment"
              subtitle="Right alignment."
              align="right"
              divider
              dividerStyle="gradient"
            />
          </Box>
        </Stack>
      </PageContainer>
    </>
  ),
};
