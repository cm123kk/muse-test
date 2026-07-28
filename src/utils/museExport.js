/**
 * MUSE Export - Universal JSON + ZIP bundle generation
 *
 * The output schema is not MUI-specific, but "consumable by any framework".
 * Designed so external AI coding tools (Cursor/Claude Code, etc.) can take it directly as context.
 *
 * ZIP structure:
 *   muse-export-{slug}.zip
 *   |-- muse.json                 <- universal tokens + metadata + vd tags
 *   |-- visual-direction.md       <- standalone MD (identical to muse.json.visualDirection.markdown)
 *   |-- README.md                 <- usage guide for AI tools
 *   \`-- references/
 *       |-- ref-XXX.jpg
 *       \`-- ...
 */

import JSZip from 'jszip';
import {
  buildDtcgTokens,
  buildDesignMd,
  buildDecisionTraceMd,
  buildAiPasteBlock,
  buildAttachmentTable,
  inferImageExt,
} from './tokenConverters';

const MUSE_EXPORT_VERSION = '1.0';

/* ============================================
 * Helpers
 * ============================================ */

const slugify = (name) =>
  (name || 'muse')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-') || 'muse';

const inferExt = (url, mime) => {
  if (typeof url === 'string' && url.startsWith('data:')) {
    const m = url.match(/^data:image\/([^;]+)/);
    if (m) return `.${m[1] === 'jpeg' ? 'jpg' : m[1]}`;
  }
  if (mime) {
    if (mime.includes('jpeg') || mime.includes('jpg')) return '.jpg';
    if (mime.includes('png')) return '.png';
    if (mime.includes('webp')) return '.webp';
    if (mime.includes('gif')) return '.gif';
    if (mime.includes('svg')) return '.svg';
  }
  const last = (typeof url === 'string' ? url : '').split('/').pop()?.split('?')[0] || '';
  const em = last.match(/\.([a-zA-Z0-9]+)$/);
  if (em) {
    const ext = em[1].toLowerCase();
    return ext === 'jpeg' ? '.jpg' : `.${ext}`;
  }
  return '.jpg';
};

/** Pick only enabled tokens and convert to export form (excludes internal _flag) */
const pickEnabledTokens = (list) =>
  (list || [])
    .filter((t) => t.isEnabled !== false)
    .map((t) => {
      const { isEnabled: _e, _removed, _pending, _tagError, ...rest } = t;
      return rest;
    });

/* ============================================
 * Universal JSON builder
 * ============================================ */

/**
 * Convert project + analysis + referenced references -> a universal JSON schema.
 *
 * Characteristics:
 *  - Not tied to MUI, Tailwind, or any framework
 *  - Specifies values as-is: color.hex, typography.fontSize (CSS value), layout.kind, etc.
 *  - visualDirection.markdown contains the narrative direction
 *  - references includes only file paths (image binaries are separate ZIP entries)
 */
