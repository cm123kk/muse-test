# MUSE. UX Flow

> **Document nature**: An early-project guide. The stage for first understanding "what data this project handles and how."
> **Data model usage**: The § Data Model Usage section of this document is the single source of truth. Columns, SQL, and constraints live in `appendix-db-schema.md` (produced by `/supabase-integration`).
> **Appendix**: For per-component detail, see [appendix-screen-component-map.md](./appendix-screen-component-map.md).

## User Scenarios

### Scenario 1. Ongoing reference archiving

- **User**: Designer / vibe-coding user
- **Goal**: Collect inspiration images and keep them auto-tagged.
- **Flow**: Enter Archive -> upload via drag-and-drop / URL -> AI auto-tags -> added to the grid.
- **Data involved**: `Reference` (W, upload)

### Scenario 2. Project creation (5-step wizard)

- **User**: Designer / PM / engineer
- **Goal**: Make design decisions by narrowing down through mode, intent, references, and usage notes. "I decided at each step."
- **Flow**: Enter ProjectCreate -> select mode -> enter intent -> curate references + layer chips -> write usage notes -> AI analysis.
- **Data involved**: `Project` (W, create), `ProjectReference` (W, chip toggle), `AnalysisResult` (W, analysis), `Reference` (R)

### Scenario 3. Token review + decision tracing

- **User**: Designer / engineer
- **Goal**: Verify the source and reasoning of AI-generated tokens and refine them to match intent.
- **Flow**: Enter ProjectDetail -> switch layer tabs -> expand token card (source + reasoning + notes + rejected candidates) -> edit on/off + emphasis.
- **Data involved**: `AnalysisResult` (R, editing is D), `Reference` (R)

### Scenario 4. Mode-based export

- **User**: Vibe-coding user / design system engineer
- **Goal**: Take tokens + decision log into external tools.
- **Flow**: ProjectDetail Export -> mode-based default deliverable auto-selected -> copy / download / ZIP bundle.
- **Data involved**: `AnalysisResult` (R), `Project` (R), `Reference` (R)

## Data Model

#### 📦 Reference `Reference`

> Inspiration images the user collected. Color, typography, and layout information are stored alongside via auto-tagging.

- **Visible on pages**: Archive, ProjectCreate, ProjectDetail
- **Created by**: User
- **Created at**: Archive
- **Fields**:

  | Field | Type | Description | Required |
  |---|---|---|---|
  | `source` | string (file / url) | Input source type | ✅ |
  | `thumbnailUrl` | image URL | Thumbnail URL or data URI | ✅ |
  | `title` | string | User-specified title | ⬜ |
  | `tags` | object (per-layer tag bundle) | Color / typography / layout / gradient / visual-direction tags. Filled by auto-tagging | ⬜ |
  | `dominantColors` | list (string HEX) | 1-5 dominant colors | ⬜ |
  | `extracted` | object (observation bundle) | Palette / typography / layout / gradient observations extracted by T1 auto-tagging | ⬜ |

  Automatic: id, created date

#### 📦 Project `Project`

> The unit that ties together intent, mode, and reference curation. The output of the 5-step wizard.

- **Visible on pages**: ProjectList, ProjectCreate, ProjectDetail
- **Created by**: User
- **Created at**: ProjectCreate
- **Fields**:

  | Field | Type | Description | Required |
  |---|---|---|---|
  | `name` | string | Project name | ✅ |
  | `mode` | string (concept / system) | Wizard mode (Step 0) | ✅ |
  | `intent` | string | One-line intent (Step 1) | ⬜ |
  | `referenceIds` | list (Reference refs) | Curated reference bundle | ⬜ |
  | `userNotes` | string | Step 3 usage notes (applied with priority in T3 synthesis) | ⬜ |
  | `referenceNotes` | object (refId -> text) | Free-form note per reference (≤100 chars) | ⬜ |

  Automatic: id, created date

#### 📦 Project-Reference mapping `ProjectReference`

> Indicates which layers (color, typography, layout, etc.) a project uses from a given reference.

- **Visible on pages**: ProjectCreate, ProjectDetail
- **Created by**: User
- **Created at**: ProjectCreate
- **Fields**:

  | Field | Type | Description | Required |
  |---|---|---|---|
  | `projectId` | ref (Project) | Owning project | ✅ |
  | `referenceId` | ref (Reference) | Curated reference | ✅ |
  | `useLayers` | list (string: color / typography / layout / gradient / visualDirection) | Layers to use from this reference. An empty list means automatic (T2 recommendation) | ⬜ |

  Automatic: id

