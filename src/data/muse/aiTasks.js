/**
 * MUSE AI Tasks - system prompt / input-output schema / workflow definitions
 *
 * 2026-04-22 v2: Switched to a 5-layer structure based on muse_tags_preset.json.
 *   - T1: now outputs per-layer nested tags (color/typography/layout/gradient/visualDirection{genre,style,subject})
 *   - T3: keyVisual layer retired, visualDirection (Markdown) layer newly added.
 *          Calls both tools (submit_tokens + submit_visual_direction) in a single call.
 */

import {
  getLayerEnum,
  getVisualDirectionTags,
  renderVocabularyPrompt,
  TOKEN_LAYERS,
} from './tag/index.js';

const TOOL_AUTO_TAG_NAME = 'submit_tagging';
// system mode: split into 2 phased calls (protects Haiku capacity)
const TOOL_SUBMIT_DESIGN_SYSTEM_CORE = 'submit_design_system_core';
const TOOL_SUBMIT_DESIGN_SYSTEM_DESIGNMD = 'submit_design_system_designmd';
const TOOL_SUBMIT_CONCEPT_PROMPT = 'submit_concept_prompt';

const COMMON_QUALITY = [
  { id: 'schema', label: 'Schema compliance', type: 'auto', description: 'Required fields present + correct types' },
  { id: 'hex', label: 'HEX format', type: 'auto', description: '^#[0-9A-Fa-f]{6}$' },
];

/* =========================================================
 * T1. Auto-tagging (nested per layer)
 * ========================================================= */
