import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

/**
 * 현재 로그인 세션과 user 를 구독하는 훅.
 * 앱 최상단에서 1회 사용 권장 (Context 와 조합).
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
