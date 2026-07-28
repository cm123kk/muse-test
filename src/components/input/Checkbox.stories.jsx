import { useState } from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

export default {
  title: 'Component/7. Input & Control/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## Checkbox [MUI]

A checkbox component that lets the user select one or more options.

### Usage Patterns

| Pattern | Description | Example |
|------|------|------|
| Basic | Basic checkbox | \`<Checkbox />\` |
| Labeled | Checkbox with a label | \`<FormControlLabel label="Label" control={<Checkbox />} />\` |
| Group | Checkbox group | \`<FormGroup>...</FormGroup>\` |
| Indeterminate | Partial selection state | \`indeterminate\` prop |
        `,
      },
    },
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'error', 'info', 'warning', 'default'],
      description: 'Sets the checkbox color.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Sets the checkbox size.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'medium' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the checkbox.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Sets the default checked state.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    indeterminate: {
      control: 'boolean',
      description: 'Sets the partial (indeterminate) selection state.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
};

/** Basic checkbox */
export const Default = {
  args: {
    color: 'primary',
    size: 'medium',
    disabled: false,
    defaultChecked: false,
    indeterminate: false,
  },
  render: (args) => (
    <Checkbox
      color={ args.color }
      size={ args.size }
      disabled={ args.disabled }
      defaultChecked={ args.defaultChecked }
      indeterminate={ args.indeterminate }
    />
  ),
};

/** Checkbox with a label */
export const WithLabel = {
  render: () => {
    const [checked, setChecked] = useState(false);

    return (
      <FormControlLabel
        control={
          <Checkbox
            checked={ checked }
            onChange={ (e) => setChecked(e.target.checked) }
          />
        }
        label="I agree to the Terms of Service"
      />
    );
  },
};

/** Size comparison */
export const Sizes = {
  render: () => (
    <Stack direction="row" spacing={ 2 } alignItems="center">
      <FormControlLabel
        control={ <Checkbox size="small" defaultChecked /> }
        label="Small"
      />
      <FormControlLabel
        control={ <Checkbox size="medium" defaultChecked /> }
        label="Medium"
      />
      <FormControlLabel
        control={ <Checkbox size="large" defaultChecked /> }
        label="Large"
      />
    </Stack>
  ),
};

/** Color variants */
export const Colors = {
  render: () => (
    <Stack direction="row" spacing={ 1 } flexWrap="wrap" useFlexGap>
      <FormControlLabel
        control={ <Checkbox defaultChecked color="primary" /> }
        label="Primary"
      />
      <FormControlLabel
        control={ <Checkbox defaultChecked color="secondary" /> }
        label="Secondary"
      />
      <FormControlLabel
        control={ <Checkbox defaultChecked color="success" /> }
        label="Success"
      />
      <FormControlLabel
        control={ <Checkbox defaultChecked color="error" /> }
        label="Error"
      />
      <FormControlLabel
        control={ <Checkbox defaultChecked color="info" /> }
        label="Info"
      />
      <FormControlLabel
        control={ <Checkbox defaultChecked color="warning" /> }
        label="Warning"
      />
    </Stack>
  ),
};

/** Disabled state */
export const Disabled = {
  render: () => (
    <Stack spacing={ 1 }>
      <FormControlLabel
        control={ <Checkbox disabled /> }
        label="Disabled (unchecked)"
      />
      <FormControlLabel
        control={ <Checkbox disabled checked /> }
        label="Disabled (checked)"
      />
    </Stack>
  ),
};

/** Checkbox group */
export const Group = {
  render: () => {
    const [selected, setSelected] = useState(['react']);

    const handleChange = (event) => {
      const value = event.target.name;
      setSelected((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      );
    };

    return (
      <FormControl component="fieldset">
        <FormLabel component="legend">Preferred framework</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={ selected.includes('react') }
                onChange={ handleChange }
                name="react"
              />
            }
            label="React"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={ selected.includes('vue') }
                onChange={ handleChange }
                name="vue"
              />
            }
            label="Vue"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={ selected.includes('angular') }
                onChange={ handleChange }
                name="angular"
              />
            }
            label="Angular"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={ selected.includes('svelte') }
                onChange={ handleChange }
                name="svelte"
              />
            }
            label="Svelte"
          />
        </FormGroup>
        <FormHelperText>Multiple selection allowed</FormHelperText>
      </FormControl>
    );
  },
};

