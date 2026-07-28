# MUSE

> A design system builder that lets you trace the source and reasoning behind every design decision the AI makes.
> A structure where user intent is embedded in the UX itself, keeping decision authority with the user.
>
> **2026-04-29**: Mode 3 (`handoff` / code direct) has been discontinued. Since it had no meaningful difference from system mode, system mode has absorbed the export role that handoff previously served (DESIGN.md + DTCG + decision-trace + refs ZIP). The active modes are `concept` and `system` (2 total).

## Background and Purpose

### Market Pain Points (validated by qualitative research. `docs/research/02-painpoints-qualitative-analysis.md`)

Four super-themes were validated across 52 sources:

- **T1. "No idea why it did that"**. DESIGN.md, Stitch, and Claude Design all deliver only results, never the reasoning behind decisions.
  - Eunsoo Kim, IBM Research: *"DESIGN.md records that 'the button is terracotta,' but it doesn't capture why terracotta was chosen. A structure that has the outcome but is missing the reasoning."* (ZDNet Korea, 2026-04-26)
- **T2. "The monotony of single input"**. Picking just 1 out of 60+ brands, or a single image input. "Everything looks... the same" (Bitovi)
- **T3. "Loss of control"**. Users cannot control usage, editing, or integration. 80% of tokens consumed in 30 minutes (PCWorld via multiple Korean outlets)
- **T4. "AI cannot replace craft"**. *"The future of designers is designing the principles and systems that let AI produce better output"* (Toss Design Team)

### MUSE's Approach

- **Embed user intent at every input point in the UX**: "Why do you like it?" when uploading a reference / "Which mode?" when starting a project / "Which layer to pull in" per recommendation card. No large new screens; small questions inserted at 6 input points.
- **Automatically surface source, reasoning, and alternatives for every decision**: the `decisionRationale` per token in T3 output shows the source reference, the intent-match reasoning, and the rejected candidates on each token card.
- **Mode-based branching**: concept / system. T2 recommendation ordering, T3 synthesis tone, and the export default all branch by mode (the previous `handoff` / code-direct mode was discontinued on 2026-04-29, with system mode absorbing export).

### Expected Impact

- Produces both tokens and a decision log that can be dropped straight into Cursor, Claude Code, Lovable, and similar tools.
- Users perceive the result as "what I decided" rather than "what the AI made," raising loyalty and preserving craft.
- Integrates the reference archiving and per-project curation experience.

## Core Features

> Directly mapped to pain points (see T1-T4 super-themes). Priority is based on the task order in [04-ux-intervention-roadmap](../research/04-ux-intervention-roadmap.md).

| # | Feature | Description | Pain Point Hit | Priority |
|---|------|------|---------|---------|
| 1 | Reference archiving | Save images via drag-and-drop / link, infinite grid view | . | Required (implemented) |
| 2 | Reference auto-tagging (T1) | Extract 5-layer tags + dominantColors + extracted tokens on upload | . | Required (implemented) |
| ~~3~~ | ~~Reference intent chip (TP1)~~ | **Discontinued (2026-04-28)**. Validation showed no effect | . | Discontinued |
| 4 | **Project mode selection** (TP2 / Wizard Step 0) | 2 cards (concept/system). Basis for all downstream branching. ~~handoff~~ was discontinued on 2026-04-29 | T2/T3 | Implemented |
| 5 | **Title + one-line intent** (TP3 / Wizard Step 1) | IntentGuideField. placeholder + helperText guidance (the guide box was moved to Step 3) | T2 keyword matching | Implemented |
| 6 | Reference auto-recommendation (T2 / Wizard Step 2) | Intent- and mode-based Top-N recommendations + referenceLayer per ref | . | Implemented |
| 7 | **Reference layer chip** (TP4 / Wizard Step 2) | Layer chip toggle per recommendation card (auto/manual) | T3 useLayers strict | Implemented |
| 8 | **Usage notes** (Step 3 NEW / Wizard Step 3) | RefinementNotesField. Explicit instructions after viewing references. Differentiated minLength by mode (concept=0/system=30). HIGHEST PRIORITY input for T3 | T3 synthesis | **Required new** implemented |
| ~~9~~ | ~~Pre-analysis confirmation box (TP5)~~ | **Discontinued (2026-04-28)**. Absorbed by the [Start analysis ->] button at the bottom of Step 3 | . | Discontinued |
| 10 | Automatic token analysis (T3 / Wizard Step 4) | selected ref + intent + mode + useLayers + **userNotes** -> 4-layer tokens + visualDirection.md + decisionRationale (per token) | . | Implemented |
| 11 | **Token decision tracing** (TP6) | Expand the ❓ on each 4-layer (color/typo/layout/gradient) token card -> source + intent match + ✋ appliedUserNotes citation + rejected candidates | T1 decision tracing | Implemented |
| 12 | Token export (MUI theme + ZIP) | MUI createTheme JSON + images + visual-direction.md | . | Implemented |
| 13 | **Simultaneous DTCG / DESIGN.md / decision-trace.md output** | W3C DTCG + Google Labs alpha spec compatible + decision log. Output as a ZIP bundle in system mode (DESIGN.md + DTCG + decision-trace.md + refs/) | T3 deliverable | Implemented (integrated into system mode 2026-04-29) |

