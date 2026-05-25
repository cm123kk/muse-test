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
    onSuccess: { action: 'success', description: '가입 성공 시 콜백' },
  },
};

export const Default = {
  args: {},
};
