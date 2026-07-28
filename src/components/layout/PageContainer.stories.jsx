import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Placeholder from '../../common/ui/Placeholder';
import { PageContainer } from './PageContainer';
import { DocumentTitle, SectionTitle } from '../storybookDocumentation';

export default {
  title: 'Component/8. Layout/PageContainer',
  component: PageContainer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * ## Basic Usage
 *
 * PageContainer is a container that wraps the main content of a page.
 * - Based on MUI Container, it provides center alignment and responsive padding
 * - Set the maximum width with the maxWidth option
 * - Default: xl (1536px)
 */
export const Default = {
  render: () => (
    <Box>
      <DocumentTitle
        title="PageContainer"
        status="Ready"
        note="A container that centers page content and applies horizontal padding"
        brandName="Layout"
        systemName="Container"
        version="1.0"
      />
      
      <Box sx={ { py: 4 } }>
        <SectionTitle>Basic Usage</SectionTitle>
        <PageContainer>
          <Placeholder.Box label="PageContainer (maxWidth=&quot;xl&quot;)" height={ 120 } />
          <Box sx={ { mt: 1 } }>
            <Typography color="text.secondary" variant="body2">
              Content is centered on screen and expands up to a maximum width of 1536px.
              Responsive padding is automatically applied on the left and right.
            </Typography>
          </Box>
        </PageContainer>
      </Box>
    </Box>
  ),
};

/**
 * ## variant (fluid / focus)
 *
 * Page width mode. fluid uses the full viewport (browsing and grid pages),
 * focus centers content with a narrow maxWidth (creation, input, and settings pages).
 */
export const Variants = {
  name: 'variant (fluid / focus)',
  render: () => (
    <Box sx={ { py: 4, bgcolor: 'grey.100' } }>
      <SectionTitle>variant comparison</SectionTitle>

      <Box sx={ { mb: 3 } }>
        <Typography variant="caption" sx={ { px: 2 } }>variant=&quot;fluid&quot;: full viewport width + clamp(24, 4vw, 64) padding</Typography>
        <PageContainer variant="fluid">
          <Placeholder.Box label="fluid: browsing pages such as Reference / Project list / detail" height={ 96 } />
        </PageContainer>
      </Box>

      <Box>
        <Typography variant="caption" sx={ { px: 2 } }>variant=&quot;focus&quot;: focusMaxWidth 720px (default), center aligned</Typography>
        <PageContainer variant="focus">
          <Placeholder.Box label="focus: narrow form pages such as Project creation / settings" height={ 96 } />
        </PageContainer>
      </Box>
    </Box>
  ),
};

/**
 * ## maxWidth options (compatibility mode when variant is not set)
 *
 * Comparison of container width for various maxWidth values
 */
export const MaxWidthOptions = {
  name: 'maxWidth options',
  render: () => (
    <Box sx={ { py: 4, bgcolor: 'grey.100' } }>
      <SectionTitle>maxWidth options comparison</SectionTitle>

      <Box sx={ { mb: 2 } }>
        <Typography variant="caption" sx={ { px: 2 } }>maxWidth="sm" (600px)</Typography>
        <PageContainer maxWidth="sm">
          <Placeholder.Box label="sm: suitable for small forms or login pages" height={ 64 } />
        </PageContainer>
      </Box>

      <Box sx={ { mb: 2 } }>
        <Typography variant="caption" sx={ { px: 2 } }>maxWidth="md" (900px)</Typography>
        <PageContainer maxWidth="md">
          <Placeholder.Box label="md: comfortable reading width, suitable for blogs or document pages" height={ 64 } />
        </PageContainer>
      </Box>

      <Box sx={ { mb: 2 } }>
        <Typography variant="caption" sx={ { px: 2 } }>maxWidth="lg" (1200px)</Typography>
        <PageContainer maxWidth="lg">
          <Placeholder.Box label="lg: suitable for pages with dashboards or tables" height={ 64 } />
        </PageContainer>
      </Box>

      <Box>
        <Typography variant="caption" sx={ { px: 2 } }>maxWidth="xl" (1536px) - default</Typography>
        <PageContainer maxWidth="xl">
          <Placeholder.Box label="xl: wide content, suitable for galleries or large grids" height={ 64 } />
        </PageContainer>
      </Box>
    </Box>
  ),
};

/**
 * ## Props Documentation
 */
export const Props = {
  name: 'Props',
  render: () => (
    <Box sx={ { py: 4 } }>
      <SectionTitle>Props</SectionTitle>
      <PageContainer>
        <Paper sx={ { p: 3 } }>
          <Box component="table" sx={ { width: '100%', borderCollapse: 'collapse', '& td, & th': { p: 1.5, borderBottom: '1px solid', borderColor: 'divider', textAlign: 'left' } } }>
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
                <td><Typography variant="body2" sx={ { fontFamily: 'monospace' } }>children</Typography></td>
                <td><Typography variant="body2" color="text.secondary">node</Typography></td>
                <td><Typography variant="body2" color="text.secondary">-</Typography></td>
                <td><Typography variant="body2">Content inside the container</Typography></td>
              </tr>
              <tr>
                <td><Typography variant="body2" sx={ { fontFamily: 'monospace' } }>variant</Typography></td>
                <td><Typography variant="body2" color="text.secondary">'fluid' | 'focus'</Typography></td>
                <td><Typography variant="body2" color="text.secondary">-</Typography></td>
                <td><Typography variant="body2">Page width mode. fluid=full viewport+clamp padding / focus=centered narrow maxWidth</Typography></td>
              </tr>
              <tr>
                <td><Typography variant="body2" sx={ { fontFamily: 'monospace' } }>focusMaxWidth</Typography></td>
                <td><Typography variant="body2" color="text.secondary">number</Typography></td>
                <td><Typography variant="body2" color="text.secondary">720</Typography></td>
                <td><Typography variant="body2">max-width (px) of the focus variant</Typography></td>
              </tr>
              <tr>
                <td><Typography variant="body2" sx={ { fontFamily: 'monospace' } }>maxWidth</Typography></td>
                <td><Typography variant="body2" color="text.secondary">xs | sm | md | lg | xl | false</Typography></td>
                <td><Typography variant="body2" color="text.secondary">'xl'</Typography></td>
                <td><Typography variant="body2">Maximum width setting</Typography></td>
              </tr>
              <tr>
                <td><Typography variant="body2" sx={ { fontFamily: 'monospace' } }>disableGutters</Typography></td>
                <td><Typography variant="body2" color="text.secondary">boolean</Typography></td>
                <td><Typography variant="body2" color="text.secondary">false</Typography></td>
                <td><Typography variant="body2">Disable horizontal padding</Typography></td>
              </tr>
              <tr>
                <td><Typography variant="body2" sx={ { fontFamily: 'monospace' } }>sx</Typography></td>
                <td><Typography variant="body2" color="text.secondary">object</Typography></td>
                <td><Typography variant="body2" color="text.secondary">-</Typography></td>
                <td><Typography variant="body2">Additional styles</Typography></td>
              </tr>
            </tbody>
          </Box>
        </Paper>
      </PageContainer>
    </Box>
  ),
};

