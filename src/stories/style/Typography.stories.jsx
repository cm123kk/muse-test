import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useTheme } from '@mui/material/styles';
import {
  DocumentTitle,
  PageContainer,
  SectionTitle,
  TreeNode,
} from '../../components/storybookDocumentation';

export default {
  title: 'Style/Typography',
  parameters: {
    layout: 'padded',
  },
};

/** Typography system documentation */
export const Docs = {
  render: () => {
    const theme = useTheme();

    // Token structure (for the tree view)
    const tokenStructure = {
      typography: {
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.fontSize,
        fontWeightLight: theme.typography.fontWeightLight,
        fontWeightRegular: theme.typography.fontWeightRegular,
        fontWeightMedium: theme.typography.fontWeightMedium,
        fontWeightBold: theme.typography.fontWeightBold,
        h1: theme.typography.h1,
        h2: theme.typography.h2,
        h3: theme.typography.h3,
        h4: theme.typography.h4,
        h5: theme.typography.h5,
        h6: theme.typography.h6,
        body1: theme.typography.body1,
        body2: theme.typography.body2,
        subtitle1: theme.typography.subtitle1,
        subtitle2: theme.typography.subtitle2,
        button: theme.typography.button,
        caption: theme.typography.caption,
        overline: theme.typography.overline,
      },
    };

    // Token values (for the table)
    const tokenValues = [
      { variant: 'h1', fontSize: theme.typography.h1?.fontSize, fontWeight: theme.typography.h1?.fontWeight, usage: 'Page main title' },
      { variant: 'h2', fontSize: theme.typography.h2?.fontSize, fontWeight: theme.typography.h2?.fontWeight, usage: 'Section title' },
      { variant: 'h3', fontSize: theme.typography.h3?.fontSize, fontWeight: theme.typography.h3?.fontWeight, usage: 'Subsection title' },
      { variant: 'h4', fontSize: theme.typography.h4?.fontSize, fontWeight: theme.typography.h4?.fontWeight, usage: 'Card title' },
      { variant: 'h5', fontSize: theme.typography.h5?.fontSize, fontWeight: theme.typography.h5?.fontWeight, usage: 'Small title' },
      { variant: 'h6', fontSize: theme.typography.h6?.fontSize, fontWeight: theme.typography.h6?.fontWeight, usage: 'Label title' },
      { variant: 'subtitle1', fontSize: theme.typography.subtitle1?.fontSize, fontWeight: theme.typography.subtitle1?.fontWeight, usage: 'Subtitle' },
      { variant: 'subtitle2', fontSize: theme.typography.subtitle2?.fontSize, fontWeight: theme.typography.subtitle2?.fontWeight, usage: 'Small subtitle' },
      { variant: 'body1', fontSize: theme.typography.body1?.fontSize, fontWeight: theme.typography.body1?.fontWeight, usage: 'Body text' },
      { variant: 'body2', fontSize: theme.typography.body2?.fontSize, fontWeight: theme.typography.body2?.fontWeight, usage: 'Secondary body' },
      { variant: 'button', fontSize: theme.typography.button?.fontSize, fontWeight: theme.typography.button?.fontWeight, usage: 'Button text' },
      { variant: 'caption', fontSize: theme.typography.caption?.fontSize, fontWeight: theme.typography.caption?.fontWeight, usage: 'Captions, annotations' },
      { variant: 'overline', fontSize: theme.typography.overline?.fontSize, fontWeight: theme.typography.overline?.fontWeight, usage: 'Labels, categories' },
    ];

    // Font weight data
    const fontWeights = [
      { name: 'Light', token: 'fontWeightLight', value: theme.typography.fontWeightLight },
      { name: 'Regular', token: 'fontWeightRegular', value: theme.typography.fontWeightRegular },
      { name: 'Medium', token: 'fontWeightMedium', value: theme.typography.fontWeightMedium },
      { name: 'Bold', token: 'fontWeightBold', value: theme.typography.fontWeightBold },
    ];

    return (
      <>
        <DocumentTitle
          title="Typography"
          status="Available"
          note="Font and text style system"
          brandName="Design System"
          systemName="Starter Kit"
          version="1.0"
        />
        <PageContainer>
          {/* Title + one-line overview */}
          <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
            Typography System
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={ { mb: 4 } }>
            The typography scale and font settings used across the project.
          </Typography>

          {/* Token structure (tree view) */}
          <SectionTitle title="Token Structure" description="theme.typography hierarchy" />
          <Box sx={ { p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 4 } }>
            { Object.entries(tokenStructure).map(([key, value]) => (
              <TreeNode key={ key } keyName={ key } value={ value } defaultOpen />
            )) }
          </Box>

          {/* Token values (table) - Typography Scale */}
          <SectionTitle title="Token Values" description="Settings per Typography variant" />
          <TableContainer sx={ { mb: 4 } }>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={ { fontWeight: 600 } }>Variant</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>Size</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>Weight</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>Sample</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>Usage</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { tokenValues.map((row) => (
                  <TableRow key={ row.variant }>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 13 } }>{ row.variant }</TableCell>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 13 } }>{ row.fontSize || '-' }</TableCell>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 13 } }>{ row.fontWeight || '-' }</TableCell>
                    <TableCell>
                      <Typography variant={ row.variant } sx={ { maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }>
                        Typography
                      </Typography>
                    </TableCell>
                    <TableCell sx={ { color: 'text.secondary', fontSize: 13 } }>{ row.usage }</TableCell>
                  </TableRow>
                )) }
              </TableBody>
            </Table>
          </TableContainer>

          {/* Font weight table */}
          <SectionTitle title="Font Weight" description="Available font weights" />
          <TableContainer sx={ { mb: 4 } }>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={ { fontWeight: 600 } }>Name</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>Token</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>Value</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>Sample</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { fontWeights.map((row) => (
                  <TableRow key={ row.token }>
                    <TableCell>{ row.name }</TableCell>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 13 } }>{ row.token }</TableCell>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 13 } }>{ row.value }</TableCell>
                    <TableCell>
                      <Box component="span" sx={ { fontWeight: row.value } }>
                        The quick brown fox
                      </Box>
                    </TableCell>
                  </TableRow>
                )) }
              </TableBody>
            </Table>
          </TableContainer>

          {/* Usage examples */}
          <SectionTitle title="Usage" description="Using the MUI Typography component" />
          <Box
            component="pre"
            sx={ {
              backgroundColor: 'grey.100',
              p: 2,
              fontSize: 12,
              fontFamily: 'monospace',
              overflow: 'auto',
              borderRadius: 1,
              mb: 4,
            } }
          >
{ `// Using a Typography variant
<Typography variant="h1">Page title</Typography>
<Typography variant="body1">Body text</Typography>
<Typography variant="caption">Caption text</Typography>

// Customizing with the sx prop
<Typography sx={{ fontWeight: 700 }}>Bold text</Typography>
<Typography sx={{ fontSize: '1.5rem' }}>Custom size</Typography>

// Using with color
<Typography variant="h4" color="primary">Primary color heading</Typography>
<Typography variant="body2" color="text.secondary">Secondary text</Typography>

// Using fontWeight tokens
<Box sx={{ fontWeight: 'fontWeightBold' }}>Bold text</Box>
<Box sx={{ fontWeight: 'fontWeightLight' }}>Light text</Box>` }
          </Box>

          {/* Vibe Coding Prompt */}
          <SectionTitle
            title="Vibe Coding Prompt"
            description="Example prompts for AI coding tools"
          />
          <Box
            component="pre"
            sx={ {
              backgroundColor: 'grey.900',
              color: 'grey.100',
              p: 2,
              fontSize: 12,
              fontFamily: 'monospace',
              overflow: 'auto',
              borderRadius: 1,
            } }
          >
{ `/* Example prompts for using typography tokens */

"Use Typography variant='h4' to build a card title.
Make it bold with fontWeight: 700."

"Build a blog post card that shows the body with body1
and the date with caption."

"Build a pricing table component using h2 for the section title
and body2 for the description."

"Build a category label with the overline variant,
and show the item name with h5."

"Use fontWeightLight (${theme.typography.fontWeightLight}) and
fontWeightBold (${theme.typography.fontWeightBold}) to differentiate
emphasized text from regular text."` }
          </Box>
        </PageContainer>
      </>
    );
  },
};
