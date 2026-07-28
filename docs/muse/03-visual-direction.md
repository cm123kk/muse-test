# MUSE. Visual Direction

## Tone and Manner

- **Keywords**: minimal / spaciousness / fluid / image-first / rounded clickables
- **Description**:
  - Each screen shows only the minimum information the user needs right now.
  - A fluid layout that makes generous use of the entire viewport (prioritize fluid width over a fixed max-width).
  - A modern, low-density spatial composition with generous sizes, spacing, and padding.
  - **Image-first**: the UI recedes so that reference images and tokens take center stage, so Primary uses a black-based neutral.
  - Avoid pure white for the background, and keep the blue-violet tint **subtle** only, without distorting image colors.
  - Apply the largest border radius to clickable elements to emphasize a soft, "invites you to press" feel.

---

## Color Direction

### Design Principles

- **Image-first Primary = black family**: if the UI accent color stands out too much, it obscures reference images and tokens. Primary uses a black-based neutral, and interaction is conveyed through radius, spacing, and motion.
- **Keep the background tint subtle only**: avoid pure `#FFFFFF`, but stop the tint at around `#FCFCFF` so it does not interfere with color perception of the images.
- **Avoid pure black (`#000000`) as well**: Primary is black, but with a very slight violet tint at around `#14132B` (which reads as black on screen).

### Proposed Changes Against Current Tokens

| Purpose | Current Token | Current Value | Change Direction | Rationale |
|------|----------|--------|----------|------|
| Primary | `palette.primary.main` | `#0000FF` | `#14132B` (tinted near-black) | Image-first. A black-based neutral so the UI recedes |
| Primary Hover | (none) |. | `#2D2B5A` | One step brighter on hover |
| Secondary | `palette.secondary.main` | `#263238` | `#5A586E` (mid neutral tint) | Secondary actions, differing from Primary only in tone |
| Background Default | `palette.background.default` | `#FFFFFF` | `#FCFCFF` (very subtle blue tint) | Avoids pure white, no distortion of image colors |
| Background Paper | `palette.background.paper` | `#FFFFFF` | `#F8F8FC` | Cards/panels, a slightly deeper surface than the base background |
| Surface Elevated | (new) |. | `#F3F3F9` | Top-level surfaces such as Dialog/Popover |
| Text Primary | `palette.text.primary` | default | `#14132B` | Near-black on the same axis as Primary (the "ink" concept) |
| Text Secondary | `palette.text.secondary` | default grey | `#7A798E` | Secondary text, subtle tint |
| Divider | `palette.divider` | default grey | `rgba(20, 19, 43, 0.08)` | Uses near-black at low opacity |
| Grey 100 | `palette.grey[100]` | default grey | `#F3F3F9` | Redefines the entire grey scale with a subtle tint |
| Action Selected | (new) |. | `rgba(20, 19, 43, 0.06)` | Token-on and tag-selected states. Low contrast, so it does not interfere with images |
| Accent (optional) | (new) |. | `#4F46E5` | Use sparingly only where truly needed (for example, an "analyzing" indicator) |

### Recommended Palette (for reference)

```
Image-First Neutral Scale (subtle violet tint)
#FCFCFF  -> background.default
#F8F8FC  -> background.paper
#F3F3F9  -> surface.elevated / grey.100
#E8E7F0  -> grey.200 / subtle border
#7A798E  -> text.secondary
#5A586E  -> secondary.main
#2D2B5A  -> primary.hover
#14132B  -> primary.main / text.primary (ink)
#4F46E5  -> accent (sparingly)
```

---

## Typography Direction

### Design Principles

- Keep the existing Pretendard / Outfit combination (brand consistency).
- To match MUSE's minimal spaciousness, **increase contrast** (displays/headlines large and bold, body text light).
- Keep letter-spacing tight (-1% to -2%) and line-height generous (1.5 or more).

### Proposed Changes

| Element | Current Setting | Change Direction | Rationale |
|------|----------|----------|------|
| `fontFamily` | `Pretendard Variable` | keep | Retain the brand asset |
| `h1` | `Outfit 900` | `Outfit 700`, `clamp(48px, 6vw, 96px)`, letter-spacing `-2%` | Fluid sizing to emphasize spaciousness, weight lightened from 900 to 700 |
| `h2` |. | `Outfit 600`, `clamp(32px, 4vw, 56px)` | Section titles |
| `h3` |. | `Outfit 600`, `clamp(24px, 2.5vw, 32px)` | Layer tab titles |
| `subtitle1` |. | `Pretendard 500`, `18px`, line-height `1.5` | Emphasized body text such as project intent statements |
| `body1` | default | `Pretendard 400`, `16px`, line-height `1.7` | Generous line spacing |
| `body2` | default | `Pretendard 400`, `14px`, line-height `1.7` | Tags and token values |
| `caption` | default | `Pretendard 500`, `12px`, letter-spacing `2%` | Labels and meta information |
| `button` | default (uppercase) | textTransform `none`, weight `500` | Forcing uppercase is too much in a minimal tone |

---

## Spacing and Layout

### Design Principles

- **Fluid layout**: minimize fixed `maxWidth`, and even in `PageContainer` prefer variants that use the full screen.
- **Generous padding and spacing**: keep the base spacing unit (8px), but bump the default padding of sections/cards/buttons up one step.
- **Lower information density**: only the key action plus results on a single screen. Secondary information appears after hover, tab, or panel entry.

### Proposed Values

