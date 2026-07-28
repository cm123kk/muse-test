import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { useSignUp } from '../../hooks/auth/useSignUp';

/**
 * Sign-up form
 *
 * Props:
 * @param {function} onSuccess - callback on successful sign-up [Optional]
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
      setLocalError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
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
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        required
        autoComplete="email"
        sx={{ mb: 2 }}
      />

      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        required
        autoComplete="new-password"
        helperText="At least 8 characters"
        sx={{ mb: 2 }}
      />

      <TextField
        label="Confirm password"
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
        {loading ? 'Signing up...' : 'Sign up'}
      </Button>
    </Box>
  );
}

export default SignUpForm;
