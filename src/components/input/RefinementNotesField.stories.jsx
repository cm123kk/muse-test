import { useState } from 'react';
import Box from '@mui/material/Box';
import { RefinementNotesField } from './RefinementNotesField.jsx';
import { references } from '../../data/muse';

export default {
  title: 'Input / RefinementNotesField',
  component: RefinementNotesField,
  parameters: { layout: 'padded' },
};

const sampleRefs = references.slice(0, 4).map((r) => ({
  id: r.id,
  thumbnailUrl: r.thumbnailUrl,
  title: r.title,
}));

export const Empty_Concept = {
  name: 'Empty (concept mode, skippable)',
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Box sx={ { maxWidth: 720 } }>
        <RefinementNotesField
          value={ value }
          onChange={ setValue }
          selectedRefs={ sampleRefs }
          mode="concept"
        />
      </Box>
    );
  },
};

export const Empty_System = {
  name: 'Empty (system mode, under 30 chars)',
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Box sx={ { maxWidth: 720 } }>
        <RefinementNotesField
          value={ value }
          onChange={ setValue }
          selectedRefs={ sampleRefs }
          mode="system"
        />
      </Box>
    );
  },
};

export const Filled_System = {
  name: 'Filled (system, passes 30 chars)',
  render: () => {
    const [value, setValue] = useState('Map ref-002 dark color to primary, emphasize ref-005 grid layout');
    return (
      <Box sx={ { maxWidth: 720 } }>
        <RefinementNotesField
          value={ value }
          onChange={ setValue }
          selectedRefs={ sampleRefs }
          mode="system"
        />
      </Box>
    );
  },
};

export const Filled_System_Long = {
  name: 'Filled (system, 50+ chars with ref-id)',
  render: () => {
    const [value, setValue] = useState(
      'Map ref-002.dominantColors[0] to brand-primary, apply ref-005.layout.columns 12, typography lighter than ref-002',
    );
    return (
      <Box sx={ { maxWidth: 720 } }>
        <RefinementNotesField
          value={ value }
          onChange={ setValue }
          selectedRefs={ sampleRefs }
          mode="system"
        />
      </Box>
    );
  },
};

export const NoRefs = {
  name: 'No references',
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Box sx={ { maxWidth: 720 } }>
        <RefinementNotesField
          value={ value }
          onChange={ setValue }
          mode="system"
        />
      </Box>
    );
  },
};

export const Disabled = {
  render: () => (
    <Box sx={ { maxWidth: 720 } }>
      <RefinementNotesField
        value="ref-002 color as primary"
        onChange={ () => {} }
        selectedRefs={ sampleRefs }
        mode="system"
        disabled
      />
    </Box>
  ),
};