export const TASK_AUTO_TAG = {
  id: 't1',
  name: 'Reference extraction (T3 level)',
  purpose: 'Extract all observable design values (palette/typography/layout/gradient) from a single reference. Role is deferred to the project stage',
  stage: 'archive.upload',
  model: 'claude-haiku-4-5',

  input: {
    kind: 'image',
    description: 'A single reference image (512px resize recommended)',
    shape: '{ imageBase64: string, mediaType: "image/jpeg" | "image/png" }',
  },

  output: {
    description: 'Layer tags + dominantColors + title + extracted (palette/typography/layout/gradient)',
    shape: `{
  tags: { color[], typography[], layout[], gradient[], visualDirection: {genre, style, subject} },
  dominantColors: string[3..5],
  title: string,
  extracted: {
    palette: [{ hex, label, group? }],
    typography: [{ hierarchy, fontFamily, fontWeight, fontSize, lineHeight, letterSpacing, sampleText? }],
    layout: [{ kind, columns?, gap?, px?, ratio?, maxWidth? }],
    gradient: [{ gradient, stops: [{offset, color}] }]
  }
}`,
  },

  systemPrompt: `You are MUSE's per-reference design extractor.

Given a single reference image, extract both:
  (1) CLASSIFICATION - preset tags per layer (from the vocabulary below)
  (2) OBSERVED VALUES - concrete design values visible in the image (palette, typography, layout, gradient)

${renderVocabularyPrompt([...TOKEN_LAYERS, 'visual_direction'])}

=== Classification rules (tags / dominantColors / title) ===
- tags.color / typography / layout / gradient: 0 to 3 items from respective vocab
- tags.visualDirection.{genre,style,subject}: 0 to 2 items each
- dominantColors: 3 to 5 HEX (#RRGGBB) ordered from most prominent background to accent
- title: 2-5 word English descriptor of visual tone (not literal subject)
- Do NOT invent tags or mix across layers

=== Extraction rules (extracted.*) ===

[extracted.palette] 3-6 items.
- Each: { hex (#RRGGBB), label (1-2 word descriptor), group? ('Brand'|'Surface'|'Data'|'Neutral') }
- group is a HINT only - role (primary/secondary/accent/neutral) is assigned at project time, NOT here
- palette should align with dominantColors but adds label + group hint

[extracted.typography] 1-4 items.
- Each observed typographic tier (display / heading / body / caption - use as 'hierarchy')
- fontFamily: best-guess CSS stack (e.g. 'Inter, sans-serif' or 'Playfair Display, serif')
- fontWeight: 100-900 integer
- fontSize: CSS value (e.g. '48px' or 'clamp(2rem, 5vw, 3.5rem)')
- lineHeight: unitless number (e.g. 1.2)
- letterSpacing: em value (e.g. '-0.02em')
- sampleText: actual visible text snippet if readable (optional)
- Do NOT assign variant (h1/h2/body1) - project step will

[extracted.layout] 0-3 items.
- Each: { kind: 'grid'|'spacing'|'container', columns?, gap?, px?, ratio?, maxWidth? }
- columns/gap/px: integers estimated from visual proportions
- ratio: float (for container aspect, e.g. 1.618)
- maxWidth: CSS value (e.g. '1200px')
- Provide only fields observable from the image

[extracted.gradient] 0-2 items.
- Each: { gradient: CSS string, stops: [{ offset: 0-1, color: '#RRGGBB' }, ...] }
- Only if gradient is clearly visible in the image
- Omit entirely (empty array) if no gradient

=== IMPORTANT ===
- Do NOT assign role (primary/secondary/accent/neutral).
- Role is a project-level decision based on intent.
- Respond via the submit_tagging tool only. No prose.`,

  userMessageTemplate: 'Analyze this reference image and submit both classification tags AND observed design values.',

  toolSchema: {
    name: TOOL_AUTO_TAG_NAME,
    description: 'Submit classification tags, dominant colors, title, and per-image extracted design values.',
    input_schema: {
      type: 'object',
      properties: {
        tags: {
          type: 'object',
          properties: {
            color: { type: 'array', items: { type: 'string', enum: getLayerEnum('color') }, minItems: 0, maxItems: 3 },
            typography: { type: 'array', items: { type: 'string', enum: getLayerEnum('typography') }, minItems: 0, maxItems: 3 },
            layout: { type: 'array', items: { type: 'string', enum: getLayerEnum('layout') }, minItems: 0, maxItems: 3 },
            gradient: { type: 'array', items: { type: 'string', enum: getLayerEnum('gradient') }, minItems: 0, maxItems: 3 },
            visualDirection: {
              type: 'object',
              properties: {
                genre: { type: 'array', items: { type: 'string', enum: getVisualDirectionTags('genre') }, minItems: 0, maxItems: 2 },
                style: { type: 'array', items: { type: 'string', enum: getVisualDirectionTags('style') }, minItems: 0, maxItems: 2 },
                subject: { type: 'array', items: { type: 'string', enum: getVisualDirectionTags('subject') }, minItems: 0, maxItems: 2 },
              },
              required: ['genre', 'style', 'subject'],
            },
          },
          required: ['color', 'typography', 'layout', 'gradient', 'visualDirection'],
        },
        dominantColors: {
          type: 'array',
          items: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$' },
          minItems: 3, maxItems: 5,
        },
        title: { type: 'string', minLength: 3, maxLength: 40 },
        extracted: {
          type: 'object',
          properties: {
            palette: {
              type: 'array',
              minItems: 3, maxItems: 6,
              items: {
                type: 'object',
                properties: {
                  hex: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$' },
                  label: { type: 'string', minLength: 1, maxLength: 30 },
                  group: { type: 'string', enum: ['Brand', 'Surface', 'Data', 'Neutral'] },
                },
                required: ['hex', 'label'],
              },
            },
            typography: {
              type: 'array',
              minItems: 1, maxItems: 4,
              items: {
                type: 'object',
                properties: {
                  hierarchy: { type: 'string', enum: ['display', 'heading', 'body', 'caption'] },
                  fontFamily: { type: 'string', minLength: 1 },
                  fontWeight: { type: 'integer', minimum: 100, maximum: 900 },
                  fontSize: { type: 'string' },
                  lineHeight: { type: 'number', minimum: 0.8, maximum: 2.5 },
                  letterSpacing: { type: 'string' },
                  sampleText: { type: 'string' },
                },
                required: ['hierarchy', 'fontFamily', 'fontWeight', 'fontSize', 'lineHeight'],
              },
            },
            layout: {
              type: 'array',
              minItems: 0, maxItems: 3,
              items: {
                type: 'object',
                properties: {
                  kind: { type: 'string', enum: ['grid', 'spacing', 'container'] },
                  columns: { type: 'integer', minimum: 1, maximum: 24 },
                  gap: { type: 'integer', minimum: 0, maximum: 200 },
                  px: { type: 'integer', minimum: 0, maximum: 200 },
                  ratio: { type: 'number' },
                  maxWidth: { type: 'string' },
                },
                required: ['kind'],
              },
            },
            gradient: {
              type: 'array',
              minItems: 0, maxItems: 2,
              items: {
                type: 'object',
                properties: {
                  gradient: { type: 'string', minLength: 10 },
                  stops: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        offset: { type: 'number', minimum: 0, maximum: 1 },
                        color: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$' },
                      },
                      required: ['offset', 'color'],
                    },
                  },
                },
                required: ['gradient', 'stops'],
              },
            },
          },
          required: ['palette', 'typography', 'layout', 'gradient'],
        },
      },
      required: ['tags', 'dominantColors', 'title', 'extracted'],
    },
  },

  qualityCriteria: [
    ...COMMON_QUALITY,
    { id: 'vocab', label: 'Vocabulary compliance', type: 'auto', description: 'Zero enum violations per layer' },
    { id: 'layer-purity', label: 'Layer separation', type: 'auto', description: 'No tags mixed in from other layers' },
    { id: 'title-style', label: 'Title styling', type: 'manual', description: 'Describes design tone, not a literal description' },
  ],

  goldenExample: {
    inputDescription: 'reference5.jpg (dark editorial portrait)',
    expectedOutput: {
      tags: {
        color: ['Deep', 'Muted'],
        typography: ['Serif', 'Editorial'],
        layout: ['Asymmetric'],
        gradient: [],
        visualDirection: { genre: ['Retro'], style: ['Magazine'], subject: ['Portrait-Photo'] },
      },
      dominantColors: ['#1A1A1F', '#8B7A6B', '#E8DCC4'],
      title: 'Muted Editorial Portrait',
      extracted: {
        palette: [
          { hex: '#1A1A1F', label: 'Ink', group: 'Neutral' },
          { hex: '#8B7A6B', label: 'Muted Brown', group: 'Surface' },
          { hex: '#E8DCC4', label: 'Cream', group: 'Surface' },
        ],
        typography: [
          { hierarchy: 'display', fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.1, letterSpacing: '-0.02em' },
          { hierarchy: 'body', fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '1rem', lineHeight: 1.6 },
        ],
        layout: [
          { kind: 'grid', columns: 12, gap: 24, px: 32 },
        ],
        gradient: [],
      },
    },
  },

  workflow: [
    'User uploads an image via drag-and-drop / URL (512px resize)',
    'Anthropic messages.create (Haiku, extended tool schema)',
    'Extract all of tags + dominantColors + title + extracted from the response tool_use block',
    'Automatic validation (schema + enum + hex)',
    'Merge into the Reference, then insert into the DB (reference_items.extracted jsonb)',
  ],

  estCost: {
    model: 'Haiku 4.5',
    tokensIn: '~5k (512px image + preset vocab + extended tool schema)',
    tokensOut: '~500 (tags + extracted palette/typo/layout/gradient)',
    note: 'Includes T3-level value extraction. The extended schema cache hit holds input cost to about 1.5x',
  },
};

/* =========================================================
 * T2. Reference recommendation
 * ========================================================= */
