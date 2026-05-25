import LandingPage from './LandingPage';

export default {
  title: 'Template/LandingPage',
  component: LandingPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    onNavigateToSignUp: { action: 'navigateToSignUp', description: '회원가입 버튼 클릭 시 콜백' },
    onNavigateToLogin: { action: 'navigateToLogin', description: '로그인 버튼 클릭 시 콜백' },
  },
};

export const Default = {
  args: {},
};
