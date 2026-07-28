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
  title: 'Style/Spacing',
  parameters: {
    layout: 'padded',
  },
};

/** Spacing system documentation */
export const Docs = {
  render: () => {
    const theme = useTheme();

    // Token structure (for the tree view)
    const tokenStructure = {
      spacing: {
        unit: 8,
        'spacing(0.5)': theme.spacing(0.5),
        'spacing(1)': theme.spacing(1),
        'spacing(1.5)': theme.spacing(1.5),
        'spacing(2)': theme.spacing(2),
        'spacing(3)': theme.spacing(3),
        'spacing(4)': theme.spacing(4),
        'spacing(5)': theme.spacing(5),
        'spacing(6)': theme.spacing(6),
        'spacing(8)': theme.spacing(8),
        'spacing(10)': theme.spacing(10),
        'spacing(12)': theme.spacing(12),
      },
    };

    // Token values (for the table)
    const tokenValues = [
      { token: 0, multiplier: '0x', px: 0, usage: 'None' },
      { token: 0.5, multiplier: '0.5x', px: 4, usage: 'Spacing inside icons' },
      { token: 1, multiplier: '1x', px: 8, usage: 'Spacing between inline elements' },
      { token: 1.5, multiplier: '1.5x', px: 12, usage: 'Padding for small components' },
      { token: 2, multiplier: '2x', px: 16, usage: 'Default component padding' },
      { token: 3, multiplier: '3x', px: 24, usage: 'Card inner padding' },
      { token: 4, multiplier: '4x', px: 32, usage: 'Section spacing' },
      { token: 5, multiplier: '5x', px: 40, usage: 'Large section spacing' },
      { token: 6, multiplier: '6x', px: 48, usage: 'Page padding' },
      { token: 8, multiplier: '8x', px: 64, usage: 'Large section margin' },
      { token: 10, multiplier: '10x', px: 80, usage: 'Page section separation' },
      { token: 12, multiplier: '12x', px: 96, usage: 'Hero section padding' },
    ];

    // sx props guide
    const sxProps = [
      { prop: 'm', description: 'margin (all sides)', example: 'm: 2' },
      { prop: 'mt, mr, mb, ml', description: 'margin (top, right, bottom, left)', example: 'mt: 2' },
      { prop: 'mx, my', description: 'margin (horizontal, vertical)', example: 'mx: "auto"' },
      { prop: 'p', description: 'padding (all sides)', example: 'p: 2' },
      { prop: 'pt, pr, pb, pl', description: 'padding (top, right, bottom, left)', example: 'pb: 3' },
      { prop: 'px, py', description: 'padding (horizontal, vertical)', example: 'px: 4' },
      { prop: 'gap', description: 'flex/grid gap', example: 'gap: 2' },
    ];

    return (
      <>
        <DocumentTitle
          title="Spacing"
          status="Available"
          note="8px grid spacing system"
          brandName="Design System"
          systemName="Starter Kit"
          version="1.0"
        />
        <PageContainer>
          {/* Title + one-line overview */}
          <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
            Spacing System
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={ { mb: 4 } }>
            A consistent spacing system based on an 8px grid.
          </Typography>

          {/* Token structure (tree view) */}
          <SectionTitle title="Token Structure" description="theme.spacing hierarchy" />
          <Box sx={ { p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 4 } }>
            { Object.entries(tokenStructure).map(([key, value]) => (
              <TreeNode key={ key } keyName={ key } value={ value } defaultOpen />
            )) }
          </Box>

          {/* Token values (table) */}
          <SectionTitle title="Token Values" description="Spacing scale and pixel values" />
          <TableContainer sx={ { mb: 4 } }>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={ { fontWeight: 600 } }>Token</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>Multiplier</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>Value</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>Visual</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>Usage</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { tokenValues.map((row) => (
                  <TableRow key={ row.token }>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 13 } }>{ row.token }</TableCell>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 13 } }>{ row.multiplier }</TableCell>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 13 } }>{ row.px }px</TableCell>
                    <TableCell>
                      <Box sx={ { display: 'flex', alignItems: 'center', gap: 1 } }>
                        <Box
                          sx={ {
                            width: Math.min(row.px, 80),
                            height: 16,
                            backgroundColor: 'primary.main',
                            minWidth: row.px > 0 ? 2 : 0,
                          } }
                        />
                      </Box>
                    </TableCell>
                    <TableCell sx={ { color: 'text.secondary', fontSize: 13 } }>{ row.usage }</TableCell>
                  </TableRow>
                )) }
              </TableBody>
            </Table>
          </TableContainer>

          {/* SX Props guide */}
          <SectionTitle title="SX Props" description="sx props available for spacing" />
          <TableContainer sx={ { mb: 4 } }>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={ { fontWeight: 600 } }>Prop</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>Description</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>Example</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { sxProps.map((row) => (
                  <TableRow key={ row.prop }>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 13 } }>{ row.prop }</TableCell>
                    <TableCell sx={ { color: 'text.secondary', fontSize: 13 } }>{ row.description }</TableCell>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ row.example }</TableCell>
                  </TableRow>
                )) }
              </TableBody>
            </Table>
          </TableContainer>

          {/* Usage examples */}
          <SectionTitle title="Usage" description="Using spacing in the MUI sx prop" />
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
{ `// Basic spacing
<Box sx={{ m: 2, p: 3 }}>  {/* margin: 16px, padding: 24px */}
  Content
</Box>

// Directional spacing
<Box sx={{ mt: 2, mb: 4, px: 3 }}>
  {/* marginTop: 16px, marginBottom: 32px, paddingX: 24px */}
</Box>

// Responsive spacing
<Box sx={{
  p: { xs: 2, sm: 3, md: 4 },  {/* 16px to 24px to 32px */}
  my: { xs: 3, md: 6 }         {/* 24px to 48px */}
}}>
  Responsive content
</Box>

// Flex gap
<Box sx={{ display: 'flex', gap: 2 }}>  {/* gap: 16px */}
  <Item /><Item /><Item />
</Box>

// Stack spacing
<Stack direction="row" spacing={2}>  {/* gap: 16px */}
  <Item /><Item />
</Stack>` }
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
{ `/* Example prompts for using spacing tokens */

"Use p: 3 (24px) for the card's inner padding,
and gap: 2 (16px) for the spacing between elements inside the card."

"Apply responsive padding: p: 2 (16px) on mobile
and p: 4 (32px) on desktop."

"Create vertical spacing between sections with my: 6 (48px),
and set the inside of each section to gap: 3 (24px)."

"Apply gap: 1 (8px) between buttons,
and mt: 4 (32px) between the button group and other elements."

"Apply py: 12 (96px) to the hero section,
and make the inner content responsive with px: { xs: 2, md: 6 }."` }
          </Box>
        </PageContainer>
      </>
    );
  },
};