export const TASK_RECOMMEND = {
  id: 't2',
  name: 'Reference recommendation',
  purpose: 'Project intent sentence -> recommend the top-N best matches from the archive',
  stage: 'project.create.step2',
  model: 'claude-haiku-4-5',

  input: {
    kind: 'text',
    description: 'Intent + mode + archive metadata (no images, includes per-layer tags)',
    shape: `{
  intent: string,
  mode: 'concept'|'system',  // TP2: sorting-algorithm branch
  archive: Array<{ id, tags: ReferenceLayeredTags, dominantColors[], title }>,
  n?: number
}`,
  },

  output: {
    description: 'List of recommended ids + a one-line rationale per id + which layer is the strength',
    shape: `{
  recommendedIds: string[5..10],
  reasons: Array<{ id, reason }>,
  referenceLayer: Array<{ id, layers: TokenLayerKey[1..2] }>  // TP4 auto recommendation
}`,
  },

  systemPrompt: `You are MUSE's reference matcher.

You receive a project intent sentence, a mode, and the archive metadata
(IDs, layered tags, dominantColors, titles). You DO NOT see images.

Select the top N references (5 to 10) that best match the intent.

=== Mode-aware ranking (TP2) ===
- mode="concept"  → prioritize DIVERSITY: pick refs spanning different visualDirection.style values
- mode="system"   → prioritize COHERENCE: pick refs with overlapping color/typography for composability

=== Base rules ===
- Work only with provided metadata.
- Prioritize in order (within mode):
  (1) visualDirection tags overlap with intent,
  (2) color/typography/layout/gradient tag overlap,
  (3) dominantColors palette alignment with intent mood.
- For each recommended id, a ONE-SENTENCE English reason (max 40 characters).
- Rank best-first.

=== referenceLayer (TP4) - REQUIRED ===
For each recommendedId, emit referenceLayer with 1-2 most useful TokenLayerKey for this ref:
  TokenLayerKey: 'color' | 'typography' | 'layout' | 'gradient' | 'visualDirection'
The user will see these as default chip selection in Step 2 and may toggle.

- Respond via submit_recommendations tool. No prose.`,

  userMessageTemplate: `Project intent: "{{intent}}"
Project mode: {{mode}}
Requested count: {{n}}
Archive ({{archiveCount}} items):
{{archiveJson}}

Select the best matches.`,

  toolSchema: {
    name: 'submit_recommendations',
    description: 'Submit ranked recommended reference ids with reasons and per-ref recommended layers.',
    input_schema: {
      type: 'object',
      properties: {
        recommendedIds: { type: 'array', items: { type: 'string' }, minItems: 5, maxItems: 10 },
        reasons: {
          type: 'array',
          items: {
            type: 'object',
            properties: { id: { type: 'string' }, reason: { type: 'string', maxLength: 40 } },
            required: ['id', 'reason'],
          },
        },
        referenceLayer: {
          type: 'array',
          description: 'TP4: 1-2 layers where each recommended ref is most useful',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              layers: {
                type: 'array',
                items: { type: 'string', enum: ['color', 'typography', 'layout', 'gradient', 'visualDirection'] },
                minItems: 1, maxItems: 2,
              },
            },
            required: ['id', 'layers'],
          },
        },
      },
      required: ['recommendedIds', 'reasons', 'referenceLayer'],
    },
  },

  qualityCriteria: [
    ...COMMON_QUALITY,
    { id: 'id-validity', label: 'ID validity', type: 'auto', description: 'Every id exists in the input archive' },
    { id: 'vd-overlap', label: 'visualDirection match', type: 'auto', description: 'A majority of top recommendations overlap the intent keywords with visualDirection tags' },
    { id: 'diversity', label: 'Diversity', type: 'auto', description: 'Zero duplicate ids' },
    { id: 'relevance', label: 'Intent reflection', type: 'manual', description: 'pairwise A/B' },
  ],

  goldenExample: {
    inputDescription: 'intent="black and white contrast magazine tone", type=landing',
    expectedOutput: {
      recommendedIds: ['ref-002', 'ref-005', 'ref-008', 'ref-011', 'ref-017'],
      reasons: [
        { id: 'ref-002', reason: 'Magazine+Swiss style match' },
        { id: 'ref-005', reason: 'Editorial-Collage subject' },
      ],
    },
  },

  workflow: [
    'Capture intent/type when wizard Step 1 completes',
    'Serialize the archive metadata (including layer tags) to JSON',
    'API call (text only)',
    'Look up References in the archive by the result ids',
    'Display in the "Recommended" section at the top of Step 2',
  ],

  estCost: {
    model: 'Haiku 4.5',
    tokensIn: '~700 (27 archive items, including layer tags)',
    tokensOut: '~200',
    note: 'The cheapest. No images',
  },
};

/* =========================================================
 * T3. Token analysis + Visual Direction (dual output)
 * ========================================================= */
