/**
 * MUSE AI Tasks - per-task execution helpers
 *
 * T1/T2/T3 call wrappers shared across pages and the Playground.
 * Combines the definitions in `aiTasks.js` + the client in `museAi.js` + preset helpers.
 */

import {
  callAnthropic,
  extractToolInput,
  extractText,
  toImageBlock,
  imageUrlToBase64DataUrl,
  resizeDataUrl,
} from './museAi';
import {
  TASK_AUTO_TAG,
  TASK_RECOMMEND,
  TASK_ANALYZE_TOKENS,
  TASK_ANALYZE_CONCEPT,
} from '../data/muse';

/**
 * Determine whether an error is retryable.
 *   - network/timeout: retry
 *   - 429 (rate limit): retry
 *   - 5xx: retry
 *   - 4xx (except 429): no retry (recalling produces the same error)
 *   - no tool_use response: retry once (Haiku occasionally violates the schema)
 */
/** Infer a ref's attachment filename (same logic as inferImageExt in the paste block) */
function inferRefAttachFile(ref, idx) {
  const url = ref?.thumbnailUrl || '';
  const m = String(url).match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
  let ext = '.jpg';
  if (m) {
    const e = m[1].toLowerCase();
    ext = e === 'jpeg' ? '.jpg' : `.${e}`;
  }
  const prefix = String(idx + 1).padStart(2, '0');
  return `${prefix}-${ref.id}${ext}`;
}

/**
 * Build per-reference notes block for T3 system prompts.
 * Includes only refs whose selectedRefs[].note is non-empty.
 * The model must quote these notes verbatim and ignore parts outside the borrowed layers.
 */
function buildReferenceNotesBlock(selectedRefs) {
  const withNotes = (selectedRefs || []).filter((r) => r?.note && String(r.note).trim().length > 0);
  if (withNotes.length === 0) return '';
  const lines = withNotes.map((r, idx) => {
    const i = (selectedRefs || []).indexOf(r);
    const file = inferRefAttachFile(r, i >= 0 ? i : idx);
    return `- ${r.id} (attachment ${(i >= 0 ? i : idx) + 1} = \`${file}\`): "${String(r.note).trim()}"`;
  });
  return `\n\n=== Per-Reference Notes (HIGHEST PRIORITY per ref) ===
The borrowing intent the user wrote for each ref. Reflect ONLY the parts these notes specify in the output,
and exclude unspecified layers from the source (set difference = ignore).
${lines.join('\n')}

Quote verbatim in decisionRationale.appliedReferenceNote of each note's source token.`;
}

/** Attach an attachFile field to extractedPool so the system prompt cites exact filenames */
function withAttachFiles(selectedRefs) {
  return (selectedRefs || []).map((ref, i) => ({
    ...ref,
    attachFile: inferRefAttachFile(ref, i),
    attachIdx: i + 1,
  }));
}

/**
 * Token reference syntax validator (DESIGN.md compatible).
 *
 * Every property value in components must be in `{a.b}` form, where
 * the first path segment is colors|typography|rounded|spacing|elevation,
 * and the second segment must match an actually emitted token id / scale key.
 *
 * @param {object} input - { tokens: { color, typography, layout, gradient, spacing, rounded, elevation, components, ... } }
 * @returns {{ ok: boolean, errors: string[], danglingRefs: string[], literalProps: string[] }}
 */
