/**
 * score-rationale.mjs
 *
 * Scores TP6 decisionRationale quality against the acceptance criteria in
 * docs/muse/appendix-decision-rationale-plan.md.
 *
 * Two layers:
 *   A. Hard gates (deterministic, must be 100%): rationale present, whichReferences
 *      non-empty and a subset of inputReferences, whyChosen length >= 24, no
 *      token-ref {a.b} / markdown leak.
 *   B. Soft quality (LLM-as-judge, 1-5 rubric): grounding, intent connection, value
 *      specificity, decision/tradeoff, conciseness, non-generic; plus faithfulness
 *      (0-1) and a source->value->intent chain-complete flag.
 *
 * Usage:
 *   node scripts/score-rationale.mjs [path-to-tokens.json] [--no-judge] [--model=claude-haiku-4-5]
 *
 * Requires .env.local with VITE_ANTHROPIC_API_KEY (unless --no-judge).
 *
 * NOTE: The judge cannot see the source reference images, so "faithfulness" here means
 * plausibility / internal consistency of the claim given the cited source names and the
 * concrete value, NOT pixel-level verification. This is a documented limitation.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const NO_JUDGE = args.includes('--no-judge');
const MODEL = (args.find((a) => a.startsWith('--model=')) || '--model=claude-haiku-4-5').split('=')[1];
const INTENT_OVERRIDE = (args.find((a) => a.startsWith('--intent=')) || '').split('=').slice(1).join('=') || null;
const REFS_OVERRIDE = (args.find((a) => a.startsWith('--refs=')) || '').split('=')[1];
const INPUT = args.find((a) => !a.startsWith('--')) || path.join(ROOT, 'scripts/rationale-samples.json');

const LAYERS = ['color', 'typography', 'layout', 'gradient'];
const tokenValue = (layer, t) => {
  if (layer === 'color') return t.hex || '';
  if (layer === 'gradient') return t.gradient || '';
  if (layer === 'typography') return [t.fontFamily, t.fontSize].filter(Boolean).join(' / ');
  if (layer === 'layout') return [t.kind, t.maxWidth, t.columns && `${t.columns}col`].filter(Boolean).join(' ');
  return '';
};

/**
 * Accept three input shapes:
 *   1. samples: { tokens: [{ layer, decisionRationale, ... }], inputReferences, intent }
 *   2. muse.json (app Export): { meta, color: { tokens: [] }, typography: { tokens: [] }, ... }
 *   3. analysis_results.layers (Supabase): { color: [...], typography: [...], ... }
 */
function normalize(data) {
  let intent = INTENT_OVERRIDE || data.intent || data.meta?.project?.intent || '(unspecified)';
  let inputRefs = REFS_OVERRIDE ? REFS_OVERRIDE.split(',').map((s) => s.trim()) : (data.inputReferences || []);
  let tokens;
  if (Array.isArray(data.tokens)) {
    tokens = data.tokens; // shape 1
  } else if (data.color && Array.isArray(data.color.tokens)) {
    tokens = LAYERS.flatMap((layer) => (data[layer]?.tokens || []).map((t) => ({ layer, id: t.id, label: t.label, value: tokenValue(layer, t), decisionRationale: t.decisionRationale }))); // shape 2
  } else if (Array.isArray(data.color)) {
    tokens = LAYERS.flatMap((layer) => (data[layer] || []).map((t) => ({ layer, id: t.id, label: t.label, value: tokenValue(layer, t), decisionRationale: t.decisionRationale }))); // shape 3
  } else {
    throw new Error('Unrecognized input shape. Expected samples / muse.json / analysis_results.layers.');
  }
  return { intent, inputRefSet: new Set(inputRefs), tokens };
}

/* ----- thresholds (from the plan) ----- */
const T = {
  faithfulness: 0.85,      // mean >= 0.85
  chainMean: 4.0,          // mean composite (1-5) >= 4.0
  chainPassRatio: 0.8,     // >= 80% of tokens score composite >= 4.0
};

