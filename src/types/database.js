/**
 * MUSE Supabase DB type definitions (JSDoc)
 * Auto-generation basis: appendix-db-schema.md
 *
 * How to update (after Supabase CLI integration):
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
 * @property {Object|null} tags - Tag groups per layer
 * @property {string[]|null} dominant_colors - Array of HEX colors
 * @property {Object|null} extracted - Observed values extracted by T1
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
 * @property {Object|null} reference_notes - refId -> text
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
 * @property {Object} layers - All 5-layer tokens
 * @property {string} updated_at
 */
