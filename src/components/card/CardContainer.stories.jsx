import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { CardContainer } from './CardContainer';
import Placeholder from '../../common/ui/Placeholder';

export default {
  title: 'Component/3. Card/CardContainer',
  component: CardContainer,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## CardContainer

A wrapper component with commonly used card styles predefined.
It is the base container for various card components such as CustomCard and ImageCard.

### Variant types
- **outlined**: Default style with a border (default)
- **elevation**: Style with a shadow
- **ghost**: Transparent style with no background or border
- **filled**: Style with a filled background color
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['outlined', 'elevation', 'ghost', 'filled'],
      description: 'Card style variant',
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Inner padding',
    },
    radius: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Corner radius',
    },
    isInteractive: {
      control: 'boolean',
      description: 'Enable hover effect',
    },
    isSelected: {
      control: 'boolean',
      description: 'Show selected state',
    },
  },
};

/**
 * Default CardContainer
 */
export const Default = {
  args: {
    variant: 'outlined',
    padding: 'md',
    radius: 'md',
    isInteractive: false,
    isSelected: false,
  },
  render: (args) => (
    <CardContainer { ...args } sx={ { width: 320 } }>
      <Typography variant="h6" sx={ { fontWeight: 600, mb: 1 } }>
        Card Title
      </Typography>
      <Typography variant="body2" color="text.secondary">
        CardContainer is a basic card wrapper that supports various variants.
      </Typography>
    </CardContainer>
  ),
};

/**
 * Variant comparison
 */
export const Variants = {
  render: () => (
    <Stack direction="row" spacing={ 2 } flexWrap="wrap" useFlexGap>
      { ['outlined', 'elevation', 'ghost', 'filled'].map((variant) => (
        <CardContainer
          key={ variant }
          variant={ variant }
          padding="md"
          sx={ { width: 200 } }
        >
          <Typography variant="subtitle2" sx={ { fontWeight: 600, mb: 0.5 } }>
            { variant }
          </Typography>
          <Typography variant="body2" color="text.secondary">
            variant=&quot;{ variant }&quot;
          </Typography>
        </CardContainer>
      )) }
    </Stack>
  ),
};

/**
 * Padding comparison
 */
export const Paddings = {
  render: () => (
    <Stack direction="row" spacing={ 2 } alignItems="flex-start">
      { ['none', 'sm', 'md', 'lg'].map((padding) => (
        <CardContainer
          key={ padding }
          variant="outlined"
          padding={ padding }
          sx={ { width: 150 } }
        >
          <Typography variant="body2" sx={ { fontWeight: 600 } }>
            padding: { padding }
          </Typography>
          <Chip label="Tag" size="small" sx={ { mt: 1 } } />
        </CardContainer>
      )) }
    </Stack>
  ),
};

/**
 * Radius comparison
 */
export const RadiusOptions = {
  render: () => (
    <Stack direction="row" spacing={ 2 }>
      { ['none', 'sm', 'md', 'lg'].map((radius) => (
        <CardContainer
          key={ radius }
          variant="elevation"
          padding="md"
          radius={ radius }
          sx={ { width: 150 } }
        >
          <Typography variant="body2" sx={ { fontWeight: 600 } }>
            radius: { radius }
          </Typography>
        </CardContainer>
      )) }
    </Stack>
  ),
};

/**
 * Interactive state
 */
export const Interactive = {
  render: () => (
    <Stack direction="row" spacing={ 2 }>
      { ['outlined', 'elevation', 'ghost', 'filled'].map((variant) => (
        <CardContainer
          key={ variant }
          variant={ variant }
          padding="md"
          isInteractive
          onClick={ () => console.log(`${variant} clicked!`) }
          sx={ { width: 180 } }
        >
          <Typography variant="subtitle2" sx={ { fontWeight: 600, mb: 0.5 } }>
            Interactive
          </Typography>
          <Typography variant="body2" color="text.secondary">
            { variant } + hover
          </Typography>
        </CardContainer>
      )) }
    </Stack>
  ),
};

/**
 * Selected state
 */
