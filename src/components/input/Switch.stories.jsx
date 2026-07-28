import { useState } from 'react';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';

export default {
  title: 'Component/7. Input & Control/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## Switch [MUI]

Toggle switch component. Used to switch between on and off states.

### Usage Patterns

| Pattern | Description | Example |
|------|------|------|
| Basic | Basic switch | \`<Switch />\` |
| Labeled | Switch with a label | \`<FormControlLabel label="Label" control={<Switch />} />\` |
| iOS Style | iOS style switch | Custom styling applied |
        `,
      },
    },
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'error', 'info', 'warning', 'default'],
      description: 'Sets the switch color.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
      description: 'Sets the switch size.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'medium' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the switch.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Sets the default switch state.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    edge: {
      control: 'select',
      options: ['start', 'end', false],
      description: 'Sets the switch edge position.',
      table: {
        type: { summary: 'string | false' },
        defaultValue: { summary: 'false' },
      },
    },
  },
};

/** Basic switch */
export const Default = {
  args: {
    color: 'primary',
    size: 'medium',
    disabled: false,
    defaultChecked: false,
  },
  render: (args) => (
    <Switch
      color={ args.color }
      size={ args.size }
      disabled={ args.disabled }
      defaultChecked={ args.defaultChecked }
    />
  ),
};

/** Switch with a label */
export const WithLabel = {
  render: () => {
    const [checked, setChecked] = useState(true);

    return (
      <FormControlLabel
        control={
          <Switch
            checked={ checked }
            onChange={ (e) => setChecked(e.target.checked) }
          />
        }
        label="Receive notifications"
      />
    );
  },
};

/** Size comparison */
export const Sizes = {
  render: () => (
    <Stack direction="row" spacing={ 2 } alignItems="center">
      <FormControlLabel
        control={ <Switch size="small" defaultChecked /> }
        label="Small"
      />
      <FormControlLabel
        control={ <Switch size="medium" defaultChecked /> }
        label="Medium"
      />
    </Stack>
  ),
};

/** Color variants */
export const Colors = {
  render: () => (
    <Stack direction="row" spacing={ 1 } flexWrap="wrap" useFlexGap>
      <FormControlLabel
        control={ <Switch defaultChecked color="primary" /> }
        label="Primary"
      />
      <FormControlLabel
        control={ <Switch defaultChecked color="secondary" /> }
        label="Secondary"
      />
      <FormControlLabel
        control={ <Switch defaultChecked color="success" /> }
        label="Success"
      />
      <FormControlLabel
        control={ <Switch defaultChecked color="error" /> }
        label="Error"
      />
      <FormControlLabel
        control={ <Switch defaultChecked color="info" /> }
        label="Info"
      />
      <FormControlLabel
        control={ <Switch defaultChecked color="warning" /> }
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
        control={ <Switch disabled /> }
        label="Disabled (Off)"
      />
      <FormControlLabel
        control={ <Switch disabled checked /> }
        label="Disabled (On)"
      />
    </Stack>
  ),
};

/** Switch group */
export const Group = {
  render: () => (
    <FormControl component="fieldset">
      <FormLabel component="legend">Notification Settings</FormLabel>
      <FormGroup>
        <FormControlLabel
          control={ <Switch defaultChecked /> }
          label="Email notifications"
        />
        <FormControlLabel
          control={ <Switch /> }
          label="SMS notifications"
        />
        <FormControlLabel
          control={ <Switch defaultChecked /> }
          label="Push notifications"
        />
      </FormGroup>
    </FormControl>
  ),
};

/** Label placement */
export const LabelPlacement = {
  render: () => (
    <Stack spacing={ 2 }>
      <FormControlLabel
        control={ <Switch /> }
        label="End (Default)"
        labelPlacement="end"
      />
      <FormControlLabel
        control={ <Switch /> }
        label="Start"
        labelPlacement="start"
      />
      <FormControlLabel
        control={ <Switch /> }
        label="Top"
        labelPlacement="top"
      />
      <FormControlLabel
        control={ <Switch /> }
        label="Bottom"
        labelPlacement="bottom"
      />
    </Stack>
  ),
};

/** Status text display */
export const WithStatusText = {
  render: () => {
    const [checked, setChecked] = useState(false);

    return (
      <Box sx={ { display: 'flex', alignItems: 'center', gap: 2 } }>
        <Typography variant="body2" color={ checked ? 'text.secondary' : 'text.primary' }>
          Off
        </Typography>
        <Switch
          checked={ checked }
          onChange={ (e) => setChecked(e.target.checked) }
        />
        <Typography variant="body2" color={ checked ? 'text.primary' : 'text.secondary' }>
          On
        </Typography>
      </Box>
    );
  },
};

/** Real world example: settings panel */
export const SettingsPanel = {
  render: () => {
    const [settings, setSettings] = useState({
      darkMode: false,
      notifications: true,
      autoSave: true,
      analytics: false,
      newsletter: false,
    });

    const handleChange = (name) => (event) => {
      setSettings({ ...settings, [name]: event.target.checked });
    };

    const SettingItem = ({ label, description, name, checked }) => (
      <Box sx={ { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', py: 1.5 } }>
        <Box sx={ { pr: 2 } }>
          <Typography variant="body1">{ label }</Typography>
          <Typography variant="caption" color="text.secondary">
            { description }
          </Typography>
        </Box>
        <Switch
          checked={ checked }
          onChange={ handleChange(name) }
          edge="end"
        />
      </Box>
    );

    return (
      <Paper sx={ { p: 3, width: 400 } }>
        <Typography variant="h6" sx={ { mb: 2, fontWeight: 600 } }>
          Settings
        </Typography>

        <Typography variant="overline" color="text.secondary">
          General
        </Typography>
        <SettingItem
          label="Dark Mode"
          description="Use a dark theme"
          name="darkMode"
          checked={ settings.darkMode }
        />
        <SettingItem
          label="Auto Save"
          description="Save changes automatically"
          name="autoSave"
          checked={ settings.autoSave }
        />

        <Divider sx={ { my: 2 } } />

        <Typography variant="overline" color="text.secondary">
          Notifications
        </Typography>
        <SettingItem
          label="Push Notifications"
          description="Receive updates as notifications"
          name="notifications"
          checked={ settings.notifications }
        />
        <SettingItem
          label="Newsletter"
          description="Receive the weekly newsletter by email"
          name="newsletter"
          checked={ settings.newsletter }
        />

        <Divider sx={ { my: 2 } } />

        <Typography variant="overline" color="text.secondary">
          Privacy
        </Typography>
        <SettingItem
          label="Analytics Data Collection"
          description="Collect usage data to improve the service"
          name="analytics"
          checked={ settings.analytics }
        />
      </Paper>
    );
  },
};

/** Real world example: public/private toggle */
export const VisibilityToggle = {
  render: () => {
    const [isPublic, setIsPublic] = useState(false);

    return (
      <Paper sx={ { p: 3, width: 300 } }>
        <Box sx={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }>
          <Box>
            <Typography variant="subtitle1" sx={ { fontWeight: 600 } }>
              { isPublic ? 'Public' : 'Private' }
            </Typography>
            <Typography variant="body2" color="text.secondary">
              { isPublic
                ? 'Visible to everyone'
                : 'Only visible to you'
              }
            </Typography>
          </Box>
          <Switch
            checked={ isPublic }
            onChange={ (e) => setIsPublic(e.target.checked) }
            color={ isPublic ? 'success' : 'default' }
          />
        </Box>
      </Paper>
    );
  },
};