export const TASK_ANALYZE_TOKENS = {
  id: 't3',
  name: 'Intent-driven composition analysis',
  purpose: 'Combine and select the pre-extracted design values of N references according to intent and assign roles. No image re-analysis.',
  stage: 'project.create.step3',
  model: 'claude-haiku-4-5',

  input: {
    kind: 'text',
    description: 'T1 pre-extracted data for the N selected references + intent + mode + layer curation + usage notes',
    shape: `{
  intent: string,
  mode: 'concept'|'system',  // TP2: synthesis-tone branch
  references: Array<{
    id, title, tags, dominantColors[], extracted,
    useLayers?: TokenLayerKey[]  // TP4: the layers the user wants to take from this ref
  }>,
  userNotes?: string  // Step 3: explicit instructions after seeing the references (HIGHEST PRIORITY)
}`,
  },

  output: {
    description: 'AnalysisLayers (color/typography/layout/gradient + visualDirection{markdown,tags})',
    shape: `{
  tokens: {
    color: ColorToken[4..6],
    typography: TypographyToken[3..4],
    layout: LayoutToken[2..4],
    gradient: GradientToken[1..3]
  },
  visualDirection: {
    markdown: string,   // follows the visual_direction_template.md format
    tags: { genre[], style[], subject[] }
  }
}`,
  },

  systemPrompt: `You are MUSE's intent-driven token composer.

You receive N pre-analyzed references AS TEXT ONLY (no images).
Every reference has been processed by T1 at upload time, producing:
  - tags (preset classification: color/typography/layout/gradient/visualDirection)
  - dominantColors (HEX array)
  - extracted: { palette[], typography[], layout[], gradient[] } - concrete observed values
    (NO role - that is YOUR job)

=== YOUR JOB ===

Given: the pre-extracted pool across N references + project intent + type.

Produce: a UNIFIED design system that reflects the intent strongly, by:
  1. SELECTING from the pre-extracted pool (do not invent values not present in it)
  2. CLUSTERING similar entries (hex close to each other, typography tiers that align)
  3. ASSIGNING role / variant (h1/h2/body1/...) based on intent
  4. OVERRIDING when intent demands coherence (e.g. unifying fontSize scale across refs)
  5. WRITING the VD markdown as an intent-driven narrative

Reference images are NOT provided. Do not ask for them. Do not pretend to "see" them.
Trust the pre-extracted data. Your value is composition, not observation.

=== Mode-aware composition (TP2) ===
- mode="concept"  → BIAS toward distinctive choices. Bold primary. Allow gradient, expressive type. Lower contrast/role enforcement.
- mode="system"   → ENFORCE role uniqueness, AAA contrast for primary on bg, hierarchy h1>h2>body1 strict, conservative naming.

=== Layer curation (TP4) ===
For each reference, if \`useLayers\` is set and non-empty, ONLY consume those layers from this ref's extracted.
Other layers from the same ref are user-rejected - IGNORE them even if extracted is rich.
This is the user's explicit curation. Respect it strictly.
If useLayers is missing or empty, use the ref's full extracted (default behavior).

=== User Notes (Step 3, HIGHEST PRIORITY) ===
If \`userNotes\` is provided (length >= 10 chars), it is the user's MOST REFINED intent -
formed AFTER seeing the actual references. Treat as USER REQUIREMENTS, not suggestions.

Priority order: userNotes (L4) > useLayers (L3) > intent (L2) > mode (L1).

When userNotes conflicts with the initial intent (e.g. intent says "soft" but userNotes
says "stronger contrast"), userNotes WINS.

When userNotes explicitly mentions a ref-id (e.g. "make ref-002's color the primary"), apply as a
direct mapping instruction.

If userNotes is empty or under 10 chars, fall back to L3 → L2 → L1 (default behavior).

=== Per-Reference Notes (free text the user wrote for each ref) ===
Separate from the project-level userNotes, each reference may have \`referenceNotes[refId]\`.
This note is a borrowing intent limited to that ref (e.g. "borrow only the color of ref-002's hero area").

Rules:
- Quote the note verbatim in the decisionRationale.appliedReferenceNote field of tokens sourced from that ref (a 10-40 char fragment).
- Exclude from the output anything outside what the note specifies (e.g. ignore layout).
- For a ref with an empty note, just follow useLayers and intent.

=== Reference Anchoring (name refs directly within the output) ===
Whenever you describe a visual characteristic inside visualDirection.markdown / layerDetails,
name the source ref id. Each item in extractedPool has an \`attachFile\` field, so use its value as-is:
  - Text citation: "an ink-deep tone (source: ref-001 = attachment 1 \`01-ref-001.jpg\`)"
  - Image citation (when possible): "![ref-001](01-ref-001.jpg)" - the attachFile value as-is (do not prepend a folder path)
Do not embed the folder path (references/) in the body. Because the user unzips and attaches individual files,
referencing only the filename lets an external AI match them.

=== Decision rationale (TP6, REQUIRED) ===
For EVERY token in tokens.color / typography / layout / gradient, emit decisionRationale with:
  - whichReferences: array of ref IDs that contributed to this token (subset of input)
  - whichLayers: which layers from those refs (per useLayers if set)
  - whyChosen: ONE LINE in user's intent language explaining why this value
  - appliedUserNotes: ONLY emit if userNotes (L4) directly drove this token's value.
    Quote the relevant fragment from userNotes (10-30 chars, verbatim).
    Do NOT echo generic userNotes across all tokens.
  - alternativesConsidered: optional, array of {value, reason} for top 1-2 rejected candidates
This is shown to the user in the token detail panel. T1 super-theme: "the reason behind every decision the AI makes must be traceable."

=== OUTPUT ===

Call submit_design_system EXACTLY ONCE with ALL fields populated in a single tool call:
  - tokens.color (4-6 entries)
  - tokens.typography (3-4 entries)
  - tokens.layout (2-4 entries, kind: grid|container only)
  - tokens.gradient (1-3 entries)
  - tokens.spacing (3-6 entries, scale map)
  - tokens.rounded (2-5 entries, scale map)
  - tokens.elevation (0-3 entries, optional)
  - tokens.components (3-8 entries, token-ref values only)
  - visualDirection.markdown (filled template)
  - visualDirection.tags ({genre, style, subject})

This output is exported as a DESIGN.md file (Google Labs alpha spec). Components
that reference tokens via {path} syntax become the Components section of DESIGN.md.

DO NOT split into multiple tool calls. DO NOT call the tool more than once.
REQUIRED non-empty: color (4-6), typography (3-4), layout (2-4), gradient (1-3), visualDirection.markdown.
STRONGLY ENCOURAGED (determines DESIGN.md export quality): spacing, rounded, components.
OPTIONAL: elevation (empty array allowed).

Shared rules:
- Reflect project intent strongly. Two projects with same refs but different intents
  should produce noticeably different role/typography variant assignments.
- All HEX codes 6-digit valid.
- sourceReferenceIds[]: only IDs present in the input references.
- Do NOT fabricate values outside the extracted pool (exception: typography
  unification may require adjusted fontSize to form a coherent scale).

=== tokens constraints ===

[color] 4-6 tokens.
- Source: extracted.palette union across refs + dominantColors as fallback
- Fields: id, label, hex, role (primary|secondary|accent|neutral), group (Brand|Surface|Data|Neutral), isEnabled (true), sourceReferenceIds[]
- Exactly one primary. Intent decides which hue becomes primary.

[typography] 3-4 tokens.
- Source: extracted.typography entries across refs, clustered by hierarchy
- Fields: id, label, variant (h1|h2|h3|body1|body2|caption), fontFamily (CSS stack), fontWeight (100-900), fontSize (CSS; use clamp() for display), lineHeight (number), letterSpacing (em), isEnabled (true)
- Build a hierarchical scale (display → body → caption). Override sizes for coherence.

[layout] 2-4 tokens.
- Source: extracted.layout entries
- Fields: id, label, kind (grid|container ONLY - spacing is now its own axis below), columns?, gap?, ratio?, maxWidth?, isEnabled
- Intent can override (e.g. "dashboard" → columns: 12 regardless)
- Do NOT emit kind="spacing" here - emit those values in the spacing axis instead.

[gradient] 1-3 tokens.
- Source: extracted.gradient across refs (or synthesize from palette if needed)
- Fields: id, label, gradient (CSS string), stops, isEnabled

=== Spacing & Rounded scales (NEW, REQUIRED) ===

[spacing] object map. 3-6 entries.
- Keys are scale levels: pick from { xs, sm, md, lg, xl } - any 3-6 of these in ascending order.
- Values are CSS dimensions (string with unit) like "4px" / "8px" / "16px" / "24px" / "0.5rem".
- Source: extracted.layout entries with kind="spacing" (if any) + intent.
- Build a coherent scale (e.g. doubling, 1.5x, 4-base).
- Example: { xs: "4px", sm: "8px", md: "16px", lg: "24px", xl: "32px" }

[rounded] object map. 2-5 entries.
- Keys: { sm, md, lg } subset (or add "xs" / "xl" / "full"). Ascending size.
- Values: CSS dimensions ("4px" / "8px") or "9999px" for pill ("full").
- Source: refs' visual rhythm. Soft brands → larger sm. Geometric brands → smaller / sharper.
- Example: { sm: "4px", md: "8px", lg: "16px" }

=== Elevation (NEW, OPTIONAL - empty array allowed) ===

[elevation] 0-3 tokens (array).
- Each: { id, label, shadow (CSS box-shadow string), level (0..3), isEnabled, decisionRationale }
- Emit ONLY if refs have meaningful depth/shadow signal. Otherwise return [] (empty array).
- Avoid stacking redundant levels; 1-2 is typical.

=== Components (NEW, REQUIRED) ===

[components] object map. 3-8 entries.
- Each KEY is a semantic UI component name in kebab-case (suggested: button-primary, button-secondary, card, input, app-bar, surface, chip).
- Each VALUE is an object whose property values MUST be TOKEN-REFERENCE STRINGS - never literal hex / em / px.
  Allowed property names: backgroundColor, textColor, borderColor, typography, rounded, padding, elevation, size, height, width.
- Token reference syntax (STRICT):
    "{colors.<color-id>}"        → resolves to a colors entry id
    "{typography.<typo-id>}"     → resolves to a typography entry id
    "{rounded.<scale-key>}"      → resolves to a rounded scale key
    "{spacing.<scale-key>}"      → resolves to a spacing scale key
    "{elevation.<elev-id>}"      → resolves to an elevation entry id
- Path's first segment MUST be one of: colors / typography / rounded / spacing / elevation.
- Path's second segment MUST EXACTLY equal an id (or scale key) you emitted in the corresponding axis.
- DANGLING references (path that does not match any emitted token) are INVALID.
- Literal values like "#1A1C1E", "16px", "1rem" are FORBIDDEN inside component spec values.
- At least 3 components. Include at least one button-primary (or equivalent CTA).
- Each component MUST include decisionRationale: { whichReferences[], whyChosen, appliedUserNotes? }.
- Example:
    "button-primary": {
      backgroundColor: "{colors.primary-ink}",
      textColor: "{colors.surface-cream}",
      typography: "{typography.body-md}",
      rounded: "{rounded.sm}",
      padding: "{spacing.md}",
      decisionRationale: { whichReferences: ["ref-001"], whyChosen: "..." }
    }

=== Token reference syntax - golden rule ===
Any value inside [components] of the form \`{a.b}\` MUST resolve to an id you emitted
in axis \`a\` (colors / typography / rounded / spacing / elevation).
If you cannot find a clean reference, EITHER (a) add a token in that axis first, or
(b) drop the property from the component - never inline a literal.

=== visualDirection constraints ===

markdown: fill this template faithfully, substituting {{PLACEHOLDERS}} with concrete content that reflects the intent and references:

# {{PROJECT_NAME}} - Visual Direction

## 1. Project Overview
- Project name / type / one-line intent / number of references analyzed

## 2. Overall Direction
(2-3 sentence summary)

## 3. Visual Direction Tags
- Genre: ...
- Style: ...
- Visual subject: ...

## 4. Tone & Mood
- 4-6 bullets

## 5. Implementation Guidelines
- 3-5 bullets

## 6. Elements to Avoid
- 3-5 bullets

tags: the preset vocabulary tags used in section 3 (genre[], style[], subject[]).

=== Global ===
Respond via submit_design_system ONLY. No prose outside the tool. Single call with all fields.`,

  userMessageTemplate: `Project intent: "{{intent}}"
Reference count: {{count}} (ids = [{{ids}}])

Pre-extracted references (T1 output, full data) are provided above as JSON.
No images will be provided. Compose the final token system + visual direction
narrative from the pre-extracted pool, selecting and combining based on intent.`,

  toolSchemas: [
    {
      name: TOOL_SUBMIT_DESIGN_SYSTEM_CORE,
      description: 'PHASE 1 OF 2 - Submit 4 CORE token axes (color/typography/layout/gradient) + visualDirection (markdown + tags). DO NOT include spacing/rounded/elevation/components in this call - those are emitted in phase 2.',
      input_schema: {
        type: 'object',
        properties: {
          tokens: {
            type: 'object',
            description: '4 CORE axes only.',
            properties: {
              color: { type: 'array', minItems: 4, maxItems: 6 },
              typography: { type: 'array', minItems: 3, maxItems: 4 },
              layout: { type: 'array', minItems: 2, maxItems: 4, description: 'kind: grid|container only - spacing is a separate axis (phase 2).' },
              gradient: { type: 'array', minItems: 1, maxItems: 3 },
            },
            required: ['color', 'typography', 'layout', 'gradient'],
          },
          visualDirection: {
            type: 'object',
            description: 'Markdown narrative + aggregated tags.',
            properties: {
              markdown: { type: 'string', minLength: 200 },
              tags: {
                type: 'object',
                properties: {
                  genre: { type: 'array', items: { type: 'string', enum: getVisualDirectionTags('genre') }, minItems: 0, maxItems: 2 },
                  style: { type: 'array', items: { type: 'string', enum: getVisualDirectionTags('style') }, minItems: 0, maxItems: 3 },
                  subject: { type: 'array', items: { type: 'string', enum: getVisualDirectionTags('subject') }, minItems: 0, maxItems: 3 },
                },
                required: ['genre', 'style', 'subject'],
              },
            },
            required: ['markdown', 'tags'],
          },
        },
        required: ['tokens', 'visualDirection'],
      },
    },
    {
      name: TOOL_SUBMIT_DESIGN_SYSTEM_DESIGNMD,
      description: 'PHASE 2 OF 2 - Submit DESIGN.md extra axes (spacing, rounded, elevation, components). Phase 1 results (4 core axes) are provided in the user message. Components values MUST use {path} references that EXACTLY match ids/keys you emit here OR ids emitted in phase 1.',
      input_schema: {
        type: 'object',
        properties: {
          spacing: { type: 'object', description: 'Scale map { xs|sm|md|lg|xl: dimension }. 3-6 entries. e.g. { sm: "8px", md: "16px", lg: "24px" }.' },
          rounded: { type: 'object', description: 'Scale map { sm|md|lg: dimension }. 2-5 entries. e.g. { sm: "4px", md: "8px" }.' },
          elevation: { type: 'array', maxItems: 3, description: 'Optional shadow tokens. Each: { id, label, shadow (CSS box-shadow), level (0..3) }. Empty array allowed when refs lack depth signal.' },
          components: { type: 'object', description: '3-8 semantic UI components (button-primary, card, input, etc.). EACH value is an object whose property values are token-reference strings: "{colors.<phase1-id>}" / "{typography.<phase1-id>}" / "{rounded.<this-call-scale-key>}" / "{spacing.<this-call-scale-key>}" / "{elevation.<this-call-id>}". Literal hex / em / px values are FORBIDDEN. Each component MUST include decisionRationale: { whichReferences[], whyChosen }.' },
        },
        required: ['spacing', 'rounded', 'components'],
      },
    },
  ],

  qualityCriteria: [
    ...COMMON_QUALITY,
    { id: 'primary-unique', label: 'Primary unique', type: 'auto', description: 'color.role==="primary" count = 1' },
    { id: 'vd-template', label: 'MD template compliance', type: 'auto', description: 'All required sections 1-6 included' },
    { id: 'typo-hierarchy', label: 'Typography hierarchy', type: 'auto', description: 'h1 > h2 > body1 order' },
    { id: 'tool-both', label: 'Both tools called', type: 'auto', description: 'submit_tokens + submit_visual_direction once each' },
    { id: 'intent-fit', label: 'Intent reflection', type: 'manual', description: 'Tokens and MD match the intent' },
    { id: 'export-success', label: 'Export suitability', type: 'auto', description: 'Both ThemeExportDialog + MD download are intact' },
    { id: 'rationale-presence', label: 'Decision rationale present', type: 'auto', description: 'TP6: decisionRationale exists on every token (whichReferences + whyChosen required)' },
    { id: 'use-layers-respect', label: 'Respect user curation', type: 'auto', description: 'TP4: other layers of a ref where useLayers is set are not used in the output' },
    { id: 'mode-divergence', label: 'Divergence by mode', type: 'manual', description: 'TP2: even with the same refs+intent, results clearly differ by mode' },
    { id: 'token-ref-syntax', label: 'Component token-ref syntax', type: 'auto', description: 'Every value in components is {a.b} form and the path matches a real token id (DESIGN.md compatible)' },
    { id: 'components-min-3', label: 'At least 3 components', type: 'auto', description: 'tokens.components keys >= 3, including at least one button-primary-style CTA' },
    { id: 'spacing-rounded-scale', label: 'spacing/rounded scale intact', type: 'auto', description: 'spacing 3-6 entries / rounded 2-5 entries, all dimension strings (px|rem) or numbers, ascending recommended' },
  ],

  goldenExample: {
    inputDescription: 'project "Editorial Minimal", intent="black and white contrast magazine", 6 images',
    expectedOutput: {
      tokens: {
        color: [{ id: 'col-ink', label: 'Primary Ink', hex: '#14132B', role: 'primary', group: 'Brand', isEnabled: true, sourceReferenceIds: ['ref-001', 'ref-003'] }],
        // typography/layout/gradient omitted
      },
      visualDirection: {
        markdown: '# Editorial Minimal - Visual Direction\n\n## 1. Project Overview\n...',
        tags: { genre: ['Retro'], style: ['Magazine', 'Swiss'], subject: ['Typography-Hero'] },
      },
    },
  },

  workflow: [
    'Obtain the full data (tags + dominantColors + extracted) for the referenceIds selected in Step 2',
    'No image attachments - all a text payload',
    'Anthropic messages.create (Haiku 4.5, tools: [submit_tokens, submit_visual_direction])',
    'Extract both tool inputs from the response, retry if either is missing',
    'Automatic validation (primary unique, MD sections, enum)',
    'Render on ProjectDetailPage once validation passes',
  ],

  estCost: {
    model: 'Haiku 4.5',
    tokensIn: '~6k (N=4 refs extracted JSON + system + tool schemas)',
    tokensOut: '~1.5k (tokens + VD markdown)',
    note: 'No images -> Haiku is sufficient. Previously (Sonnet + images): ~$0.048 -> now ~$0.008 (6x savings)',
  },
};

