import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Divider from '@mui/material/Divider';
import { DocumentTitle, PageContainer, SectionTitle } from '../../components/storybookDocumentation';

import { componentTokenMap, tokenCategories, componentList } from '../../data/componentTokenMap';

export default {
  title: 'Style/Component Tokens',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## Per-Component Token Usage Guide

Shows which theme tokens each MUI component references when styled.

### Purpose
- Help designers understand the styling structure of each component
- Identify which components are affected when a token changes
        `,
      },
    },
  },
};

/** Component tokens documentation */
export const Default = {
  render: () => {
    const categories = ['palette', 'typography', 'spacing', 'shape', 'shadows', 'transitions', 'zIndex'];

    const categoryDescriptions = {
      palette: 'Color tokens: affect most colorful components such as buttons, chips, and alerts',
      typography: 'Typography tokens: affect all text elements',
      spacing: 'Spacing tokens (8px based): affect the spacing of every component',
      shape: 'Shape tokens: affect corners of cards, buttons, input fields, and so on',
      shadows: 'Shadow tokens: affect components with elevation',
      transitions: 'Transition tokens: affect components with animation',
      zIndex: 'Layer order tokens: affect modals, dropdowns, and so on',
    };

    const matrix = componentList.map((name) => {
      const component = componentTokenMap[name];
      return {
        name,
        description: component?.description || '',
        categories: categories.map((cat) => component?.tokens[cat]?.items.length || 0),
        total: Object.values(component?.tokens || {}).reduce(
          (sum, cat) => sum + (cat.items?.length || 0), 0
        ),
      };
    });

    return (
      <>
        <DocumentTitle
          title="Component Tokens"
          status="Available"
          note="Theme token usage by component"
          brandName="Design System"
          systemName="Starter Kit"
          version="1.0"
        />
        <PageContainer>
          <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
            Component Token Usage
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={ { mb: 4 } }>
            See which theme tokens each MUI component uses.
          </Typography>

          <SectionTitle title="Token Categories" description="Theme token category descriptions" />

          <TableContainer sx={ { mb: 6 } }>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={ { fontWeight: 600, width: '20%' } }>Category</TableCell>
                  <TableCell sx={ { fontWeight: 600, width: '20%' } }>Name</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { categories.map((cat) => (
                  <TableRow key={ cat }>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ cat }</TableCell>
                    <TableCell sx={ { fontWeight: 600 } }>{ tokenCategories[cat]?.name }</TableCell>
                    <TableCell sx={ { color: 'text.secondary', fontSize: 13 } }>
                      { categoryDescriptions[cat] }
                    </TableCell>
                  </TableRow>
                )) }
              </TableBody>
            </Table>
          </TableContainer>

          <SectionTitle title="Usage Matrix" description="Component x token category usage (numbers are token counts)" />

          <TableContainer sx={ { mb: 6 } }>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={ { fontWeight: 600, width: '15%' } }>Component</TableCell>
                  { categories.map((cat) => (
                    <TableCell key={ cat } align="center" sx={ { fontWeight: 600, fontSize: 11 } }>
                      { tokenCategories[cat]?.name }
                    </TableCell>
                  )) }
                  <TableCell align="center" sx={ { fontWeight: 600 } }>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { matrix.map((row) => (
                  <TableRow key={ row.name }>
                    <TableCell sx={ { fontWeight: 600 } }>{ row.name }</TableCell>
                    { row.categories.map((count, idx) => (
                      <TableCell key={ idx } align="center">
                        { count > 0 ? (
                          <Box
                            sx={ {
                              display: 'inline-block',
                              minWidth: 24,
                              py: 0.25,
                              px: 0.75,
                              backgroundColor: count >= 5 ? 'primary.main' : count >= 3 ? 'grey.300' : 'grey.100',
                              color: count >= 5 ? 'white' : 'text.primary',
                              fontSize: 12,
                              fontWeight: 600,
                            } }
                          >
                            { count }
                          </Box>
                        ) : (
                          <Typography variant="caption" color="text.disabled">-</Typography>
                        ) }
                      </TableCell>
                    )) }
                    <TableCell align="center" sx={ { fontWeight: 600 } }>{ row.total }</TableCell>
                  </TableRow>
                )) }
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={ { display: 'flex', gap: 3, mb: 6 } }>
            <Box sx={ { display: 'flex', alignItems: 'center', gap: 1 } }>
              <Box sx={ { width: 24, height: 20, backgroundColor: 'primary.main' } } />
              <Typography variant="caption">5+ (heavy use)</Typography>
            </Box>
            <Box sx={ { display: 'flex', alignItems: 'center', gap: 1 } }>
              <Box sx={ { width: 24, height: 20, backgroundColor: 'grey.300' } } />
              <Typography variant="caption">3-4 (moderate)</Typography>
            </Box>
            <Box sx={ { display: 'flex', alignItems: 'center', gap: 1 } }>
              <Box sx={ { width: 24, height: 20, backgroundColor: 'grey.100' } } />
              <Typography variant="caption">1-2 (light use)</Typography>
            </Box>
          </Box>

          <SectionTitle title="Component Details" description="Detailed token information per component" />

          { componentList.map((name) => {
            const component = componentTokenMap[name];
            if (!component) return null;

            return (
              <Box key={ name } sx={ { mb: 4 } }>
                <Typography variant="h6" sx={ { fontWeight: 600, mb: 1 } }>
                  { component.name }
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={ { mb: 2 } }>
                  { component.description }
                </Typography>

                <TableContainer sx={ { mb: 2 } }>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={ { fontWeight: 600, width: '15%' } }>Category</TableCell>
                        <TableCell sx={ { fontWeight: 600, width: '30%' } }>Token</TableCell>
                        <TableCell sx={ { fontWeight: 600 } }>Role</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      { Object.entries(component.tokens).flatMap(([category, data]) =>
                        data.items.map((item, idx) => (
                          <TableRow key={ `${category}-${idx}` }>
                            { idx === 0 ? (
                              <TableCell
                                rowSpan={ data.items.length }
                                sx={ { fontWeight: 600, verticalAlign: 'top' } }
                              >
                                { tokenCategories[category]?.name }
                              </TableCell>
                            ) : null }
                            <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>
                              { item.token }
                            </TableCell>
                            <TableCell sx={ { color: 'text.secondary', fontSize: 13 } }>
                              { item.role }
                            </TableCell>
                          </TableRow>
                        ))
                      ) }
                    </TableBody>
                  </Table>
                </TableContainer>

                <Divider />
              </Box>
            );
          }) }
        </PageContainer>
      </>
    );
  },
};
