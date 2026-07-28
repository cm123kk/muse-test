/**
 * generate-rules.js
 *
 * Scans .claude/rules/ and .claude/skills/ to
 * auto-generate src/data/ruleRelationships.js.
 *
 * Usage: pnpm generate-rules
 */

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { writeFileSync } from 'node:fs';
import { join, basename, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
const RULES_DIR = join(ROOT, '.claude', 'rules');
const SKILLS_DIR = join(ROOT, '.claude', 'skills');
const OUT = join(ROOT, 'src', 'data', 'ruleRelationships.js');

/** Extract the priority keyword from the first heading */
function parsePriority(content) {
  const first = content.split('\n').find((l) => l.startsWith('#'));
  if (!first) return 'MUST';
  if (first.includes('CRITICAL')) return 'CRITICAL';
  if (first.includes('SHOULD')) return 'SHOULD';
  return 'MUST';
}

/** Convert a filename to a kebab-case id */
function toId(filename) {
  return basename(filename, '.md').toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

/** Extract the first sentence of the description from SKILL.md frontmatter */
function parseSkillDescription(content) {
  const match = content.match(/^---\n[\s\S]*?description:\s*(.+)\n[\s\S]*?---/);
  if (match) return match[1].trim();
  const line = content.split('\n').find((l) => l.startsWith('>'));
  return line ? line.replace(/^>\s*/, '') : '';
}

// ── Node collection ──

const nodes = [];
const edges = [];

// Root
nodes.push({
  id: 'claude-md',
  name: 'CLAUDE.md',
  priority: 'root',
  path: 'CLAUDE.md',
  description: 'Project rules entry point (acts as a router)',
});

// Rules
if (existsSync(RULES_DIR)) {
  for (const file of readdirSync(RULES_DIR).filter((f) => f.endsWith('.md')).sort()) {
    const content = readFileSync(join(RULES_DIR, file), 'utf-8');
    const id = toId(file);
    nodes.push({
      id,
      name: file,
      priority: parsePriority(content),
      path: `.claude/rules/${file}`,
      description: content.split('\n').find((l) => l && !l.startsWith('#'))?.trim() || '',
    });
    edges.push({ from: 'claude-md', to: id, type: 'loads' });
  }
}

// Skills + Resources
if (existsSync(SKILLS_DIR)) {
  for (const dir of readdirSync(SKILLS_DIR, { withFileTypes: true }).filter((d) => d.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
    const skillPath = join(SKILLS_DIR, dir.name, 'SKILL.md');
    if (!existsSync(skillPath)) continue;

    const skillContent = readFileSync(skillPath, 'utf-8');
    const skillId = dir.name;

    nodes.push({
      id: skillId,
      name: `${dir.name} (Skill)`,
      priority: 'Skill',
      path: `.claude/skills/${dir.name}/SKILL.md`,
      description: parseSkillDescription(skillContent),
    });
    edges.push({ from: 'claude-md', to: skillId, type: 'activates', note: '' });

    // Resources
    const resDir = join(SKILLS_DIR, dir.name, 'resources');
    if (existsSync(resDir)) {
      for (const resFile of readdirSync(resDir).filter((f) => f.endsWith('.md')).sort()) {
        const resId = `${skillId}--${toId(resFile)}`;
        const resContent = readFileSync(join(resDir, resFile), 'utf-8');
        nodes.push({
          id: resId,
          name: resFile,
          priority: 'Skill Resource',
          path: `.claude/skills/${dir.name}/resources/${resFile}`,
          description: resContent.split('\n').find((l) => l && !l.startsWith('#'))?.trim() || '',
        });
        edges.push({ from: skillId, to: resId, type: 'resources', note: '' });
      }
    }
  }
}

// ── conditionMatrix ──
// This is a semantic mapping, so it cannot be auto-generated. Defined statically by node id.
const ruleIds = nodes.filter((n) => ['CRITICAL', 'MUST', 'SHOULD'].includes(n.priority)).map((n) => n.id);
const skillIds = nodes.filter((n) => n.priority === 'Skill').map((n) => n.id);

const conditionMatrix = [
  {
    task: 'Create component',
    rules: ruleIds.filter((id) => ['design-system', 'code-convention'].includes(id)),
    skill: 'component-work',
    skillResources: ['component-work--taxonomy-index', 'component-work--storybook-writing'].filter((id) => nodes.some((n) => n.id === id)),
  },
  {
    task: 'Modify component',
    rules: ruleIds.filter((id) => ['design-system', 'code-convention'].includes(id)),
    skill: 'component-work',
    skillResources: ['component-work--storybook-writing'].filter((id) => nodes.some((n) => n.id === id)),
  },
  {
    task: 'Delete component',
    rules: [],
    skill: 'component-work',
  },
  {
    task: 'Interactive component',
    rules: ruleIds.filter((id) => ['design-system', 'code-convention'].includes(id)),
    skill: 'component-work',
    skillResources: ['component-work--taxonomy-index', 'component-work--interactive-principles', 'component-work--storybook-writing'].filter((id) => nodes.some((n) => n.id === id)),
  },
  {
    task: 'Write/modify story',
    rules: [],
    skill: 'component-work',
    skillResources: ['component-work--storybook-writing'].filter((id) => nodes.some((n) => n.id === id)),
  },
  {
    task: 'Convert external code',
    rules: ruleIds.filter((id) => ['design-system', 'code-convention'].includes(id)),
    skill: 'convert-external',
    skillResources: ['convert-external--conversion-checklist'].filter((id) => nodes.some((n) => n.id === id)),
  },
  {
    task: 'Refactoring',
    rules: ruleIds.filter((id) => ['code-convention'].includes(id)),
    skill: 'component-work',
    skillResources: ['component-work--refactoring-guide'].filter((id) => nodes.some((n) => n.id === id)),
  },
  {
    task: 'Modify theme/style',
    rules: ruleIds.filter((id) => ['design-system'].includes(id)),
    skillResources: ['component-work--mui-theme'].filter((id) => nodes.some((n) => n.id === id)),
  },
  {
    task: 'Grid usage',
    rules: ruleIds.filter((id) => ['mui-grid-usage'].includes(id)),
  },
];

// ── Output ──

const output = `/**
 * Project rule relationship data (auto-generated)
 *
 * This file is auto-generated by scripts/generate-rules.js.
 * Do not edit it directly. If a change is needed, edit the script.
 *
 * Generate: pnpm generate-rules
 * Generated on: ${new Date().toISOString().slice(0, 10)}
 */

export const priorityMeta = {
  root: { color: '#000000', label: 'Root', order: 0 },
  CRITICAL: { color: '#D32F2F', label: 'Absolutely must not be violated', order: 1 },
  MUST: { color: '#ED6C02', label: 'Must be followed', order: 2 },
  SHOULD: { color: '#0288D1', label: 'Follow for related work', order: 3 },
  Skill: { color: '#7B1FA2', label: 'Skill (intent-based activation)', order: 4 },
  'Skill Resource': { color: '#9E9E9E', label: 'Skill Resource (on-demand)', order: 5 },
};

export const ruleNodes = ${JSON.stringify(nodes, null, 2)};

export const edgeTypes = {
  loads: { label: 'Auto load', style: 'solid' },
  references: { label: 'Text reference', style: 'dashed' },
  conditional: { label: 'Conditional reference', style: 'dotted' },
  activates: { label: 'Intent-based activation', style: 'solid' },
  resources: { label: 'on-demand Read', style: 'dashed' },
};

export const ruleEdges = ${JSON.stringify(edges, null, 2)};

export const conditionMatrix = ${JSON.stringify(conditionMatrix, null, 2)};
`;

writeFileSync(OUT, output, 'utf-8');

const ruleCount = nodes.filter((n) => ['CRITICAL', 'MUST', 'SHOULD'].includes(n.priority)).length;
const skillCount = nodes.filter((n) => n.priority === 'Skill').length;
const resourceCount = nodes.filter((n) => n.priority === 'Skill Resource').length;

console.log(`Generated ${OUT}`);
console.log(`  Rules: ${ruleCount}, Skills: ${skillCount}, Resources: ${resourceCount}`);
console.log(`  Edges: ${edges.length}, Conditions: ${conditionMatrix.length}`);
