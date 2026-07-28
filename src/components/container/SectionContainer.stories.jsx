import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { PageContainer } from '../layout/PageContainer';
import { SectionContainer } from './SectionContainer';
import { DocumentTitle, SectionTitle } from '../storybookDocumentation';
import Placeholder from '../../common/ui/Placeholder';

export default {
  title: 'Component/2. Container/SectionContainer',
  component: SectionContainer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * ## Basic Usage
 *
 * SectionContainer is a container that separates each section within a page.
 * - Expands to 100% width and provides vertical padding (py)
 * - Applies semantic markup with the section tag
 * - Responsive padding: mobile (xs) py:4, desktop (md) py:6
 */
export const Default = {
  render: () => (
    <Box>
      <DocumentTitle
        title="SectionContainer"
        status="Ready"
        note="A container that separates sections within a page and provides consistent vertical padding"
        brandName="Layout"
        systemName="Container"
        version="1.0"
      />

      <Box sx={{ py: 4 }}>
        <SectionTitle>Basic Usage</SectionTitle>
        <SectionContainer sx={{ bgcolor: 'grey.50', border: '2px dashed', borderColor: 'secondary.main' }}>
          <PageContainer>
            <Typography variant="h6" gutterBottom color="secondary">
              SectionContainer
            </Typography>
            <Typography color="text.secondary">
              The section container expands to 100% width, and vertical padding is applied automatically.
              You can use a PageContainer inside to limit the content width.
            </Typography>
          </PageContainer>
        </SectionContainer>
      </Box>
    </Box>
  ),
};

/**
 * ## variant (fluid / focus)
 *
 * Content width mode of the section. fluid is 100% width (default behavior),
 * focus is centered with a narrow maxWidth (narrow form or settings sections).
 */
export const Variants = {
  name: 'variant (fluid / focus)',
  render: () => (
    <Box sx={{ py: 4, bgcolor: 'grey.100' }}>
      <SectionTitle>variant comparison</SectionTitle>

      <SectionContainer variant="fluid" sx={{ bgcolor: 'background.paper', mb: 2 }}>
        <Placeholder.Box label='variant="fluid": 100% width grid/browse section' height={ 80 } />
      </SectionContainer>

      <SectionContainer variant="focus" sx={{ bgcolor: 'background.paper' }}>
        <Placeholder.Box label='variant="focus": focusMaxWidth 720px centered form section' height={ 80 } />
      </SectionContainer>
    </Box>
  ),
};

/**
 * ## Stacking Multiple Sections
 *
 * Place SectionContainers in sequence to separate sections.
 */
export const StackingSections = {
  render: () => (
    <Box sx={{ py: 4 }}>
      <SectionTitle>Stacking Multiple Sections</SectionTitle>
      <Typography variant="body2" color="text.secondary" sx={{ px: 2, mb: 2 }}>
        Placing SectionContainers in sequence creates natural section separation.
      </Typography>

      <SectionContainer sx={{ bgcolor: 'grey.50' }}>
        <PageContainer>
          <Typography variant="h5" gutterBottom>Section 1: Hero</Typography>
          <Typography>Content of the first section. Separated by background color.</Typography>
        </PageContainer>
      </SectionContainer>

      <SectionContainer sx={{ bgcolor: 'white' }}>
        <PageContainer>
          <Typography variant="h5" gutterBottom>Section 2: Features</Typography>
          <Typography>Content of the second section. White background.</Typography>
        </PageContainer>
      </SectionContainer>

      <SectionContainer sx={{ bgcolor: 'grey.100' }}>
        <PageContainer>
          <Typography variant="h5" gutterBottom>Section 3: Testimonials</Typography>
          <Typography>Content of the third section. Gray background.</Typography>
        </PageContainer>
      </SectionContainer>
    </Box>
  ),
};

/**
 * ## Responsive Spacing
 *
 * The default vertical padding is applied responsively.
 */
export const ResponsiveSpacing = {
  render: () => (
    <Box sx={{ py: 4, bgcolor: 'grey.50' }}>
      <SectionTitle>Default Spacing (py)</SectionTitle>
      <PageContainer>
        <Paper sx={{ p: 3 }}>
          <Typography variant="body2" paragraph>
            The vertical padding of SectionContainer is applied responsively:
          </Typography>
          <Box sx={{ display: 'flex', gap: 4 }}>
            <Box>
              <Typography variant="subtitle2" color="primary">Mobile (xs)</Typography>
              <Typography variant="h4" sx={{ fontFamily: 'monospace' }}>py: 4</Typography>
              <Typography variant="caption" color="text.secondary">= 32px</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="primary">Desktop (md+)</Typography>
              <Typography variant="h4" sx={{ fontFamily: 'monospace' }}>py: 6</Typography>
              <Typography variant="caption" color="text.secondary">= 48px</Typography>
            </Box>
          </Box>
        </Paper>
      </PageContainer>
    </Box>
  ),
};

/**
 * ## Props Documentation
 */
export const Props = {
  render: () => (
    <Box sx={{ py: 4 }}>
      <SectionTitle>Props</SectionTitle>
      <PageContainer>
        <Paper sx={{ p: 3 }}>
          <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', '& td, & th': { p: 1.5, borderBottom: '1px solid', borderColor: 'divider', textAlign: 'left' } }}>
            <thead>
              <tr>
                <th><Typography variant="subtitle2">Prop</Typography></th>
                <th><Typography variant="subtitle2">Type</Typography></th>
                <th><Typography variant="subtitle2">Default</Typography></th>
                <th><Typography variant="subtitle2">Description</Typography></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><Typography variant="body2" sx={{ fontFamily: 'monospace' }}>children</Typography></td>
                <td><Typography variant="body2" color="text.secondary">node</Typography></td>
                <td><Typography variant="body2" color="text.secondary">-</Typography></td>
                <td><Typography variant="body2">Content inside the section</Typography></td>
              </tr>
              <tr>
                <td><Typography variant="body2" sx={{ fontFamily: 'monospace' }}>variant</Typography></td>
                <td><Typography variant="body2" color="text.secondary">'fluid' | 'focus'</Typography></td>
                <td><Typography variant="body2" color="text.secondary">-</Typography></td>
                <td><Typography variant="body2">Section width mode. fluid=100% / focus=centered narrow maxWidth</Typography></td>
              </tr>
              <tr>
                <td><Typography variant="body2" sx={{ fontFamily: 'monospace' }}>focusMaxWidth</Typography></td>
                <td><Typography variant="body2" color="text.secondary">number</Typography></td>
                <td><Typography variant="body2" color="text.secondary">720</Typography></td>
                <td><Typography variant="body2">max-width (px) of the focus variant</Typography></td>
              </tr>
              <tr>
                <td><Typography variant="body2" sx={{ fontFamily: 'monospace' }}>sx</Typography></td>
                <td><Typography variant="body2" color="text.secondary">object</Typography></td>
                <td><Typography variant="body2" color="text.secondary">-</Typography></td>
                <td><Typography variant="body2">Additional styles (bgcolor, border, etc.)</Typography></td>
              </tr>
            </tbody>
          </Box>
        </Paper>
      </PageContainer>
    </Box>
  ),
};

/**
 * ## Combined Usage with PageContainer
 *
 * A common pattern of using SectionContainer together with PageContainer.
 */
export const CombinedUsage = {
  render: () => (
    <Box>
      <SectionTitle>Combined Usage Example</SectionTitle>
      <Typography variant="body2" color="text.secondary" sx={{ px: 2, mb: 2 }}>
        SectionContainer handles the full width background, while PageContainer limits the content width.
      </Typography>

      <SectionContainer sx={{ bgcolor: 'primary.main', color: 'white' }}>
        <PageContainer>
          <Typography variant="h3" gutterBottom>Hero Section</Typography>
          <Typography variant="h6" sx={{ opacity: 0.8 }}>
            SectionContainer provides the full width background color,
            and PageContainer limits the inner content width.
          </Typography>
        </PageContainer>
      </SectionContainer>

      <SectionContainer>
        <PageContainer>
          <Typography variant="h4" gutterBottom>Features</Typography>
          <Box sx={ { display: 'flex', gap: 3, flexWrap: 'wrap' } }>
            { [1, 2, 3].map((i) => (
              <Placeholder.Box key={ i } label={ `Feature ${i}` } height={ 100 } sx={ { flex: '1 1 200px' } } />
            )) }
          </Box>
        </PageContainer>
      </SectionContainer>

      <SectionContainer sx={{ bgcolor: 'grey.900', color: 'white' }}>
        <PageContainer>
          <Typography variant="body2" align="center">
            © 2024 Footer Section - Full width background with centered content
          </Typography>
        </PageContainer>
      </SectionContainer>
    </Box>
  ),
};

