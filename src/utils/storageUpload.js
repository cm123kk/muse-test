import { supabase } from '../lib/supabase';

const BUCKET = 'references';

/**
 * Supabase Storage에 이미지 파일을 업로드한다.
 * 경로: {userId}/{uuid}.{ext}
 *
 * @param {File} file - 업로드할 파일
 * @param {string} userId - 현재 사용자 ID
 * @param {object} [client] - 주입 가능한 Supabase 클라이언트 (기본: 실제 클라이언트)
 * @returns {Promise<{ storagePath: string, publicUrl: string }>}
 */
export async function uploadImageToStorage(file, userId, client = supabase) {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const filename = `${crypto.randomUUID()}.${ext}`;
  const storagePath = `${userId}/${filename}`;

  const { error } = await client.storage
    .from(BUCKET)
    .upload(storagePath, file, { contentType: file.type, upsert: false });

  if (error) throw new Error(`Storage 업로드 실패: ${error.message}`);

  const { data: { publicUrl } } = client.storage
    .from(BUCKET)
    .getPublicUrl(storagePath);

  return { storagePath, publicUrl };
}

/**
 * Storage에서 이미지를 삭제한다.
 * 실패해도 DB 레코드 삭제는 진행되므로 throw하지 않는다.
 *
 * @param {string} storagePath - storage_path 컬럼 값
 * @param {object} [client]
 */
export async function deleteImageFromStorage(storagePath, client = supabase) {
  if (!storagePath) return;
  const { error } = await client.storage.from(BUCKET).remove([storagePath]);
  if (error) console.warn('[Storage 삭제 실패]', storagePath, error.message);
}
