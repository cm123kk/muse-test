import SignUpPage from './SignUpPage';

export default {
  title: 'Template/SignUpPage',
  component: SignUpPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    onSignUpSuccess: { action: 'signUpSuccess', description: '가입 성공 시 콜백' },
    onNavigateToLogin: { action: 'navigateToLogin', description: '로그인 링크 클릭 시 콜백' },
  },
};

export const Default = {
  args: {},
};
