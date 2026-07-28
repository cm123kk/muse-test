/**
 * MUSE Data - barrel export
 *
 * All story/page templates import their dummy data from here.
 * Replace actual images/data in each file (references.js, projects.js, etc.).
 */

export {
  references,
  referencesById,
  getReferenceThumbnails,
  flattenTags,
} from './references.js';
export { projects, projectsById, projectsWithThumbnails } from './projects.js';
export { analysisResultsByProjectId, getAnalysisResult } from './analysisResults.js';
export { defaultUserSettings } from './userSettings.js';

// AI task definitions
export {
  TASK_AUTO_TAG,
  TASK_RECOMMEND,
  TASK_ANALYZE_TOKENS,
  TASK_ANALYZE_CONCEPT,
  AI_TASKS,
  AI_TASKS_BY_ID,
  AI_WORKFLOW_DIAGRAM,
} from './aiTasks.js';

// Tag preset helper
export {
  MUSE_TAGS_PRESET,
  TOKEN_LAYERS,
  VISUAL_DIRECTION_CATEGORIES,
  getLayerTags,
  getLayerEnum,
  getLayerTagObjects,
  getVisualDirectionTags,
  getVisualDirectionTagObjects,
  getTagDescription,
  renderVocabularyPrompt,
} from './tag/index.js';
