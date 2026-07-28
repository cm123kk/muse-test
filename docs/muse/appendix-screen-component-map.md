# appendix. Screen ↔ Component Map

> An appendix split out from the body of [02-ux-flow.md](./02-ux-flow.md). Detailed component mapping by screen group.

---

## A. App Skeleton (Global Layout, Navigation)

| Component | Purpose | Type | Existing Path / Notes |
|----------|------|------|-----------------|
| `AppShell` | Global layout (GNB + main area) | Reuse | `components/layout/AppShell.jsx` |
| `GNB` | Global navigation bar | Reuse | `components/navigation/GNB.jsx` |
| `PageContainer` | Responsive page container | Reuse | `components/layout/PageContainer.jsx` |
| `SectionContainer` | Section-level container | Reuse | `components/container/SectionContainer.jsx` |

## B. Archive (Reference Collection, Exploration)

| Component | Purpose | Type | Existing Path / Notes |
|----------|------|------|-----------------|
| `FileDropzone` | Drag and drop / URL upload | Reuse | `components/input/FileDropzone.jsx` |
| `Masonry` (MUI) | Infinite grid base | Modify | Connect the infinite scroll hook |
| `ImageCard` | Reference thumbnail + tag badge + selection checkbox | Modify | Extends `components/card/ImageCard.jsx` |
| `SearchBar` | Archive search | Reuse | `components/input/SearchBar.jsx` |
| `FilterBar` | Tag/color-tone filter | Reuse | `components/templates/FilterBar.jsx` |
| `TagInput` | Per-reference tag editing | Reuse | `components/input/TagInput.jsx` |

## C. Project (List, 5-step Wizard)

| Component | Purpose | Type | Existing Path / Notes |
|----------|------|------|-----------------|
| `MoodboardCard` | Project list card (2x2 thumbnails) | Reuse | `components/card/MoodboardCard.jsx` |
| `CardContainer` | Base card container | Reuse | `components/card/CardContainer.jsx` |
| `TextField` / `Select` / `Button` | Form inputs | Reuse | MUI |
| `ProjectCreateWizard` | 5-step wizard (Step 0-4) | New | Category: `templates` |
| `ReferencePicker` | Recommendation + archive multi-select panel | New | Category: `templates` |
| `ModeSelectCard` | Step 0 mode card (concept / system) | Reuse | `components/card/ModeSelectCard.jsx` |
| `IntentGuideField` | Step 1 intent input | Reuse | `components/input/IntentGuideField.jsx` |
| `ReferenceLayerChipRow` | Step 2 per-card layer chip | Reuse | `components/card/ReferenceLayerChipRow.jsx` |
| `RefinementNotesField` | Step 3 usage notes | Reuse | `components/input/RefinementNotesField.jsx` |

## D. Analysis Feedback (Progress State, Warnings)

| Component | Purpose | Type | Existing Path / Notes |
|----------|------|------|-----------------|
| `Dialog` (MUI) | Warning/confirmation modal | Reuse | MUI |
| `AnalysisProgress` | Analysis progress (per-layer indicator) | New | Category: `overlay-feedback` |

## E. ProjectDetail (Token Editing Shell)

| Component | Purpose | Type | Existing Path / Notes |
|----------|------|------|-----------------|
| `CategoryTab` | Layer tab (color / typography / layout / gradient / VD) | Reuse | `components/in-page-navigation/CategoryTab.jsx` |
| `SplitScreen` | Left/right split of token editing panel and preview | Reuse | `components/layout/SplitScreen.jsx` |
| `Switch` | Token on/off toggle | Reuse | MUI |
| `TokenListItem` | Common token row for layers (on/off + emphasis slider) | New | Category: `data-display` |

## F. Per-Layer Preview (Token Visualization)

| Component | Purpose | Type | Existing Path / Notes |
|----------|------|------|-----------------|
| `ColorSwatchList` | Color token swatch + HEX + toggle | New | Category: `data-display` |
| `TypographyPreview` | Typography sample text + properties | New | Category: `data-display` |
| `LayoutTokenPreview` | Grid/spacing diagram | New | Category: `data-display` |
| `GradientPreview` | Gradient token swatch | New | Category: `data-display` |
| `TokenDecisionTracePanel` | TP6 expansion (source + reason + appliedUserNotes + rejected candidates) | New | Category: `data-display` |
| `DesignMdPreview` | DESIGN.md alpha spec result screen | New | Category: `data-display` |

## G. Export

| Component | Purpose | Type | Existing Path / Notes |
|----------|------|------|-----------------|
| `ThemeExportDialog` | Universal JSON / ZIP bundle / standalone JSON download | New | Category: `overlay-feedback` |

## H. Auth (Sign-up, Login)

| Component | Purpose | Type | Existing Path / Notes |
|----------|------|------|-----------------|
| `AuthHero` | Sign-up/login entry screen | Reuse | `components/templates/AuthHero.jsx` |
| `LoginForm` | Email + password input | New | Category: `input` (delegated to component-work) |
| `SignUpForm` | Sign-up input | New | Category: `input` (delegated to component-work) |
| `AuthGuard` | Login guard route | New | Category: `layout` (delegated to component-work) |

---

## Totals by Group (Reuse / Modify / New)

| Group | Reuse | Modify | New |
|------|-------|------|------|
| A. App Skeleton | 4 | 0 | 0 |
| B. Archive | 4 | 2 | 0 |
| C. Project | 7 | 0 | 2 |
| D. Analysis Feedback | 1 | 0 | 1 |
| E. ProjectDetail | 3 | 0 | 1 |
| F. Layer Preview | 0 | 0 | 6 |
| G. Export | 0 | 0 | 1 |
| H. Auth | 1 | 0 | 3 |
| **Total** | **20** | **2** | **14** |

> The count in the body (02-ux-flow.md § Component List) of reuse 17 / modify 2 / new 10 is an older version that omits the H group (Auth) and part of ProjectDetail. This appendix is the current truth.
