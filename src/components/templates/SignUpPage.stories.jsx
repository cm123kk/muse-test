import SignUpPage from './SignUpPage';

export default {
  title: 'Template/SignUpPage',
  component: SignUpPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    onSignUpSuccess: { action: 'signUpSuccess', description: 'Callback on successful sign up' },
    onNavigateToLogin: { action: 'navigateToLogin', description: 'Callback when the Login link is clicked' },
  },
};

export const Default = {
  args: {},
};