function validateTokenRefs(input) {
  const errors = [];
  const danglingRefs = [];
  const literalProps = [];
  const t = input?.tokens || {};
  const components = t.components;

  if (!components || typeof components !== 'object' || Array.isArray(components)) {
    errors.push('components-missing-or-not-object');
    return { ok: false, errors, danglingRefs, literalProps };
  }
  const componentKeys = Object.keys(components);
  if (componentKeys.length < 3) {
    errors.push(`components-min-3-violated(got=${componentKeys.length})`);
  }

  const colorIds = new Set((t.color || []).map((x) => x?.id).filter(Boolean));
  const typoIds = new Set((t.typography || []).map((x) => x?.id).filter(Boolean));
  const elevIds = new Set((t.elevation || []).map((x) => x?.id).filter(Boolean));
  const spacingKeys = new Set(Object.keys(t.spacing || {}));
  const roundedKeys = new Set(Object.keys(t.rounded || {}));

  const axisIds = {
    colors: colorIds,
    typography: typoIds,
    elevation: elevIds,
    spacing: spacingKeys,
    rounded: roundedKeys,
  };
  const reservedProps = new Set([
    'decisionRationale', 'whichReferences', 'whyChosen', 'appliedUserNotes',
    'appliedReferenceNote', 'alternativesConsidered', 'sourceReferenceIds',
  ]);

  const refRegex = /^\{([a-z]+)\.([a-zA-Z0-9_-]+)\}$/;

  for (const compKey of componentKeys) {
    const spec = components[compKey];
    if (!spec || typeof spec !== 'object') {
      errors.push(`components.${compKey}-not-object`);
      continue;
    }
    for (const propKey of Object.keys(spec)) {
      if (reservedProps.has(propKey)) continue;
      const val = spec[propKey];
      if (typeof val !== 'string') continue;
      const m = val.match(refRegex);
      if (!m) {
        literalProps.push(`${compKey}.${propKey}="${val}"`);
        continue;
      }
      const [, axis, id] = m;
      const idsForAxis = axisIds[axis];
      if (!idsForAxis) {
        danglingRefs.push(`${compKey}.${propKey} → unknown axis "${axis}"`);
        continue;
      }
      if (!idsForAxis.has(id)) {
        danglingRefs.push(`${compKey}.${propKey} → ${axis}.${id} (not emitted)`);
      }
    }
  }

  if (literalProps.length > 0) errors.push(`literal-values:${literalProps.length}`);
  if (danglingRefs.length > 0) errors.push(`dangling-refs:${danglingRefs.length}`);

  return { ok: errors.length === 0, errors, danglingRefs, literalProps };
}

function isRetryableError(err) {
  if (!err) return false;
  const status = err.status;
  if (!status) return true; // no status (network/timeout, etc.)
  if (status === 429) return true;
  if (status >= 500 && status < 600) return true;
  if (status >= 400 && status < 500) return false;
  return false;
}

/**
 * T1 - image URL -> auto tagging (auto-retry up to 3 times)
 *   - Retry conditions: network / 429 / 5xx / no tool_use response
 *   - Give-up conditions: 4xx (except 429) - configuration/image problem
 * @returns {Promise<{ tags, dominantColors, title, extracted }>}
 */
export async function runAutoTag({ imageUrl, model, maxAttempts = 3 }) {
  const dataUrl = imageUrl.startsWith('data:')
    ? imageUrl
    : await imageUrlToBase64DataUrl(imageUrl);
  const resized = await resizeDataUrl(dataUrl, 1024);
  const imageBlock = toImageBlock(resized);
  if (!imageBlock) throw new Error('Failed to create image block');

  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await callAnthropic({
        model: model || TASK_AUTO_TAG.model,
        max_tokens: 512,
        system: TASK_AUTO_TAG.systemPrompt,
        tools: [TASK_AUTO_TAG.toolSchema],
        tool_choice: { type: 'tool', name: TASK_AUTO_TAG.toolSchema.name },
        messages: [
          {
            role: 'user',
            content: [imageBlock, { type: 'text', text: TASK_AUTO_TAG.userMessageTemplate }],
          },
        ],
      });
      const toolInput = extractToolInput(response, TASK_AUTO_TAG.toolSchema.name);
      if (!toolInput) {
        throw new Error(`No T1 tool_use response. text: ${extractText(response) || '(empty)'}`);
      }
      return toolInput;
    } catch (e) {
      lastError = e;
      if (!isRetryableError(e) || attempt === maxAttempts) {
        throw e;
      }
      // exponential backoff: 500ms -> 1500ms
      const delay = 500 * Math.pow(3, attempt - 1);
      // eslint-disable-next-line no-console
      console.warn(`[runAutoTag] attempt ${attempt} failed, retrying after ${delay}ms`, e?.message);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastError;
}