export const Selected = {
  render: () => (
    <Stack direction="row" spacing={ 2 }>
      <CardContainer variant="outlined" padding="md" sx={ { width: 180 } }>
        <Typography variant="subtitle2" sx={ { fontWeight: 600 } }>
          Normal
        </Typography>
        <Typography variant="body2" color="text.secondary">
          isSelected=false
        </Typography>
      </CardContainer>
      <CardContainer variant="outlined" padding="md" isSelected sx={ { width: 180 } }>
        <Typography variant="subtitle2" sx={ { fontWeight: 600 } }>
          Selected
        </Typography>
        <Typography variant="body2" color="text.secondary">
          isSelected=true
        </Typography>
      </CardContainer>
    </Stack>
  ),
};

/**
 * Real usage example: product card
 */
export const ProductExample = {
  render: () => (
    <CardContainer
      variant="outlined"
      padding="md"
      isInteractive
      onClick={ () => console.log('Product clicked') }
      sx={ { width: 280 } }
    >
      <Placeholder.Media
        index={ 0 }
        ratio="16/9"
        sx={ {
          width: '100%',
          height: 160,
          borderRadius: 1,
          mb: 2,
        } }
      />
      <Box sx={ { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 } }>
        <Typography variant="subtitle1" sx={ { fontWeight: 600 } }>
          Premium Wireless Earbuds
        </Typography>
        <Chip label="NEW" size="small" color="primary" />
      </Box>
      <Typography variant="body2" color="text.secondary" sx={ { mb: 2 } }>
        High-quality sound and comfortable fit
      </Typography>
      <Box sx={ { display: 'flex', alignItems: 'baseline', gap: 1 } }>
        <Typography variant="h6" color="primary" sx={ { fontWeight: 700 } }>
          ₩89,000
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={ { textDecoration: 'line-through' } }>
          ₩120,000
        </Typography>
      </Box>
    </CardContainer>
  ),
};

/**
 * Real usage example: stat card
 */
export const StatExample = {
  render: () => (
    <Stack direction="row" spacing={ 2 }>
      <CardContainer variant="elevation" padding="md" sx={ { minWidth: 180 } }>
        <Typography variant="overline" color="text.secondary">
          Total Visitors
        </Typography>
        <Typography variant="h4" sx={ { fontWeight: 700 } }>
          12,543
        </Typography>
        <Typography variant="caption" color="success.main">
          +12.5% vs last week
        </Typography>
      </CardContainer>
      <CardContainer variant="elevation" padding="md" sx={ { minWidth: 180 } }>
        <Typography variant="overline" color="text.secondary">
          New Signups
        </Typography>
        <Typography variant="h4" sx={ { fontWeight: 700 } }>
          847
        </Typography>
        <Typography variant="caption" color="error.main">
          -3.2% vs last week
        </Typography>
      </CardContainer>
    </Stack>
  ),
};

/**
 * Real usage example: selectable options
 */
export const SelectableOptions = {
  render: () => (
    <Stack direction="row" spacing={ 2 }>
      { ['Basic', 'Pro', 'Enterprise'].map((plan, index) => (
        <CardContainer
          key={ plan }
          variant="outlined"
          padding="md"
          isInteractive
          isSelected={ index === 1 }
          onClick={ () => console.log(`${plan} selected`) }
          sx={ { width: 160 } }
        >
          <Typography variant="subtitle1" sx={ { fontWeight: 700, mb: 0.5 } }>
            { plan }
          </Typography>
          <Typography variant="h5" sx={ { fontWeight: 700, mb: 1 } }>
            ${ index === 0 ? '9' : index === 1 ? '29' : '99' }
            <Typography component="span" variant="body2" color="text.secondary">
              /mo
            </Typography>
          </Typography>
          <Button
            variant={ index === 1 ? 'contained' : 'outlined' }
            size="small"
            fullWidth
            sx={ { textTransform: 'none' } }
          >
            { index === 1 ? 'Current' : 'Select' }
          </Button>
        </CardContainer>
      )) }
    </Stack>
  ),
};