/* ----- deterministic hard gates ----- */
const TOKEN_REF_RE = /\{[a-z]+\.[^}]+\}/i;
const MARKDOWN_RE = /(\*\*|`|#{1,6}\s|\]\()/;

function hardGate(token, inputRefSet) {
  const dr = token?.decisionRationale;
  const issues = [];
  if (!dr || typeof dr !== 'object') return { pass: false, issues: ['missing decisionRationale'] };
  const refs = Array.isArray(dr.whichReferences) ? dr.whichReferences : [];
  if (refs.length === 0) issues.push('whichReferences empty');
  else if (inputRefSet.size > 0) {
    const bad = refs.filter((r) => !inputRefSet.has(r));
    if (bad.length) issues.push(`refs not in input: ${bad.join(', ')}`);
  }
  const why = typeof dr.whyChosen === 'string' ? dr.whyChosen.trim() : '';
  if (why.length < 24) issues.push('whyChosen missing/too short');
  else if (TOKEN_REF_RE.test(why) || MARKDOWN_RE.test(why)) issues.push('whyChosen has token-ref/markdown');
  return { pass: issues.length === 0, issues };
}

/* ----- env / judge ----- */
function loadApiKey() {
  const text = fs.readFileSync(path.join(ROOT, '.env.local'), 'utf-8');
  const key = text.match(/^VITE_ANTHROPIC_API_KEY=(.+)$/m)?.[1]?.trim();
  if (!key) throw new Error('VITE_ANTHROPIC_API_KEY not found in .env.local');
  return key;
}

const JUDGE_SYSTEM = `You are a STRICT evaluator of design-token decision rationales.
Each rationale is a single "whyChosen" sentence that should justify why a design token
(color/typography/layout/gradient) was chosen for a project.

A GOOD rationale is a 3-element chain: it names the SOURCE (which reference/observation),
the concrete VALUE chosen, and ties it to the user INTENT. It is specific to THIS token
(not a generic sentence that could be pasted onto any token).

Score each axis 1-5 (5 = best). Be critical: reserve 5 for genuinely excellent.
- grounding: names a specific source/reference and what was observed there
- intentConnection: connects the choice to the stated project intent
- valueSpecificity: explains the actual value chosen (this hue/weight/scale), not generic praise
- decisionTradeoff: reads as a decision (ideally with an alternative), not just description
- concise: one clear plain sentence, no jargon dump
- nonGeneric: could NOT be pasted onto a different token and still fit

Also return:
- faithfulness (0.0-1.0): is the claim plausibly supported by the cited source and the value,
  with no fabrication or internal contradiction. (You cannot see the source image; judge plausibility.)
- chainComplete (boolean): does it contain all three of source + value + intent.
Return ONLY via the submit_score tool.`;

const JUDGE_TOOL = {
  name: 'submit_score',
  description: 'Submit the rubric scores for one rationale.',
  input_schema: {
    type: 'object',
    properties: {
      grounding: { type: 'integer', minimum: 1, maximum: 5 },
      intentConnection: { type: 'integer', minimum: 1, maximum: 5 },
      valueSpecificity: { type: 'integer', minimum: 1, maximum: 5 },
      decisionTradeoff: { type: 'integer', minimum: 1, maximum: 5 },
      concise: { type: 'integer', minimum: 1, maximum: 5 },
      nonGeneric: { type: 'integer', minimum: 1, maximum: 5 },
      faithfulness: { type: 'number', minimum: 0, maximum: 1 },
      chainComplete: { type: 'boolean' },
      notes: { type: 'string', maxLength: 240 },
    },
    required: ['grounding', 'intentConnection', 'valueSpecificity', 'decisionTradeoff', 'concise', 'nonGeneric', 'faithfulness', 'chainComplete', 'notes'],
  },
};

async function judge(apiKey, { intent, token }) {
  const dr = token.decisionRationale;
  const userText = `Project intent: ${intent}
Token: [${token.layer}] ${token.label} = ${token.value}
Cited sources (whichReferences): ${(dr.whichReferences || []).join(', ') || '(none)'}
alternativesConsidered: ${dr.alternativesConsidered ? JSON.stringify(dr.alternativesConsidered) : '(none)'}

whyChosen: "${dr.whyChosen}"

Score this rationale.`;
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 512,
      system: JUDGE_SYSTEM,
      tools: [JUDGE_TOOL],
      tool_choice: { type: 'tool', name: JUDGE_TOOL.name },
      messages: [{ role: 'user', content: userText }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const json = await res.json();
  const tool = (json.content || []).find((b) => b.type === 'tool_use');
  if (!tool?.input) throw new Error('No tool_use in judge response');
  return tool.input;
}

const AXES = ['grounding', 'intentConnection', 'valueSpecificity', 'decisionTradeoff', 'concise', 'nonGeneric'];
const composite = (s) => AXES.reduce((a, k) => a + s[k], 0) / AXES.length;
const fmt = (n) => Number(n).toFixed(2);

async function main() {
  const data = JSON.parse(fs.readFileSync(INPUT, 'utf-8'));
  const { intent, inputRefSet, tokens } = normalize(data);

  console.log(`\n=== TP6 decisionRationale scoring ===`);
  console.log(`input: ${path.relative(ROOT, INPUT)}  |  tokens: ${tokens.length}  |  judge: ${NO_JUDGE ? 'skipped' : MODEL}\n`);

  // A. Hard gates
  const gates = tokens.map((t) => ({ t, g: hardGate(t, inputRefSet) }));
  const gatePass = gates.filter((x) => x.g.pass).length;
  console.log(`--- A. Hard gates (deterministic, target 100%) ---`);
  gates.forEach(({ t, g }) => {
    console.log(`  ${g.pass ? 'PASS' : 'FAIL'}  [${t.layer}] ${t.label}${g.pass ? '' : '  -> ' + g.issues.join('; ')}`);
  });
  console.log(`  hard-gate pass rate: ${gatePass}/${tokens.length} (${fmt((gatePass / tokens.length) * 100)}%)\n`);

  if (NO_JUDGE) {
    console.log('(judge skipped: --no-judge)\n');
    return;
  }

  // B. LLM-judge
  const apiKey = loadApiKey();
  console.log(`--- B. Soft quality (LLM-judge ${MODEL}, 1-5 rubric) ---`);
  const scored = [];
  for (const t of tokens) {
    try {
      const s = await judge(apiKey, { intent, token: t });
      const comp = composite(s);
      scored.push({ t, s, comp });
      console.log(
        `  [${t.layer}] ${t.label}: composite ${fmt(comp)}/5  faith ${fmt(s.faithfulness)}  chain:${s.chainComplete ? 'yes' : 'NO'}`
        + `  (g${s.grounding} i${s.intentConnection} v${s.valueSpecificity} d${s.decisionTradeoff} c${s.concise} ng${s.nonGeneric})`
      );
      if (s.notes) console.log(`         note: ${s.notes}`);
    } catch (e) {
      console.log(`  [${t.layer}] ${t.label}: JUDGE ERROR ${e.message}`);
    }
  }

  if (!scored.length) { console.log('\nno judge scores produced.\n'); return; }
  const meanComp = scored.reduce((a, x) => a + x.comp, 0) / scored.length;
  const meanFaith = scored.reduce((a, x) => a + x.s.faithfulness, 0) / scored.length;
  const passRatio = scored.filter((x) => x.comp >= T.chainMean).length / scored.length;
  const chainCompleteRatio = scored.filter((x) => x.s.chainComplete).length / scored.length;

  console.log(`\n--- Verdict vs acceptance criteria ---`);
  const line = (label, val, ok) => console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${label}: ${val}`);
  line(`Hard gates == 100%`, `${fmt((gatePass / tokens.length) * 100)}%`, gatePass === tokens.length);
  line(`Faithfulness mean >= ${T.faithfulness}`, fmt(meanFaith), meanFaith >= T.faithfulness);
  line(`Chain quality mean >= ${T.chainMean}/5`, `${fmt(meanComp)}/5`, meanComp >= T.chainMean);
  line(`Tokens with composite >= ${T.chainMean} is >= ${T.chainPassRatio * 100}%`, `${fmt(passRatio * 100)}%`, passRatio >= T.chainPassRatio);
  console.log(`  (info) chainComplete (source+value+intent): ${fmt(chainCompleteRatio * 100)}%`);
  console.log('');
}

main().catch((e) => { console.error(e); process.exit(1); });
