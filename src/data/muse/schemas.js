/**
 * MUSE Data Schemas (JSDoc Types)
 *
 * Definitions moved from the data model section of `docs/muse/02-ux-flow.md` into JSDoc typedefs.
 * No runtime objects; a reference file for IDE autocomplete/hover info.
 *
 * 2026-04-22 v2: keyVisual layer removed, visualDirection(Markdown) layer added.
 *   - Reference.tags: flat string[] -> per-layer nested structure
 *   - AnalysisLayers: replaced the 5th layer keyVisual (image) -> visualDirection (md)
 */

/**
 * @typedef {Object} ReferenceLayeredTags
 * @property {string[]} color         - 0-3 items from preset.layers.color
 * @property {string[]} typography    - 0-3 items from preset.layers.typography
 * @property {string[]} layout        - 0-3 items from preset.layers.layout
 * @property {string[]} gradient      - 0-3 items from preset.layers.gradient
 * @property {{genre: string[], style: string[], subject: string[]}} visualDirection - 0-2 items per subcategory
 */

/**
 * @typedef {Object} ExtractedPaletteItem
 * @property {string} hex - #RRGGBB
 * @property {string} label - 1-2 word descriptor
 * @property {'Brand'|'Surface'|'Data'|'Neutral'} [group] - a single-image perspective hint (not a role)
 */

/**
 * @typedef {Object} ExtractedTypographyItem
 * @property {'display'|'heading'|'body'|'caption'} hierarchy - relative hierarchy within a single image
 * @property {string} fontFamily - CSS stack
 * @property {number} fontWeight - 100-900
 * @property {string} fontSize - CSS value
 * @property {number} lineHeight - unitless
 * @property {string} [letterSpacing] - em value
 * @property {string} [sampleText] - an actual visible text snippet
 */

/**
 * @typedef {Object} ExtractedLayoutItem
 * @property {'grid'|'spacing'|'container'} kind
 * @property {number} [columns]
 * @property {number} [gap]
 * @property {number} [px]
 * @property {number} [ratio]
 * @property {string} [maxWidth]
 */

/**
 * @typedef {Object} ExtractedGradientItem
 * @property {string} gradient - CSS gradient string
 * @property {Array<{offset: number, color: string}>} stops
 */

/**
 * @typedef {Object} ExtractedValues
 * @property {ExtractedPaletteItem[]} palette - 3-6 observed colors
 * @property {ExtractedTypographyItem[]} typography - 1-4 typography specs per hierarchy
 * @property {ExtractedLayoutItem[]} layout - 0-3 layout hints
 * @property {ExtractedGradientItem[]} gradient - 0-2 gradients
 */

/**
 * @typedef {Object} Reference
 * @property {string} id - unique identifier (e.g. 'ref-001')
 * @property {'file'|'url'} source - input source type
 * @property {string} thumbnailUrl - thumbnail URL or data URI
 * @property {ReferenceLayeredTags} tags - per-layer tags (selected only from the preset vocabulary)
 * @property {string[]} [dominantColors] - representative color HEX (optional)
 * @property {ExtractedValues} [extracted] - T3-level observed values extracted by T1 (excluding role/emphasis)
 * @property {string} createdAt - ISO date string
 * @property {string} [title] - title (optional)
 */

/**
 * @typedef {'concept'|'system'} ProjectMode - TP2 project mode
 *   - 'concept'  : concept exploration (diversity first, T2 sorting and T3 synthesis tone lean distinctive)
 *   - 'system'   : building a design system (coherence first, strict roles, contrast validation, DESIGN.md ZIP export)
 */

/**
 * @typedef {'color'|'typography'|'layout'|'gradient'|'visualDirection'} TokenLayerKey
 */

/**
 * @typedef {Object} SelectedReferenceCuration - TP4 declaration of the layers the user takes per reference
 * @property {string} id - reference id
 * @property {TokenLayerKey[]} useLayers - layers to use from this reference. An empty array means automatic (T2 referenceLayer)
 */

