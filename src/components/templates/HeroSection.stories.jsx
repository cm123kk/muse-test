import HeroSection from './HeroSection';

export default {
  title: 'Section/HeroSection',
  component: HeroSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    onNavigateToSignUp: { action: 'navigateToSignUp', description: '시작하기 버튼 클릭 시 콜백' },
    onNavigateToLogin: { action: 'navigateToLogin', description: '로그인 버튼 클릭 시 콜백' },
    centerKeepout: {
      control: { type: 'number', min: 0, max: 400 },
      description: '중앙 텍스트 보호 반경(px)',
    },
  },
};

export const Default = {
  args: {
    centerKeepout: 240,
  },
};