## Target Users (4 personas. Mapped in `02-painpoints-qualitative-analysis.md` §6)

- **P1. Non-designer PM/founder**: "I want to build a prototype without a designer." Enters TP2 "concept" mode.
- **P2. Senior designer**: "AI can't replace my craft, but I still need acceleration." Intentional curation via TP4 layer chips.
- **P3. Design system engineer**: "30% is lost when bringing tokens into code." TP2 "system" mode + DTCG / DESIGN.md / decision-trace ZIP export.
- **P4. AI coding tool power user**: "Even when I hand over DESIGN.md, the AI ignores it." Builds trust with schema-strict tool output + decision log citations.

## Technical Scope

- **Included**
  - Web-based interface (minimal UI)
  - Image upload / link saving, infinite grid
  - AI-based token analysis (color/typography/layout/gradient/key visual)
  - Per-layer token editing UI
  - Export in MUI theme format
- **Excluded**
  - Actual code generation (only up to token export; component code is handled by external vibe-coding tools)
  - Collaboration/sharing features (out of initial scope)
  - Mobile native apps
  - Theme formats other than MUI (Tailwind, Chakra, etc. considered later)
- **Constraints**
  - AI analysis depends on external model APIs, so cost and latency must be considered.
  - Typography analysis is estimation-based from images (exact font-name matching is best-effort).
  - Needs an image storage capacity strategy (initially can start within local/browser storage scope).

## Success Criteria (verifiable metrics)

Existing quantitative:
- Create one project -> token export within 3 minutes.
- Apply the exported MUI theme directly to a project and feel the visual consistency.

UX intentionality metrics (`04-ux-intervention-roadmap.md` §7):

| Metric | Before (hypothesis) | After (target) |
|------|-----------|----------|
| Average intent input length | <20 chars | >40 chars (TP3 seed/example effect) |
| Step 2 manual layer change rate | 0% | >30% (TP4 user decision behavior) |
| Token card hover/click rate | not measured | >60% (TP6 users checking rationale) |
| T3 result export rate | not measured | +10pp (higher satisfaction) |
| 30-day return rate | not measured | up (higher loyalty) |

Voluntary reach by persona:
- P1 PM enters "concept" mode -> reaches a satisfying result within 5 minutes.
- P2 designer toggles TP4 layer chips -> perceives "I decided this."
- P3 engineer exports DTCG -> imports into external build pipeline with no edits.
- P4 AI coding power user drops decision-trace.md straight into Cursor -> decisions are not ignored.

---

## Reference Documents

- [docs/research/01-design-md-painpoints-raw.md](../research/01-design-md-painpoints-raw.md). Raw market pain-point citations (52 items)
- [docs/research/02-painpoints-qualitative-analysis.md](../research/02-painpoints-qualitative-analysis.md). Qualitative analysis (4 super-themes, 18 clusters)
- [docs/research/04-ux-intervention-roadmap.md](../research/04-ux-intervention-roadmap.md). TP1-TP6 + system prompt updates (implementation spec)