/* =========================================================
 * T3 (concept only) - generate a single prompt for instant web-prompt validation
 *
 * Purpose: let a non-designer paste it directly into Claude Desktop / Gemini / ChatGPT web chat
 *      to instantly visualize "does this mood produce the design?"
 * Output: a 200-800 char English prompt string (no token IDs, JSON, or code blocks)
 * ========================================================= */
export const TASK_ANALYZE_CONCEPT = {
  id: 't3-concept',
  name: 'Concept prompt generation',
  purpose: 'References + intent -> an 800-char design prompt to paste directly into a web AI chat',
  stage: 'project.create.step4 (mode=concept)',
  model: 'claude-haiku-4-5',

  input: {
    kind: 'text',
    description: 'Intent + selectedRefs(extracted) + userNotes',
    shape: '{ intent, selectedRefs[], userNotes? }',
  },

  output: {
    description: 'A single prompt string (200-800 chars, English, focused on visual description)',
    shape: '{ prompt: string }',
  },

  systemPrompt: `You are MUSE's concept prompt writer.

GOAL: produce a single English prompt (200-800 chars) the user can paste directly
into Claude Desktop / Gemini / ChatGPT web chat to immediately visualize the design.

The output is NOT a design system spec. It is a vivid, dense prompt that an AI
image/UI generator can consume to render a concept screen.

=== INPUT ===
- intent: project intent sentence
- selectedRefs[]: pre-extracted T1 data (palette, typography, layout, gradient observations)
- userNotes (Step 3, HIGHEST PRIORITY): user's refined direction after seeing refs
- mode: always 'concept' for this task

=== OUTPUT prompt - content rules ===

The prompt MUST cover ALL FIVE bands in a natural flowing English paragraph (no bullets, no headers, no markdown):
  1. Overall mood/genre (1 sentence) - Editorial Dashboard / Brutalist Hero / etc
  2. Core colors (specify 3-5 HEX) - briefly note the Primary, Surface, Accent roles
  3. Typography (font-family + size hint) - at least 2 tiers of Display + Body
  4. Layout and structure (grid columns, spacing, container hint)
  5. Mood and texture (background, gradient, surface treatment)

If userNotes is present, you MUST weave its content naturally into the prompt (no verbatim quoting, reflect the meaning).

=== OUTPUT prompt - FORMAT rules (formatting bans) ===
- Natural English sentences. Descriptive "a ... that ..." phrasing.
- Concrete: state HEX codes, font names, and pixel/rem values directly.
- Under 200 chars is too thin, over 800 chars gets cut.
- Absolutely forbidden (format): token ids (col-ink, typo-h1, etc.), JSON, code blocks (\`\`\`), variable names, labels like "primary:", "h1:".
- Natural language only. The user copies it as-is and pastes into another AI.

=== AI SLOP - Visual Clichés to AVOID (visual bans) ===
Separate from the format bans, exclude the following from your descriptions so the result does not regress into "AI-made generic":

**Product-conditional bans** (block regression patterns based on the intent's product type):
- When the intent is "dashboard" / "metric" / "analytics" style: no magazine cover layout / editorial article spread / weather almanac / daily journal cover / news bulletin style descriptions. Even if the mood is "editorial", keep the essence a functional dashboard.
- When the intent is "landing" / "marketing": no plain blog post / app screen style descriptions.
- When the intent is "mobile" / "app": no desktop 1440px full-width layout descriptions.

**Avoid generic AI fonts** (stated in the Anthropic Cookbook):
- No descriptions using Inter / Roboto / Open Sans / Lato / SF Pro / Helvetica alone.
- Instead, recommend a distinctive choice: editorial (Playfair Display, Crimson Pro, Fraunces) / display (Clash Display, Bricolage, Newsreader) / technical (IBM Plex, Space Grotesk) / code (JetBrains Mono).

**Cliché backgrounds**:
- flat solid cream/white background without any texture/gradient (background = never a solid color only)
- purple-on-white gradients (overused AI default)
- generic glass morphism (uniform translucent cards)

**AI-generated look patterns**:
- uniform spacing everywhere (all spacing identical)
- generic Lucide/Heroicons style icons everywhere
- soft drop shadows everywhere (shadow overuse)
- monotonously repeating only an even 4-card metric grid (but preserve the dashboard's metric card itself as essential - only block the infinite even 4-card repetition)
- a left line border on containers / cards / sections (a left vertical accent line, blockquote-style left border) - a common AI cliché that drifts into a magazine/editorial tone
- italic use - no overuse of italics for emphasis or quotation (a regression signal toward magazine cover / editorial article spread; emphasize only with weight, size, and color)

These bans are "explicit avoidance" - direct signals that Claude / Gemini receive. Weaving them into the natural language once or twice as "avoiding ...", "unlike a simple ..." increases the effect.

=== EXAMPLE (for reference, never output as-is) ===

(a) Landing - magazine tone (each of 3 refs cited by attachFile):
"A magazine-tone landing page with strong black-and-white contrast, using the ink-deep #14132B from 01-ref-001.jpg as the base color. On a cream #FAF6E8 surface, the calm mustard #D4A857 accent from 02-ref-002.jpg is scattered as highlights. Display uses the Playfair Display serif from 03-ref-003.jpg, bold and left-aligned at 4rem, while the body is stable in Crimson Pro 1rem with 1.6 lineHeight. A 12-col modular grid with 24px gap, container max-width 1200px. A retro paper-grain texture is laid fixed over the background for a paper feel, and the Hero section draws the eye with oversized typography while a small meta-info column sits on the right. Unlike a plain blog-post-style monotonous card grid, an asymmetric hierarchy guides the eye."

(b) Dashboard - functional + retro accent (intent: "functional dashboard with retro mood"):
"A function-first metric dashboard accented with a 1970s editorial mood. Warm contrast from ink #1F1F1F text, cream #E8E5DC surface, and mustard #C8A574 accent. Display applies the Fraunces serif at 28px to large metric numbers, while the body uses IBM Plex Sans 13px on labels. A 12-col grid with 16px gap, max 1280px. A retro paper-grain texture is laid fixed over the background, but the dashboard's functional components like metric card / line chart / data table are kept intact. Rather than a magazine cover / weather almanac style, functional readability comes first, and only a fontWeight emphasis hierarchy is borrowed from editorial for the sticky header nav."

(c) Mobile - Y2K glitch mood:
"A mobile app with a Y2K glitch feel. A fluorescent #B8FF3D accent on a metallic #C0C7D1 surface, with deep purple #2B1A4E text. Display uses Bricolage Grotesque bold at 32px, the body Space Grotesk 14px. A 4-col mobile grid with 12px gap, viewport 390px. Faint chromatic aberration and a noise texture drift across the background, and cards are placed as if floating with a 1px sharp border. It distances itself from the generic AI mobile look of desktop full-width layouts / soft drop shadows / uniform spacing, building character through glitch detail."

(what the 3 examples share: covering all 5 bands + stating a negative "unlike ..." once or twice + weaving in ref sources 0-2 times briefly)

=== Per-Reference Notes (HIGHEST PRIORITY per ref when present) ===
A borrowing intent the user wrote per ref may appear at the end of the user message (e.g. "ref-002: borrow only the hero color").
Take only the part the note specifies from that ref and ignore the rest of the layers (set difference).
The note's intent must be woven naturally into the prompt (no verbatim quoting - reflect the meaning due to the 800-char limit).

=== Reference Anchoring (REQUIRED) ===
Name the source reference filename directly in the prompt. Each item in extractedPool has an
\`attachFile\` field (e.g. \`01-ref-001.jpg\`, \`02-ref-002.jpg\`) which is the exact filename inside the ZIP,
and it becomes the matching cue when the user attaches that file to an external AI chat.

Rules:
- Cite attachFile values directly *at least as many times as the number of refs* in the prompt (if there are 3 refs, at least 3 times).
  Inline them when describing each ref's most prominent borrowing point (among color / typography / layout / mood).
- Citation examples:
  - "using the ink-deep #14132B from 01-ref-001.jpg as the base color"
  - "the typography borrows the Playfair Display Serif from 02-ref-002.jpg"
  - "the retro paper-grain texture from 03-ref-003.jpg laid fixed"
- Do not use a bare ref-XXX id. Always state the attachFile filename together with it or on its own.
- Do not prepend the folder path (references/). Use the attachFile value as-is.

=== Global ===
Respond via submit_concept_prompt ONLY. No prose outside the tool. Single call.`,

  userMessageTemplate: `Intent: "{{intent}}"
Reference count: {{count}} (ids = [{{ids}}])

Pre-extracted reference data is provided above as JSON.
Compose ONE English prompt 200-800 chars covering all 5 bands.`,

  toolSchemas: [
    {
      name: TOOL_SUBMIT_CONCEPT_PROMPT,
      description: 'Submit a single English concept prompt (200-800 chars) for direct paste into web AI chats.',
      input_schema: {
        type: 'object',
        properties: {
          prompt: {
            type: 'string',
            minLength: 200,
            maxLength: 800,
            description: 'English design prompt. Covers all 5 bands, states 3+ HEX, natural-language sentences.',
          },
        },
        required: ['prompt'],
      },
    },
  ],

  qualityCriteria: [
    { id: 'length', label: 'Length 200-800 chars', type: 'auto', description: 'minLength/maxLength' },
    { id: 'hex-presence', label: '3+ HEX', type: 'auto', description: '/(#[0-9A-Fa-f]{6}.*){3,}/' },
    { id: 'no-markdown', label: 'No markdown', type: 'auto', description: 'no ##, **, ```, - bullets' },
    { id: 'no-token-ids', label: 'No token IDs', type: 'auto', description: 'no col-, typo-, primary:, etc.' },
    { id: 'paste-ready', label: 'Instant web-chat use', type: 'manual', description: 'Pasting into Gemini produces a visualization' },
  ],

  workflow: [
    'Branch on mode==="concept" at the start of Step 4',
    'Text payload of pre-extracted selectedRefs + intent + userNotes',
    'Anthropic messages.create (Haiku, tools: [submit_concept_prompt])',
    'Force a single tool_choice -> exactly one call',
    'Automatic validation (length / HEX / absence of markdown)',
    'Render the prompt box + copy button on ProjectDetailPage once validation passes',
  ],

  estCost: {
    model: 'Haiku 4.5',
    tokensIn: '~3k (refs extracted + system)',
    tokensOut: '~400 (800 chars)',
    note: 'The cheapest T3. No images + short output.',
  },
};


export const AI_TASKS = [TASK_AUTO_TAG, TASK_RECOMMEND, TASK_ANALYZE_TOKENS, TASK_ANALYZE_CONCEPT];

export const AI_TASKS_BY_ID = Object.fromEntries(AI_TASKS.map((t) => [t.id, t]));

export const AI_WORKFLOW_DIAGRAM = `flowchart LR
  Upload[Image upload] --> T1["T1 · Per-layer tagging<br/>(Haiku, 5 layers)"]
  T1 --> Archive[(Archive)]
  NewProj[Project creation Step 1] -->|intent+type| T2["T2 · Recommendation<br/>(Haiku, text)"]
  Archive --> T2
  T2 --> Step2[Step 2 reference selection]
  Step2 --> T3["T3 · Tokens + VD<br/>(Sonnet, 2 tools)"]
  T3 --> Detail[Project detail]
  Detail --> Export[tokens.js + visual-direction.md]
`;

/** Legacy-compat flat vocabulary removed - replaced by the preset helper's getLayerTags() */
