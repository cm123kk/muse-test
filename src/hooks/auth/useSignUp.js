import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { normalizeSupabaseError } from '../../utils/supabaseError';

/**
 * Sign-up hook. Sends a verification email on success.
 *
 * @returns {{ signUp: (args: { email: string, password: string, displayName?: string }) => Promise<{ ok: boolean }>, loading: boolean, error: { message: string, code: string|null }|null }}
 */
export function useSignUp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function signUp({ email, password, displayName }) {
    setLoading(true);
    setError(null);
    try {
      const { error: err } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: displayName ? { display_name: displayName } : undefined,
        },
      });
      if (err) throw err;
      return { ok: true };
    } catch (err) {
      setError(normalizeSupabaseError(err));
      return { ok: false };
    } finally {
      setLoading(false);
    }
  }

  return { signUp, loading, error };
}