| Area | Current | Change Direction |
|------|------|----------|
| `spacing` base unit | `8px` | keep |
| Page horizontal padding | default | PC `clamp(24px, 4vw, 64px)`, Mobile `20px` |
| Spacing between sections |. | PC `96-120px`, Mobile `64px` |
| Card base padding | default | `24-32px` |
| Button padding (lg) | default | `16px 28px` |
| Gap between components (default) |. | `16px` (sm) / `24px` (md) / `40px` (lg) |
| Breakpoint strategy | MUI default | keep (`xs 0 / sm 600 / md 900 / lg 1200 / xl 1536`), prefer fluid padding over `maxWidth` |

### Layout Patterns

- Archive: fluid Masonry (column count auto-adjusts based on viewport width)
- Project detail: `SplitScreen` at a 40 left / 60 right ratio, both sides fluid internally
- Dialog/Export: capped max width (`720px`), but margins expand automatically based on viewport height

---

## Border Radius (key change)

### Design Principles

- Existing global `shape.borderRadius: 0` -> **apply the largest radius, but only to clickable UI**.
- Keep non-clickable surfaces (Paper, Section) at `0` or a very small value to preserve the grid feel of the space.
- Maximize affordance through the contrast "what can be pressed is round, what cannot is angular."

### Application by Token

| Target | Value | Rationale |
|------|-----|------|
| `shape.borderRadius` (global default) | `0` (keep) | Non-clickable surfaces stay angular |
| Button (all sizes) | `999px` (pill) | Interpreting "the largest radius" as a full pill |
| IconButton | `999px` | Circular |
| Chip, Tag | `999px` | Pill consistency |
| Switch | keep MUI default | Already a pill |
| Input (TextField, SearchBar) | `16px` | Clickable, but a large radius that does not harm inner text alignment |
| Select | `16px` | Same as Input |
| Card (all Cards) | `24px` | Unified regardless of clickable/non-clickable, keeping MUSE's soft spaciousness consistent |
| Dialog | `24px` | Softens even top-level surfaces |
| Paper / Section | `0` | keep |

---

## Elevation (secondary change)

- Keep the base shadow philosophy (low opacity plus large blur).
- Replace only the color from pure `rgba(0,0,0,...)` -> a violet tint, so it stays consistent with the overall tone.

```jsx
shadows: [
  'none',
  '0 0 8px rgba(20, 19, 43, 0.04)',
  '0 0 16px rgba(20, 19, 43, 0.06)',
  '0 8px 32px rgba(20, 19, 43, 0.08)',
  // ...
]
```

---

## References

> At this stage, focus first on layout/token design, and map reference images into the table below as they become available.

| # | Reference | Reference Point |
|---|---------|------------|
|. | (to be mapped later) | image-first, generous whitespace, large typography, pill buttons |

---

## Summary of Tokens That Need Changing

List of tokens to edit directly in `src/styles/theme.js`.

| Token Path | Current Value | New Value | Applies To |
|-----------|--------|--------|----------|
| `palette.primary.main` | `#0000FF` | `#14132B` | Primary buttons/links/emphasis (image-first neutral) |
| `palette.primary.light` | (none) | `#2D2B5A` | hover, light emphasis |
| `palette.secondary.main` | `#263238` | `#5A586E` | Secondary buttons/areas |
| `palette.background.default` | `#FFFFFF` | `#FCFCFF` | body background (subtle tint) |
| `palette.background.paper` | `#FFFFFF` | `#F8F8FC` | Card, Paper |
| `palette.text.primary` | default | `#14132B` | body text (same axis as Primary) |
| `palette.text.secondary` | default | `#7A798E` | secondary text |
| `palette.divider` | default | `rgba(20, 19, 43, 0.08)` | all dividers |
| `palette.grey[100~900]` | default grey | redefined as a subtle tint scale | everywhere grey is used |
| `palette.info.main` (accent) | default | `#4F46E5` | minimal emphasis such as the analyzing indicator |
| `typography.fontFamily` | `Pretendard Variable` | keep | global |
| `typography.h1` | `Outfit 900` | `Outfit 700`, `clamp(48px, 6vw, 96px)`, ls `-2%` | Hero, landing headline |
| `typography.h2` |. | `Outfit 600`, `clamp(32px, 4vw, 56px)` | section titles |
| `typography.body1` | default | `16px`, line-height `1.7` | body |
| `typography.button` | uppercase | `textTransform: 'none'`, weight 500 | all buttons |
| `shape.borderRadius` | `0` | `0` (keep) | global default |
| `components.MuiButton.styleOverrides.root.borderRadius` |. | `999px` | all Buttons |
| `components.MuiChip.styleOverrides.root.borderRadius` |. | `999px` | Chip, Tag |
| `components.MuiIconButton.styleOverrides.root.borderRadius` |. | `999px` | IconButton |
| `components.MuiOutlinedInput.styleOverrides.root.borderRadius` |. | `16px` | TextField, Input |
| `components.MuiDialog.styleOverrides.paper.borderRadius` |. | `24px` | all Dialogs |
| `shadows` | default (black) | replaced with a violet-tinted version | global |

---

## Key Design Points (summary)

- **Color (image-first)**: Primary is a black-based near-black `#14132B` to push the UI back, and the background carries only a **subtle tint** at around `#FCFCFF`. Minimizes interference with color perception of images.
- **Accent is minimal**: violet `#4F46E5` only where truly needed, such as "analyzing."
- **Typography**: keep Outfit/Pretendard, with h1 enlarged fluidly via `clamp(48, 6vw, 96)`.
- **Spacing**: keep the base spacing, but bump padding and section spacing up one step.
- **Radius**: keep global `0`, but apply the maximum radius only to **clickables (Button/Chip/IconButton = pill, Input = 16px, all Cards/Dialogs = 24px)** to strengthen affordance contrast.
- **References**: unmapped at this stage, with layout/token design taking priority.
