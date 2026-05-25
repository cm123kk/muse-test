import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { useSignIn } from '../../hooks/auth/useSignIn';

/**
 * 로그인 폼
 *
 * Props:
 * @param {function} onSuccess - 로그인 성공 시 콜백 [Optional]
 *
 * Example usage:
 * <LoginForm onSuccess={() => navigate('/archive')} />
 */
function LoginForm({ onSuccess }) {
  const { signIn, loading, error } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const result = await signIn({ email, password });
    if (result.ok && onSuccess) onSuccess();
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message}
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
        autoComplete="current-password"
        sx={{ mb: 3 }}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading || !email || !password}
        size="large"
      >
        {loading ? '로그인 중...' : '로그인'}
      </Button>
    </Box>
  );
}

export default LoginForm;
