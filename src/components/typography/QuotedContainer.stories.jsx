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
import { QuotedContainer } from '.';

export default {
  title: 'Component/1. Typography/QuotedContainer',
  component: QuotedContainer,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## QuotedContainer

A component that smartly places quote marks at the start and end of text.

### Use Cases
- Visually emphasize quotations
- Editorial style large quote mark decoration
- Support for various quote mark styles
        `,
      },
    },
  },
  argTypes: {
    children: {
      control: { type: 'text' },
      description: 'Text to quote',
    },
    quoteSize: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Quote mark size',
    },
    quoteColor: {
      control: { type: 'select' },
      options: ['text.disabled', 'text.secondary', 'primary.main', 'secondary.main', '#000000', '#666666'],
      description: 'Quote mark color',
    },
    position: {
      control: { type: 'select' },
      options: ['outside', 'inside', 'overlay'],
      description: 'Quote mark position',
    },
    animated: {
      control: { type: 'boolean' },
      description: 'Appear animation',
    },
    author: {
      control: { type: 'text' },
      description: 'Quote source/author',
    },
    variant: {
      control: { type: 'select' },
      options: ['h3', 'h4', 'h5', 'h6', 'body1', 'body2'],
      description: 'Typography variant',
    },
    align: {
      control: { type: 'select' },
      options: ['left', 'center', 'right'],
      description: 'Text alignment',
    },
  },
};

const sampleQuotes = {
  short: 'Design is not just what it looks like. Design is how it works.',
  medium: 'The details are not the details. They make the design. A design is not complete until the user finds it obvious.',
  long: 'Good design is as little design as possible. Less, but better, because it concentrates on the essential aspects, and the products are not burdened with non-essentials. Back to purity, back to simplicity.',
  korean: 'Design is not just how it looks and feels. Design is how it works.',
};

/** Basic usage */
export const Default = {
  args: {
    children: sampleQuotes.short,
    quoteSize: 'lg',
    quoteColor: 'text.disabled',
    position: 'outside',
    animated: false,
    author: 'Steve Jobs',
    variant: 'h4',
    align: 'left',
  },
};

/** Documentation and demo */
export const Documentation = {
  render: () => (
    <>
      <DocumentTitle
        title="QuotedContainer"
        status="Available"
        note="Place quote marks around text"
        brandName="Typography"
        systemName="Starter Kit"
        version="1.0"
      />
      <PageContainer>
        <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
          QuotedContainer
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={ { mb: 4 } }>
          A component that smartly places quote marks at the start and end of text.
          Visually emphasizes quotations with large decorative quote marks.
        </Typography>

        <SectionTitle title="Props" description="List of props for the QuotedContainer component." />
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
                <TableCell>string</TableCell>
                <TableCell>-</TableCell>
                <TableCell>Text to quote (required)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>quoteSize</TableCell>
                <TableCell>&apos;sm&apos; | &apos;md&apos; | &apos;lg&apos; | &apos;xl&apos;</TableCell>
                <TableCell>&apos;lg&apos;</TableCell>
                <TableCell>Quote mark size</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>quoteColor</TableCell>
                <TableCell>string</TableCell>
                <TableCell>&apos;text.disabled&apos;</TableCell>
                <TableCell>Quote mark color</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>position</TableCell>
                <TableCell>&apos;outside&apos; | &apos;inside&apos; | &apos;overlay&apos;</TableCell>
                <TableCell>&apos;outside&apos;</TableCell>
                <TableCell>Quote mark position</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>animated</TableCell>
                <TableCell>boolean</TableCell>
                <TableCell>false</TableCell>
                <TableCell>Appear animation</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>author</TableCell>
                <TableCell>string</TableCell>
                <TableCell>-</TableCell>
                <TableCell>Quote source/author</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>variant</TableCell>
                <TableCell>string</TableCell>
                <TableCell>&apos;h4&apos;</TableCell>
                <TableCell>Typography variant</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>align</TableCell>
                <TableCell>&apos;left&apos; | &apos;center&apos; | &apos;right&apos;</TableCell>
                <TableCell>&apos;left&apos;</TableCell>
                <TableCell>Text alignment</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle title="Quote Size" description="Four quote mark sizes." />
        <Stack spacing={ 4 }>
          <Box sx={ { p: 4, border: '1px solid', borderColor: 'divider' } }>
            <Typography variant="caption" sx={ { mb: 2, display: 'block', color: 'text.secondary' } }>
              Small (sm)
            </Typography>
            <QuotedContainer quoteSize="sm" author="Steve Jobs">
              { sampleQuotes.short }
            </QuotedContainer>
          </Box>
          <Box sx={ { p: 4, border: '1px solid', borderColor: 'divider' } }>
            <Typography variant="caption" sx={ { mb: 2, display: 'block', color: 'text.secondary' } }>
              Medium (md)
            </Typography>
            <QuotedContainer quoteSize="md" author="Steve Jobs">
              { sampleQuotes.short }
            </QuotedContainer>
          </Box>
          <Box sx={ { p: 4, border: '1px solid', borderColor: 'divider' } }>
            <Typography variant="caption" sx={ { mb: 2, display: 'block', color: 'text.secondary' } }>
              Large (lg) - Default
            </Typography>
            <QuotedContainer quoteSize="lg" author="Steve Jobs">
              { sampleQuotes.short }
            </QuotedContainer>
          </Box>
          <Box sx={ { p: 4, border: '1px solid', borderColor: 'divider' } }>
            <Typography variant="caption" sx={ { mb: 2, display: 'block', color: 'text.secondary' } }>
              Extra Large (xl)
            </Typography>
            <QuotedContainer quoteSize="xl" author="Steve Jobs">
              { sampleQuotes.short }
            </QuotedContainer>
          </Box>
        </Stack>

        <SectionTitle title="Position Variants" description="Three quote mark position options." />
        <Stack spacing={ 5 }>
          <Box>
            <Typography variant="subtitle2" sx={ { mb: 1, color: 'text.secondary' } }>
              Outside (default) - top left of first character, bottom right of last character
            </Typography>
            <Box sx={ { p: 4, border: '1px solid', borderColor: 'divider' } }>
              <QuotedContainer position="outside" author="Steve Jobs">
                { sampleQuotes.short }
              </QuotedContainer>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={ { mb: 1, color: 'text.secondary' } }>
              Inside - smaller icons placed close to the text
            </Typography>
            <Box sx={ { p: 4, border: '1px solid', borderColor: 'divider' } }>
              <QuotedContainer position="inside" author="Steve Jobs">
                { sampleQuotes.short }
              </QuotedContainer>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={ { mb: 1, color: 'text.secondary' } }>
              Overlay - background decoration behind the text
            </Typography>
            <Box sx={ { p: 4, border: '1px solid', borderColor: 'divider' } }>
              <QuotedContainer position="overlay" author="Dieter Rams">
                { sampleQuotes.medium }
              </QuotedContainer>
            </Box>
          </Box>
        </Stack>
      </PageContainer>
    </>
  ),
};
