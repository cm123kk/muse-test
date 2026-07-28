import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useTheme } from '@mui/material/styles';
import { red, orange, green } from '@mui/material/colors';
import {
  DocumentTitle,
  PageContainer,
  SectionTitle,
  TreeNode,
} from '../../components/storybookDocumentation';

/** MUSE Neutral Tint Scale: violet-tinted custom gray */
const museNeutralScale = {
  50: '#FAFAFD',
  100: '#F3F3F9',
  200: '#E8E7F0',
  300: '#D6D5E0',
  400: '#B5B4C2',
  500: '#9493A3',
  600: '#7A798E',
  700: '#5A586E',
  800: '#3A384E',
  900: '#14132B',
};

/** MUSE Accent Scale: violet for essential emphasis (info.main family) */
const museAccentScale = {
  50: '#EEF0FF',
  100: '#E0E3FF',
  200: '#C7CCFF',
  300: '#A5ABFF',
  400: '#8289F5',
  500: '#6366F1',
  600: '#4F46E5',
  700: '#4338CA',
  800: '#3730A3',
  900: '#1E1B4B',
};

export default {
  title: 'Style/Colors',
  parameters: {
    layout: 'padded',
  },
};

/** Palette scale component: large block layout */
const PaletteScale = ({ name, colorObj, description }) => (
  <Box sx={ { mb: 6 } }>
    <Typography variant="h6" sx={ { fontWeight: 600, mb: 0.5 } }>{ name }</Typography>
    <Typography variant="body2" color="text.secondary" sx={ { mb: 2 } }>{ description }</Typography>
    <Box sx={ { display: 'flex', flexWrap: 'wrap', gap: 1 } }>
      { [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
        <Box
          key={ shade }
          sx={ {
            width: 80,
            height: 80,
            backgroundColor: colorObj[shade],
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 3,
            border: shade < 200 ? '1px solid' : 'none',
            borderColor: 'divider',
          } }
        >
          <Typography
            variant="caption"
            sx={ {
              color: shade >= 400 ? '#FFFFFF' : 'rgba(20, 19, 43, 0.7)',
              fontSize: 12,
              fontWeight: 700,
            } }
          >
            { shade }
          </Typography>
          <Typography
            variant="caption"
            sx={ {
              color: shade >= 400 ? 'rgba(255,255,255,0.7)' : 'rgba(20, 19, 43, 0.5)',
              fontSize: 10,
              fontFamily: 'monospace',
            } }
          >
            { colorObj[shade] }
          </Typography>
        </Box>
      )) }
    </Box>
  </Box>
);

/** Semantic token block component */
const SemanticColorBlock = ({ name, colorObj, description }) => {
  const shades = ['light', 'main', 'dark'];
  return (
    <Box sx={ { mb: 6 } }>
      <Typography variant="h6" sx={ { fontWeight: 600, mb: 0.5 } }>{ name }</Typography>
      <Typography variant="body2" color="text.secondary" sx={ { mb: 2 } }>{ description }</Typography>
      <Box sx={ { display: 'flex', flexWrap: 'wrap', gap: 1 } }>
        { shades.map((shade) => {
          const color = colorObj[shade];
          const isLight = shade === 'light';
          return (
            <Box
              key={ shade }
              sx={ {
                width: 120,
                height: 80,
                backgroundColor: color,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 3,
                border: isLight ? '1px solid' : 'none',
                borderColor: 'divider',
              } }
            >
              <Typography
                variant="caption"
                sx={ {
                  color: isLight ? 'rgba(20, 19, 43, 0.7)' : '#FFFFFF',
                  fontSize: 12,
                  fontWeight: 700,
                } }
              >
                { shade }
              </Typography>
              <Typography
                variant="caption"
                sx={ {
                  color: isLight ? 'rgba(20, 19, 43, 0.5)' : 'rgba(255,255,255,0.7)',
                  fontSize: 10,
                  fontFamily: 'monospace',
                } }
              >
                { color }
              </Typography>
            </Box>
          );
        }) }
      </Box>
    </Box>
  );
};

