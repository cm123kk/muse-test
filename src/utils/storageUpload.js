import { supabase } from '../lib/supabase';

const BUCKET = 'references';

/**
 * Upload an image file to Supabase Storage.
 * Path: {userId}/{uuid}.{ext}
 *
 * @param {File} file - The file to upload
 * @param {string} userId - The current user ID
 * @param {object} [client] - An injectable Supabase client (default: the real client)
 * @returns {Promise<{ storagePath: string, publicUrl: string }>}
 */
export async function uploadImageToStorage(file, userId, client = supabase) {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const filename = `${crypto.randomUUID()}.${ext}`;
  const storagePath = `${userId}/${filename}`;

  const { error } = await client.storage
    .from(BUCKET)
    .upload(storagePath, file, { contentType: file.type, upsert: false });

  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  const { data: { publicUrl } } = client.storage
    .from(BUCKET)
    .getPublicUrl(storagePath);

  return { storagePath, publicUrl };
}

/**
 * Delete an image from Storage.
 * Does not throw on failure, since DB record deletion still proceeds.
 *
 * @param {string} storagePath - The storage_path column value
 * @param {object} [client]
 */
export async function deleteImageFromStorage(storagePath, client = supabase) {
  if (!storagePath) return;
  const { error } = await client.storage.from(BUCKET).remove([storagePath]);
  if (error) console.warn('[Storage delete failed]', storagePath, error.message);
}
