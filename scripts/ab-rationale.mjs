/**
 * ab-rationale.mjs
 *
 * Controlled A/B of the whyChosen INSTRUCTION change (Fix #2 quality iteration).
 * Holds tokens + cited references fixed; regenerates each token's decisionRationale
 * once with the OLD guidance and once with the NEW guidance, using the same model.
 * Writes two files in the score-rationale samples shape so they can be scored identically:
 *   /tmp/rationale-old.json  (old instruction)
 *   /tmp/rationale-new.json  (new instruction)
 *
 * IMPORTANT (honesty): this isolates the INSTRUCTION effect only. The judge and this
 * harness cannot see the source images, so the DELTA between arms is meaningful but the
 * absolute grounding/faithfulness is not the full pipeline. For the authoritative number,
 * regenerate the analysis in-app and score the exported muse.json.
 *
 * Usage: node scripts/ab-rationale.mjs "/path/to/muse-export.json" [--model=claude-haiku-4-5]
 * Requires .env.local with VITE_ANTHROPIC_API_KEY.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const MODEL = (args.find((a) => a.startsWith('--model=')) || '--model=claude-haiku-4-5').split('=')[1];
const INPUT = args.find((a) => !a.startsWith('--'));
if (!INPUT) { console.error('usage: node scripts/ab-rationale.mjs <muse-export.json>'); process.exit(1); }

// Arm "old" = v1 guidance (control); arm "new" = v3 guidance (facts-dense, jargon-banned, ~25-40 words).
const OLD_GUIDE = [
  'whyChosen: ONE specific sentence with THREE parts:',
  '(1) the CONCRETE thing observed in a cited ref (name it, e.g. "the near-black masthead in ref-003", not "the reference");',
  '(2) the exact value chosen and why THIS value beats a plausible alternative;',
  '(3) how it serves the project intent.',
  'BANNED unless anchored to a concrete detail: vague praise (elegant / sophisticated / clean / modern / balanced / timeless).',
  'The sentence must fail the PASTE TEST.',
  'alternativesConsidered: REQUIRED - the single strongest rejected candidate + the concrete reason it lost.',
].join(' ');
const NEW_GUIDE = [
  'whyChosen: ONE sentence (~25-40 words) DENSE WITH CONCRETE FACTS, not adjectives, with THREE parts:',
  '(1) the SPECIFIC thing observed in a named ref WITH its value (e.g. "the #14132B ink in the ref-003 masthead", not "the reference");',
  '(2) the EXACT value you chose (name the hex / font / px);',
  '(3) how it serves the project intent.',
  'Spend every word on a fact. Do NOT put the alternative in whyChosen.',
  'BANNED unless immediately backed by a concrete detail: vague filler adjectives (elegant / sophisticated / clean / modern / balanced / timeless / dynamism / systemic / editorial warmth / breathing).',
  'The sentence must fail the PASTE TEST.',
  'alternativesConsidered: REQUIRED - the single strongest rejected candidate + the concrete reason it lost.',
].join(' ');

const LAYERS = ['color', 'typography', 'layout', 'gradient'];
const tokenValue = (layer, t) => {
  if (layer === 'color') return t.hex || '';
  if (layer === 'gradient') return t.gradient || '';
  if (layer === 'typography') return [t.fontFamily, t.fontSize].filter(Boolean).join(' / ');
  if (layer === 'layout') return [t.kind, t.maxWidth, t.columns && `${t.columns}col`].filter(Boolean).join(' ');
  return '';
};

function loadApiKey() {
  const text = fs.readFileSync(path.join(ROOT, '.env.local'), 'utf-8');
  const key = text.match(/^VITE_ANTHROPIC_API_KEY=(.+)$/m)?.[1]?.trim();
  if (!key) throw new Error('VITE_ANTHROPIC_API_KEY not found in .env.local');
  return key;
}

const TOOL = {
  name: 'submit_rationale',
  description: 'Submit the decisionRationale for one design token.',
  input_schema: {
    type: 'object',
    properties: {
      whichReferences: { type: 'array', items: { type: 'string' }, minItems: 1 },
      whichLayers: { type: 'array', items: { type: 'string' } },
      whyChosen: { type: 'string', minLength: 24 },
      alternativesConsidered: {
        type: 'array',
        items: { type: 'object', properties: { value: { type: 'string' }, reason: { type: 'string' } }, required: ['value', 'reason'] },
      },
    },
    required: ['whichReferences', 'whyChosen'],
  },
};

async function gen(apiKey, { intent, token, refs, guide }) {
  const sys = `You write decisionRationale for design tokens. Follow the guidance EXACTLY. Ground claims only in what the token value and the cited references plausibly support; do not fabricate specifics you cannot justify. Respond ONLY via submit_rationale.\n\nGUIDANCE:\n${guide}`;
  const user = `Project intent: ${intent}
Token: [${token.layer}] ${token.label} = ${token.value}
Cited references (use these ids in whichReferences): ${refs.map((r) => `${r.id}${r.title ? ` (${r.title})` : ''}`).join('; ')}
Write the decisionRationale for this token.`;
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({
      model: MODEL, max_tokens: 400, system: sys, tools: [TOOL],
      tool_choice: { type: 'tool', name: TOOL.name },
      messages: [{ role: 'user', content: user }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const json = await res.json();
  const tool = (json.content || []).find((b) => b.type === 'tool_use');
  if (!tool?.input) throw new Error('no tool_use');
  return tool.input;
}

async function main() {
  const data = JSON.parse(fs.readFileSync(INPUT, 'utf-8'));
  const intent = data.meta?.project?.intent || data.intent || '(unspecified)';
  const refList = data.references || [];
  const refTitle = (id) => {
    const r = refList.find((x) => x.id === id || x.reference_id === id);
    return r?.title || r?.name || r?.label || '';
  };
  const tokens = LAYERS.flatMap((layer) => (data[layer]?.tokens || []).map((t) => ({
    layer, id: t.id, label: t.label, value: tokenValue(layer, t),
    whichReferences: t.decisionRationale?.whichReferences || [],
  })));
  const apiKey = loadApiKey();

  console.log(`A/B on ${tokens.length} tokens (model ${MODEL})\n`);
  const oldOut = { intent, inputReferences: [], tokens: [] };
  const newOut = { intent, inputReferences: [], tokens: [] };
  const refIds = new Set();

  for (const tk of tokens) {
    const refs = (tk.whichReferences.length ? tk.whichReferences : refList.map((r) => r.id || r.reference_id)).map((id) => ({ id, title: refTitle(id) }));
    refs.forEach((r) => refIds.add(r.id));
    for (const [arm, guide, out] of [['old', OLD_GUIDE, oldOut], ['new', NEW_GUIDE, newOut]]) {
      try {
        const dr = await gen(apiKey, { intent, token: tk, refs, guide });
        out.tokens.push({ layer: tk.layer, id: tk.id, label: tk.label, value: tk.value, decisionRationale: dr });
        process.stdout.write(`  ${arm}:${tk.label} ok  `);
      } catch (e) {
        process.stdout.write(`  ${arm}:${tk.label} ERR(${e.message})  `);
      }
    }
    process.stdout.write('\n');
  }
  oldOut.inputReferences = [...refIds];
  newOut.inputReferences = [...refIds];
  fs.writeFileSync('/tmp/rationale-old.json', JSON.stringify(oldOut, null, 2));
  fs.writeFileSync('/tmp/rationale-new.json', JSON.stringify(newOut, null, 2));
  console.log('\nwrote /tmp/rationale-old.json and /tmp/rationale-new.json');
  console.log('score each with: node scripts/score-rationale.mjs /tmp/rationale-old.json');
}

main().catch((e) => { console.error(e); process.exit(1); });