/**
 * T2 - intent sentence + mode + archive meta -> top-N recommendations + automatic layer suggestions
 * @param {object} params
 * @param {string} params.intent
 * @param {'concept'|'system'} [params.mode='system'] - TP2 mode (sorting branch)
 * @param {Array} params.archive
 * @param {number} [params.n=6]
 * @param {string} [params.model]
 * @returns {Promise<{ recommendedIds, reasons, referenceLayer }>}
 */
export async function runRecommend({ intent, mode = 'system', archive, n = 6, model }) {
  const compactArchive = archive.map((r) => ({
    id: r.id,
    title: r.title,
    tags: r.tags,
    dominantColors: r.dominantColors,
  }));

  const userText = TASK_RECOMMEND.userMessageTemplate
    .replace('{{intent}}', intent)
    .replace('{{mode}}', mode)
    .replace('{{n}}', String(n))
    .replace('{{archiveCount}}', String(compactArchive.length))
    .replace('{{archiveJson}}', JSON.stringify(compactArchive, null, 2));

  const response = await callAnthropic({
    model: model || TASK_RECOMMEND.model,
    max_tokens: 1024,
    system: TASK_RECOMMEND.systemPrompt,
    tools: [TASK_RECOMMEND.toolSchema],
    tool_choice: { type: 'tool', name: TASK_RECOMMEND.toolSchema.name },
    messages: [{ role: 'user', content: userText }],
  });

  const toolInput = extractToolInput(response, TASK_RECOMMEND.toolSchema.name);
  if (!toolInput) {
    throw new Error(`No T2 tool_use response. text: ${extractText(response) || '(empty)'}`);
  }
  return toolInput;
}

/**
 * T3 - pre-extracted N images + intent + mode + layer curation + usage notes -> tokens + visualDirection(MD)
 * @param {object} params
 * @param {string} params.intent
 * @param {'concept'|'system'} [params.mode='system'] - TP2 synthesis tone
 * @param {Array<{id, thumbnailUrl, tags?, dominantColors?, extracted?, useLayers?}>} params.selectedRefs
 * @param {string} [params.userNotes=''] - Step 3 usage notes (explicit instructions after viewing references, HIGHEST PRIORITY)
 * @param {string} [params.model]
 * @param {function} [params.onProgress]
 * @returns {Promise<{ tokens, visualDirection }>}
 */
