import HeroSection from './HeroSection';

export default {
  title: 'Section/HeroSection',
  component: HeroSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    onNavigateToSignUp: { action: 'navigateToSignUp', description: 'Callback when the Get Started button is clicked' },
    onNavigateToLogin: { action: 'navigateToLogin', description: 'Callback when the Login button is clicked' },
    centerKeepout: {
      control: { type: 'number', min: 0, max: 400 },
      description: 'Protected radius for the center text (px)',
    },
  },
};

export const Default = {
  args: {
    centerKeepout: 240,
  },
};
