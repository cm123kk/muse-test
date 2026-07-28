import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Placeholder from '../../common/ui/Placeholder';
import LineGrid from './LineGrid';

export default {
  title: 'Component/8. Layout/LineGrid',
  component: LineGrid,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## LineGrid

A custom layout component that extends MUI Grid to automatically draw lines (borders) between items.

### Key Features
- **Grid Container mode**: automatically creates vertical/horizontal lines between Grid items when the \`container\` prop is used
- **Stack mode**: works as Stack + Divider when used without the \`container\` prop
- **Equal Height**: distributes all row heights evenly with the \`equalHeight\` prop
- **Row Heights**: specify per-row ratios with the \`rowHeights\` prop

### Usage Patterns
| Pattern | Description | Example |
|------|------|------|
| Grid Container | Grid with lines | \`<LineGrid container gap={16}>\` |
| Stack | Vertical dividers | \`<LineGrid>\` |
| Equal Height | Even height | \`<LineGrid container equalHeight>\` |
| Row Heights | Ratio specification | \`<LineGrid container rowHeights={[1, 2]}>\` |
        `,
      },
    },
  },
  argTypes: {
    container: {
      control: 'boolean',
      description: 'Enable Grid container mode. When false, works in Stack mode',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    gap: {
      control: { type: 'range', min: 0, max: 64, step: 8 },
      description: 'Spacing between items (px). Lines are drawn at the center of this spacing',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
      },
    },
    borderColor: {
      control: 'text',
      description: 'Line color (MUI color token)',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'text.primary' },
      },
    },
    equalHeight: {
      control: 'boolean',
      description: 'Distribute all row heights evenly',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    rowHeights: {
      control: 'object',
      description: 'Array of per-row height ratios (example: [1, 2, 1])',
      table: {
        type: { summary: 'number[]' },
        defaultValue: { summary: 'null' },
      },
    },
  },
};

/** Basic Grid Container: grid layout with lines */
export const Default = {
  args: {
    container: true,
    gap: 16,
    borderColor: 'text.primary',
  },
  render: ({ container, gap, borderColor }) => (
    <Box sx={ { width: '100%', maxWidth: 600 } }>
      <LineGrid container={ container } gap={ gap } borderColor={ borderColor }>
        <Grid size={ { xs: 6 } }>
          <Placeholder.Box label="xs=6" height={ 80 } />
        </Grid>
        <Grid size={ { xs: 6 } }>
          <Placeholder.Box label="xs=6" height={ 80 } />
        </Grid>
        <Grid size={ { xs: 4 } }>
          <Placeholder.Box label="xs=4" height={ 80 } />
        </Grid>
        <Grid size={ { xs: 4 } }>
          <Placeholder.Box label="xs=4" height={ 80 } />
        </Grid>
        <Grid size={ { xs: 4 } }>
          <Placeholder.Box label="xs=4" height={ 80 } />
        </Grid>
      </LineGrid>
    </Box>
  ),
};

/** Stack mode: separate sections with vertical Dividers */
export const StackMode = {
  args: {
    gap: 16,
    borderColor: 'text.primary',
  },
  render: ({ gap, borderColor }) => (
    <Box sx={ { width: '100%', maxWidth: 400 } }>
      <LineGrid gap={ gap } borderColor={ borderColor }>
        <Placeholder.Box label="Section 1" height={ 60 } />
        <Placeholder.Box label="Section 2" height={ 60 } />
        <Placeholder.Box label="Section 3" height={ 60 } />
      </LineGrid>
    </Box>
  ),
};

/** Equal Height: even height for all rows */
export const EqualHeight = {
  args: {
    gap: 16,
    borderColor: 'divider',
  },
  render: ({ gap, borderColor }) => (
    <Box sx={ { width: '100%', maxWidth: 600, height: 300 } }>
      <LineGrid container gap={ gap } borderColor={ borderColor } equalHeight>
        <Grid size={ { xs: 12 } }>
          <Placeholder.Box label="Row 1 (1/3)" height="100%" />
        </Grid>
        <Grid size={ { xs: 6 } }>
          <Placeholder.Box label="Row 2 - Col 1" height="100%" />
        </Grid>
        <Grid size={ { xs: 6 } }>
          <Placeholder.Box label="Row 2 - Col 2" height="100%" />
        </Grid>
        <Grid size={ { xs: 4 } }>
          <Placeholder.Box label="Row 3" height="100%" />
        </Grid>
        <Grid size={ { xs: 4 } }>
          <Placeholder.Box label="Row 3" height="100%" />
        </Grid>
        <Grid size={ { xs: 4 } }>
          <Placeholder.Box label="Row 3" height="100%" />
        </Grid>
      </LineGrid>
    </Box>
  ),
};

