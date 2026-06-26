import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import LoginForm from '../input/LoginForm';
import SignUpForm from '../input/SignUpForm';

/**
 * AuthModal 컴포넌트
 *
 * Props:
 * @param {boolean} isOpen - 모달 열림 여부 [Required]
 * @param {string} initialTab - 초기 탭 ('signup' | 'login') [Optional, 기본값: 'signup']
 * @param {function} onClose - 모달 닫기 콜백 [Required]
 * @param {function} onSuccess - 인증 성공 시 콜백 [Optional]
 *
 * Example usage:
 * <AuthModal isOpen={open} initialTab="signup" onClose={() => setOpen(false)} />
 */
function AuthModal({ isOpen, initialTab = 'signup', onClose, onSuccess }) {
  const [tab, setTab] = useState(initialTab);

  const handleTabChange = (_, newTab) => setTab(newTab);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 0,
        },
      }}
    >
      <DialogContent sx={{ p: { xs: 3, sm: 4 }, position: 'relative' }}>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ position: 'absolute', top: 12, right: 12, color: 'text.secondary' }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em', mb: 2 }}>
          MUSE
        </Typography>

        <Tabs
          value={tab}
          onChange={handleTabChange}
          centered
          sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="가입하기" value="signup" sx={{ fontWeight: 600 }} />
          <Tab label="로그인" value="login" sx={{ fontWeight: 600 }} />
        </Tabs>

        <Box>
          {tab === 'signup' && (
            <SignUpForm onSuccess={onSuccess ?? onClose} />
          )}
          {tab === 'login' && (
            <LoginForm onSuccess={onSuccess ?? onClose} />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default AuthModal;
