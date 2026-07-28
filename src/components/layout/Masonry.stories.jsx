import Masonry from '@mui/lab/Masonry';
import Box from '@mui/material/Box';
import Placeholder from '../../common/ui/Placeholder';

/**
 * Random height generation (to demonstrate the Masonry effect)
 */
const heights = [150, 90, 180, 120, 200, 100, 160, 130, 170, 110, 140, 190];

export default {
  title: 'Component/8. Layout/Masonry',
  component: Masonry,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## Masonry [MUI]

The Masonry component from \`@mui/lab\`. It implements a **Pinterest-style** variable height grid layout.

### Differences from Grid

| Grid | Masonry |
|------|---------|
| Flexbox based | CSS columns based |
| Even row height | Preserves individual item height |
| Left to right order | Top to bottom order |
| General layout | Image gallery, card list |

### Use Scenarios
- Image gallery (various ratios)
- Card list (various content lengths)
- Pinterest/Behance style layouts

### Key Props

| Prop | Type | Description |
|------|------|------|
| \`columns\` | number \\| object | Number of columns (responsive support) |
| \`spacing\` | number | Spacing between items (in units of 8px) |
| \`defaultColumns\` | number | Default number of columns for SSR |
| \`defaultSpacing\` | number | Default spacing for SSR |
        `,
      },
    },
  },
  argTypes: {
    columns: {
      control: 'select',
      options: [1, 2, 3, 4, 5, 6],
      description: 'Sets the number of columns.',
      table: {
        type: { summary: 'number | object' },
        defaultValue: { summary: '4' },
      },
    },
    spacing: {
      control: 'select',
      options: [0, 1, 2, 3, 4],
      description: 'Spacing between items (in units of 8px)',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
      },
    },
  },
};

/** Basic Masonry: items of various heights */
export const Default = {
  args: {
    columns: 4,
    spacing: 2,
  },
  render: ({ columns, spacing }) => (
    <Box sx={ { width: '100%' } }>
      <Masonry columns={ columns } spacing={ spacing }>
        { heights.map((height, index) => (
          <Placeholder.Box key={ index } label={ `${index + 1}` } height={ height } />
        )) }
      </Masonry>
    </Box>
  ),
};

/** Responsive columns: number of columns per breakpoint */
export const Responsive = {
  render: () => (
    <Box sx={ { width: '100%' } }>
      <Masonry columns={ { xs: 1, sm: 2, md: 3, lg: 4 } } spacing={ 2 }>
        { heights.map((height, index) => (
          <Placeholder.Box key={ index } label={ `${index + 1}` } height={ height } />
        )) }
      </Masonry>
    </Box>
  ),
};

/** Image gallery: Masonry effect with real images */
export const ImageGallery = {
  render: () => (
    <Box sx={ { width: '100%' } }>
      <Masonry columns={ { xs: 2, sm: 3, md: 4 } } spacing={ 2 }>
        { Array.from({ length: 8 }, (_, i) => (
          <Placeholder.Media key={ i } index={ i } category="abstract" />
        )) }
      </Masonry>
    </Box>
  ),
};

/** Spacing comparison */
export const SpacingComparison = {
  render: () => (
    <Box sx={ { display: 'flex', flexDirection: 'column', gap: 4 } }>
      { [1, 2, 3].map((spacing) => (
        <Box key={ spacing }>
          <Box sx={ { mb: 1, fontWeight: 600 } }>spacing={ spacing }</Box>
          <Masonry columns={ 4 } spacing={ spacing }>
            { [100, 80, 120, 90].map((height, index) => (
              <Placeholder.Box key={ index } label={ `${index + 1}` } height={ height } />
            )) }
          </Masonry>
        </Box>
      )) }
    </Box>
  ),
};

/** Column count comparison */
export const ColumnsComparison = {
  render: () => (
    <Box sx={ { display: 'flex', flexDirection: 'column', gap: 4 } }>
      { [2, 3, 4, 5].map((columns) => (
        <Box key={ columns }>
          <Box sx={ { mb: 1, fontWeight: 600 } }>columns={ columns }</Box>
          <Masonry columns={ columns } spacing={ 1 }>
            { heights.slice(0, 8).map((height, index) => (
              <Placeholder.Box key={ index } label={ `${index + 1}` } height={ height } />
            )) }
          </Masonry>
        </Box>
      )) }
    </Box>
  ),
};