/** Row Heights: specify per-row ratios */
export const CustomRowHeights = {
  args: {
    gap: 16,
    borderColor: 'text.secondary',
    rowHeights: [1, 2],
  },
  render: ({ gap, borderColor, rowHeights }) => (
    <Box sx={ { width: '100%', maxWidth: 600, height: 300 } }>
      <LineGrid container gap={ gap } borderColor={ borderColor } rowHeights={ rowHeights }>
        <Grid size={ { xs: 12 } }>
          <Placeholder.Box label="Row 1 (1/3 height)" height="100%" />
        </Grid>
        <Grid size={ { xs: 6 } }>
          <Placeholder.Box label="Row 2 (2/3 height)" height="100%" />
        </Grid>
        <Grid size={ { xs: 6 } }>
          <Placeholder.Box label="Row 2 (2/3 height)" height="100%" />
        </Grid>
      </LineGrid>
    </Box>
  ),
};

/** Responsive grid: layout changes per breakpoint */
export const Responsive = {
  args: {
    gap: 16,
    borderColor: 'text.primary',
  },
  render: ({ gap, borderColor }) => (
    <Box sx={ { width: '100%', maxWidth: 800 } }>
      <Typography variant="caption" color="text.secondary" sx={ { mb: 2, display: 'block' } }>
        Resize the browser to see the responsive behavior
      </Typography>
      <LineGrid container gap={ gap } borderColor={ borderColor }>
        <Grid size={ { xs: 12, md: 8 } }>
          <Placeholder.Box label="xs=12 md=8" height={ 100 } />
        </Grid>
        <Grid size={ { xs: 12, md: 4 } }>
          <Placeholder.Box label="xs=12 md=4" height={ 100 } />
        </Grid>
        <Grid size={ { xs: 6, md: 4 } }>
          <Placeholder.Box label="xs=6 md=4" height={ 80 } />
        </Grid>
        <Grid size={ { xs: 6, md: 4 } }>
          <Placeholder.Box label="xs=6 md=4" height={ 80 } />
        </Grid>
        <Grid size={ { xs: 12, md: 4 } }>
          <Placeholder.Box label="xs=12 md=4" height={ 80 } />
        </Grid>
      </LineGrid>
    </Box>
  ),
};

/** Border Color variants: various line colors */
export const BorderColorVariants = {
  render: () => (
    <Box sx={ { display: 'flex', flexDirection: 'column', gap: 4, width: '100%', maxWidth: 400 } }>
      <Box>
        <Typography variant="subtitle2" sx={ { mb: 1 } }>borderColor="text.primary"</Typography>
        <LineGrid container gap={ 16 } borderColor="text.primary">
          <Grid size={ { xs: 6 } }><Placeholder.Box label="1" height={ 50 } /></Grid>
          <Grid size={ { xs: 6 } }><Placeholder.Box label="2" height={ 50 } /></Grid>
        </LineGrid>
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={ { mb: 1 } }>borderColor="primary.main"</Typography>
        <LineGrid container gap={ 16 } borderColor="primary.main">
          <Grid size={ { xs: 6 } }><Placeholder.Box label="1" height={ 50 } /></Grid>
          <Grid size={ { xs: 6 } }><Placeholder.Box label="2" height={ 50 } /></Grid>
        </LineGrid>
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={ { mb: 1 } }>borderColor="divider"</Typography>
        <LineGrid container gap={ 16 } borderColor="divider">
          <Grid size={ { xs: 6 } }><Placeholder.Box label="1" height={ 50 } /></Grid>
          <Grid size={ { xs: 6 } }><Placeholder.Box label="2" height={ 50 } /></Grid>
        </LineGrid>
      </Box>
    </Box>
  ),
};
