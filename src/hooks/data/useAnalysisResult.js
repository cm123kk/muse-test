import { useCallback, useEffect, useState } from 'react';
import { supabase as defaultClient } from '../../lib/supabase';
import { normalizeSupabaseError } from '../../utils/supabaseError';

/**
 * 특정 프로젝트의 analysis_results 조회
 *
 * @param {{ projectId: string, client?: object }} options
 * @returns {{ data: import('../../types/database').AnalysisResult|null, loading: boolean, error: object|null, refetch: () => void }}
 */
export function useAnalysisResult({ projectId, client = defaultClient }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const { data: row, error: err } = await client
        .from('analysis_results')
        .select('*')
        .eq('project_id', projectId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();
      if (err && err.code !== 'PGRST116') throw err;
      setData(row ?? null);
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
 * analysis_results 생성 (AI 분석 완료 후 저장)
 *
 * @param {{ client?: object }} [options]
 * @returns {{ createAnalysisResult: (payload: { project_id: string, status: string, layers: object }) => Promise<{ ok: boolean, data?: object }>, loading: boolean, error: object|null }}
 */
export function useCreateAnalysisResult({ client = defaultClient } = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function createAnalysisResult(payload) {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await client
        .from('analysis_results')
        .insert(payload)
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

  return { createAnalysisResult, loading, error };
}

/**
 * analysis_results 토큰 편집 (isEnabled / emphasis 업데이트)
 *
 * @param {{ client?: object }} [options]
 * @returns {{ updateAnalysisResult: (id: string, patch: Partial<import('../../types/database').AnalysisResult>) => Promise<{ ok: boolean, data?: object }>, loading: boolean, error: object|null }}
 */
export function useUpdateAnalysisResult({ client = defaultClient } = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function updateAnalysisResult(id, patch) {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await client
        .from('analysis_results')
        .update(patch)
        .eq('id', id)
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

  return { updateAnalysisResult, loading, error };
}