export async function runAnalyzeTokens({ intent, mode = 'system', selectedRefs, model, onProgress }) {
  if (!selectedRefs?.length) throw new Error('At least 1 image required');

  // Send only pre-extracted data as payload. No images. attachFile = exact filename inside the ZIP.
  const extractedPool = selectedRefs.map((ref, i) => ({
    id: ref.id,
    attachIdx: i + 1,
    attachFile: inferRefAttachFile(ref, i),
    title: ref.title || null,
    tags: ref.tags || {},
    dominantColors: ref.dominantColors || [],
    extracted: ref.extracted || {},
    useLayers: Array.isArray(ref.useLayers) ? ref.useLayers : [],
  }));

  const refNotesBlock = buildReferenceNotesBlock(selectedRefs);

  const content = [
    {
      type: 'text',
      text: `=== Pre-extracted references (${selectedRefs.length}) ===

${JSON.stringify(extractedPool, null, 2)}

=== End of references ===

=== Project Mode (TP2) ===
mode: ${mode}
${mode === 'concept' ? 'BIAS toward distinctive choices. Bold primary. Lower role enforcement.'
  : 'ENFORCE role uniqueness, AAA contrast for primary on bg, hierarchy strict.'}

=== Layer Curation (TP4) ===
${extractedPool.some((r) => r.useLayers.length > 0)
  ? extractedPool
    .filter((r) => r.useLayers.length > 0)
    .map((r) => `${r.id}: ONLY use [${r.useLayers.join(', ')}]`)
    .join('\n')
  : '(none - all layers of all refs may be used freely)'}${refNotesBlock}`,
    },
    {
      type: 'text',
      text: TASK_ANALYZE_TOKENS.userMessageTemplate
        .replace('{{intent}}', intent)
        .replace('{{mode}}', mode)
        .replace('{{count}}', String(selectedRefs.length))
        .replace('{{ids}}', selectedRefs.map((r) => r.id).join(', ')),
    },
  ];

  const PROGRESS_KEYS_SYSTEM = [
    'color', 'typography', 'layout', 'gradient',
    'spacing', 'rounded', 'components', 'visualDirection',
  ];
  // Start progress state
  onProgress?.(
    PROGRESS_KEYS_SYSTEM.map((key, i) => ({
      key,
      status: i === 0 ? 'running' : 'pending',
    })),
  );

  const MAX_TOKENS = 8192;
  const [coreSchema, designmdSchema] = TASK_ANALYZE_TOKENS.toolSchemas;
  const baseModel = model || TASK_ANALYZE_TOKENS.model;

  // ========== Phase 1: CORE 4 axes + visualDirection ==========

  const phase1Content = [
    ...content,
    {
      type: 'text',
      text: `=== PHASE 1 OF 2 ===
This call emits ONLY tokens.{color, typography, layout, gradient} + visualDirection.{markdown, tags}.
DO NOT include spacing/rounded/elevation/components in this call. Those go in phase 2.
Required non-empty: color (4-6), typography (3-4), layout (2-4 with kind grid|container only), gradient (1-3).
visualDirection.markdown must be 200+ chars filling sections 1-6 of the template.`,
    },
  ];

  const callPhase1 = async (extraInstruction = '') => {
    const messagesContent = extraInstruction
      ? [...phase1Content, { type: 'text', text: extraInstruction }]
      : phase1Content;
    const res = await callAnthropic({
      model: baseModel,
      max_tokens: MAX_TOKENS,
      system: TASK_ANALYZE_TOKENS.systemPrompt,
      tools: [coreSchema],
      tool_choice: { type: 'tool', name: coreSchema.name },
      messages: [{ role: 'user', content: messagesContent }],
    });
    const input = extractToolInput(res, coreSchema.name);
    return { res, input };
  };

  const checkCoreEmpties = (input) => {
    const t = input?.tokens || {};
    const empties = ['color', 'typography', 'layout', 'gradient']
      .filter((k) => !(Array.isArray(t[k]) && t[k].length > 0));
    const md = input?.visualDirection?.markdown;
    if (!md || md.length < 200) empties.push('visualDirection.markdown');
    return empties;
  };
  const summarizePhase1 = (input) => {
    const t = input?.tokens || {};
    return {
      core: {
        color: Array.isArray(t.color) ? t.color.length : 0,
        typography: Array.isArray(t.typography) ? t.typography.length : 0,
        layout: Array.isArray(t.layout) ? t.layout.length : 0,
        gradient: Array.isArray(t.gradient) ? t.gradient.length : 0,
      },
      visualDirection: {
        markdownLen: input?.visualDirection?.markdown?.length || 0,
        tags: input?.visualDirection?.tags ? Object.keys(input.visualDirection.tags) : [],
      },
    };
  };

  let { res: p1Res, input: phase1 } = await callPhase1();
  if (!phase1) throw new Error(`No T3 phase1 tool_use response. text: ${extractText(p1Res) || '(empty)'}`);
  if (p1Res?.stop_reason === 'max_tokens') {
    throw new Error(`T3 phase1 response was truncated at max_tokens(${MAX_TOKENS}).`);
  }
  // eslint-disable-next-line no-console
  console.log('[runAnalyzeTokens] Phase 1 result:', summarizePhase1(phase1));

  let p1Empties = checkCoreEmpties(phase1);
  if (p1Empties.length > 0) {
    // eslint-disable-next-line no-console
    console.warn('[runAnalyzeTokens] Phase 1 validation failed -> retrying:', p1Empties);
    const retry = await callPhase1(
      `[CRITICAL RETRY] Phase 1 missing/short: ${p1Empties.join(', ')}. Re-emit COMPLETE phase 1: tokens (color 4-6, typography 3-4, layout 2-4, gradient 1-3) + visualDirection (markdown 200+ chars, tags).`
    );
    if (retry.input) {
      phase1 = retry.input;
      p1Res = retry.res;
      p1Empties = checkCoreEmpties(phase1);
    }
    // eslint-disable-next-line no-console
    console.log('[runAnalyzeTokens] Phase 1 retry result:', summarizePhase1(phase1));
  }
  if (p1Empties.length > 0) {
    // eslint-disable-next-line no-console
    console.error('[runAnalyzeTokens] Phase 1 still empty after retry:', p1Empties);
  }

  // Progress state - phase 1 axes done
  onProgress?.(
    PROGRESS_KEYS_SYSTEM.map((key) => {
      if (['color', 'typography', 'layout', 'gradient', 'visualDirection'].includes(key)) {
        return { key, status: 'done' };
      }
      return { key, status: key === 'spacing' ? 'running' : 'pending' };
    }),
  );

  // ========== Phase 2: spacing / rounded / elevation / components ==========

  const phase1Color = phase1?.tokens?.color || [];
  const phase1Typo = phase1?.tokens?.typography || [];
  const phase1Layout = phase1?.tokens?.layout || [];
  const phase1Gradient = phase1?.tokens?.gradient || [];

  const phase2Content = [
    ...content,
    {
      type: 'text',
      text: `=== PHASE 2 OF 2 ===
Phase 1 emitted these tokens. Use these EXACT ids when building component {path} references.

colors (use as "{colors.<id>}"):
${phase1Color.map((c) => `  - ${c.id}  (${c.hex}, role=${c.role || '?'})`).join('\n') || '  (none)'}

typography (use as "{typography.<id>}"):
${phase1Typo.map((t) => `  - ${t.id}  (variant=${t.variant || '?'}, ${t.fontFamily || '?'})`).join('\n') || '  (none)'}

layout entries (FYI, not directly referenced):
${phase1Layout.map((l) => `  - ${l.id}  (kind=${l.kind})`).join('\n') || '  (none)'}

gradient entries (FYI):
${phase1Gradient.map((g) => `  - ${g.id}`).join('\n') || '  (none)'}

THIS CALL emits ONLY:
  - spacing: object map (3-6 entries, e.g. { sm: "8px", md: "16px", lg: "24px" })
  - rounded: object map (2-5 entries, e.g. { sm: "4px", md: "8px" })
  - elevation: array (0-3 entries, may be empty)
  - components: object map (3-8 entries), kebab-case names. EACH value's properties MUST be "{a.b}" token-ref strings:
      "{colors.<id>}"      → use phase 1 color ids exactly
      "{typography.<id>}"  → use phase 1 typography ids exactly
      "{spacing.<key>}"    → use scale keys you emit in this call's spacing
      "{rounded.<key>}"    → use scale keys you emit in this call's rounded
      "{elevation.<id>}"   → use ids you emit in this call's elevation
    NEVER use literal values like "#1A1C1E" or "16px" inside component spec values.
    EACH component MUST include decisionRationale: { whichReferences[], whyChosen }.
    Include at least one button-primary (or equivalent CTA).`,
    },
  ];

  const callPhase2 = async (extraInstruction = '') => {
    const messagesContent = extraInstruction
      ? [...phase2Content, { type: 'text', text: extraInstruction }]
      : phase2Content;
    const res = await callAnthropic({
      model: baseModel,
      max_tokens: MAX_TOKENS,
      system: TASK_ANALYZE_TOKENS.systemPrompt,
      tools: [designmdSchema],
      tool_choice: { type: 'tool', name: designmdSchema.name },
      messages: [{ role: 'user', content: messagesContent }],
    });
    const input = extractToolInput(res, designmdSchema.name);
    return { res, input };
  };

  // Merge the phase2 result so validateTokenRefs can see the phase1 ids.
  const buildMergedForRefCheck = (phase2) => ({
    tokens: {
      color: phase1Color,
      typography: phase1Typo,
      spacing: phase2?.spacing || {},
      rounded: phase2?.rounded || {},
      elevation: Array.isArray(phase2?.elevation) ? phase2.elevation : [],
      components: phase2?.components || {},
    },
  });
  const summarizePhase2 = (phase2) => ({
    spacing: phase2?.spacing && typeof phase2.spacing === 'object' ? Object.keys(phase2.spacing).length : 0,
    rounded: phase2?.rounded && typeof phase2.rounded === 'object' ? Object.keys(phase2.rounded).length : 0,
    elevation: Array.isArray(phase2?.elevation) ? phase2.elevation.length : 0,
    components: phase2?.components && typeof phase2.components === 'object' ? Object.keys(phase2.components).length : 0,
  });

  let { res: p2Res, input: phase2 } = await callPhase2();
  if (p2Res?.stop_reason === 'max_tokens') {
    // eslint-disable-next-line no-console
    console.error('[runAnalyzeTokens] Phase 2 response truncated at max_tokens - ignoring phase 2 result and proceeding with phase 1 only');
    phase2 = null;
  }
  // eslint-disable-next-line no-console
  console.log('[runAnalyzeTokens] Phase 2 result:', phase2 ? summarizePhase2(phase2) : '(none)');

  let refCheck = phase2 ? validateTokenRefs(buildMergedForRefCheck(phase2)) : { ok: true, literalProps: [], danglingRefs: [], errors: [] };
  const hasComponents = phase2?.components && typeof phase2.components === 'object'
    && !Array.isArray(phase2.components) && Object.keys(phase2.components).length > 0;
  const needsRefRetry = hasComponents && (refCheck.literalProps.length > 0 || refCheck.danglingRefs.length > 0);

  if (needsRefRetry) {
    // eslint-disable-next-line no-console
    console.warn('[runAnalyzeTokens] Phase 2 ref violation -> retrying:', { literals: refCheck.literalProps.slice(0, 3), danglings: refCheck.danglingRefs.slice(0, 3) });
    const parts = ['[CRITICAL RETRY] Phase 2 components contained invalid references.'];
    if (refCheck.literalProps.length > 0) {
      parts.push(`Literal values found (must be {a.b} token-ref): ${refCheck.literalProps.slice(0, 5).join(' | ')}.`);
    }
    if (refCheck.danglingRefs.length > 0) {
      parts.push(`Dangling references: ${refCheck.danglingRefs.slice(0, 5).join(' | ')}. Use ONLY ids that exist in phase 1 (color, typography) or this call's spacing/rounded/elevation keys.`);
    }
    const retry = await callPhase2(parts.join(' '));
    if (retry.input) {
      phase2 = retry.input;
      p2Res = retry.res;
      refCheck = validateTokenRefs(buildMergedForRefCheck(phase2));
    }
    // eslint-disable-next-line no-console
    console.log('[runAnalyzeTokens] Phase 2 retry result:', summarizePhase2(phase2));
  }

  // system mode fallback: if ref violations persist after retry, demote only components to an empty object.
  let phase2Final = phase2;
  let refValidation = null;
  const stillHasInvalidComponents = phase2Final?.components && Object.keys(phase2Final.components).length > 0
    && (refCheck.literalProps.length > 0 || refCheck.danglingRefs.length > 0);
  if (stillHasInvalidComponents) {
    // eslint-disable-next-line no-console
    console.warn('[runAnalyzeTokens] components ref violation persists -> fallback to empty object (system mode)');
    phase2Final = { ...phase2Final, components: {} };
    refValidation = {
      fallback: true,
      errors: refCheck.errors,
      danglingRefs: refCheck.danglingRefs,
      literalProps: refCheck.literalProps,
    };
  }

  // Completed state
  onProgress?.(
    PROGRESS_KEYS_SYSTEM.map((key) => ({ key, status: 'done' })),
  );

  // ========== Merge & return ==========

  const mergedTokens = {
    color: phase1Color,
    typography: phase1Typo,
    layout: phase1Layout,
    gradient: phase1Gradient,
    spacing: phase2Final?.spacing || {},
    rounded: phase2Final?.rounded || {},
    elevation: Array.isArray(phase2Final?.elevation) ? phase2Final.elevation : [],
    components: phase2Final?.components || {},
  };

  return {
    tokens: mergedTokens,
    visualDirection: phase1?.visualDirection || null,
    _refValidation: refValidation,
  };
}

