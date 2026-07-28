import { useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useReferences } from '../../hooks/data/useReferences';
import { useAuthContext } from '../../contexts/AuthContext';
import { fileToDataUrl, resizeDataUrl, imageUrlToBase64DataUrl } from '../../utils/museAi';
import { uploadImageToStorage, deleteImageFromStorage } from '../../utils/storageUpload';
import { runAutoTag } from '../../utils/museAiTasks';

const EMPTY_TAGS = {
  color: [],
  typography: [],
  layout: [],
  gradient: [],
  visualDirection: { genre: [], style: [], subject: [] },
};

/**
 * useReferenceArchive hook
 *
 * Encapsulates ArchivePage's Supabase-based upload + T1 tagging + delete + retry logic.
 * When store mode is off, it uses only the externally injected references / onUploadFile.
 *
 * @param {object}   params
 * @param {boolean}  params.useStoreMode - whether to use Supabase directly
 * @param {array}    [params.externalReferences] - references to display when store is not used
 * @param {function} [params.onUploadFile] - upload callback delegated to the host when store is not used
 * @param {object}   [params.client] - Supabase client (default: the real client, Storybook: mock)
 */
export function useReferenceArchive({
  useStoreMode,
  externalReferences,
  onUploadFile,
  client: clientProp,
}) {
  const effectiveClient = clientProp || supabase;
  const { user } = useAuthContext();

  // Fetch the reference list from Supabase
  const { data: supabaseRefs, refetch } = useReferences({ client: effectiveClient });

  // Temporary items being uploaded/tagged (optimistic UI)
  const [pendingRefs, setPendingRefs] = useState([]);

  const [uploadState, setUploadState] = useState({
    isUploading: false,
    error: null,
    lastId: null,
  });

  const references = useMemo(() => {
    if (!useStoreMode) return externalReferences || [];
    const confirmed = (supabaseRefs || []).map(mapFromDb);
    return [...confirmed, ...pendingRefs];
  }, [useStoreMode, supabaseRefs, pendingRefs, externalReferences]);

  const pendingCount = useMemo(
    () => references.filter((r) => r._pending).length,
    [references],
  );

  /** Convert a DB record -> UI reference object */
  function mapFromDb(row) {
    return {
      id: row.id,
      source: row.source,
      thumbnailUrl: row.thumbnail_url,
      storagePath: row.storage_path,
      title: row.title || '',
      tags: row.tags || EMPTY_TAGS,
      dominantColors: row.dominant_colors || [],
      extracted: row.extracted || {},
      createdAt: row.created_at,
    };
  }

  /** Handle a single file: Storage upload -> DB INSERT -> T1 tagging -> DB UPDATE */
  const uploadOne = async (file) => {
    const dataUrl = await fileToDataUrl(file);
    const resized = await resizeDataUrl(dataUrl, 512);

    // Optimistic UI: show the pending item immediately
    const tempId = crypto.randomUUID();
    const pendingItem = {
      id: tempId,
      source: 'file',
      thumbnailUrl: resized,
      title: file.name?.replace(/\.[^.]+$/, '') || 'Untitled',
      tags: EMPTY_TAGS,
      dominantColors: [],
      extracted: {},
      _pending: true,
    };
    setPendingRefs((prev) => [...prev, pendingItem]);

    try {
      // 1. Storage upload
      const { storagePath, publicUrl } = await uploadImageToStorage(file, user.id, effectiveClient);

      // 2. DB INSERT
      const insertPayload = {
        owner_id: user.id,
        source: 'file',
        thumbnail_url: publicUrl,
        storage_path: storagePath,
        title: pendingItem.title,
        tags: EMPTY_TAGS,
        dominant_colors: [],
        extracted: {},
      };

      const { data: inserted, error: insertErr } = await effectiveClient
        .from('reference_items')
        .insert(insertPayload)
        .select()
        .single();

      if (insertErr) throw insertErr;

      // 3. T1 auto-tagging
      try {
        const result = await runAutoTag({ imageUrl: resized });
        await effectiveClient
          .from('reference_items')
          .update({
            tags: result.tags,
            dominant_colors: result.dominantColors,
            title: result.title || inserted.title,
            extracted: result.extracted || {},
          })
          .eq('id', inserted.id);
      } catch (tagError) {
        console.warn('[T1 tagging failed]', tagError?.message);
        // Keep the record even if tagging fails; it can be retried from ReferenceCard
      }

      // Remove the optimistic item, then refresh the Supabase list
      setPendingRefs((prev) => prev.filter((r) => r.id !== tempId));
      refetch();

      return { id: inserted.id };
    } catch (err) {
      setPendingRefs((prev) => prev.filter((r) => r.id !== tempId));
      throw err;
    }
  };

  /** Batch execution with a concurrency limit */
  const runWithConcurrency = async (items, limit, fn) => {
    const results = new Array(items.length);
    let cursor = 0;
    const worker = async () => {
      while (cursor < items.length) {
        const i = cursor;
        cursor += 1;
        try {
          results[i] = { status: 'fulfilled', value: await fn(items[i]), item: items[i] };
        } catch (e) {
          results[i] = { status: 'rejected', reason: e, item: items[i] };
        }
      }
    };
    await Promise.all(Array(Math.min(limit, items.length)).fill(null).map(worker));
    return results;
  };

  const handleUploadFile = async (file) => {
    if (!file) return;
    if (!useStoreMode) { onUploadFile?.(file); return; }
    setUploadState({ isUploading: true, error: null, lastId: null });
    try {
      const ref = await uploadOne(file);
      setUploadState({ isUploading: false, error: null, lastId: ref.id });
    } catch (e) {
      setUploadState({ isUploading: false, error: e?.message || String(e), lastId: null });
    }
  };

  const handleUploadFiles = async (files) => {
    const list = Array.from(files || []);
    if (!list.length) return;
    if (!useStoreMode) { list.forEach((f) => onUploadFile?.(f)); return; }
    setUploadState({ isUploading: true, error: null, lastId: null });

    const results = await runWithConcurrency(list, 3, (f) => uploadOne(f));
    const failed = results.filter((r) => r.status === 'rejected');
    const lastOk = [...results].reverse().find((r) => r.status === 'fulfilled');

    let errorMsg = null;
    if (failed.length) {
      const names = failed.map((r) => r.item?.name || '?').slice(0, 3).join(', ');
      const more = failed.length > 3 ? ` and ${failed.length - 3} more` : '';
      errorMsg = `${failed.length} uploads failed: ${names}${more}`;
    }
    setUploadState({ isUploading: false, error: errorMsg, lastId: lastOk?.value?.id || null });
  };

  /** "Retry" for a _tagError card: re-run T1, then DB UPDATE */
  const retryTagging = async (ref) => {
    try {
      const dataUrl = await imageUrlToBase64DataUrl(ref.thumbnailUrl);
      const resized = await resizeDataUrl(dataUrl, 512);
      const result = await runAutoTag({ imageUrl: resized });
      await effectiveClient
        .from('reference_items')
        .update({
          tags: result.tags,
          dominant_colors: result.dominantColors,
          title: result.title || ref.title,
          extracted: result.extracted || {},
        })
        .eq('id', ref.id);
      refetch();
    } catch (e) {
      console.warn('[retryTagging failed]', e?.message);
    }
  };

  const removeReference = async (id) => {
    const target = references.find((r) => r.id === id);
    await effectiveClient.from('reference_items').delete().eq('id', id);
    if (target?.storagePath) {
      await deleteImageFromStorage(target.storagePath, effectiveClient);
    }
    refetch();
  };

  return {
    references,
    uploadState,
    pendingCount,
    handleUploadFile,
    handleUploadFiles,
    retryTagging,
    removeReference,
  };
}
