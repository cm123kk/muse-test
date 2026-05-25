import LoginPage from './LoginPage';

export default {
  title: 'Template/LoginPage',
  component: LoginPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    onLoginSuccess: { action: 'loginSuccess', description: '로그인 성공 시 콜백' },
    onNavigateToSignUp: { action: 'navigateToSignUp', description: '회원가입 링크 클릭 시 콜백' },
  },
};

export const Default = {
  args: {},
};