export function buildUniversalJson({ project, analysis, references }) {
  const projectRefs = (references || []).filter((r) =>
    (project.referenceIds || []).includes(r.id),
  );

  const refFileMap = {};
  projectRefs.forEach((r, i) => {
    const prefix = String(i + 1).padStart(2, '0');
    refFileMap[r.id] = `${prefix}-${r.id}${inferImageExt(r.thumbnailUrl)}`;
  });

  return {
    meta: {
      museVersion: MUSE_EXPORT_VERSION,
      project: {
        id: project.id,
        name: project.name,
        intent: project.intent,
        mode: project.mode,
        createdAt: project.createdAt,
      },
      generatedAt: new Date().toISOString(),
      referenceCount: projectRefs.length,
    },

    color: {
      description: 'Color tokens extracted from images. HEX values are usable as-is. role is primary/secondary/accent/neutral.',
      tokens: pickEnabledTokens(analysis?.color),
    },

    typography: {
      description: 'Typography tokens. fontFamily is a CSS font stack; fontSize is a raw CSS value like clamp().',
      tokens: pickEnabledTokens(analysis?.typography),
    },

    layout: {
      description: 'Layout tokens. kind is grid(columns+gap) / container(ratio+maxWidth). spacing is a separate axis.',
      tokens: pickEnabledTokens(analysis?.layout),
    },

    gradient: {
      description: 'Gradient tokens. The gradient field can be applied as a raw CSS gradient string.',
      tokens: pickEnabledTokens(analysis?.gradient),
    },

    spacing: {
      description: 'Spacing scale tokens (an object map like xs/sm/md/lg/xl). 1:1 with DESIGN.md spacing.',
      scale: analysis?.spacing || {},
    },

    rounded: {
      description: 'Border radius scale tokens (object map). 1:1 with DESIGN.md rounded.',
      scale: analysis?.rounded || {},
    },

    elevation: {
      description: 'Shadow tokens (optional). An empty array means a flat design. 1:1 with DESIGN.md x-elevation.',
      tokens: pickEnabledTokens(Array.isArray(analysis?.elevation) ? analysis.elevation : []),
    },

    components: {
      description: 'UI component composition. All values are {a.b} token references. 1:1 with DESIGN.md components.',
      specs: analysis?.components || {},
    },

    visualDirection: {
      description: 'Context-based visual direction. A narrative MD document + aggregated tags.',
      markdown: analysis?.visualDirection?.markdown || '',
      tags: analysis?.visualDirection?.tags || { genre: [], style: [], subject: [] },
    },

    references: projectRefs.map((r) => ({
      id: r.id,
      filename: refFileMap[r.id],
      title: r.title,
      tags: r.tags,
      dominantColors: r.dominantColors,
      source: r.source,
    })),
  };
}

/* ============================================
 * README builder (AI tool guide)
 * ============================================ */

function buildReadme(project, references) {
  const name = project.name || 'Untitled';
  const attachmentTable = buildAttachmentTable(project, references);
  return `# MUSE Export - ${name}

Generated by MUSE on ${new Date().toISOString().slice(0, 10)}.

## Reference Images (exact filenames to attach to external AI)

${attachmentTable}

> When attaching to an external AI, use the filenames above as-is. The \`ref-XXX\` mentions in the body map 1:1 to the files above.

## File layout

| File | Purpose |
|------|------|
| \`muse.json\` | Universal design tokens + meta + visual direction tags (machine-readable) |
| \`visual-direction.md\` | Narrative design direction (human/LLM-readable) |
| \`ai-paste-block.md\` | For pasting into external AI tools (platform-neutral prose + attachment matching) |
| Each reference image | See the matching table above |

## How to feed into AI coding tools

### Cursor / Claude Code
Copy this folder into the project root (e.g. \`design/muse/\`), then prompt:

> Implement this project using the tokens in \`design/muse/muse.json\`.
> Follow the tone and intent in \`design/muse/visual-direction.md\`.
> Refer to the original images in the matching table above when needed.

### ChatGPT / Claude conversation
Paste the body of \`ai-paste-block.md\` and upload the image files from the matching table in attachment order:

> Build {framework} components based on this token and direction document.

## muse.json schema summary

- \`meta\` - project meta (name/intent/mode/createdAt)
- \`color.tokens\` - \`[{ id, label, hex, role, group }]\`
- \`typography.tokens\` - \`[{ id, label, variant, fontFamily, fontWeight, fontSize, lineHeight, letterSpacing }]\`
- \`layout.tokens\` - \`[{ id, label, kind, columns|gap|px|ratio|maxWidth }]\`
- \`gradient.tokens\` - \`[{ id, label, gradient }]\` (CSS string)
- \`visualDirection\` - \`{ markdown, tags: { genre, style, subject } }\`
- \`references\` - \`[{ id, filename, title, tags, dominantColors }]\`

Framework-independent: in MUI/Tailwind/Chakra/Styled Components, use \`hex\` and the CSS values as-is.

---

**Intent**: ${project.intent || '(none)'}
**Project mode**: ${project.mode || 'system'}
`;
}

