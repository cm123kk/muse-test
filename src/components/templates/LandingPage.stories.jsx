import LandingPage from './LandingPage';

export default {
  title: 'Template/LandingPage',
  component: LandingPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    onNavigateToSignUp: { action: 'navigateToSignUp', description: 'Callback when the Sign Up button is clicked' },
    onNavigateToLogin: { action: 'navigateToLogin', description: 'Callback when the Login button is clicked' },
  },
};

export const Default = {
  args: {},
};
