import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Placeholder from '../../common/ui/Placeholder';
import { CarouselContainer } from './CarouselContainer';

/**
 * Create sample items for the demo
 */
const createSampleItems = (count) =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `Item ${i + 1}`,
  }));

const sampleItems = createSampleItems(8);

/**
 * Default item renderer, based on Placeholder.Box
 */
const DefaultItemRenderer = (item) => (
  <Placeholder.Box label={ item.title } height={ 180 } />
);

/**
 * Card style item renderer, based on Placeholder.Card
 */
const CardItemRenderer = (item) => (
  <Placeholder.Card ratio="16/9" lines={ 2 } />
);

/**
 * Story component: ResponsiveDemo
 */
function ResponsiveDemo() {
  return (
    <Box sx={{ width: '100%', maxWidth: 1200 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        The number of visible items changes with screen size. (xs:1, sm:2, md:3, lg:4)
      </Typography>
      <CarouselContainer
        items={sampleItems}
        renderItem={DefaultItemRenderer}
        visible={{ xs: 1, sm: 2, md: 3, lg: 4 }}
        gap={16}
      />
    </Box>
  );
}

/**
 * Story component: WithDividerDemo
 */
function WithDividerDemo() {
  return (
    <Box sx={{ width: '100%', maxWidth: 1000 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Dividers are shown between items.
      </Typography>
      <CarouselContainer
        items={sampleItems}
        renderItem={CardItemRenderer}
        visible={{ xs: 1, sm: 2, md: 3 }}
        gap={24}
        hasDivider
        dividerColor="rgba(0,0,0,0.12)"
      />
    </Box>
  );
}

/**
 * Story component: OutsideNavigationDemo
 */
function OutsideNavigationDemo() {
  return (
    <Box sx={{ width: '100%', maxWidth: 900, px: 8 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        The navigation buttons are positioned outside the container.
      </Typography>
      <CarouselContainer
        items={sampleItems}
        renderItem={DefaultItemRenderer}
        visible={{ xs: 1, sm: 2, md: 3 }}
        gap={16}
        navPosition="outside"
      />
    </Box>
  );
}

/**
 * Story component: IndexChangeDemo
 */
function IndexChangeDemo() {
  const [index, setIndex] = useState(0);

  return (
    <Box sx={{ width: '100%', maxWidth: 1000 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Current index:
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
          {index}
        </Typography>
      </Stack>
      <CarouselContainer
        items={sampleItems}
        renderItem={CardItemRenderer}
        visible={{ xs: 1, sm: 2, md: 3 }}
        gap={20}
        onIndexChange={setIndex}
      />
    </Box>
  );
}

/**
 * Story component: StepDemo
 */
function StepDemo() {
  return (
    <Box sx={{ width: '100%', maxWidth: 1000 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        step=2: moves 2 items at a time.
      </Typography>
      <CarouselContainer
        items={createSampleItems(12)}
        renderItem={DefaultItemRenderer}
        visible={{ xs: 2, sm: 3, md: 4 }}
        gap={16}
        step={2}
      />
    </Box>
  );
}

/**
 * Story component: NoNavigationDemo
 */
function NoNavigationDemo() {
  return (
    <Box sx={{ width: '100%', maxWidth: 1000 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        The navigation buttons are hidden. Use this when controlling the carousel by other means such as touch swipe.
      </Typography>
      <CarouselContainer
        items={sampleItems.slice(0, 4)}
        renderItem={CardItemRenderer}
        visible={{ xs: 1, sm: 2, md: 4 }}
        gap={16}
        hasNavigation={false}
      />
    </Box>
  );
}

export default {
  title: 'Component/2. Container/CarouselContainer',
  component: CarouselContainer,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## CarouselContainer

A responsive multi-item carousel container component.

### Features
- Configure visible count per breakpoint
- Smooth slide animation
- Divider support between items
- Customizable navigation button position
- Index change callback support
        `,
      },
    },
  },
  argTypes: {
    items: {
      description: 'Array of items to render',
      table: {
        type: { summary: 'Array' },
      },
    },
    renderItem: {
      description: 'Item renderer function (item, index) => ReactNode',
      table: {
        type: { summary: 'function' },
      },
    },
    visible: {
      description: 'Visible count per breakpoint {xs, sm, md, lg, xl}',
      control: 'object',
      table: {
        type: { summary: 'object' },
        defaultValue: { summary: '{xs:1, sm:2, md:3, lg:4}' },
      },
    },
    gap: {
      description: 'Spacing between items (px)',
      control: { type: 'number', min: 0, max: 48 },
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 16 },
      },
    },
    step: {
      description: 'Number of items to move at once',
      control: { type: 'number', min: 1, max: 5 },
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 1 },
      },
    },
    hasNavigation: {
      description: 'Show navigation buttons',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    hasDivider: {
      description: 'Show dividers between items',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    dividerColor: {
      description: 'Divider color',
      control: 'color',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'divider' },
      },
    },
    navPosition: {
      description: 'Navigation button position',
      control: 'radio',
      options: ['inside', 'outside'],
      table: {
        type: { summary: "'inside' | 'outside'" },
        defaultValue: { summary: 'inside' },
      },
    },
    onIndexChange: {
      description: 'Index change callback function',
      table: {
        type: { summary: '(index: number) => void' },
      },
    },
  },
};

/**
 * Basic carousel with responsive item visibility
 */
export const Default = {
  args: {
    items: sampleItems,
    renderItem: DefaultItemRenderer,
    visible: { xs: 1, sm: 2, md: 3, lg: 4 },
    gap: 16,
    step: 1,
    hasNavigation: true,
    hasDivider: false,
    navPosition: 'inside',
  },
};

/**
 * Responsive demo showing changes by screen size
 */
export const Responsive = {
  render: () => <ResponsiveDemo />,
};

/**
 * Carousel with dividers
 */
export const WithDivider = {
  render: () => <WithDividerDemo />,
};

/**
 * Outside navigation buttons
 */
export const OutsideNavigation = {
  render: () => <OutsideNavigationDemo />,
};

/**
 * Index change callback demo
 */
export const WithIndexChange = {
  render: () => <IndexChangeDemo />,
};

/**
 * Step setting demo, moving several items at once
 */
export const StepMovement = {
  render: () => <StepDemo />,
};

/**
 * Hidden navigation
 */
export const NoNavigation = {
  render: () => <NoNavigationDemo />,
};
