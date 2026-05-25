import { useCallback, useEffect, useState } from 'react';
import { supabase as defaultClient } from '../../lib/supabase';
import { normalizeSupabaseError } from '../../utils/supabaseError';

/**
 * @param {{ client?: object, filter?: object }} [options]
 * @returns {{ data: import('../../types/database').ReferenceItem[]|null, loading: boolean, error: object|null, refetch: () => void }}
 */
export function useReferences({ client = defaultClient, filter } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = client.from('reference_items').select('*').order('created_at', { ascending: false });
      if (filter) {
        Object.entries(filter).forEach(([k, v]) => { query = query.eq(k, v); });
      }
      const { data: rows, error: err } = await query;
      if (err) throw err;
      setData(rows);
    } catch (err) {
      setError(normalizeSupabaseError(err));
    } finally {
      setLoading(false);
    }
  }, [client, JSON.stringify(filter)]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * @param {{ client?: object }} [options]
 * @returns {{ createReference: (payload: Partial<import('../../types/database').ReferenceItem>) => Promise<{ ok: boolean, data?: object }>, loading: boolean, error: object|null }}
 */
export function useCreateReference({ client = defaultClient } = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function createReference(payload) {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await client.from('reference_items').insert(payload).select().single();
      if (err) throw err;
      return { ok: true, data };
    } catch (err) {
      setError(normalizeSupabaseError(err));
      return { ok: false };
    } finally {
      setLoading(false);
    }
  }

  return { createReference, loading, error };
}

/**
 * @param {{ client?: object }} [options]
 * @returns {{ updateReference: (id: string, patch: Partial<import('../../types/database').ReferenceItem>) => Promise<{ ok: boolean, data?: object }>, loading: boolean, error: object|null }}
 */
export function useUpdateReference({ client = defaultClient } = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function updateReference(id, patch) {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await client.from('reference_items').update(patch).eq('id', id).select().single();
      if (err) throw err;
      return { ok: true, data };
    } catch (err) {
      setError(normalizeSupabaseError(err));
      return { ok: false };
    } finally {
      setLoading(false);
    }
  }

  return { updateReference, loading, error };
}

/**
 * @param {{ client?: object }} [options]
 * @returns {{ deleteReference: (id: string) => Promise<{ ok: boolean }>, loading: boolean, error: object|null }}
 */
export function useDeleteReference({ client = defaultClient } = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function deleteReference(id) {
    setLoading(true);
    setError(null);
    try {
      const { error: err } = await client.from('reference_items').delete().eq('id', id);
      if (err) throw err;
      return { ok: true };
    } catch (err) {
      setError(normalizeSupabaseError(err));
      return { ok: false };
    } finally {
      setLoading(false);
    }
  }

  return { deleteReference, loading, error };
}
