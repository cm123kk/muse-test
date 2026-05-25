import { useCallback, useEffect, useState } from 'react';
import { supabase as defaultClient } from '../../lib/supabase';
import { normalizeSupabaseError } from '../../utils/supabaseError';

/**
 * 현재 사용자의 user_settings 조회
 *
 * @param {{ client?: object }} [options]
 * @returns {{ data: import('../../types/database').UserSettings|null, loading: boolean, error: object|null, refetch: () => void }}
 */
export function useUserSettings({ client = defaultClient } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await client.auth.getUser();
      if (!user) { setData(null); return; }
      const { data: row, error: err } = await client
        .from('user_settings')
        .select('*')
        .eq('id', user.id)
        .single();
      if (err) throw err;
      setData(row);
    } catch (err) {
      setError(normalizeSupabaseError(err));
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * user_settings 수정
 *
 * @param {{ client?: object }} [options]
 * @returns {{ updateUserSettings: (patch: Partial<import('../../types/database').UserSettings>) => Promise<{ ok: boolean, data?: object }>, loading: boolean, error: object|null }}
 */
export function useUpdateUserSettings({ client = defaultClient } = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function updateUserSettings(patch) {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await client.auth.getUser();
      if (!user) throw new Error('로그인이 필요합니다');
      const { data, error: err } = await client
        .from('user_settings')
        .update(patch)
        .eq('id', user.id)
        .select()
        .single();
      if (err) throw err;
      return { ok: true, data };
    } catch (err) {
      setError(normalizeSupabaseError(err));
      return { ok: false };
    } finally {
      setLoading(false);
    }
  }

  return { updateUserSettings, loading, error };
}
