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
import {
  StyledParagraph,
  PullQuote,
} from '.';

export default {
  title: 'Component/1. Typography/StyledParagraph',
  component: StyledParagraph,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## StyledParagraph

A quote/emphasis paragraph component that supports a left decoration line and a Drop Cap.

### Use Cases
- Emphasize quotations
- Section introduction text
- Highlight important information
        `,
      },
    },
  },
  argTypes: {
    children: {
      control: { type: 'text' },
      description: 'Paragraph text',
    },
    variant: {
      control: { type: 'select' },
      options: ['h4', 'h5', 'h6', 'body1', 'body2'],
      description: 'Typography variant',
    },
    dropCap: {
      control: { type: 'boolean' },
      description: 'Enlarge first character (Drop Cap, 2 line height, automatic float)',
    },
    styleColor: {
      control: { type: 'select' },
      options: ['primary.main', 'secondary.main', 'text.primary', 'text.secondary', 'error.main', 'warning.main', 'success.main'],
      description: 'Drop Cap and decoration line color',
    },
    align: {
      control: { type: 'select' },
      options: ['left', 'center', 'right', 'justify'],
      description: 'Text alignment',
    },
    maxWidth: {
      control: { type: 'number' },
      description: 'Maximum width (ch unit)',
    },
  },
};

const sampleText = {
  short: 'Design systems enable teams to build better products faster by making design reusable.',
  medium: 'A design system is a collection of reusable components, guided by clear standards, that can be assembled together to build any number of applications. It serves as a single source of truth for product teams.',
  long: 'Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed. The arrangement of type involves selecting typefaces, point sizes, line lengths, line-spacing, and letter-spacing, and adjusting the space between pairs of letters. The term typography is also applied to the style, arrangement, and appearance of the letters, numbers, and symbols created by the process.',
  korean: 'A design system is a collection of reusable components with clear standards that can build any number of applications. It serves as a single source of truth for product teams.',
};

/** Basic usage */
export const Default = {
  args: {
    children: sampleText.medium,
    variant: 'h5',
    dropCap: false,
    styleColor: 'primary.main',
    align: 'left',
    maxWidth: 65,
  },
};

/** Documentation and demo */
export const Documentation = {
  render: () => (
    <>
      <DocumentTitle
        title="StyledParagraph"
        status="Available"
        note="Quote style paragraph with decoration line"
        brandName="Typography"
        systemName="Starter Kit"
        version="2.0"
      />
      <PageContainer>
        <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
          StyledParagraph
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={ { mb: 4 } }>
          A quote/emphasis paragraph component that supports a left decoration line and a Drop Cap.
          styleColor controls both the decoration line and Drop Cap color at once.
        </Typography>

        <SectionTitle title="Props" description="List of props for the StyledParagraph component." />
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
                <TableCell>Paragraph text (required)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>variant</TableCell>
                <TableCell>&apos;h4&apos; | &apos;h5&apos; | &apos;h6&apos; | &apos;body1&apos; | &apos;body2&apos;</TableCell>
                <TableCell>&apos;h5&apos;</TableCell>
                <TableCell>Typography variant</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>dropCap</TableCell>
                <TableCell>boolean</TableCell>
                <TableCell>false</TableCell>
                <TableCell>Enlarge first character (Drop Cap, 2 line height, automatic float)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>styleColor</TableCell>
                <TableCell>string</TableCell>
                <TableCell>&apos;primary.main&apos;</TableCell>
                <TableCell>Drop Cap and decoration line color</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>maxWidth</TableCell>
                <TableCell>number | string</TableCell>
                <TableCell>65</TableCell>
                <TableCell>Maximum width (ch unit or CSS value)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>align</TableCell>
                <TableCell>&apos;left&apos; | &apos;center&apos; | &apos;right&apos; | &apos;justify&apos;</TableCell>
                <TableCell>&apos;left&apos;</TableCell>
                <TableCell>Text alignment</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle title="Basic Usage" description="Basic usage example." />
        <Box sx={ { p: 3, border: '1px solid', borderColor: 'divider' } }>
          <StyledParagraph>
            { sampleText.medium }
          </StyledParagraph>
        </Box>

        <SectionTitle title="Drop Cap" description="The first character is enlarged to 2 line height." />
        <Box sx={ { p: 3, border: '1px solid', borderColor: 'divider' } }>
          <StyledParagraph dropCap>
            { sampleText.long }
          </StyledParagraph>
        </Box>

        <SectionTitle title="Style Color" description="styleColor controls both the decoration line and Drop Cap color at once." />
        <Stack spacing={ 4 }>
          <Box sx={ { p: 3, border: '1px solid', borderColor: 'divider' } }>
            <Typography variant="caption" sx={ { mb: 1, display: 'block', color: 'text.secondary' } }>
              primary.main (default)
            </Typography>
            <StyledParagraph dropCap styleColor="primary.main">
              { sampleText.medium }
            </StyledParagraph>
          </Box>
          <Box sx={ { p: 3, border: '1px solid', borderColor: 'divider' } }>
            <Typography variant="caption" sx={ { mb: 1, display: 'block', color: 'text.secondary' } }>
              secondary.main
            </Typography>
            <StyledParagraph dropCap styleColor="secondary.main">
              { sampleText.medium }
            </StyledParagraph>
          </Box>
          <Box sx={ { p: 3, border: '1px solid', borderColor: 'divider' } }>
            <Typography variant="caption" sx={ { mb: 1, display: 'block', color: 'text.secondary' } }>
              error.main
            </Typography>
            <StyledParagraph dropCap styleColor="error.main">
              { sampleText.medium }
            </StyledParagraph>
          </Box>
        </Stack>

        <SectionTitle title="PullQuote" description="A quote component that includes author information." />
        <Box sx={ { p: 3, border: '1px solid', borderColor: 'divider' } }>
          <PullQuote author="Steve Jobs">
            Design is not just what it looks like and feels like. Design is how it works.
          </PullQuote>
        </Box>

        <SectionTitle title="PullQuote with Drop Cap" description="A quote with Drop Cap applied." />
        <Box sx={ { p: 3, border: '1px solid', borderColor: 'divider' } }>
          <PullQuote author="Dieter Rams" dropCap styleColor="secondary.main">
            Good design is as little design as possible. Less, but better, because it concentrates on the essential aspects.
          </PullQuote>
        </Box>

        <SectionTitle title="Long Form Text" description="Long form paragraph example." />
        <Box sx={ { p: 3, border: '1px solid', borderColor: 'divider' } }>
          <StyledParagraph dropCap>
            { sampleText.korean }
          </StyledParagraph>
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
          {`// Basic usage
<StyledParagraph>
  Your quote text here...
</StyledParagraph>

// Drop Cap and color specification
<StyledParagraph dropCap styleColor="secondary.main">
  Lorem ipsum dolor sit amet...
</StyledParagraph>

// PullQuote with author
<PullQuote author="Steve Jobs">
  Design is how it works.
</PullQuote>`}
        </Box>
      </PageContainer>
    </>
  ),
};