/**
 * T3 (concept) - generate an 800-character Korean design prompt
 *  - Ready to paste directly into a web AI chat (Claude Desktop / Gemini / ChatGPT)
 *  - Returns only a single prompt string (no token synthesis)
 *  - Validation: length 200-800, HEX 3+, no markdown/token IDs
 *  - Retry once on validation failure
 *
 * @param {object} params
 * @param {string} params.intent
 * @param {Array<{id, tags?, dominantColors?, extracted?}>} params.selectedRefs
 * @param {string} [params.userNotes='']
 * @param {string} [params.model]
 * @param {function} [params.onProgress]
 * @returns {Promise<{ conceptPrompt: string }>}
 */
export async function runAnalyzeConcept({ intent, selectedRefs, model, onProgress }) {
  if (!selectedRefs?.length) throw new Error('At least 1 image required');

  const extractedPool = selectedRefs.map((ref, i) => ({
    id: ref.id,
    attachIdx: i + 1,
    attachFile: inferRefAttachFile(ref, i),
    title: ref.title || null,
    tags: ref.tags || {},
    dominantColors: ref.dominantColors || [],
    extracted: ref.extracted || {},
  }));

  const refNotesBlock = buildReferenceNotesBlock(selectedRefs);
  const content = [
    {
      type: 'text',
      text: `=== Pre-extracted references (${selectedRefs.length}) ===

${JSON.stringify(extractedPool, null, 2)}

=== End of references ===${refNotesBlock}`,
    },
    {
      type: 'text',
      text: TASK_ANALYZE_CONCEPT.userMessageTemplate
        .replace('{{intent}}', intent)
        .replace('{{count}}', String(selectedRefs.length))
        .replace('{{ids}}', selectedRefs.map((r) => r.id).join(', ')),
    },
  ];

  const toolName = TASK_ANALYZE_CONCEPT.toolSchemas[0].name;

  const callOnce = async (extraInstruction = '') => {
    const messagesContent = extraInstruction
      ? [...content, { type: 'text', text: extraInstruction }]
      : content;
    const res = await callAnthropic({
      model: model || TASK_ANALYZE_CONCEPT.model,
      max_tokens: 1024,
      system: TASK_ANALYZE_CONCEPT.systemPrompt,
      tools: TASK_ANALYZE_CONCEPT.toolSchemas,
      tool_choice: { type: 'tool', name: toolName },
      messages: [{ role: 'user', content: messagesContent }],
    });
    const input = extractToolInput(res, toolName);
    return { res, input };
  };

  // Auto validation: length, HEX count, absence of markdown/token IDs
  const validate = (prompt) => {
    if (!prompt || typeof prompt !== 'string') return ['empty'];
    const errors = [];
    if (prompt.length < 200) errors.push(`too-short(${prompt.length})`);
    if (prompt.length > 800) errors.push(`too-long(${prompt.length})`);
    const hexCount = (prompt.match(/#[0-9A-Fa-f]{6}/g) || []).length;
    if (hexCount < 3) errors.push(`hex-too-few(${hexCount})`);
    if (/```|^#{1,6}\s|^\s*[-*]\s/m.test(prompt)) errors.push('markdown-detected');
    if (/(col-|typo-|primary:|h1:|--[a-z]+-)/i.test(prompt)) errors.push('token-id-detected');
    return errors;
  };

  onProgress?.([{ key: 'conceptPrompt', status: 'running' }]);

  let { res: response, input: result } = await callOnce();
  if (!result?.prompt) {
    throw new Error(`No T3(concept) tool_use response. text: ${extractText(response) || '(empty)'}`);
  }

  let errors = validate(result.prompt);
  if (errors.length > 0) {
    // eslint-disable-next-line no-console
    console.warn('[runAnalyzeConcept] validation failed -> retrying:', errors);
    const retryInstruction = `[CRITICAL RETRY] Previous prompt failed validation: ${errors.join(', ')}. ` +
      'Constraints: 200-800 Korean chars, ≥3 HEX codes, NO markdown headers/bullets/code blocks, NO token IDs. ' +
      'Re-emit a single natural Korean paragraph.';
    const retry = await callOnce(retryInstruction);
    if (retry.input?.prompt) {
      result = retry.input;
      response = retry.res;
      errors = validate(result.prompt);
      if (errors.length > 0) {
        // eslint-disable-next-line no-console
        console.error('[runAnalyzeConcept] validation still failed after retry:', errors, '- returning prompt as-is');
      }
    }
  }

  onProgress?.([{ key: 'conceptPrompt', status: 'done' }]);

  return { conceptPrompt: result.prompt };
}


/**
 * Auto-generate a usage note for a single reference.
 *
 * Based on the project intent + mode + the ref's tags / extracted meta,
 * suggests "what to borrow from this reference" as one line (<=100 chars).
 * An aid for the Step 3 usage note input - the user may use it as-is or edit it.
 *
 * @param {object} params
 * @param {string} params.intent - One-line project intent
 * @param {'concept'|'system'} [params.mode='system']
 * @param {object} params.ref - { id, title?, tags?, dominantColors?, extracted?, useLayers? }
 * @param {string[]} [params.useLayers] - Layers the user curated for borrowing (take priority if present)
 * @param {string} [params.model]
 * @returns {Promise<string>} Note string (max 100 chars, trimmed on both sides)
 */
export async function runSuggestRefNote({ intent, mode = 'system', ref, useLayers, model }) {
  if (!ref?.id) throw new Error('ref is required');

  const layers = Array.isArray(useLayers) && useLayers.length > 0
    ? useLayers
    : (Array.isArray(ref.useLayers) ? ref.useLayers : []);

  const meta = {
    id: ref.id,
    title: ref.title || null,
    tags: ref.tags || {},
    dominantColors: ref.dominantColors || [],
    extracted: ref.extracted || {},
    useLayers: layers,
  };

  const system = `You are a design reference curator. Suggest, in a single concise English line (<=100 chars), which part of the user's selected reference to borrow.

Rules:
- 100 chars or fewer. Just the essentials, no periods or quotation marks.
- Specify which layer of which area, e.g. "hero area color palette" / "mimic right sidebar structure".
- If useLayers is specified, address only those layers.
- For mode=concept, weight mood/emotion; for mode=system, weight tokens/roles.
- Output the note string only. No labels, prefixes, or explanations.`;

  const userText = `=== Project intent ===
${intent || '(none)'}

=== Mode ===
${mode}

=== Reference meta ===
${JSON.stringify(meta, null, 2)}

Suggest, in one line, what to borrow from this reference.`;

  const response = await callAnthropic({
    model: model || TASK_ANALYZE_TOKENS.model,
    max_tokens: 200,
    system,
    messages: [{ role: 'user', content: userText }],
  });

  const text = (extractText(response) || '').trim().replace(/^["'`]|["'`]$/g, '').trim();
  return text.slice(0, 100);
}
