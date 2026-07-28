import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Placeholder from '../../common/ui/Placeholder';

export default {
  title: 'Component/8. Layout/Grid',
  component: Grid,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## Grid [MUI]

The MUI Grid v7 component.

Use the \`size\` prop to build a responsive layout. It is based on a **12 column system**.

### 12 Column System
- The sum of columns in a row is always **12**.
- When the sum exceeds 12, items automatically wrap to the next line.
- Example: two \`size={6}\` = 12 (one line), three \`size={6}\` = 18 (split into two lines)

| Layout | size value | Total |
|------|---------|------|
| Halves | 6 + 6 | 12 |
| Thirds | 4 + 4 + 4 | 12 |
| Quarters | 3 + 3 + 3 + 3 | 12 |
| Sidebar | 3 + 9 | 12 |

### Key Changes (v7)
- Use the \`size\` prop instead of \`xs\`, \`sm\`, \`md\`, and similar props
- Specify responsive values as \`size={{ xs: 12, md: 6 }}\`

### Usage Patterns
| Pattern | Description | Example |
|------|------|------|
| Fixed size | Set columns with a number | \`size={6}\` |
| Responsive | Set per breakpoint | \`size={{ xs: 12, md: 6 }}\` |
| Auto expand | Fill remaining space | \`size="grow"\` |
        `,
      },
    },
  },
  argTypes: {
    spacing: {
      control: 'select',
      options: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      description: 'Sets the spacing between Grid items. (in units of 8px)',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
      },
    },
  },
};

/** Basic grid: spacing is adjustable */
export const Default = {
  args: {
    spacing: 2,
  },
  render: ({ spacing }) => (
    <Box sx={ { flexGrow: 1 } }>
      <Grid container spacing={ spacing }>
        <Grid size={ 8 }>
          <Placeholder.Box label="size=8" />
        </Grid>
        <Grid size={ 4 }>
          <Placeholder.Box label="size=4" />
        </Grid>
        <Grid size={ 4 }>
          <Placeholder.Box label="size=4" />
        </Grid>
        <Grid size={ 8 }>
          <Placeholder.Box label="size=8" />
        </Grid>
      </Grid>
    </Box>
  ),
};

/** Equal columns: thirds */
export const EqualColumns = {
  args: {
    spacing: 2,
  },
  render: ({ spacing }) => (
    <Box sx={ { flexGrow: 1 } }>
      <Grid container spacing={ spacing }>
        <Grid size={ 4 }>
          <Placeholder.Box label="size=4" />
        </Grid>
        <Grid size={ 4 }>
          <Placeholder.Box label="size=4" />
        </Grid>
        <Grid size={ 4 }>
          <Placeholder.Box label="size=4" />
        </Grid>
      </Grid>
    </Box>
  ),
};

/** Responsive grid: different size per breakpoint */
export const Responsive = {
  args: {
    spacing: 2,
  },
  render: ({ spacing }) => (
    <Box sx={ { flexGrow: 1 } }>
      <Grid container spacing={ spacing }>
        <Grid size={ { xs: 12, sm: 6, md: 4 } }>
          <Placeholder.Box label="xs=12 sm=6 md=4" />
        </Grid>
        <Grid size={ { xs: 12, sm: 6, md: 4 } }>
          <Placeholder.Box label="xs=12 sm=6 md=4" />
        </Grid>
        <Grid size={ { xs: 12, sm: 6, md: 4 } }>
          <Placeholder.Box label="xs=12 sm=6 md=4" />
        </Grid>
      </Grid>
    </Box>
  ),
};

/** Auto layout: using grow */
export const AutoLayout = {
  args: {
    spacing: 2,
  },
  render: ({ spacing }) => (
    <Box sx={ { flexGrow: 1 } }>
      <Grid container spacing={ spacing }>
        <Grid size="grow">
          <Placeholder.Box label="grow" />
        </Grid>
        <Grid size={ 6 }>
          <Placeholder.Box label="size=6" />
        </Grid>
        <Grid size="grow">
          <Placeholder.Box label="grow" />
        </Grid>
      </Grid>
    </Box>
  ),
};

/** Nested grid */
export const NestedGrid = {
  args: {
    spacing: 2,
  },
  render: ({ spacing }) => (
    <Box sx={ { flexGrow: 1 } }>
      <Grid container spacing={ spacing }>
        <Grid size={ 12 }>
          <Placeholder.Box label="size=12 (Parent)" />
        </Grid>
        <Grid container size={ 12 } spacing={ spacing }>
          <Grid size={ 6 }>
            <Placeholder.Box label="Nested size=6" sx={ { backgroundColor: '#f5f5f5' } } />
          </Grid>
          <Grid size={ 6 }>
            <Placeholder.Box label="Nested size=6" sx={ { backgroundColor: '#f5f5f5' } } />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  ),
};

/** Spacing comparison: view various spacings at a glance */
export const SpacingComparison = {
  render: () => (
    <Box sx={ { flexGrow: 1 } }>
      <Grid container spacing={ 1 } sx={ { mb: 2 } }>
        <Grid size={ 4 }><Placeholder.Box label="spacing=1" /></Grid>
        <Grid size={ 4 }><Placeholder.Box label="spacing=1" /></Grid>
        <Grid size={ 4 }><Placeholder.Box label="spacing=1" /></Grid>
      </Grid>
      <Grid container spacing={ 2 } sx={ { mb: 2 } }>
        <Grid size={ 4 }><Placeholder.Box label="spacing=2" /></Grid>
        <Grid size={ 4 }><Placeholder.Box label="spacing=2" /></Grid>
        <Grid size={ 4 }><Placeholder.Box label="spacing=2" /></Grid>
      </Grid>
      <Grid container spacing={ 4 }>
        <Grid size={ 4 }><Placeholder.Box label="spacing=4" /></Grid>
        <Grid size={ 4 }><Placeholder.Box label="spacing=4" /></Grid>
        <Grid size={ 4 }><Placeholder.Box label="spacing=4" /></Grid>
      </Grid>
    </Box>
  ),
};
