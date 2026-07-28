import { useState } from 'react';
import Box from '@mui/material/Box';
import { IntentGuideField } from './IntentGuideField.jsx';

export default {
  title: 'Input / IntentGuideField',
  component: IntentGuideField,
  parameters: { layout: 'centered' },
};

export const Empty = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Box sx={ { width: 560 } }>
        <IntentGuideField value={ value } onChange={ setValue } />
      </Box>
    );
  },
};

export const Filled = {
  render: () => {
    const [value, setValue] = useState('Calm dark mood fintech dashboard, data readability first');
    return (
      <Box sx={ { width: 560 } }>
        <IntentGuideField value={ value } onChange={ setValue } />
      </Box>
    );
  },
};

export const NearLimit = {
  render: () => {
    const [value, setValue] = useState(
      'Mobile app for new user onboarding, warm and friendly tone, illustration accents allowed, dark mode support, AAA accessibility',
    );
    return (
      <Box sx={ { width: 560 } }>
        <IntentGuideField value={ value } onChange={ setValue } />
      </Box>
    );
  },
};

export const Disabled = {
  render: () => (
    <Box sx={ { width: 560 } }>
      <IntentGuideField value="Calm dark mood" onChange={ () => {} } disabled />
    </Box>
  ),
};
