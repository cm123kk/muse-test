import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { TagInput } from './TagInput';

export default {
  title: 'Component/7. Input & Control/TagInput',
  component: TagInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## TagInput

Tag input and management field component.

### Features
- Add and remove tags
- Maximum tag count limit
- Autocomplete suggestion support
        `,
      },
    },
  },
};

/**
 * TagInput basic usage example
 */
export const Default = {
  render: () => {
    const [tags, setTags] = useState(['minimal', 'dark']);

    return (
      <Box sx={{ maxWidth: 400 }}>
        <TagInput
          tags={tags}
          onChange={setTags}
          placeholder="Add tags..."
          maxTags={8}
          label="Style Keywords"
        />
      </Box>
    );
  },
};

/**
 * TagInput with Suggestions
 */
export const WithSuggestions = {
  render: () => {
    const [tags, setTags] = useState([]);
    const suggestions = ['minimal', 'bold', 'colorful', 'dark', 'light', 'retro', 'modern', 'organic', 'geometric', 'playful'];

    return (
      <Box sx={{ maxWidth: 400 }}>
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
          TagInput with Suggestions
        </Typography>
        <TagInput
          tags={tags}
          onChange={setTags}
          placeholder="Type to see suggestions..."
          suggestions={suggestions}
          maxTags={5}
        />
      </Box>
    );
  },
};
