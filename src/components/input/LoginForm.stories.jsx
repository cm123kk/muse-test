import Box from '@mui/material/Box';
import LoginForm from './LoginForm';

export default {
  title: 'Custom Component/LoginForm',
  component: LoginForm,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Box sx={{ maxWidth: 440, mx: 'auto', p: 3 }}>
        <Story />
      </Box>
    ),
  ],
  argTypes: {
    onSuccess: { action: 'success', description: 'Callback fired on successful login' },
  },
};

export const Default = {
  args: {},
};