#### 📦 Analysis Result `AnalysisResult`

> The bundle of design tokens the AI produced. Each token includes its source, reasoning, and rejected candidates.

- **Visible on pages**: ProjectDetail
- **Created by**: AI
- **Created at**: ProjectCreate
- **Fields**:

  | Field | Type | Description | Required |
  |---|---|---|---|
  | `projectId` | ref (Project) | Owning project | ✅ |
  | `status` | string (pending / running / done / error) | Analysis progress state | ✅ |
  | `layers` | object (5-layer token bundle) | Color / typography / layout / gradient / visual-direction tokens | ✅ |

  Common fields for each token (rows of `color` / `typography` / `layout` / `gradient`):

  | Field | Type | Description | Required |
  |---|---|---|---|
  | `label` | string | Token name | ✅ |
  | `isEnabled` | boolean | User on/off toggle | ✅ |
  | `emphasis` | number (0 / 1 / 2) | Emphasis slider | ✅ |
  | `sourceReferenceIds` | list (Reference refs) | Source references | ⬜ |
  | `decisionRationale` | object (source / reasoning / user notes / rejected candidates) | Decision-tracing info | ⬜ |

  Automatic: id, modified date (each token also gets an automatic id)

#### 📦 User Settings `UserSettings`

> Per-user AI model / storage / theme settings. One row per user.

- **Visible on pages**: Settings
- **Created by**: System
- **Created at**: Settings
- **Fields**:

  | Field | Type | Description | Required |
  |---|---|---|---|
  | `aiModel` | string | AI model name used for T1/T2/T3 calls | ✅ |
  | `storageMode` | string (local / cloud) | Data storage location | ✅ |
  | `themeMode` | string (light / dark / system) | Screen theme | ✅ |
  | `isAutoTagEnabled` | boolean | Whether auto-tagging runs on upload | ✅ |

  Automatic: id (= 1:1 with user)

#### 📦 User `User`

> A registered user. The owner of all data.

- **Visible on pages**: Auth, GNB
- **Created by**: User
- **Created at**: Auth
- **Fields**:

  | Field | Type | Description | Required |
  |---|---|---|---|
  | `email` | string | Login email | ✅ |
  | `displayName` | string | Display name shown in the GNB | ⬜ |
  | `avatarUrl` | image URL | Profile image | ⬜ |

  Automatic: id, signup date

## UX Flow

> A narrative that breaks the scenarios above into steps from a data perspective. For each step: page, user action, data produced, and result.

### Scenario 1 by step. Reference archiving

1. **Enter Archive** (Archive)
   - User action: browses the inspiration image grid
   - Data produced: `Reference` R (displays the existing grid)
   - Result: upload area (drag-and-drop / URL input) is shown

2. **Upload image** (Archive)
   - User action: drags and drops an image or pastes a URL
   - Data produced: `Reference` W (stores thumbnail / source URL)
   - Result: an empty card is added to the grid immediately; auto-tagging begins

3. **Auto-tagging** (Archive)
   - User action: (waiting) the card's tag badges / dominant colors fill in asynchronously
   - Data produced: `Reference` D (enriches tag / color / typography / layout info)
   - Result: card completed. Becomes discoverable in search / filter

### Scenario 2 by step. Project creation 5-step

1. **Mode selection (Step 0)** (ProjectCreate)
   - User action: selects one of the concept / system cards
   - Data produced: `Project` W (saves the mode field)
   - Result: branches the guidance / minLength of the next step

2. **Title + intent (Step 1)** (ProjectCreate)
   - User action: enters project name + one-line intent
   - Data produced: `Project` W (name + intent fields)
   - Result: AI begins intent-based reference recommendations

3. **References + layer chip (Step 2)** (ProjectCreate)
   - User action: picks from recommended references and toggles per-card layer chips (color / typography / layout)
   - Data produced: `Reference` R (selection), `ProjectReference` W (id + useLayers mapping)
   - Result: curation complete. Guidance for the next step is shown

4. **Usage notes (Step 3)** (ProjectCreate)
   - User action: after viewing references, spells out usage points in free text
   - Data produced: `Project` D (adds the userNotes field)
   - Result: [Start analysis] button becomes active

5. **AI analysis (Step 4)** (ProjectCreate)
   - User action: clicks Start analysis and watches the progress indicator
   - Data produced: `AnalysisResult` W (4-8 axis tokens + source + reasoning + rejected candidates)
   - Result: automatically moves to ProjectDetail

