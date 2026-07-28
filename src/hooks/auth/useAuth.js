import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

/**
 * Hook that subscribes to the current login session and user.
 * Recommended to use once at the top of the app (combined with Context).
 *
 * @returns {{ user: object|null, session: object|null, loading: boolean }}
 */
export function useAuth() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data.session);
        setLoading(false);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user: session?.user ?? null, session, loading };
}
