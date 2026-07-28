import { projects } from './projects.js';

/**
 * MUSE - per-project analysis result dummy data
 *
 * 2026-04-22 v2: keyVisual layer removed, visualDirection(Markdown) layer added.
 *
 * @type {Record<string, import('./schemas.js').AnalysisResult>}
 */

/** Shared typography preset */
const TYPO_PRESETS = {
  editorial: [
    {
      id: 'typo-display',
      label: 'Display Heading',
      variant: 'h1',
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 700,
      fontSize: 'clamp(48px, 6vw, 96px)',
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
      sampleText: 'Editorial',
      isEnabled: true,
      emphasis: 2,
    },
    {
      id: 'typo-section',
      label: 'Section Heading',
      variant: 'h2',
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 600,
      fontSize: 'clamp(32px, 4vw, 56px)',
      lineHeight: 1.15,
      letterSpacing: '-0.02em',
      isEnabled: true,
      emphasis: 1,
    },
    {
      id: 'typo-body',
      label: 'Body',
      variant: 'body1',
      fontFamily: '"Pretendard Variable", sans-serif',
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: 1.7,
      isEnabled: true,
      emphasis: 1,
    },
    {
      id: 'typo-caption',
      label: 'Caption',
      variant: 'caption',
      fontFamily: '"Pretendard Variable", sans-serif',
      fontWeight: 500,
      fontSize: '12px',
      lineHeight: 1.5,
      letterSpacing: '0.02em',
      isEnabled: false,
      emphasis: 0,
    },
  ],
};

/** A single layout preset shared by all project fixtures (consolidated after type was retired) */
const DEFAULT_LAYOUT_PRESET = [
  { id: 'lay-grid-12', label: '12 Column Grid', kind: 'grid', columns: 12, gap: 24, isEnabled: true, emphasis: 2 },
  { id: 'lay-section-gap', label: 'Section Gap', kind: 'spacing', px: 96, isEnabled: true, emphasis: 2 },
  { id: 'lay-card-pad', label: 'Card Padding', kind: 'spacing', px: 24, isEnabled: true, emphasis: 1 },
  { id: 'lay-hero', label: 'Hero Container', kind: 'container', ratio: 0.9, maxWidth: '1440px', isEnabled: true, emphasis: 1 },
];

const COLOR_PRESETS = {
  'proj-001': [
    {
      id: 'col-ink',
      label: 'Primary Ink',
      hex: '#14132B',
      role: 'primary',
      group: 'Brand',
      isEnabled: true,
      emphasis: 2,
      sourceReferenceIds: ['ref-001', 'ref-003'],
      decisionRationale: {
        whichReferences: ['ref-001', 'ref-003'],
        whichLayers: ['color'],
        whyChosen: 'Matches the "black and white contrast, magazine tone" intent. The darkest, least saturated value',
        alternativesConsidered: [
          { value: '#000000', reason: 'Pure black is too strong for a magazine tone' },
          { value: '#1F1B3D', reason: 'A ref-001 dominantColors candidate, but dropped for being slightly too saturated' },
        ],
      },
    },
    {
      id: 'col-accent',
      label: 'Accent Violet',
      hex: '#4F46E5',
      role: 'accent',
      group: 'Brand',
      isEnabled: true,
      emphasis: 1,
      sourceReferenceIds: ['ref-002'],
      decisionRationale: {
        whichReferences: ['ref-002'],
        whichLayers: ['color'],
        whyChosen: 'Extracted from ref-002 dominantColors[1]. Saturated enough for an accent role',
      },
    },
    { id: 'col-secondary', label: 'Secondary Neutral', hex: '#5A586E', role: 'secondary', group: 'Brand', isEnabled: true, emphasis: 1, sourceReferenceIds: ['ref-001'] },
    { id: 'col-bg', label: 'Background Tint', hex: '#FCFCFF', group: 'Surface', isEnabled: true, emphasis: 0 },
    { id: 'col-muted', label: 'Muted Grey', hex: '#7A798E', group: 'Neutral', isEnabled: false, emphasis: 0 },
  ],
  'proj-002': [
    { id: 'col-deep', label: 'Deep Navy', hex: '#0F172A', role: 'primary', group: 'Brand', isEnabled: true, emphasis: 2 },
    { id: 'col-signal', label: 'Signal Blue', hex: '#2563EB', role: 'accent', group: 'Data', isEnabled: true, emphasis: 2 },
    { id: 'col-ok', label: 'Success', hex: '#10B981', group: 'Data', isEnabled: true, emphasis: 1 },
    { id: 'col-warn', label: 'Warning', hex: '#F59E0B', group: 'Data', isEnabled: true, emphasis: 1 },
    { id: 'col-err', label: 'Error', hex: '#EF4444', group: 'Data', isEnabled: true, emphasis: 1 },
    { id: 'col-panel', label: 'Panel BG', hex: '#F8FAFC', group: 'Surface', isEnabled: true, emphasis: 0 },
  ],
  'proj-003': [
    { id: 'col-warm', label: 'Warm Beige', hex: '#E8DCC4', role: 'primary', group: 'Brand', isEnabled: true, emphasis: 2 },
    { id: 'col-terra', label: 'Terracotta', hex: '#C97D5D', role: 'accent', group: 'Brand', isEnabled: true, emphasis: 2 },
    { id: 'col-soft', label: 'Soft Cream', hex: '#FAF5EB', group: 'Surface', isEnabled: true, emphasis: 0 },
    { id: 'col-deep-brown', label: 'Deep Brown', hex: '#3E2C20', role: 'secondary', group: 'Brand', isEnabled: true, emphasis: 1 },
  ],
  'proj-004': [
    { id: 'col-vivid', label: 'Vivid Red', hex: '#E63946', role: 'primary', group: 'Brand', isEnabled: true, emphasis: 2 },
    { id: 'col-mustard', label: 'Mustard', hex: '#F4A261', role: 'accent', group: 'Brand', isEnabled: true, emphasis: 2 },
    { id: 'col-ink', label: 'Ink Black', hex: '#000000', role: 'secondary', group: 'Brand', isEnabled: true, emphasis: 1 },
    { id: 'col-off-white', label: 'Off White', hex: '#F1F1E8', group: 'Surface', isEnabled: true, emphasis: 0 },
  ],
};

