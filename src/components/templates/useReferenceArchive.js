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
 * useReferenceArchive 훅
 *
 * ArchivePage의 Supabase 기반 업로드 + T1 태깅 + 삭제 + 재시도 로직을 캡슐화한다.
 * store 모드가 꺼져 있으면 외부 주입된 references / onUploadFile 만 사용한다.
 *
 * @param {object}   params
 * @param {boolean}  params.useStoreMode - Supabase 직접 사용 여부
 * @param {array}    [params.externalReferences] - store 미사용 시 표시할 레퍼런스
 * @param {function} [params.onUploadFile] - store 미사용 시 호스트로 위임할 업로드 콜백
 * @param {object}   [params.client] - Supabase 클라이언트 (기본: 실제 클라이언트, Storybook: mock)
 */
export function useReferenceArchive({
  useStoreMode,
  externalReferences,
  onUploadFile,
  client: clientProp,
}) {
  const effectiveClient = clientProp || supabase;
  const { user } = useAuthContext();

  // Supabase에서 레퍼런스 목록 조회
  const { data: supabaseRefs, refetch } = useReferences({ client: effectiveClient });

  // 업로드/태깅 중인 임시 항목 (낙관적 UI)
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

  /** DB 레코드 → UI reference 객체 변환 */
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

  /** 단일 파일 처리: Storage 업로드 → DB INSERT → T1 태깅 → DB UPDATE */
  const uploadOne = async (file) => {
    const dataUrl = await fileToDataUrl(file);
    const resized = await resizeDataUrl(dataUrl, 512);

    // 낙관적 UI: 즉시 pending 항목 표시
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
      // 1. Storage 업로드
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

      // 3. T1 자동 태깅
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
        console.warn('[T1 태깅 실패]', tagError?.message);
        // 태깅 실패해도 레코드는 유지 — ReferenceCard에서 재시도 가능
      }

      // 낙관적 항목 제거 후 Supabase 목록 새로고침
      setPendingRefs((prev) => prev.filter((r) => r.id !== tempId));
      refetch();

      return { id: inserted.id };
    } catch (err) {
      setPendingRefs((prev) => prev.filter((r) => r.id !== tempId));
      throw err;
    }
  };

  /** concurrency 제한 배치 실행 */
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
      const more = failed.length > 3 ? ` 외 ${failed.length - 3}장` : '';
      errorMsg = `${failed.length}장 업로드 실패: ${names}${more}`;
    }
    setUploadState({ isUploading: false, error: errorMsg, lastId: lastOk?.value?.id || null });
  };

  /** _tagError 카드의 "다시 시도" — T1 재수행 후 DB UPDATE */
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
      console.warn('[retryTagging 실패]', e?.message);
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
