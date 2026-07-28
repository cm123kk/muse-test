import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useTheme } from '@mui/material/styles';
import { DocumentTitle, PageContainer, SectionTitle } from '../../components/storybookDocumentation';

export default {
  title: 'Overview/For Designers',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## Designer Guide

A guide to understanding the React + MUI + Storybook environment for designers who are familiar with Figma.

### Purpose
- 1:1 mapping between Figma concepts and code concepts
- Understanding the relationship between React and Storybook
- Design and development collaboration workflow
        `,
      },
    },
  },
};

/**
 * DocContent Component
 * Separated to use React hooks properly
 */
function DocContent() {
  const theme = useTheme();
  return (
    <>
      <DocumentTitle
        title="For Designers"
        status="Available"
        note="Figma to React + Storybook concept guide"
        brandName="Design System"
        systemName="Starter Kit"
        version="1.0"
      />
      <PageContainer>
        <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
          Designer Guide
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={ { mb: 4 } }>
          Understand React + MUI + Storybook through familiar Figma concepts
        </Typography>

        <SectionTitle title="Table of Contents" />
        <TableContainer sx={ { mb: 4 } }>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell sx={ { fontWeight: 600, width: '30%' } }>Core Analogy</TableCell>
                <TableCell>Figma vs React + Storybook</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontWeight: 600 } }>Concept Mapping</TableCell>
                <TableCell>Mapping Figma terms to code terms</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontWeight: 600 } }>Theme Structure</TableCell>
                <TableCell>Figma Styles = Theme</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontWeight: 600 } }>Project Structure</TableCell>
                <TableCell>File locations and relationships</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontWeight: 600 } }>Using Storybook</TableCell>
                <TableCell>Exploring and testing components</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle title="Core Analogy" />
        <TableContainer sx={ { mb: 4 } }>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell sx={ { fontWeight: 600, width: '30%' } }>Figma</TableCell>
                <TableCell>Design file + component documentation</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontWeight: 600 } }>React + Storybook</TableCell>
                <TableCell>Real code + component documentation</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="body2" color="text.secondary" sx={ { mb: 4 } }>
          Key difference: Figma is a picture, while Storybook is actual working code.
          A button in Storybook is really clickable, shows hover effects, and applies a disabled state.
        </Typography>

        <SectionTitle title="Concept Mapping: Figma to Code" />
        <TableContainer sx={ { mb: 4 } }>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={ { fontWeight: 600 } }>Figma</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>Code</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Component</TableCell>
                <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>React Component</TableCell>
                <TableCell>Reusable UI block</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Variants</TableCell>
                <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>Props</TableCell>
                <TableCell>Component states and options</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Styles</TableCell>
                <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>Theme</TableCell>
                <TableCell>Design tokens: color, typography, effects</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>UI Kit</TableCell>
                <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>MUI</TableCell>
                <TableCell>Prebuilt component library</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Override</TableCell>
                <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>sx prop</TableCell>
                <TableCell>Instance style override</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Auto Layout</TableCell>
                <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>Grid / Flexbox</TableCell>
                <TableCell>Auto-aligned Layout</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Component Docs</TableCell>
                <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>Storybook</TableCell>
                <TableCell>This documentation tool</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle title="Theme = Figma Styles" />
        <Typography variant="body2" sx={ { mb: 3 } }>
          Just as Figma centrally manages Color Styles and Text Styles,
          code manages all design tokens in a Theme file.
        </Typography>
        <TableContainer sx={ { mb: 4 } }>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={ { fontWeight: 600 } }>Figma Styles</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>Code Theme</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Color Styles (Primary, Secondary)</TableCell>
                <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>palette.primary, palette.secondary</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Text Styles (Heading, Body)</TableCell>
                <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>typography.h1, typography.body1</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Effect Styles (Shadow)</TableCell>
                <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>components.MuiPaper.styleOverrides</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle title="Current Theme Values" />
        <TableContainer sx={ { mb: 4 } }>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell sx={ { fontWeight: 600, width: '30%' } }>Primary Color</TableCell>
                <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ theme.palette.primary.main }</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontWeight: 600 } }>Secondary Color</TableCell>
                <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ theme.palette.secondary.main }</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontWeight: 600 } }>Border Radius</TableCell>
                <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ theme.shape.borderRadius }px</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle title="Two Independent Apps" />
        <Typography variant="body2" sx={ { mb: 3 } }>
          In a React project, the actual service (App) and Storybook run as completely independent apps.
          They share the same components but have different entry points and config files.
        </Typography>
        <TableContainer sx={ { mb: 4 } }>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={ { fontWeight: 600 } }></TableCell>
                <TableCell sx={ { fontWeight: 600 } }>Production App</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>Storybook</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={ { fontWeight: 600 } }>Command</TableCell>
                <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>pnpm dev</TableCell>
                <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>pnpm storybook</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontWeight: 600 } }>Entry Point</TableCell>
                <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>main.jsx → App.jsx</TableCell>
                <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>.storybook/main.js</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontWeight: 600 } }>Config File</TableCell>
                <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>vite.config.js</TableCell>
                <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>.storybook/preview.jsx</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontWeight: 600 } }>Port</TableCell>
                <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>localhost:5173</TableCell>
                <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>localhost:6006</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle title="Design to Development Workflow" />
        <TableContainer sx={ { mb: 4 } }>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell sx={ { fontWeight: 600, width: 80 } }>Step 1</TableCell>
                <TableCell sx={ { fontWeight: 600, width: '25%' } }>Design in Figma</TableCell>
                <TableCell>Define components, Variants, Styles</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontWeight: 600 } }>Step 2</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>Implement in React</TableCell>
                <TableCell>Convert the Figma design into code</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontWeight: 600 } }>Step 3</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>Review in Storybook</TableCell>
                <TableCell>Designers review the implemented components</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontWeight: 600 } }>Step 4</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>Deploy to Production</TableCell>
                <TableCell>A finished product built from reviewed components</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle title="Using Storybook" />
        <Typography variant="body2" sx={ { mb: 3 } }>
          Storybook is like combining Figma's Component Docs and Inspect panel.
          You can visually check components built from real code and test them by changing Props.
        </Typography>
        <TableContainer sx={ { mb: 4 } }>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={ { fontWeight: 600 } }>Figma Inspect Panel</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>Storybook Controls</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>View component properties</TableCell>
                <TableCell>Adjust Props in real time</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Select Variants</TableCell>
                <TableCell>Change Variants via dropdown</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Read-only (not editable)</TableCell>
                <TableCell>Interactive control</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle title="Quick Start Exercise" />
        <Box
          component="pre"
          sx={ {
            backgroundColor: 'grey.100',
            p: 2,
            fontSize: 12,
            fontFamily: 'monospace',
            overflow: 'auto',
          } }
        >
{ `1. In the sidebar, go to Component → Button → Doc
2. In the Controls panel at the bottom, change variant to "outlined"
3. Change color to "secondary"
4. Watch the button update in real time` }
        </Box>
      </PageContainer>
    </>
  );
}

/** Documentation */
export const Doc = {
  render: () => <DocContent />,
};
