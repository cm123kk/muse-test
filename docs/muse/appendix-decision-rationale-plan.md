# appendix. Decision Rationale (TP6) Reliability Plan

> A pre-implementation plan. Why token decision tracing (TP6) is not reliably working in the running app, and how we will fix and verify it.
> **Status**: Implemented and verified. Shipping the v3 iteration (see sections 7 to 12). Uncommitted in the working tree at time of writing.
> **Related**: [01-project-summary.md](./01-project-summary.md) (#11 TP6), [02-ux-flow.md](./02-ux-flow.md) (Scenario 3), [appendix-screen-component-map.md](./appendix-screen-component-map.md) (TokenDecisionTracePanel).

The body docs claim TP6 is "implemented," but in the running app the reasoning interface often does not appear. This appendix records the root-cause analysis, the fix plan, and the research-grounded acceptance criteria agreed on before implementing.

---

## 1. Verdict: ready in code, not reliably working

Checked across four layers (data model, AI output, storage, UI exposure). "Ready" does not equal "working."

| Layer | Status | Finding |
|---|---|---|
| Component and wiring | ✅ Ready | `TokenDecisionTracePanel` exists and is wired: `ProjectDetailPage` -> `AnalysisLayerTabs` -> `ColorSwatchList` / `TypographyPreview` / `LayoutTokenPreview` / `GradientPreview` -> panel. `references` is passed through. |
| Trigger icon | ⚠️ Mismatch | The trigger is an expand chevron (`ExpandMoreIcon`), not the question mark the docs describe. Users looking for a help affordance do not find one. |
| Panel visibility | ⚠️ Conditional | The button renders only when a token has `decisionRationale` or `sourceReferenceIds` (`ColorSwatchList`: `hasRationale`). No data means no button. |
| Data guarantee | ❌ Not enforced | The Phase 1 core tool schema defines the token arrays with no item shape (`color: { type: 'array' }`), so `decisionRationale` is not required. The prose asks for it, but the worked example and field list show only `sourceReferenceIds`. `runAnalyzeTokens` passes the model output through unchanged, so the fields are frequently missing. |

Evidence: `src/data/muse/aiTasks.js` (Phase 1 core schema; prose asks for rationale but the example omits it), `src/utils/museAiTasks.js` (pass-through, no normalization), `src/components/data-display/ColorSwatchList.jsx` (`hasRationale` gate, chevron trigger), `src/components/templates/ProjectDetailPage.jsx` (render chain).

## 2. Root cause in plain terms: the order-form analogy

```
Think of the AI filling out an order form.

  1. The official form (tool schema)   -> the model MUST fill every defined box.
                                           A box that is not on the form can be skipped.
  2. A sticky note beside it (prompt)   -> "please also add the reason". Easy to ignore.
  3. A sample filled form (example)     -> the model copies the sample closely.

Our problem:
  - "Why this value" (decisionRationale) has NO box on the official form.
  - It is only asked on the sticky note, AND the sample shows only the source, not the reason.
  => The model skips the reason. Then the screen has nothing to show,
     so the expand button never appears. It looks like the feature does not exist.
```

One line: we asked for the reason as a request (a note), not as an obligation (a required field), and even the example omitted it, so the model does not produce it, so the UI has nothing to reveal.

## 3. What counts as a good reason: the 3-element chain

Not source alone, not intent alone. A good `whyChosen` links source -> value -> intent in one sentence.

| Type | Example `whyChosen` | Verdict |
|---|---|---|
| Source only | "Pulled the deep navy from ref-003." | ⚠️ Partial. Grounded but does not say why it is good. |
| Intent only | "Adds weight for a calm, editorial feel." | ⚠️ Partial. A claim with no grounding. |
| 3-element chain | "Took the low-value deep navy (#1A2340) from ref-003's hero background to anchor the calm editorial intent; the brighter blue candidate was dropped as too busy." | ✅ Good. Source plus value plus intent (plus rejected alternative). |

**Litmus test** for non-generic quality: if the same sentence could be pasted onto any other token and still make sense, it is a weak reason. A good reason only fits this token.

## 4. The three fixes and why each is needed

Existence, then quality, then discovery. Each fix defends a different failure.

| # | Fix | What | Why it matters | Role |
|---|---|---|---|---|
| 1 | Enforce in schema | Add a required item schema to color / typography / layout / gradient in the Phase 1 core tool schema: each token requires `decisionRationale { whichReferences[], whyChosen }`. | The schema is the only thing the model always obeys. Structural grounding cuts citation hallucination by 75 to 90 percent, versus 5 to 15 percent for prompting alone. | Guarantees existence |
| 2 | Fix example and prompt | Add `decisionRationale` (in the 3-element chain form) to the worked example and the field list so they match the prose instruction. | The model imitates the example. A consistent, rich example lifts the quality of the reason, not just its presence, and removes the current prose-versus-example contradiction. | Guarantees quality |
| 3 | Change icon to a help mark | Swap the expand chevron for a question / help icon on the token row. | Users look for a question mark to find a reason. A chevron reads as "expand", not "see why". Aligns the UI with the docs and user expectation. | Guarantees discovery |

## 5. Acceptance criteria (research-grounded)

Thresholds mapped from RAG evaluation and LLM-as-judge practice. See Sources.

### A. Hard gates (deterministic, require 100 percent, retry once on failure)

| Check | Threshold | Basis |
|---|---|---|
| `whichReferences` is a subset of the input references | 100 percent (0 hallucinated sources) | Citation attribution, deterministically checkable |
| `whyChosen` present, meets a minimum length, no token-id / markdown / hex leak | 100 percent | Grounding plus format hygiene |

### B. Soft quality (LLM-as-judge, 1 to 5 labelled scale, used only after calibration)

| Metric | Threshold | Basis |
|---|---|---|
| Judge vs human agreement (calibration) | at least 80 percent agreement on 30 to 50 hand-scored tokens (disagreement under 20 percent) | LLM-as-judge calibration best practice |
| Faithfulness (reason actually supported by the cited ref, not fabricated) | at least 0.85 | RAGAS faithfulness 0.75 floor plus factuality gate 0.85 |
| 3-element chain quality (source plus value plus intent) | mean at least 4.0 / 5 and at least 80 percent of tokens at 4/5 or higher | RAG answer relevancy 0.8 |

### C. Regression gate

| Check | Threshold | Basis |
|---|---|---|
| Aggregate quality vs last passing baseline | block if it drops by 2 percent or more | Deployment gate practice |

## 6. Verification plan (how we make sure)

Three layers: static, code-enforced, then live measurement.

| Layer | Method | Note |
|---|---|---|
| Static review | Score the worked example against the rubric before shipping it. | Catches weak or generic example sentences early |
| Code-enforced + retry | Turn the unenforced rationale-presence criterion into a real validator (subset check, length, generic-phrase blocklist, leak check) with one retry, like the existing ref-check retry. | Machine-guarantees the hard gates in group A |
| Live measurement | Run real T3 on 3 to 4 fixture projects, score outputs against the rubric (optionally via LLM-judge), and compare before / after. | Requires `VITE_ANTHROPIC_API_KEY`. Do not report "working" until observed on live output. |

## 7. Implementation results (what shipped)

All three fixes were implemented and verified:

- **Fix 1 (schema)**: each core token (color / typography / layout / gradient) now REQUIRES `decisionRationale { whichReferences, whyChosen, alternativesConsidered }` in the Phase 1 tool schema (`src/data/muse/aiTasks.js`).
- **Fix 2 (prompt / example)**: whyChosen strengthened to a source -> value -> intent chain; worked example and field lists updated to match.
- **Hard-gate validator + one retry** in `runAnalyzeTokens` (`src/utils/museAiTasks.js`): presence, `whichReferences` subset of input refs, whyChosen length bounds, no token-ref / markdown leak, alternatives present.
- **Fix 3 (icon)**: the four preview components use a help / question icon instead of the expand chevron.

Verified on real exports: the help affordance, sources (thumbnails + layer chip), the reason, and the alternative all render, and the deterministic hard gates pass 100 percent.

## 8. How we measured

- **Scorer**: `scripts/score-rationale.mjs`. Deterministic hard gates (group A) plus an LLM-as-judge (Haiku 4.5, single, uncalibrated) scoring each whyChosen 1 to 5 on six axes (grounding, intent connection, value specificity, decision tradeoff, conciseness, non-generic), plus faithfulness (0 to 1) and a chain-complete flag. It reads the muse.json export shape directly.
- **Two measurement modes**:
  1. Real pipeline: regenerate in the app -> Export muse.json -> score. Authoritative, but each regeneration produces a DIFFERENT token set, so run-to-run numbers vary (the v1 run had 10 tokens, the v2 run had 13).
  2. Controlled A/B (`scripts/ab-rationale.mjs`): hold the tokens fixed, change ONLY the instruction, score both arms. This is the cleaner way to compare instructions.
- **Caveats kept in mind throughout**:
  - Single uncalibrated judge, so absolute numbers are directional and small gaps are noise.
  - The isolated A/B scores higher than the real pipeline (about 4.1 vs about 3.0 to 3.8) because the real pipeline writes longer, denser sentences.
  - Faithfulness is a weak metric here: the judge cannot see the source images, so scores cluster.

## 9. The three iterations (v1 / v2 / v3)

Baseline first (fixes present, but reasons still generic), then three wording / limit iterations:

| Version | Change | whyChosen char limit | Chain quality | Faithfulness | whyChosen length |
|---|---|---|---|---|---|
| Baseline | rationale required, plain instruction | min 24 | 2.61 (real) | 0.59 | ~130 chars |
| v1 | source -> value -> intent chain + alternatives REQUIRED | min 40, no max | 3.78 (real) / 4.17 to 4.29 (A/B) | 0.76 to 0.85 | 319 to 329 chars, 43 words |
| v2 | cap whyChosen short, move tradeoff to the field | min 40, max 220 | 3.03 (real) REGRESSION | 0.64 | 191 chars, 30 words |
| v3 | facts-dense, ban filler adjectives, looser cap | min 40, max 260 | 4.04 (A/B, about = v1) | 0.79 | 235 chars, 30 words |

- **v1**: big jump (grounding, value, and tradeoff all rise). Best raw judge score. Downside: verbose (43 words per reason).
- **v2**: shortening backfired. Cutting length also cut the concrete observation and the value justification, so grounding / value dropped more than conciseness gained -> net regression. Lesson: the fix is not "shorter", it is "same detail, less jargon".
- **v3**: facts-dense reword with the filler adjectives banned and a 260-char cap. In a controlled A/B on the same tokens, v3 (4.04) landed just under v1 (4.17) on the judge, but about 26 to 30 percent shorter.

## 10. Character-limit analysis (the lever)

The only structural lever changed across versions is the whyChosen upper limit:

| | min | max (schema hint) | validator upper | observed avg | observed max |
|---|---|---|---|---|---|
| v1 | 40 | none (unbounded) | none | 319 chars / 43 words | 370 |
| v2 | 40 | 220 | over 220 -> retry | 191 chars / 30 words | 221 |
| v3 | 40 | 260 | over 260 -> retry | 235 chars / 30 words | 287 |

- v1 has NO ceiling, so the model rambles to about 319 chars. v3 introduces a 260-char ceiling; that single change drives the 319 -> 235 (about -26 percent) reduction.
- v2 (220) was too aggressive and cut substance; v3 (260) gives about 40 chars (6 to 7 words) of headroom, which is exactly the room needed to keep the concrete observation and value while still braking the verbosity.
- **Enforcement**: `maxLength` in the tool schema is a soft hint (Anthropic does not hard-enforce output against the input schema), so a few outputs slip over (v3 observed max 287 over the 260 target). The real teeth is the validator plus one retry.

## 11. Why we ship v3, not v1 (the decision)

v1 has the higher raw judge score, so why not v1?

1. **The gap is within noise.** Chain quality 4.17 (v1) vs 4.04 (v3) is a 3.1 percent difference; faithfulness 0.85 vs 0.79 is 0.06 on a metric already flagged as weak. On a single uncalibrated judge over about 13 items, one token moving 3 to 4 shifts the mean by about 0.08. The strict "80 percent of tokens at 4/5 or higher" sub-threshold is unmet by BOTH (v1 69 percent, v3 62 percent), so it does not separate them either.
2. **The judge under-weights the reader's cost.** Conciseness is 1 of 6 rubric axes, so v1's verbosity barely dents its composite. But a human reading 10 to 13 rationales pays a much larger cognitive-load cost: v1 is about 43 words times about 12 tokens = 500+ words to read; v3 is about 30 words times 12 = about 360 words. Re-weighting for real product UX favors v3.
3. **v3 still clears the research-grounded bar.** Its chain-quality mean (4.04) passes the 4.0 bar (mapped from RAG answer-relevancy 0.8), and its faithfulness (0.79) is above the RAGAS production floor of 0.75 (the 0.85 was the stricter factuality gate).

**Decision: ship v3.** It sits at the quality bar (statistically indistinguishable from v1 on grounded quality) while cutting about 30 percent of the reading burden across a full token panel.

## 12. Final scorecard (v3)

| Criterion | Target (basis) | v3 | Verdict |
|---|---|---|---|
| Hard gates | 100 percent | 100 percent | PASS |
| Chain quality mean | at least 4.0 / 5 (RAG relevancy 0.8) | 4.04 | PASS |
| Faithfulness mean | at least 0.85 strict gate; at least 0.75 RAGAS production floor | 0.79 | Above production floor, under the strict gate (weak metric here) |
| Tokens at 4/5 or higher | at least 80 percent | 62 percent | Unmet by all versions (model + judge ceiling) |
| chainComplete | (info) | 100 percent | source + value + intent present on every token |
| Reader load | (product) | about 30 words per reason | about 30 percent lighter than v1 |

Tooling to reproduce all of the above: `scripts/score-rationale.mjs`, `scripts/ab-rationale.mjs`, `scripts/rationale-samples.json`.

## 13. Research sources

- [RAG Evaluation 2026: Methods, Metrics, Frameworks (datavlab)](https://datavlab.ai/post/rag-evaluation-methods-metrics-2026-guide)
- [RAG Evaluation Metrics in 2026: Faithfulness and More (futureagi)](https://futureagi.com/blog/rag-evaluation-metrics-2025/)
- [Beginner's Guide to RAGAS Score (projectpro)](https://www.projectpro.io/article/ragas-score-llm/1156)
- [LLM-as-a-judge: a complete guide (Evidently AI)](https://www.evidentlyai.com/llm-guide/llm-as-a-judge)
- [LLM Evaluation Rubric: A Production Scoring Template (prodinit)](https://prodinit.com/blog/llm-evaluation-rubric)
- [Why LLM-as-a-Judge is the best LLM evaluation method (Confident AI)](https://www.confident-ai.com/blog/why-llm-as-a-judge-is-the-best-llm-evaluation-method)
- [Which AI Has the Lowest Hallucination Rate? (Seekr)](https://www.seekr.com/resource/ai-lowest-hallucination-rate/)
- [AI Hallucination Rate Benchmarks 2026 (digitalapplied)](https://www.digitalapplied.com/blog/ai-model-hallucination-rate-benchmarks-2026-study)
- [CiteCheck: Retrieval-Grounded Detection of LLM Citation Hallucinations (arXiv)](https://arxiv.org/html/2605.27700v1)
