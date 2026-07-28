import Box from '@mui/material/Box';
import SignUpForm from './SignUpForm';

export default {
  title: 'Custom Component/SignUpForm',
  component: SignUpForm,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Box sx={{ maxWidth: 440, mx: 'auto', p: 3 }}>
        <Story />
      </Box>
    ),
  ],
  argTypes: {
    onSuccess: { action: 'success', description: 'Callback fired on successful sign up' },
  },
};

export const Default = {
  args: {},
};
