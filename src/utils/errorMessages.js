/**
 * Supabase error code/message -> English mapping
 * Keys: PostgREST error code | Supabase Auth error code | English message
 */
export const ERROR_MESSAGES = {
  // Auth
  'Invalid login credentials': 'Email or password is incorrect',
  'Email not confirmed': 'Email verification required. Please check your inbox',
  'User already registered': 'This email is already registered',
  'Email rate limit exceeded': 'Too many requests. Please try again in a moment',
  'Password should be at least 6 characters': 'Password must be at least 6 characters',
  'Unable to validate email address: invalid format': 'Invalid email format',
  'Signup requires a valid password': 'Please enter a password',
  'For security purposes, you can only request this after': 'For security reasons, please try again in a moment',
  'New password should be different from the old password': 'New password must be different from the current one',
  'Token has expired or is invalid': 'The verification link has expired',
  'User not found': 'User does not exist',

  // PostgREST (DB)
  '23505': 'This value already exists',
  '23503': 'The referenced data could not be found',
  '23502': 'A required field is empty',
  '23514': 'The input does not meet the required conditions',
  '22P02': 'Invalid format',
  '42501': 'You do not have access permission',
  'PGRST116': 'The requested data could not be found',
  'PGRST301': 'Your session has expired',

  // Network
  'Failed to fetch': 'Unable to connect to the server. Please check your internet connection',
  'TypeError: Network request failed': 'A network error occurred',

  // Storage
  'The resource was not found': 'File not found',
  'Payload too large': 'The file is too large',
  'Mime type not supported': 'Unsupported file type',
};

/**
 * Per-form-field error map
 */
export const FIELD_ERRORS = {
  'Invalid login credentials': { field: 'password', message: 'Email or password is incorrect' },
  'User already registered': { field: 'email', message: 'This email is already registered' },
  '23505': { field: 'unknown', message: 'This value already exists' },
};