/**
 * @typedef {Object} Project
 * @property {string} id
 * @property {string} name
 * @property {string} intent
 * @property {ProjectMode} [mode] - TP2 mode selection (default: 'system')
 * @property {SelectedReferenceCuration[]} [selectedRefs] - TP4 per-reference layer curation
 * @property {string} [userNotes] - Step 3 usage notes (explicit instructions after seeing references, applied first in T3 synthesis)
 * @property {Object<string, string>} [referenceNotes] - free-text notes per reference ({refId: <=100 chars}). Entered on ProjectDetailPage. Deterministically reflected in paste block generation. No T3 re-call
 * @property {string[]} referenceIds
 * @property {string} createdAt
 */

/**
 * @typedef {0|1|2} Emphasis
 */

/**
 * @typedef {Object} DecisionRationale - TP6 token decision tracing
 * @property {string[]} whichReferences - source reference ids (1 or more)
 * @property {TokenLayerKey[]} [whichLayers] - which layers it was taken from (reflects TP4 useLayers)
 * @property {string} whyChosen - reason it matches the user intent (one line)
 * @property {string} [appliedUserNotes] - the fragment of Step 3 userNotes that directly drove this token decision (10-30 chars)
 * @property {string} [appliedReferenceNote] - the fragment of the source ref's referenceNotes that influenced this token (10-40 chars)
 * @property {Array<{value: string, reason: string}>} [alternativesConsidered] - rejected candidates + reasons
 */

/**
 * @typedef {Object} ColorToken
 * @property {string} id
 * @property {string} label
 * @property {string} hex
 * @property {'primary'|'secondary'|'accent'|'neutral'} [role]
 * @property {string} [group]
 * @property {boolean} isEnabled
 * @property {Emphasis} emphasis
 * @property {string[]} [sourceReferenceIds]
 * @property {DecisionRationale} [decisionRationale] - TP6 decision tracing
 */

/**
 * @typedef {Object} TypographyToken
 * @property {string} id
 * @property {string} label
 * @property {string} [variant]
 * @property {string} fontFamily
 * @property {number} fontWeight
 * @property {string} fontSize
 * @property {number} [lineHeight]
 * @property {string} [letterSpacing]
 * @property {string} [sampleText]
 * @property {boolean} isEnabled
 * @property {Emphasis} emphasis
 * @property {DecisionRationale} [decisionRationale] - TP6 decision tracing
 */

/**
 * @typedef {Object} LayoutToken
 * @property {string} id
 * @property {string} label
 * @property {'grid'|'spacing'|'container'} kind
 * @property {number} [columns]
 * @property {number} [gap]
 * @property {number} [px]
 * @property {number} [ratio]
 * @property {string} [maxWidth]
 * @property {boolean} isEnabled
 * @property {Emphasis} emphasis
 * @property {DecisionRationale} [decisionRationale] - TP6 decision tracing
 */

/**
 * @typedef {Object} GradientToken
 * @property {string} id
 * @property {string} label
 * @property {string} gradient
 * @property {Array<{offset:number,color:string}>} [stops]
 * @property {boolean} isEnabled
 * @property {Emphasis} emphasis
 * @property {DecisionRationale} [decisionRationale] - TP6 decision tracing
 */

/**
 * @typedef {Object} VisualDirectionLayer
 * @property {string} markdown - an MD string filled in the visual_direction_template.md format
 * @property {{genre: string[], style: string[], subject: string[]}} [tags] - aggregated preset tags
 */

/**
 * @typedef {Object} AnalysisLayers
 * @property {ColorToken[]} color
 * @property {TypographyToken[]} typography
 * @property {LayoutToken[]} layout
 * @property {GradientToken[]} gradient
 * @property {VisualDirectionLayer} visualDirection - Markdown narrative + tag aggregation
 */

/**
 * @typedef {Object} AnalysisResult
 * @property {string} id
 * @property {string} projectId
 * @property {AnalysisLayers} layers
 * @property {'pending'|'running'|'done'|'error'} status
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} UserSettings
 * @property {string} aiModel
 * @property {'local'|'cloud'} storageMode
 * @property {'light'|'dark'|'system'} themeMode
 * @property {boolean} isAutoTagEnabled
 */

export {};