const GRADIENT_PRESETS = {
  'proj-001': [
    { id: 'grad-indigo-dusk', label: 'Indigo Dusk', gradient: 'linear-gradient(180deg, #1E1B4B, #4F46E5)', isEnabled: true, emphasis: 2 },
    { id: 'grad-muted-sand', label: 'Muted Sand', gradient: 'linear-gradient(90deg, #E8E7F0, #D6D5E0)', isEnabled: false, emphasis: 0 },
  ],
  'proj-002': [
    { id: 'grad-data-sky', label: 'Data Sky', gradient: 'linear-gradient(135deg, #2563EB, #0EA5E9)', isEnabled: true, emphasis: 2 },
  ],
  'proj-003': [
    { id: 'grad-sunset', label: 'Sunset', gradient: 'linear-gradient(135deg, #F4A261, #E76F51)', isEnabled: true, emphasis: 2 },
    { id: 'grad-cream', label: 'Cream Wash', gradient: 'linear-gradient(180deg, #FAF5EB, #E8DCC4)', isEnabled: true, emphasis: 1 },
  ],
  'proj-004': [
    { id: 'grad-hot', label: 'Hot Mustard', gradient: 'radial-gradient(circle at 30% 30%, #F4A261, #E63946 70%)', isEnabled: true, emphasis: 2 },
  ],
};

