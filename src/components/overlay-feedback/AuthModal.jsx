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
 * AuthModal component
 *
 * Props:
 * @param {boolean} isOpen - Whether the modal is open [Required]
 * @param {string} initialTab - Initial tab ('signup' | 'login') [Optional, default: 'signup']
 * @param {function} onClose - Modal close callback [Required]
 * @param {function} onSuccess - Callback on successful authentication [Optional]
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
          <Tab label="Sign up" value="signup" sx={{ fontWeight: 600 }} />
          <Tab label="Sign in" value="login" sx={{ fontWeight: 600 }} />
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