/** Single color block component */
const SingleColorBlock = ({ name, color, hasBorder = false }) => (
  <Box
    sx={ {
      width: 120,
      height: 80,
      backgroundColor: color,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 3,
      border: hasBorder ? '1px solid' : 'none',
      borderColor: 'divider',
    } }
  >
    <Typography
      variant="caption"
      sx={ {
        color: hasBorder ? 'rgba(20, 19, 43, 0.7)' : '#FFFFFF',
        fontSize: 12,
        fontWeight: 700,
      } }
    >
      { name }
    </Typography>
    <Typography
      variant="caption"
      sx={ {
        color: hasBorder ? 'rgba(20, 19, 43, 0.5)' : 'rgba(255,255,255,0.7)',
        fontSize: 10,
        fontFamily: 'monospace',
      } }
    >
      { color }
    </Typography>
  </Box>
);

/** Docs - color system documentation (first story) */
export const Docs = {
  render: () => {
    const theme = useTheme();

    // Token structure (for the tree view)
    const tokenStructure = {
      palette: {
        primary: theme.palette.primary,
        secondary: theme.palette.secondary,
        error: theme.palette.error,
        warning: theme.palette.warning,
        success: theme.palette.success,
        info: theme.palette.info,
        text: theme.palette.text,
        background: theme.palette.background,
        divider: theme.palette.divider,
      },
    };

    // Token values (for the table)
    const tokenValues = [
      { token: 'primary.main', value: theme.palette.primary.main, description: 'Main brand color, CTA buttons' },
      { token: 'primary.light', value: theme.palette.primary.light, description: 'Hover state, background emphasis' },
      { token: 'primary.dark', value: theme.palette.primary.dark, description: 'Active state, text emphasis' },
      { token: 'secondary.main', value: theme.palette.secondary.main, description: 'Secondary actions, tags' },
      { token: 'error.main', value: theme.palette.error.main, description: 'Error, delete, danger' },
      { token: 'warning.main', value: theme.palette.warning.main, description: 'Caution, warning' },
      { token: 'success.main', value: theme.palette.success.main, description: 'Success, complete, active' },
      { token: 'info.main', value: theme.palette.info.main, description: 'Information, guidance' },
      { token: 'text.primary', value: theme.palette.text.primary, description: 'Primary text' },
      { token: 'text.secondary', value: theme.palette.text.secondary, description: 'Secondary text, captions' },
      { token: 'background.default', value: theme.palette.background.default, description: 'Page background' },
      { token: 'background.paper', value: theme.palette.background.paper, description: 'Card and modal background' },
      { token: 'divider', value: theme.palette.divider, description: 'Dividers, borders' },
    ];

    return (
      <>
        <DocumentTitle
          title="Color System"
          status="Available"
          note="Color palette and semantic color tokens"
          brandName="Design System"
          systemName="Starter Kit"
          version="1.0"
        />
        <PageContainer>
          {/* Title + one-line overview */}
          <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
            Color System
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={ { mb: 4 } }>
            The color palette and semantic color tokens used across the project.
          </Typography>

          {/* Token structure (tree view) */}
          <SectionTitle title="Token Structure" description="theme.palette hierarchy" />
          <Box sx={ { p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 4 } }>
            { Object.entries(tokenStructure).map(([key, value]) => (
              <TreeNode key={ key } keyName={ key } value={ value } defaultOpen />
            )) }
          </Box>

          {/* Token values (table) */}
          <SectionTitle title="Token Values" description="Actual values of key color tokens" />
          <TableContainer sx={ { mb: 4 } }>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={ { fontWeight: 600 } }>Token</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>Value</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>Preview</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { tokenValues.map((row) => (
                  <TableRow key={ row.token }>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 13 } }>{ row.token }</TableCell>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 13 } }>{ row.value }</TableCell>
                    <TableCell>
                      <Box
                        sx={ {
                          width: 24,
                          height: 24,
                          backgroundColor: row.value,
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: '4px',
                        } }
                      />
                    </TableCell>
                    <TableCell sx={ { color: 'text.secondary', fontSize: 13 } }>{ row.description }</TableCell>
                  </TableRow>
                )) }
              </TableBody>
            </Table>
          </TableContainer>

          {/* Usage examples */}
          <SectionTitle title="Usage" description="Using color tokens in the MUI sx prop" />
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
{ `// Background color
<Box sx={{ backgroundColor: 'primary.main' }} />
<Box sx={{ backgroundColor: 'background.paper' }} />

// Text color
<Typography sx={{ color: 'text.primary' }}>Primary text</Typography>
<Typography sx={{ color: 'text.secondary' }}>Secondary text</Typography>

// Border color
<Box sx={{ border: '1px solid', borderColor: 'divider' }} />

// State colors
<Button color="primary">Primary</Button>
<Button color="error">Error</Button>

// Hover state
<Box sx={{
  backgroundColor: 'primary.main',
  '&:hover': { backgroundColor: 'primary.dark' }
}} />` }
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
{ `/* Example prompts for using color tokens */

"Use primary.main (${theme.palette.primary.main}) to build a CTA button.
Make it change to primary.dark on hover."

"Use text.primary and text.secondary to differentiate
the title and description text colors in a card component."

"Build a selected-state card with a background.paper background
and a primary.main border."

"Build a delete button with the error.main color,
and darken it to error.dark on hover."` }
          </Box>
        </PageContainer>
      </>
    );
  },
};

