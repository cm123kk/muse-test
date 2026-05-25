import { useCallback, useEffect, useState } from 'react';
import { supabase as defaultClient } from '../../lib/supabase';
import { normalizeSupabaseError } from '../../utils/supabaseError';

/**
 * 특정 프로젝트의 project_references 목록 조회
 *
 * @param {{ projectId: string, client?: object }} options
 * @returns {{ data: import('../../types/database').ProjectReference[]|null, loading: boolean, error: object|null, refetch: () => void }}
 */
export function useProjectReferences({ projectId, client = defaultClient }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const { data: rows, error: err } = await client
        .from('project_references')
        .select('*, reference_items(*)')
        .eq('project_id', projectId);
      if (err) throw err;
      setData(rows);
    } catch (err) {
      setError(normalizeSupabaseError(err));
    } finally {
      setLoading(false);
    }
  }, [projectId, client]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * project_references upsert (레이어 chip 토글)
 *
 * @param {{ client?: object }} [options]
 * @returns {{ upsertProjectReference: (payload: { project_id: string, reference_id: string, use_layers?: string[] }) => Promise<{ ok: boolean, data?: object }>, loading: boolean, error: object|null }}
 */
export function useUpsertProjectReference({ client = defaultClient } = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function upsertProjectReference(payload) {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await client
        .from('project_references')
        .upsert(payload, { onConflict: 'project_id,reference_id' })
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

  return { upsertProjectReference, loading, error };
}

/**
 * @param {{ client?: object }} [options]
 * @returns {{ deleteProjectReference: (projectId: string, referenceId: string) => Promise<{ ok: boolean }>, loading: boolean, error: object|null }}
 */
export function useDeleteProjectReference({ client = defaultClient } = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function deleteProjectReference(projectId, referenceId) {
    setLoading(true);
    setError(null);
    try {
      const { error: err } = await client
        .from('project_references')
        .delete()
        .eq('project_id', projectId)
        .eq('reference_id', referenceId);
      if (err) throw err;
      return { ok: true };
    } catch (err) {
      setError(normalizeSupabaseError(err));
      return { ok: false };
    } finally {
      setLoading(false);
    }
  }

  return { deleteProjectReference, loading, error };
}
