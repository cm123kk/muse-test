import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

export default {
  title: 'Component/7. Input & Control/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## Button [MUI]

Showcases the various variants of the MUI Button component.

Combine props such as variant, color, and size to build the style you want.
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'contained', 'outlined'],
      description: 'Determines the visual style of the button.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'text' },
      },
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'error', 'info', 'warning'],
      description: 'Sets the color theme of the button.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Sets the size of the button.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'medium' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Sets the disabled state of the button.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Expands the button to the full width of its parent element.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    children: {
      control: 'text',
      description: 'Text or element displayed inside the button.',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
  },
};

/** Basic button */
export const Default = {
  args: {
    variant: 'contained',
    children: 'Button',
  },
};

/** Contained button: used for primary actions that need emphasis */
export const Contained = {
  args: {
    variant: 'contained',
    children: 'Contained Button',
  },
};

/** Outlined button: used for secondary actions */
export const Outlined = {
  args: {
    variant: 'outlined',
    children: 'Outlined Button',
  },
};

/** Text button: used for the lowest emphasis actions */
export const Text = {
  args: {
    variant: 'text',
    children: 'Text Button',
  },
};

/** Comparison of all variants */
export const AllVariants = {
  render: () => (
    <Stack spacing={ 2 } direction="row">
      <Button variant="text">Text</Button>
      <Button variant="contained">Contained</Button>
      <Button variant="outlined">Outlined</Button>
    </Stack>
  ),
};

/** Color variants: Primary, Secondary, Success, Error, Info, Warning */
export const Colors = {
  render: () => (
    <Stack spacing={ 2 } direction="row" flexWrap="wrap" useFlexGap>
      <Button variant="contained" color="primary">Primary</Button>
      <Button variant="contained" color="secondary">Secondary</Button>
      <Button variant="contained" color="success">Success</Button>
      <Button variant="contained" color="error">Error</Button>
      <Button variant="contained" color="info">Info</Button>
      <Button variant="contained" color="warning">Warning</Button>
    </Stack>
  ),
};

/** Size variants: Small, Medium, Large */
export const Sizes = {
  render: () => (
    <Stack spacing={ 2 } direction="row" alignItems="center">
      <Button variant="contained" size="small">Small</Button>
      <Button variant="contained" size="medium">Medium</Button>
      <Button variant="contained" size="large">Large</Button>
    </Stack>
  ),
};

/** Disabled state */
export const Disabled = {
  render: () => (
    <Stack spacing={ 2 } direction="row">
      <Button variant="text" disabled>Text</Button>
      <Button variant="contained" disabled>Contained</Button>
      <Button variant="outlined" disabled>Outlined</Button>
    </Stack>
  ),
};