/** 1. Color Palette - MUSE raw scale */
export const Palette = {
  name: '1. Color Palette',
  render: () => (
    <>
      <DocumentTitle
        title="Color Palette"
        status="Available"
        note="MUSE tinted neutral + accent + state scales"
        brandName="MUSE"
        systemName="Design System"
        version="1.0"
      />
      <PageContainer>
        <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
          Color Palette (MUSE Raw Scale)
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={ { mb: 4 } }>
          MUSE removes pure white and black, redefining its grays along a subtle violet tint axis.
          These scales are combined to build the semantic tokens (primary, secondary, text, background, and so on).
        </Typography>

        <Divider sx={ { mb: 4 } } />

        <PaletteScale
          name="Neutral Tint"
          colorObj={ museNeutralScale }
          description="MUSE base gray scale: the axis for background, text, and borders. Access via `theme.palette.grey[*]`"
        />
        <PaletteScale
          name="Accent Violet"
          colorObj={ museAccentScale }
          description="Violet for essential emphasis: the `theme.palette.info.main (#4F46E5)` family. Use sparingly (analyzing state, selection indicators, and similar)"
        />
        <PaletteScale name="Red" colorObj={ red } description="Error state (MUI default kept)" />
        <PaletteScale name="Orange" colorObj={ orange } description="Warning state (MUI default kept)" />
        <PaletteScale name="Green" colorObj={ green } description="Success state (MUI default kept)" />

        <SectionTitle title="Lightness Guide" description="Based on the MUSE Neutral Tint" />

        <TableContainer>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell sx={ { fontWeight: 600, width: '20%' } }>50-100</TableCell>
                <TableCell>Very light: near `background.default (#FCFCFF)` and `paper (#F8F8FC)`</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontWeight: 600 } }>200-300</TableCell>
                <TableCell>Light: divider, hover, borders</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontWeight: 600 } }>400-500</TableCell>
                <TableCell>Medium: disabled, placeholder</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontWeight: 600 } }>600-700</TableCell>
                <TableCell>Dark: `text.secondary (#7A798E)`, `secondary.main (#5A586E)`</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontWeight: 600 } }>800-900</TableCell>
                <TableCell>Very dark: `primary.main` and `text.primary (#14132B)` (image-first neutral)</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </PageContainer>
    </>
  ),
};

