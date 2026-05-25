/**
 * MUSE Supabase DB 타입 정의 (JSDoc)
 * 자동 생성 기준: appendix-db-schema.md
 *
 * 갱신 방법 (Supabase CLI 연동 후):
 *   pnpm db:types
 */

/**
 * @typedef {Object} Profile
 * @property {string} id - uuid PK (= auth.users.id)
 * @property {string|null} display_name
 * @property {string|null} avatar_url
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} UserSettings
 * @property {string} id - uuid PK (= auth.users.id)
 * @property {string} ai_model
 * @property {'local'|'cloud'} storage_mode
 * @property {'light'|'dark'|'system'} theme_mode
 * @property {boolean} is_auto_tag_enabled
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} ReferenceItem
 * @property {string} id - uuid PK
 * @property {string} owner_id - uuid FK → auth.users.id
 * @property {'file'|'url'} source
 * @property {string} thumbnail_url
 * @property {string|null} title
 * @property {Object|null} tags - 레이어별 태그 묶음
 * @property {string[]|null} dominant_colors - HEX 색상 배열
 * @property {Object|null} extracted - T1 추출 관찰 값
 * @property {string} created_at
 */

/**
 * @typedef {Object} Project
 * @property {string} id - uuid PK
 * @property {string} owner_id - uuid FK → auth.users.id
 * @property {string} name
 * @property {'concept'|'system'} mode
 * @property {string|null} intent
 * @property {string|null} user_notes
 * @property {Object|null} reference_notes - refId → 텍스트
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} ProjectReference
 * @property {string} id - uuid PK
 * @property {string} project_id - uuid FK → projects.id
 * @property {string} reference_id - uuid FK → reference_items.id
 * @property {string[]|null} use_layers - ['color', 'typography', ...]
 */

/**
 * @typedef {'pending'|'running'|'done'|'error'} AnalysisStatus
 */

/**
 * @typedef {Object} AnalysisResult
 * @property {string} id - uuid PK
 * @property {string} project_id - uuid FK → projects.id
 * @property {AnalysisStatus} status
 * @property {Object} layers - 5 레이어 토큰 전체
 * @property {string} updated_at
 */
