import { ERROR_MESSAGES } from './errorMessages';

/**
 * Supabase 에러를 한국어 메시지로 정규화
 *
 * @param {unknown} error - Supabase 에러 객체
 * @returns {{ message: string, code: string | null }}
 */
export function normalizeSupabaseError(error) {
  if (!error) return { message: '', code: null };

  const code = error.code || error.status || null;
  const message =
    ERROR_MESSAGES[code] ||
    ERROR_MESSAGES[error.message] ||
    error.message ||
    '알 수 없는 오류가 발생했습니다';

  return { message, code };
}
