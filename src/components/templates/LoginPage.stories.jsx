import LoginPage from './LoginPage';

export default {
  title: 'Template/LoginPage',
  component: LoginPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    onLoginSuccess: { action: 'loginSuccess', description: 'Callback on successful login' },
    onNavigateToSignUp: { action: 'navigateToSignUp', description: 'Callback when the Sign Up link is clicked' },
  },
};

export const Default = {
  args: {},
};
