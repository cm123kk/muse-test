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
    onSuccess: { action: 'success', description: '로그인 성공 시 콜백' },
  },
};

export const Default = {
  args: {},
};