### Scenario 3 by step. Token review + decision tracing

1. **Enter ProjectDetail** (ProjectDetail)
   - User action: clicks a project card
   - Data produced: `Project` R, `AnalysisResult` R, `Reference` R (used-ref strip)
   - Result: layer tabs (color / typography / layout / gradient / visual direction) are shown

2. **Expand token card** (ProjectDetail)
   - User action: clicks the ❓ indicator on a token card
   - Data produced: `AnalysisResult` R (cites decisionRationale)
   - Result: shows source ref + intent match + user-note application + rejected candidates

3. **Edit on/off + emphasis** (ProjectDetail)
   - User action: toggles off unneeded tokens, raises emphasis on important ones
   - Data produced: `AnalysisResult` D (isEnabled / emphasis fields)
   - Result: real-time preview updates

### Scenario 4 by step. Export

1. **Click Export** (ProjectDetail)
   - User action: clicks the Export button in the top-right
   - Data produced: `Project` R (checks mode), `AnalysisResult` R (all tokens)
   - Result: mode-based default deliverable dialog

2. **Select mode-based deliverable** (ProjectDetail)
   - User action: confirms the default among concept = conceptPrompt + image ZIP / system = ZIP bundle (DESIGN.md + DTCG + decision-trace + refs)
   - Data produced: `Reference` R (bundles the ref images)
   - Result: copy / download / ZIP bundle complete

## Page List

| Page | Path | One-line description | Data involved |
|---|---|---|---|
| Auth | `/auth` | Sign up / log in | User |
| Archive | `/` | Reference grid + upload + search/filter | Reference |
| ProjectList | `/projects` | Project card list | Project |
| ProjectCreate | `/projects/new` | 5-step wizard (mode -> intent -> references -> usage notes -> analysis) | Project, ProjectReference, AnalysisResult, Reference |
| ProjectDetail | `/projects/:id` | Layer tabs + token editing + Export | AnalysisResult, Reference, Project |
| Settings | `/settings` | AI model / storage / theme | UserSettings |

## Data Model Usage

> This table is the sole input for `/supabase-integration`. When the data-name to table-name 1:1 mapping changes, always update this table first.

| Data name | Description | Code identifier | Expected table name | Page responsible for creation |
|---|---|---|---|---|
| `Reference` | Reference | `reference` | `reference_items` | Archive |
| `Project` | Project | `project` | `projects` | ProjectCreate |
| `ProjectReference` | Project-Reference mapping | `projectReference` | `project_references` | ProjectCreate |
| `AnalysisResult` | Analysis result | `analysisResult` | `analysis_results` | ProjectCreate |
| `UserSettings` | User settings | `userSettings` | `user_settings` | Settings |
| `User` | User | `user` | `auth.users` (Supabase built-in) | Auth |

## Component List

> Only new components are in the main text: those not present in the existing design system that must be built new. Reused / modified components are in the [appendix-screen-component-map.md](./appendix-screen-component-map.md) appendix.

| Component | Category | One-line purpose |
|---|---|---|
| `ProjectCreateWizard` | templates | 5-step wizard shell (Step 0-4) |
| `ReferencePicker` | templates | Recommendation + archive multi-select panel |
| `AnalysisProgress` | overlay-feedback | Analysis progress indicator (per-layer steps) |
| `ThemeExportDialog` | overlay-feedback | Mode-based export dialog |
| `TokenListItem` | data-display | Token row (on/off + emphasis slider) |
| `ColorSwatchList` | data-display | Color token swatch + HEX + toggle |
| `TypographyPreview` | data-display | Typography sample text + properties |
| `LayoutTokenPreview` | data-display | Grid / spacing diagram |
| `GradientPreview` | data-display | Gradient token swatch |
| `TokenDecisionTracePanel` | data-display | Expandable token source / reasoning / rejected candidates |
| `DesignMdPreview` | data-display | DESIGN.md alpha spec result screen |
| `LoginForm` | input | Email + password input |
| `SignUpForm` | input | Sign-up input |
| `AuthGuard` | layout | Login-guarded route |

## References

- [01-project-summary.md](./01-project-summary.md). Pain point -> feature mapping
- [appendix-screen-component-map.md](./appendix-screen-component-map.md). Screen <-> component detail (all reused / modified / new)
- [docs/research/04-ux-intervention-roadmap.md](../research/04-ux-intervention-roadmap.md). Input-point implementation spec
