import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { normalizeSupabaseError } from '../../utils/supabaseError';

/**
 * 로그인 훅
 *
 * @returns {{ signIn: (args: { email: string, password: string }) => Promise<{ ok: boolean }>, loading: boolean, error: { message: string, code: string|null }|null }}
 */
export function useSignIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function signIn({ email, password }) {
    setLoading(true);
    setError(null);
    try {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) throw err;
      return { ok: true };
    } catch (err) {
      setError(normalizeSupabaseError(err));
      return { ok: false };
    } finally {
      setLoading(false);
    }
  }

  return { signIn, loading, error };
}