/** Visual Direction MD - per-project samples filled in the visual_direction_template.md format */
const VISUAL_DIRECTION_MD = {
  'proj-001': {
    markdown: `# Editorial Minimal: Visual Direction

> The **context-based visual direction** among the outputs of MUSE reference analysis.
> See the separate \`tokens.json\` for token values.

---

## 1. Project Overview
- **Project name**: Editorial Minimal
- **Project type**: landing
- **One-line intent**: Black and white contrast, large typography, and generous whitespace in a magazine tone
- **References analyzed**: 6

## 2. Overall Direction
Built on the Magazine and Swiss editorial traditions, it places large serif headlines over a restrained achromatic palette to create a quiet, static tension.

## 3. Visual Direction Tags
- **Genre**: Retro
- **Style**: Magazine, Swiss
- **Visual subject**: Typography-Hero, Editorial-Collage

## 4. Tone & Mood
- Keep a cool neutral base of black and white, with only the faintest violet tint mixed in
- Uppercase headlines set in a serif display, body text in dense Pretendard
- Exaggerate the whitespace between sections while keeping the interior tight, for a rhythmic contrast
- Reinforce the printed feel with grayscale images and a grainy texture

## 5. Implementation Guidelines
- Minimal rounding on button and card corners (only clickables are pill-shaped)
- Shadows use flat offset blur only, colored with a near-black tint
- Fixed 12-column grid with a 24px gap
- Fluid typography for h1/h2 based on \`clamp()\`

## 6. Elements to Avoid
- No neon or vivid colors anywhere
- No 3D rendered illustrations
- No glassmorphism or neumorphism styling
`,
    tags: {
      genre: ['Retro'],
      style: ['Magazine', 'Swiss'],
      subject: ['Typography-Hero', 'Editorial-Collage'],
    },
  },
  'proj-002': {
    markdown: `# Fintech Dashboard: Visual Direction

## 1. Project Overview
- **Project name**: Fintech Dashboard
- **Project type**: dashboard
- **One-line intent**: A data-dense dashboard with a calm blue foundation

## 2. Overall Direction
Follow the Swiss tradition of information density, but keep only a single point of Signal Blue over a dark tone to focus on data highlights.

## 3. Visual Direction Tags
- **Genre**: (none)
- **Style**: Swiss, Glassmorphic
- **Visual subject**: UI-Mockup, Dense-Dashboard-Visual

## 4. Tone & Mood
- Slightly translucent glass panels over a Deep Navy base
- Signal Blue only on key metrics, secondary data kept low-saturation
- A narrow 16-column grid with a 16px gap between panels to maximize density
- Minimal glow and shadow, letting information density replace decoration
`,
    tags: {
      genre: [],
      style: ['Swiss', 'Glassmorphic'],
      subject: ['UI-Mockup'],
    },
  },
  'proj-003': {
    markdown: `# Lifestyle App: Visual Direction

## 1. Project Overview
- **Project name**: Lifestyle App
- **Project type**: mobile
- **One-line intent**: A warm-toned mobile app with an everyday texture

## 2. Overall Direction
Center on an Earth palette and Hand-Drawn illustration to convey the warm, everyday atmosphere of daily life.

## 3. Visual Direction Tags
- **Genre**: Retro
- **Style**: Claymorphic
- **Visual subject**: Hand-Drawn, Portrait-Photo

## 4. Tone & Mood
- Terracotta accents over a Warm Beige base
- Cards and buttons are soft-rounded with a Claymorphic feel and matte shadows
- Images use a Grainy-Visual filter for an analog feel
- Typography is Humanist Sans, with body line-height of 1.7 or more
`,
    tags: {
      genre: ['Retro'],
      style: ['Claymorphic'],
      subject: ['Hand-Drawn', 'Portrait-Photo'],
    },
  },
  'proj-004': {
    markdown: `# Studio Brand: Visual Direction

## 1. Project Overview
- **Project name**: Studio Brand
- **Project type**: brand
- **One-line intent**: Branding with bold color and a limited typography set

## 2. Overall Direction
The intersection of Neubrutalism and Risograph. Strong block colors and a rough print texture for a memorable impression.

## 3. Visual Direction Tags
- **Genre**: Risograph
- **Style**: Neubrutalism
- **Visual subject**: Typography-Hero, Abstract-Shape

## 4. Tone & Mood
- Primary-color surface splits of Vivid Red and Mustard
- Thick black outlines and flat offset shadows
- A single Display serif locks in the brand wordmark
- A rough paper noise laid over the entire background
`,
    tags: {
      genre: ['Risograph'],
      style: ['Neubrutalism'],
      subject: ['Typography-Hero', 'Abstract-Shape'],
    },
  },
};

export const analysisResultsByProjectId = projects.reduce((acc, project) => {
  acc[project.id] = {
    id: `analysis-${project.id}`,
    projectId: project.id,
    status: 'done',
    updatedAt: project.createdAt,
    layers: {
      color: COLOR_PRESETS[project.id] || [],
      typography: TYPO_PRESETS.editorial,
      layout: DEFAULT_LAYOUT_PRESET,
      gradient: GRADIENT_PRESETS[project.id] || [],
      visualDirection: VISUAL_DIRECTION_MD[project.id] || {
        markdown: '# Visual Direction\n\n(not yet generated)',
        tags: { genre: [], style: [], subject: [] },
      },
    },
  };
  return acc;
}, {});

export const getAnalysisResult = (projectId) => analysisResultsByProjectId[projectId];
