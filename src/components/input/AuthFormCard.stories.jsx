import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AuthFormCard from './AuthFormCard';

export default {
  title: 'Custom Component/AuthFormCard',
  component: AuthFormCard,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text', description: 'Form title' },
    subtitle: { control: 'text', description: 'Form subtitle' },
    children: { control: false, description: 'Form content' },
    footer: { control: false, description: 'Bottom link/text slot' },
  },
};

export const Default = {
  args: {
    title: 'Log in',
    subtitle: 'Welcome to MUSE.',
    children: (
      <Box sx={{ height: 160, border: '1px dashed', borderColor: 'divider', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body2" color="text.disabled">Form field area</Typography>
      </Box>
    ),
    footer: (
      <Typography variant="body2" color="text.secondary">
        Don't have an account? <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Sign up</span>
      </Typography>
    ),
  },
};

export const WithoutSubtitle = {
  args: {
    title: 'Sign up',
    children: (
      <Box sx={{ height: 200, border: '1px dashed', borderColor: 'divider', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body2" color="text.disabled">Form field area</Typography>
      </Box>
    ),
  },
};