/* ============================================
 * ZIP builder + download
 * ============================================ */

/**
 * concept mode only - download a single .md file (no ZIP)
 * @returns {Promise<{ filename: string, size: number }>}
 */
export async function exportConceptPrompt({ project, analysis, references }) {
  const zip = new JSZip();
  const promptText = analysis?.conceptPrompt || '';
  const slug = slugify(project?.name);
  const date = new Date().toISOString().slice(0, 10);
  const pasteBlock = buildAiPasteBlock({ project, analysis, references });
  const attachmentTable = buildAttachmentTable(project, references);

  const md = `# ${project?.name || 'Concept'} - Concept Prompt

_Generated by MUSE on ${date} (mode: concept)_

## Reference Images (exact filenames to attach to external AI)

${attachmentTable}

> When pasting into an external AI tool, upload the files above in attachment order using the filenames as-is.

## How to use

Paste the "AI Paste Block" section below into an external AI tool (Claude Design / Gemini / AI Studio / ChatGPT, etc.)
as-is, and upload the files from the matching table above together in attachment order.

## Prompt (raw)

${promptText}

---

${pasteBlock}

---

**Project intent**: ${project?.intent || '(none)'}
`;
  zip.file('concept-prompt.md', md);
  zip.file('ai-paste-block.md', pasteBlock);

  // Include images (attachment-order prefix, matching the paste block cues)
  const projectRefs = (project?.referenceIds || [])
    .map((id) => (references || []).find((r) => r.id === id))
    .filter(Boolean);
  await Promise.all(projectRefs.map(async (ref, i) => {
    const prefix = String(i + 1).padStart(2, '0');
    const filename = `${prefix}-${ref.id}${inferImageExt(ref.thumbnailUrl)}`;
    try {
      const res = await fetch(ref.thumbnailUrl);
      if (!res.ok) throw new Error(`status ${res.status}`);
      const blob = await res.blob();
      zip.file(filename, blob);
    } catch (e) {
      zip.file(`${prefix}-${ref.id}.error.txt`, `Failed to include image: ${e?.message || String(e)}`);
    }
  }));

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const filename = `muse-${slug}-concept-${date}.zip`;
  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return { filename, size: zipBlob.size };
}

/**
 * Bundle one project into a ZIP and download it. (system mode)
 * concept mode branches to exportConceptPrompt.
 * @param {object} params
 * @param {object} params.project - Project entity
 * @param {object} params.analysis - AnalysisLayers (a shape where layers are directly accessible)
 * @param {array}  params.references - All store references (only the used ones are included in the ZIP)
 * @returns {Promise<{ filename: string, size: number }>}
 */
export async function exportProjectAsZip({ project, analysis, references }) {
  // concept mode: a single .md file instead of a ZIP
  if (project?.mode === 'concept') {
    return exportConceptPrompt({ project, analysis });
  }

  const zip = new JSZip();
  const universal = buildUniversalJson({ project, analysis, references });

  // 1) muse.json (universal tokens)
  zip.file('muse.json', JSON.stringify(universal, null, 2));

  // 2) standalone visual-direction.md
  const md = analysis?.visualDirection?.markdown;
  if (md) {
    zip.file('visual-direction.md', md);
  }

  // 3) README for AI tools
  zip.file('README.md', buildReadme(project, references));

  // 3.5) ai-paste-block.md - for pasting into external AI tools (platform-neutral) (common to all modes)
  zip.file('ai-paste-block.md', buildAiPasteBlock({ project, analysis, references }));

  // 4) references/ - used images only, as binaries (attachment-order prefix: 01-ref-XXX)
  const projectRefs = (project.referenceIds || [])
    .map((id) => (references || []).find((r) => r.id === id))
    .filter(Boolean);
  const refsFolder = zip.folder('references');

  await Promise.all(
    projectRefs.map(async (ref, i) => {
      const prefix = String(i + 1).padStart(2, '0');
      const filename = `${prefix}-${ref.id}${inferImageExt(ref.thumbnailUrl)}`;
      try {
        const res = await fetch(ref.thumbnailUrl);
        if (!res.ok) throw new Error(`status ${res.status}`);
        const blob = await res.blob();
        refsFolder.file(filename, blob);
      } catch (e) {
        refsFolder.file(
          `${prefix}-${ref.id}.error.txt`,
          `Failed to include image: ${e?.message || String(e)}`,
        );
      }
    }),
  );

  // 5) Generate & download
  const blob = await zip.generateAsync({ type: 'blob' });
  const slug = slugify(project.name);
  const date = new Date().toISOString().slice(0, 10);
  const filename = `muse-${slug}-${date}.zip`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return { filename, size: blob.size };
}