/** Horizontal group layout */
export const GroupRow = {
  render: () => (
    <FormControl component="fieldset">
      <FormLabel component="legend">Areas of interest</FormLabel>
      <FormGroup row>
        <FormControlLabel
          control={ <Checkbox defaultChecked /> }
          label="Development"
        />
        <FormControlLabel
          control={ <Checkbox /> }
          label="Design"
        />
        <FormControlLabel
          control={ <Checkbox /> }
          label="Planning"
        />
        <FormControlLabel
          control={ <Checkbox /> }
          label="Marketing"
        />
      </FormGroup>
    </FormControl>
  ),
};

/** Indeterminate (partial selection) */
export const Indeterminate = {
  render: () => {
    const [checked, setChecked] = useState([true, false, false]);

    const handleParent = (event) => {
      setChecked([event.target.checked, event.target.checked, event.target.checked]);
    };

    const handleChild = (index) => (event) => {
      const newChecked = [...checked];
      newChecked[index] = event.target.checked;
      setChecked(newChecked);
    };

    const allChecked = checked.every(Boolean);
    const someChecked = checked.some(Boolean);

    return (
      <Box>
        <FormControlLabel
          control={
            <Checkbox
              checked={ allChecked }
              indeterminate={ someChecked && !allChecked }
              onChange={ handleParent }
            />
          }
          label="Select all"
        />
        <Box sx={ { display: 'flex', flexDirection: 'column', ml: 3 } }>
          <FormControlLabel
            control={ <Checkbox checked={ checked[0] } onChange={ handleChild(0) } /> }
            label="Option 1"
          />
          <FormControlLabel
            control={ <Checkbox checked={ checked[1] } onChange={ handleChild(1) } /> }
            label="Option 2"
          />
          <FormControlLabel
            control={ <Checkbox checked={ checked[2] } onChange={ handleChild(2) } /> }
            label="Option 3"
          />
        </Box>
      </Box>
    );
  },
};

/** Label placement */
export const LabelPlacement = {
  render: () => (
    <Stack spacing={ 2 }>
      <FormControlLabel
        control={ <Checkbox /> }
        label="End (default)"
        labelPlacement="end"
      />
      <FormControlLabel
        control={ <Checkbox /> }
        label="Start"
        labelPlacement="start"
      />
      <FormControlLabel
        control={ <Checkbox /> }
        label="Top"
        labelPlacement="top"
      />
      <FormControlLabel
        control={ <Checkbox /> }
        label="Bottom"
        labelPlacement="bottom"
      />
    </Stack>
  ),
};

/** Error state */
export const WithError = {
  render: () => (
    <FormControl error component="fieldset">
      <FormLabel component="legend">Terms of Service</FormLabel>
      <FormGroup>
        <FormControlLabel
          control={ <Checkbox color="error" /> }
          label="I agree to the Terms of Service (required)"
        />
        <FormControlLabel
          control={ <Checkbox color="error" /> }
          label="I agree to the collection of personal information (required)"
        />
      </FormGroup>
      <FormHelperText>Please select all required items</FormHelperText>
    </FormControl>
  ),
};

/** Real world example: notification settings */
export const NotificationSettings = {
  render: () => {
    const [settings, setSettings] = useState({
      email: true,
      push: true,
      sms: false,
      marketing: false,
    });

    const handleChange = (name) => (event) => {
      setSettings({ ...settings, [name]: event.target.checked });
    };

    return (
      <Paper sx={ { p: 3, width: 320 } }>
        <Typography variant="h6" sx={ { mb: 2, fontWeight: 600 } }>
          Notification settings
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={ settings.email }
                onChange={ handleChange('email') }
              />
            }
            label="Email notifications"
          />
          <Typography variant="caption" color="text.secondary" sx={ { ml: 4, mb: 1 } }>
            Receive news and updates by email
          </Typography>

          <FormControlLabel
            control={
              <Checkbox
                checked={ settings.push }
                onChange={ handleChange('push') }
              />
            }
            label="Push notifications"
          />
          <Typography variant="caption" color="text.secondary" sx={ { ml: 4, mb: 1 } }>
            Receive app push notifications
          </Typography>

          <FormControlLabel
            control={
              <Checkbox
                checked={ settings.sms }
                onChange={ handleChange('sms') }
              />
            }
            label="SMS notifications"
          />
          <Typography variant="caption" color="text.secondary" sx={ { ml: 4, mb: 1 } }>
            Receive important alerts by text message
          </Typography>

          <FormControlLabel
            control={
              <Checkbox
                checked={ settings.marketing }
                onChange={ handleChange('marketing') }
              />
            }
            label="Agree to marketing communications"
          />
          <Typography variant="caption" color="text.secondary" sx={ { ml: 4 } }>
            Receive promotions and event information
          </Typography>
        </FormGroup>
      </Paper>
    );
  },
};
