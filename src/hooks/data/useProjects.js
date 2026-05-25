import { useCallback, useEffect, useState } from 'react';
import { supabase as defaultClient } from '../../lib/supabase';
import { normalizeSupabaseError } from '../../utils/supabaseError';

/**
 * @param {{ client?: object }} [options]
 * @returns {{ data: import('../../types/database').Project[]|null, loading: boolean, error: object|null, refetch: () => void }}
 */
export function useProjects({ client = defaultClient } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: rows, error: err } = await client
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      if (err) throw err;
      setData(rows);
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
 * 프로젝트 목록을 연결된 레퍼런스 썸네일과 함께 조회.
 * project_references → reference_items.thumbnail_url 조인.
 *
 * @param {{ client?: object }} [options]
 * @returns {{ data: Array|null, loading: boolean, error: object|null, refetch: () => void }}
 */
export function useProjectsWithThumbnails({ client = defaultClient } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: rows, error: err } = await client
        .from('projects')
        .select('*, project_references(reference_items(id, thumbnail_url))')
        .order('created_at', { ascending: false });
      if (err) throw err;

      const mapped = (rows || []).map((p) => ({
        ...p,
        thumbnails: (p.project_references || [])
          .map((pr) => pr.reference_items?.thumbnail_url)
          .filter(Boolean)
          .slice(0, 4),
      }));
      setData(mapped);
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
 * @param {{ id: string, client?: object }} options
 * @returns {{ data: import('../../types/database').Project|null, loading: boolean, error: object|null }}
 */
export function useProject({ id, client = defaultClient }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    client.from('projects').select('*').eq('id', id).single()
      .then(({ data: row, error: err }) => {
        if (err) setError(normalizeSupabaseError(err));
        else setData(row);
      })
      .finally(() => setLoading(false));
  }, [id, client]);

  return { data, loading, error };
}

/**
 * @param {{ client?: object }} [options]
 * @returns {{ createProject: (payload: Partial<import('../../types/database').Project>) => Promise<{ ok: boolean, data?: object }>, loading: boolean, error: object|null }}
 */
export function useCreateProject({ client = defaultClient } = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function createProject(payload) {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await client.from('projects').insert(payload).select().single();
      if (err) throw err;
      return { ok: true, data };
    } catch (err) {
      setError(normalizeSupabaseError(err));
      return { ok: false };
    } finally {
      setLoading(false);
    }
  }

  return { createProject, loading, error };
}

/**
 * @param {{ client?: object }} [options]
 * @returns {{ updateProject: (id: string, patch: Partial<import('../../types/database').Project>) => Promise<{ ok: boolean, data?: object }>, loading: boolean, error: object|null }}
 */
export function useUpdateProject({ client = defaultClient } = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function updateProject(id, patch) {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await client.from('projects').update(patch).eq('id', id).select().single();
      if (err) throw err;
      return { ok: true, data };
    } catch (err) {
      setError(normalizeSupabaseError(err));
      return { ok: false };
    } finally {
      setLoading(false);
    }
  }

  return { updateProject, loading, error };
}

/**
 * @param {{ client?: object }} [options]
 * @returns {{ deleteProject: (id: string) => Promise<{ ok: boolean }>, loading: boolean, error: object|null }}
 */
export function useDeleteProject({ client = defaultClient } = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function deleteProject(id) {
    setLoading(true);
    setError(null);
    try {
      const { error: err } = await client.from('projects').delete().eq('id', id);
      if (err) throw err;
      return { ok: true };
    } catch (err) {
      setError(normalizeSupabaseError(err));
      return { ok: false };
    } finally {
      setLoading(false);
    }
  }

  return { deleteProject, loading, error };
}
