import { ERROR_MESSAGES } from './errorMessages';

/**
 * Normalize a Supabase error into an English message
 *
 * @param {unknown} error - Supabase error object
 * @returns {{ message: string, code: string | null }}
 */
export function normalizeSupabaseError(error) {
  if (!error) return { message: '', code: null };

  const code = error.code || error.status || null;
  const message =
    ERROR_MESSAGES[code] ||
    ERROR_MESSAGES[error.message] ||
    error.message ||
    'An unknown error occurred';

  return { message, code };
}
