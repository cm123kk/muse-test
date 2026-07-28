import { useState } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';

export default {
  title: 'Component/6. In-page Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## Tabs [MUI]

A tab navigation component. It provides switching between related groups of content.

### Usage Patterns

| Pattern | Description | Example |
|------|------|------|
| Basic | Basic tabs | \`<Tabs><Tab label="Tab 1" /></Tabs>\` |
| Centered | Center aligned | \`centered\` prop |
| Scrollable | Scrollable | \`variant="scrollable"\` |
| Vertical | Vertical orientation | \`orientation="vertical"\` |
        `,
      },
    },
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Sets the orientation of the tabs.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'horizontal' },
      },
    },
    variant: {
      control: 'select',
      options: ['standard', 'scrollable', 'fullWidth'],
      description: 'Sets the layout variant of the tabs.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'standard' },
      },
    },
    centered: {
      control: 'boolean',
      description: 'Centers the tabs.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    textColor: {
      control: 'select',
      options: ['inherit', 'primary', 'secondary'],
      description: 'Sets the tab text color.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'primary' },
      },
    },
    indicatorColor: {
      control: 'select',
      options: ['primary', 'secondary'],
      description: 'Sets the tab indicator color.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'primary' },
      },
    },
  },
};

/** Tab panel component */
const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={ value !== index }
    id={ `tabpanel-${index}` }
    aria-labelledby={ `tab-${index}` }
    { ...other }
  >
    { value === index && (
      <Box sx={ { p: 3 } }>
        <Typography>{ children }</Typography>
      </Box>
    ) }
  </div>
);

/** Basic tabs */
export const Default = {
  args: {
    orientation: 'horizontal',
    variant: 'standard',
    centered: false,
    textColor: 'primary',
    indicatorColor: 'primary',
  },
  render: (args) => {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    return (
      <Box sx={ { width: '100%' } }>
        <Box sx={ { borderBottom: 1, borderColor: 'divider' } }>
          <Tabs
            value={ value }
            onChange={ handleChange }
            orientation={ args.orientation }
            variant={ args.variant }
            centered={ args.centered }
            textColor={ args.textColor }
            indicatorColor={ args.indicatorColor }
          >
            <Tab label="Tab 1" />
            <Tab label="Tab 2" />
            <Tab label="Tab 3" />
          </Tabs>
        </Box>
        <TabPanel value={ value } index={ 0 }>
          Content of the first tab.
        </TabPanel>
        <TabPanel value={ value } index={ 1 }>
          Content of the second tab.
        </TabPanel>
        <TabPanel value={ value } index={ 2 }>
          Content of the third tab.
        </TabPanel>
      </Box>
    );
  },
};

/** Centered tabs */
export const Centered = {
  render: () => {
    const [value, setValue] = useState(0);

    return (
      <Box sx={ { width: '100%' } }>
        <Tabs
          value={ value }
          onChange={ (e, v) => setValue(v) }
          centered
        >
          <Tab label="Home" />
          <Tab label="Profile" />
          <Tab label="Settings" />
        </Tabs>
      </Box>
    );
  },
};

/** Full width tabs */
export const FullWidth = {
  render: () => {
    const [value, setValue] = useState(0);

    return (
      <Box sx={ { width: '100%' } }>
        <Tabs
          value={ value }
          onChange={ (e, v) => setValue(v) }
          variant="fullWidth"
        >
          <Tab label="Calls" />
          <Tab label="Favorites" />
          <Tab label="Recents" />
        </Tabs>
      </Box>
    );
  },
};

/** Scrollable tabs */
export const Scrollable = {
  render: () => {
    const [value, setValue] = useState(0);

    return (
      <Box sx={ { maxWidth: 480 } }>
        <Tabs
          value={ value }
          onChange={ (e, v) => setValue(v) }
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Item 1" />
          <Tab label="Item 2" />
          <Tab label="Item 3" />
          <Tab label="Item 4" />
          <Tab label="Item 5" />
          <Tab label="Item 6" />
          <Tab label="Item 7" />
        </Tabs>
      </Box>
    );
  },
};

/** Vertical tabs */
export const Vertical = {
  render: () => {
    const [value, setValue] = useState(0);

    return (
      <Box sx={ { display: 'flex', height: 224, bgcolor: 'background.paper' } }>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={ value }
          onChange={ (e, v) => setValue(v) }
          sx={ { borderRight: 1, borderColor: 'divider' } }
        >
          <Tab label="Item 1" />
          <Tab label="Item 2" />
          <Tab label="Item 3" />
          <Tab label="Item 4" />
        </Tabs>
        <TabPanel value={ value } index={ 0 }>
          Content of Item 1
        </TabPanel>
        <TabPanel value={ value } index={ 1 }>
          Content of Item 2
        </TabPanel>
        <TabPanel value={ value } index={ 2 }>
          Content of Item 3
        </TabPanel>
        <TabPanel value={ value } index={ 3 }>
          Content of Item 4
        </TabPanel>
      </Box>
    );
  },
};

/** Color variants */
export const Colors = {
  render: () => {
    const [value1, setValue1] = useState(0);
    const [value2, setValue2] = useState(0);

    return (
      <Box sx={ { display: 'flex', flexDirection: 'column', gap: 4 } }>
        <Box>
          <Typography variant="subtitle2" sx={ { mb: 1 } }>Primary (Default)</Typography>
          <Tabs
            value={ value1 }
            onChange={ (e, v) => setValue1(v) }
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Tab 1" />
            <Tab label="Tab 2" />
            <Tab label="Tab 3" />
          </Tabs>
        </Box>
        <Box>
          <Typography variant="subtitle2" sx={ { mb: 1 } }>Secondary</Typography>
          <Tabs
            value={ value2 }
            onChange={ (e, v) => setValue2(v) }
            textColor="secondary"
            indicatorColor="secondary"
          >
            <Tab label="Tab 1" />
            <Tab label="Tab 2" />
            <Tab label="Tab 3" />
          </Tabs>
        </Box>
      </Box>
    );
  },
};

/** Disabled tab */
export const Disabled = {
  render: () => {
    const [value, setValue] = useState(0);

    return (
      <Tabs value={ value } onChange={ (e, v) => setValue(v) }>
        <Tab label="Active" />
        <Tab label="Disabled" disabled />
        <Tab label="Active" />
      </Tabs>
    );
  },
};
