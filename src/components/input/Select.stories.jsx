import { useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import OutlinedInput from '@mui/material/OutlinedInput';
import ListSubheader from '@mui/material/ListSubheader';
import Typography from '@mui/material/Typography';

export default {
  title: 'Component/7. Input & Control/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## Select [MUI]

Component for selecting one or more options from a dropdown list.

### Usage Patterns

| Pattern | Description | Example |
|------|------|------|
| Basic | Basic single select | \`<Select><MenuItem>...</MenuItem></Select>\` |
| Multiple | Multiple select | \`multiple\` prop |
| Grouped | Grouped options | Use \`ListSubheader\` |
| Native | Native select | \`native\` prop |
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['outlined', 'filled', 'standard'],
      description: 'Sets the visual style of the select.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'outlined' },
      },
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
      description: 'Sets the size of the select.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'medium' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the select.',
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
    multiple: {
      control: 'boolean',
      description: 'Enables multiple selection.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
};

/** Basic select */
export const Default = {
  args: {
    variant: 'outlined',
    size: 'medium',
    disabled: false,
    error: false,
  },
  render: (args) => {
    const [value, setValue] = useState('');

    return (
      <FormControl
        sx={ { minWidth: 200 } }
        variant={ args.variant }
        size={ args.size }
        disabled={ args.disabled }
        error={ args.error }
      >
        <InputLabel>Age</InputLabel>
        <Select
          value={ value }
          label="Age"
          onChange={ (e) => setValue(e.target.value) }
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={ 10 }>10s</MenuItem>
          <MenuItem value={ 20 }>20s</MenuItem>
          <MenuItem value={ 30 }>30s</MenuItem>
          <MenuItem value={ 40 }>40s and above</MenuItem>
        </Select>
      </FormControl>
    );
  },
};

/** Variant comparison */
export const AllVariants = {
  render: () => {
    const [values, setValues] = useState({ outlined: '', filled: '', standard: '' });

    const handleChange = (variant) => (event) => {
      setValues({ ...values, [variant]: event.target.value });
    };

    return (
      <Stack spacing={ 3 } sx={ { width: 200 } }>
        <FormControl variant="outlined">
          <InputLabel>Outlined</InputLabel>
          <Select value={ values.outlined } label="Outlined" onChange={ handleChange('outlined') }>
            <MenuItem value={ 1 }>Option 1</MenuItem>
            <MenuItem value={ 2 }>Option 2</MenuItem>
            <MenuItem value={ 3 }>Option 3</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="filled">
          <InputLabel>Filled</InputLabel>
          <Select value={ values.filled } label="Filled" onChange={ handleChange('filled') }>
            <MenuItem value={ 1 }>Option 1</MenuItem>
            <MenuItem value={ 2 }>Option 2</MenuItem>
            <MenuItem value={ 3 }>Option 3</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="standard">
          <InputLabel>Standard</InputLabel>
          <Select value={ values.standard } label="Standard" onChange={ handleChange('standard') }>
            <MenuItem value={ 1 }>Option 1</MenuItem>
            <MenuItem value={ 2 }>Option 2</MenuItem>
            <MenuItem value={ 3 }>Option 3</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    );
  },
};

/** Size comparison */
export const Sizes = {
  render: () => {
    const [small, setSmall] = useState('');
    const [medium, setMedium] = useState('');

    return (
      <Stack spacing={ 3 } direction="row" alignItems="flex-start">
        <FormControl size="small" sx={ { minWidth: 150 } }>
          <InputLabel>Small</InputLabel>
          <Select value={ small } label="Small" onChange={ (e) => setSmall(e.target.value) }>
            <MenuItem value={ 1 }>Option 1</MenuItem>
            <MenuItem value={ 2 }>Option 2</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="medium" sx={ { minWidth: 150 } }>
          <InputLabel>Medium</InputLabel>
          <Select value={ medium } label="Medium" onChange={ (e) => setMedium(e.target.value) }>
            <MenuItem value={ 1 }>Option 1</MenuItem>
            <MenuItem value={ 2 }>Option 2</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    );
  },
};

/** Helper text and error */
export const WithHelperText = {
  render: () => {
    const [value, setValue] = useState('');
    const [errorValue, setErrorValue] = useState('');

    return (
      <Stack spacing={ 3 } sx={ { width: 250 } }>
        <FormControl>
          <InputLabel>Category</InputLabel>
          <Select value={ value } label="Category" onChange={ (e) => setValue(e.target.value) }>
            <MenuItem value="tech">Technology</MenuItem>
            <MenuItem value="design">Design</MenuItem>
            <MenuItem value="business">Business</MenuItem>
          </Select>
          <FormHelperText>Select a category of interest</FormHelperText>
        </FormControl>

        <FormControl error>
          <InputLabel>Required</InputLabel>
          <Select
            value={ errorValue }
            label="Required"
            onChange={ (e) => setErrorValue(e.target.value) }
          >
            <MenuItem value="a">Option A</MenuItem>
            <MenuItem value="b">Option B</MenuItem>
          </Select>
          <FormHelperText>This field is required</FormHelperText>
        </FormControl>
      </Stack>
    );
  },
};

/** Multiple selection */
export const Multiple = {
  render: () => {
    const [values, setValues] = useState([]);

    const options = ['React', 'Vue', 'Angular', 'Svelte', 'Next.js'];

    return (
      <FormControl sx={ { minWidth: 300 } }>
        <InputLabel>Framework</InputLabel>
        <Select
          multiple
          value={ values }
          onChange={ (e) => setValues(e.target.value) }
          input={ <OutlinedInput label="Framework" /> }
          renderValue={ (selected) => (
            <Box sx={ { display: 'flex', flexWrap: 'wrap', gap: 0.5 } }>
              { selected.map((value) => (
                <Chip key={ value } label={ value } size="small" />
              )) }
            </Box>
          ) }
        >
          { options.map((option) => (
            <MenuItem key={ option } value={ option }>
              { option }
            </MenuItem>
          )) }
        </Select>
        <FormHelperText>Select all frameworks you use</FormHelperText>
      </FormControl>
    );
  },
};

/** Grouped options */
export const Grouped = {
  render: () => {
    const [value, setValue] = useState('');

    return (
      <FormControl sx={ { minWidth: 250 } }>
        <InputLabel>Region</InputLabel>
        <Select value={ value } label="Region" onChange={ (e) => setValue(e.target.value) }>
          <ListSubheader>Capital Area</ListSubheader>
          <MenuItem value="seoul">Seoul</MenuItem>
          <MenuItem value="incheon">Incheon</MenuItem>
          <MenuItem value="gyeonggi">Gyeonggi</MenuItem>

          <ListSubheader>Chungcheong</ListSubheader>
          <MenuItem value="daejeon">Daejeon</MenuItem>
          <MenuItem value="chungnam">Chungnam</MenuItem>
          <MenuItem value="chungbuk">Chungbuk</MenuItem>

          <ListSubheader>Yeongnam</ListSubheader>
          <MenuItem value="busan">Busan</MenuItem>
          <MenuItem value="daegu">Daegu</MenuItem>
          <MenuItem value="ulsan">Ulsan</MenuItem>
        </Select>
      </FormControl>
    );
  },
};

/** Disabled options */
export const DisabledOptions = {
  render: () => {
    const [value, setValue] = useState('');

    return (
      <FormControl sx={ { minWidth: 200 } }>
        <InputLabel>Plan</InputLabel>
        <Select value={ value } label="Plan" onChange={ (e) => setValue(e.target.value) }>
          <MenuItem value="free">Free</MenuItem>
          <MenuItem value="basic">Basic</MenuItem>
          <MenuItem value="pro" disabled>Pro (Coming soon)</MenuItem>
          <MenuItem value="enterprise" disabled>Enterprise (Coming soon)</MenuItem>
        </Select>
        <FormHelperText>Only currently available plans can be selected</FormHelperText>
      </FormControl>
    );
  },
};

/** Disabled select */
export const Disabled = {
  render: () => (
    <FormControl sx={ { minWidth: 200 } } disabled>
      <InputLabel>Disabled</InputLabel>
      <Select value="" label="Disabled">
        <MenuItem value={ 1 }>Option 1</MenuItem>
        <MenuItem value={ 2 }>Option 2</MenuItem>
      </Select>
      <FormHelperText>Cannot be selected</FormHelperText>
    </FormControl>
  ),
};

/** Native select */
export const Native = {
  render: () => {
    const [value, setValue] = useState('');

    return (
      <FormControl sx={ { minWidth: 200 } }>
        <InputLabel variant="standard" htmlFor="native-select">
          Browser
        </InputLabel>
        <Select
          native
          value={ value }
          onChange={ (e) => setValue(e.target.value) }
          inputProps={ { id: 'native-select' } }
          variant="standard"
        >
          <option value="">Select an option</option>
          <option value="chrome">Chrome</option>
          <option value="firefox">Firefox</option>
          <option value="safari">Safari</option>
          <option value="edge">Edge</option>
        </Select>
        <FormHelperText>Native select: better UX on mobile</FormHelperText>
      </FormControl>
    );
  },
};

/** Real world example: filters */
export const FilterExample = {
  render: () => {
    const [category, setCategory] = useState('all');
    const [status, setStatus] = useState('all');
    const [sort, setSort] = useState('newest');

    return (
      <Box sx={ { p: 3, bgcolor: 'grey.50', width: 500 } }>
        <Typography variant="subtitle2" sx={ { mb: 2, fontWeight: 600 } }>
          Filter Options
        </Typography>
        <Stack direction="row" spacing={ 2 }>
          <FormControl size="small" sx={ { minWidth: 120 } }>
            <InputLabel>Category</InputLabel>
            <Select
              value={ category }
              label="Category"
              onChange={ (e) => setCategory(e.target.value) }
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="tech">Technology</MenuItem>
              <MenuItem value="design">Design</MenuItem>
              <MenuItem value="marketing">Marketing</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={ { minWidth: 120 } }>
            <InputLabel>Status</InputLabel>
            <Select
              value={ status }
              label="Status"
              onChange={ (e) => setStatus(e.target.value) }
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={ { minWidth: 120 } }>
            <InputLabel>Sort</InputLabel>
            <Select
              value={ sort }
              label="Sort"
              onChange={ (e) => setSort(e.target.value) }
            >
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="oldest">Oldest</MenuItem>
              <MenuItem value="name">Name</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>
    );
  },
};
