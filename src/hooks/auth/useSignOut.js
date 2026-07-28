import { useState } from 'react';
import { supabase } from '../../lib/supabase';

/**
 * Sign-out hook
 *
 * @returns {{ signOut: () => Promise<void>, loading: boolean }}
 */
export function useSignOut() {
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
  }

  return { signOut, loading };
}