/** 2. Semantic Tokens - role-based colors */
export const SemanticTokens = {
  name: '2. Semantic Tokens',
  render: () => {
    const theme = useTheme();
    return (
      <>
        <DocumentTitle
          title="Semantic Tokens"
          status="Available"
          note="Role-based semantic colors"
          brandName="Design System"
          systemName="Starter Kit"
          version="1.0"
        />
        <PageContainer>
          <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
            Semantic Tokens (Role-based Colors)
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={ { mb: 4 } }>
            Tokens that assign meaning and a role to each color. Components reference these tokens.
          </Typography>

          <SectionTitle title="Brand Colors" />

          <SemanticColorBlock
            name="Primary"
            colorObj={ theme.palette.primary }
            description="CTA buttons, links, selected state"
          />
          <SemanticColorBlock
            name="Secondary"
            colorObj={ theme.palette.secondary }
            description="Secondary buttons, tags"
          />

          <SectionTitle
            title="Feedback Colors"
            description="Colors that communicate system state to the user."
          />

          <SemanticColorBlock
            name="Error"
            colorObj={ theme.palette.error }
            description="Error, delete, danger"
          />
          <SemanticColorBlock
            name="Warning"
            colorObj={ theme.palette.warning }
            description="Caution, warning"
          />
          <SemanticColorBlock
            name="Success"
            colorObj={ theme.palette.success }
            description="Success, complete, active"
          />
          <SemanticColorBlock
            name="Info"
            colorObj={ theme.palette.info }
            description="Information, guidance"
          />

          <SectionTitle title="Text and Background Colors" />

          <Box sx={ { mb: 6 } }>
            <Typography variant="h6" sx={ { fontWeight: 600, mb: 0.5 } }>Text</Typography>
            <Typography variant="body2" color="text.secondary" sx={ { mb: 2 } }>Text colors</Typography>
            <Box sx={ { display: 'flex', flexWrap: 'wrap', gap: 1 } }>
              <SingleColorBlock name="primary" color={ theme.palette.text.primary } />
              <SingleColorBlock name="secondary" color={ theme.palette.text.secondary } />
              <SingleColorBlock name="disabled" color={ theme.palette.text.disabled } />
            </Box>
          </Box>

          <Box sx={ { mb: 6 } }>
            <Typography variant="h6" sx={ { fontWeight: 600, mb: 0.5 } }>Background</Typography>
            <Typography variant="body2" color="text.secondary" sx={ { mb: 2 } }>Background colors</Typography>
            <Box sx={ { display: 'flex', flexWrap: 'wrap', gap: 1 } }>
              <SingleColorBlock name="default" color={ theme.palette.background.default } hasBorder />
              <SingleColorBlock name="paper" color={ theme.palette.background.paper } hasBorder />
            </Box>
          </Box>
        </PageContainer>
      </>
    );
  },
};

/** 3. Usage - application in components */
export const Usage = {
  name: '3. Usage',
  render: () => (
    <>
      <DocumentTitle
        title="Color Usage"
        status="Available"
        note="Color application in components"
        brandName="Design System"
        systemName="Starter Kit"
        version="1.0"
      />
      <PageContainer>
        <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
          Component Usage Examples
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={ { mb: 4 } }>
          See how semantic tokens are applied to real components.
        </Typography>

        <SectionTitle
          title="Button Component"
          description="Pass a semantic token name to the Button color prop to apply that color."
        />

        <Box
          component="pre"
          sx={ {
            backgroundColor: 'grey.100',
            p: 2,
            fontSize: 12,
            fontFamily: 'monospace',
            overflow: 'auto',
            borderRadius: 2,
            mb: 4,
          } }
        >
{ `<Button variant="contained" color="primary">Primary</Button>
<Button variant="contained" color="error">Error</Button>
<Button variant="contained" color="success">Success</Button>` }
        </Box>

        <SectionTitle
          title="Using the sx prop directly"
          description="You can reference theme values directly in the sx prop."
        />

        <Box
          component="pre"
          sx={ {
            backgroundColor: 'grey.100',
            p: 2,
            fontSize: 12,
            fontFamily: 'monospace',
            overflow: 'auto',
            borderRadius: 2,
          } }
        >
{ `// Reference by string (recommended)
<Box sx={{ backgroundColor: 'primary.main' }} />
<Box sx={{ color: 'text.secondary' }} />
<Box sx={{ borderColor: 'divider' }} />

// Reference by function (when complex calculation is needed)
<Box sx={{ backgroundColor: (theme) => theme.palette.primary.light }} />` }
        </Box>
      </PageContainer>
    </>
  ),
};
