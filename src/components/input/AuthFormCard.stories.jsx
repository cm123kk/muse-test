import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AuthFormCard from './AuthFormCard';

export default {
  title: 'Custom Component/AuthFormCard',
  component: AuthFormCard,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text', description: '폼 제목' },
    subtitle: { control: 'text', description: '폼 부제목' },
    children: { control: false, description: '폼 내용' },
    footer: { control: false, description: '하단 링크/텍스트 슬롯' },
  },
};

export const Default = {
  args: {
    title: '로그인',
    subtitle: 'MUSE에 오신 것을 환영합니다.',
    children: (
      <Box sx={{ height: 160, border: '1px dashed', borderColor: 'divider', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body2" color="text.disabled">폼 필드 영역</Typography>
      </Box>
    ),
    footer: (
      <Typography variant="body2" color="text.secondary">
        계정이 없으신가요? <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>회원가입</span>
      </Typography>
    ),
  },
};

export const WithoutSubtitle = {
  args: {
    title: '회원가입',
    children: (
      <Box sx={{ height: 200, border: '1px dashed', borderColor: 'divider', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body2" color="text.disabled">폼 필드 영역</Typography>
      </Box>
    ),
  },
};