/**
 * system mode only - a lightweight ZIP centered on DESIGN.md.
 *
 * ZIP structure:
 *   muse-system-{slug}-{date}.zip
 *   |-- DESIGN.md            <- Google Labs alpha spec, front-matter + 8 prose sections
 *   |-- decision-trace.md    <- TP6 decision trace (whichReferences / whyChosen / appliedUserNotes)
 *   |-- muse.json            <- universal tokens (for compatibility)
 *   |-- tokens.dtcg.json     <- DTCG (optional - for compatibility with other tools)
 *   |-- visual-direction.md  <- VD markdown alone
 *   |-- README.md            <- usage guide + matching table
 *   \`-- references/
 *       \`-- {ref-id}.{ext}
 *
 * @returns {Promise<{ filename: string, size: number }>}
 */
export async function exportSystemBundle({ project, analysis, references }) {
  const zip = new JSZip();
  const tokens = {
    color: analysis?.color || [],
    typography: analysis?.typography || [],
    layout: analysis?.layout || [],
    gradient: analysis?.gradient || [],
    spacing: analysis?.spacing || {},
    rounded: analysis?.rounded || {},
    elevation: Array.isArray(analysis?.elevation) ? analysis.elevation : [],
    components: analysis?.components || {},
  };

  zip.file('DESIGN.md', buildDesignMd({ project, layers: analysis }));
  zip.file('decision-trace.md', buildDecisionTraceMd({ project, layers: analysis }));
  zip.file('muse.json', JSON.stringify(buildUniversalJson({ project, analysis, references }), null, 2));
  zip.file('tokens.dtcg.json', JSON.stringify(buildDtcgTokens(tokens), null, 2));
  zip.file('visual-direction.md', analysis?.visualDirection?.markdown || '_(no visual direction)_');
  zip.file('README.md', buildReadme(project, references));

  const projectRefs = (project.referenceIds || [])
    .map((id) => (references || []).find((r) => r.id === id))
    .filter(Boolean);
  const refsFolder = zip.folder('references');
  await Promise.all(projectRefs.map(async (ref, i) => {
    const prefix = String(i + 1).padStart(2, '0');
    const filename = `${prefix}-${ref.id}${inferImageExt(ref.thumbnailUrl)}`;
    try {
      const res = await fetch(ref.thumbnailUrl);
      if (!res.ok) throw new Error(`status ${res.status}`);
      const blob = await res.blob();
      refsFolder.file(filename, blob);
    } catch (e) {
      refsFolder.file(`${prefix}-${ref.id}.error.txt`, `Failed to include image: ${e?.message || String(e)}`);
    }
  }));

  const blob = await zip.generateAsync({ type: 'blob' });
  const slug = slugify(project.name);
  const date = new Date().toISOString().slice(0, 10);
  const filename = `muse-system-${slug}-${date}.zip`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return { filename, size: blob.size };
}

/**
 * Download muse.json only (a lightweight path without images).
 */
export function downloadUniversalJson({ project, analysis, references }) {
  const universal = buildUniversalJson({ project, analysis, references });
  const slug = slugify(project.name);
  const blob = new Blob([JSON.stringify(universal, null, 2)], {
    type: 'application/json;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `muse-${slug}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
