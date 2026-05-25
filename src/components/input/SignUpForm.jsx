import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { useSignUp } from '../../hooks/auth/useSignUp';

/**
 * 회원가입 폼
 *
 * Props:
 * @param {function} onSuccess - 가입 성공 시 콜백 [Optional]
 *
 * Example usage:
 * <SignUpForm onSuccess={() => navigate('/archive')} />
 */
function SignUpForm({ onSuccess }) {
  const { signUp, loading, error } = useSignUp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError('');

    if (password.length < 8) {
      setLocalError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('비밀번호가 일치하지 않습니다.');
      return;
    }

    const result = await signUp({ email, password });
    if (result.ok && onSuccess) onSuccess();
  }

  const displayError = localError || error?.message;
  const isSubmittable = email && password && confirmPassword && !loading;

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {displayError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {displayError}
        </Alert>
      )}

      <TextField
        label="이메일"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        required
        autoComplete="email"
        sx={{ mb: 2 }}
      />

      <TextField
        label="비밀번호"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        required
        autoComplete="new-password"
        helperText="8자 이상"
        sx={{ mb: 2 }}
      />

      <TextField
        label="비밀번호 확인"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        fullWidth
        required
        autoComplete="new-password"
        sx={{ mb: 3 }}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={!isSubmittable}
        size="large"
      >
        {loading ? '가입 중...' : '회원가입'}
      </Button>
    </Box>
  );
}

export default SignUpForm;
