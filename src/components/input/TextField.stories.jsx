import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

export default {
  title: 'Component/7. Input & Control/TextField',
  component: TextField,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## TextField [MUI]

Form component for capturing user text input.

### Usage Patterns

| Pattern | Description | Example |
|------|------|------|
| Outlined | Bordered style (default) | \`variant="outlined"\` |
| Filled | Background fill style | \`variant="filled"\` |
| Standard | Underline style | \`variant="standard"\` |
| Multiline | Multi line input | \`multiline rows={4}\` |
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['outlined', 'filled', 'standard'],
      description: 'Sets the visual style of the input field.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'outlined' },
      },
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
      description: 'Sets the size of the input field.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'medium' },
      },
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'error', 'info', 'success', 'warning'],
      description: 'Sets the color shown on focus.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'primary' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input field.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    required: {
      control: 'boolean',
      description: 'Marks the field as required.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    error: {
      control: 'boolean',
      description: 'Displays the error state.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Expands to full width.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    label: {
      control: 'text',
      description: 'The label of the input field.',
      table: {
        type: { summary: 'string' },
      },
    },
    placeholder: {
      control: 'text',
      description: 'The placeholder text.',
      table: {
        type: { summary: 'string' },
      },
    },
    helperText: {
      control: 'text',
      description: 'Helper text shown below the input field.',
      table: {
        type: { summary: 'string' },
      },
    },
  },
};

/** Basic text field */
export const Default = {
  args: {
    label: 'Label',
    placeholder: 'Enter text',
  },
};

/** Variant comparison */
export const AllVariants = {
  render: () => (
    <Stack spacing={ 3 } sx={ { width: 300 } }>
      <TextField label="Outlined" variant="outlined" />
      <TextField label="Filled" variant="filled" />
      <TextField label="Standard" variant="standard" />
    </Stack>
  ),
};

/** Size comparison */
export const Sizes = {
  render: () => (
    <Stack spacing={ 3 } direction="row" alignItems="center">
      <TextField label="Small" size="small" />
      <TextField label="Medium" size="medium" />
    </Stack>
  ),
};

/** Required input */
export const Required = {
  args: {
    label: 'Name',
    required: true,
    helperText: 'This field is required',
  },
};

/** Error state */
export const Error = {
  render: () => (
    <Stack spacing={ 3 } sx={ { width: 300 } }>
      <TextField
        label="Email"
        error
        helperText="Not a valid email format"
        defaultValue="invalid-email"
      />
      <TextField
        label="Password"
        type="password"
        error
        helperText="Password must be at least 8 characters"
      />
    </Stack>
  ),
};

/** Disabled and read only */
export const DisabledAndReadOnly = {
  render: () => (
    <Stack spacing={ 3 } sx={ { width: 300 } }>
      <TextField
        label="Disabled"
        defaultValue="Disabled input"
        disabled
      />
      <TextField
        label="Read Only"
        defaultValue="Read only input"
        slotProps={ {
          input: {
            readOnly: true,
          },
        } }
      />
    </Stack>
  ),
};

/** Multiline input */
export const Multiline = {
  render: () => (
    <Stack spacing={ 3 } sx={ { width: 400 } }>
      <TextField
        label="Basic Multiline"
        multiline
        rows={ 4 }
        placeholder="Enter multiple lines of text"
      />
      <TextField
        label="Auto Height"
        multiline
        minRows={ 2 }
        maxRows={ 6 }
        placeholder="Height adjusts automatically based on content"
      />
    </Stack>
  ),
};

/** Input types */
export const InputTypes = {
  render: () => (
    <Stack spacing={ 3 } sx={ { width: 300 } }>
      <TextField label="Text" type="text" />
      <TextField label="Password" type="password" />
      <TextField label="Email" type="email" />
      <TextField label="Number" type="number" />
      <TextField label="Date" type="date" slotProps={ { inputLabel: { shrink: true } } } />
      <TextField label="Time" type="time" slotProps={ { inputLabel: { shrink: true } } } />
    </Stack>
  ),
};

/** Adornment (prefix/suffix elements) */
export const WithAdornments = {
  render: () => (
    <Stack spacing={ 3 } sx={ { width: 300 } }>
      <TextField
        label="Amount"
        slotProps={ {
          input: {
            startAdornment: <InputAdornment position="start">₩</InputAdornment>,
          },
        } }
      />
      <TextField
        label="Weight"
        slotProps={ {
          input: {
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
          },
        } }
      />
      <TextField
        label="Password"
        type="password"
        slotProps={ {
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" size="small">
                  <Box component="span" sx={ { fontSize: 16 } }>👁</Box>
                </IconButton>
              </InputAdornment>
            ),
          },
        } }
      />
    </Stack>
  ),
};

/** Color variants */
export const Colors = {
  render: () => (
    <Stack spacing={ 3 } sx={ { width: 300 } }>
      <TextField label="Primary" color="primary" focused />
      <TextField label="Secondary" color="secondary" focused />
      <TextField label="Success" color="success" focused />
      <TextField label="Warning" color="warning" focused />
    </Stack>
  ),
};

/** Full width */
export const FullWidth = {
  render: () => (
    <Box sx={ { width: 400 } }>
      <TextField
        label="Full Width"
        fullWidth
        helperText="Takes up the full width of the parent element"
      />
    </Box>
  ),
};

/** Form example: login */
export const LoginForm = {
  render: () => (
    <Box
      component="form"
      sx={ {
        width: 360,
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        bgcolor: 'background.paper',
        boxShadow: 1,
      } }
    >
      <Typography variant="h5" sx={ { fontWeight: 700, mb: 1 } }>
        Log In
      </Typography>
      <TextField
        label="Email"
        type="email"
        required
        fullWidth
        placeholder="example@email.com"
      />
      <TextField
        label="Password"
        type="password"
        required
        fullWidth
        placeholder="Enter your password"
      />
      <Typography variant="caption" color="text.secondary">
        * Required fields
      </Typography>
    </Box>
  ),
};

/** Form example: sign up */
export const SignupForm = {
  render: () => (
    <Box
      component="form"
      sx={ {
        width: 400,
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
        bgcolor: 'background.paper',
        boxShadow: 1,
      } }
    >
      <Typography variant="h5" sx={ { fontWeight: 700, mb: 1 } }>
        Sign Up
      </Typography>
      <TextField
        label="Name"
        required
        fullWidth
        helperText="Please enter your real name"
      />
      <TextField
        label="Email"
        type="email"
        required
        fullWidth
        helperText="A verification email will be sent"
      />
      <TextField
        label="Password"
        type="password"
        required
        fullWidth
        helperText="At least 8 characters, including letters, numbers, and symbols"
      />
      <TextField
        label="Confirm Password"
        type="password"
        required
        fullWidth
      />
      <TextField
        label="Bio"
        multiline
        rows={ 3 }
        fullWidth
        placeholder="Write a short bio (optional)"
      />
    </Box>
  ),
};
