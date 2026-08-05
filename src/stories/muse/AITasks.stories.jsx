import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {
  AI_TASKS,
  AI_WORKFLOW_DIAGRAM,
  TASK_AUTO_TAG,
  TASK_RECOMMEND,
  TASK_ANALYZE_TOKENS,
  TOKEN_LAYERS,
  VISUAL_DIRECTION_CATEGORIES,
  getLayerTags,
  getVisualDirectionTags,
} from '../../data/muse';
import {
  DocumentTitle,
  PageContainer,
  SectionTitle,
} from '../../components/storybookDocumentation';

export default {
  title: 'MUSE/AI Tasks',
  parameters: { layout: 'padded' },
};

/* ============================================
 * Common render helpers
 * ============================================ */

const CodeBlock = ({ children, tone = 'light' }) => (
  <Box
    component="pre"
    sx={ {
      m: 0,
      p: 2,
      bgcolor: tone === 'dark' ? 'grey.900' : 'grey.100',
      color: tone === 'dark' ? 'grey.100' : 'text.primary',
      borderRadius: 2,
      fontSize: 12,
      lineHeight: 1.6,
      fontFamily: 'monospace',
      overflow: 'auto',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    } }
  >
    { typeof children === 'string' ? children : JSON.stringify(children, null, 2) }
  </Box>
);

const MetaRow = ({ label, value, mono = false }) => (
  <Box sx={ { display: 'flex', gap: 2, py: 0.75, borderBottom: '1px solid', borderColor: 'divider' } }>
    <Typography variant="caption" sx={ { minWidth: 120, color: 'text.secondary', fontWeight: 500 } }>
      { label }
    </Typography>
    <Typography
      variant="body2"
      sx={ { flex: 1, fontFamily: mono ? 'monospace' : 'inherit', fontSize: mono ? 12 : 14 } }
    >
      { value }
    </Typography>
  </Box>
);

/* ============================================
 * New structure: Input → Prompt → Output summary + UX + data model
 * ============================================ */

/** 1) Top: Input → Prompt → Output 3-step summary (see it at a glance) */
/** Item / Description / Data example 3 columns: scan quickly within each column */
const FieldRows = ({ rows }) => (
  <Box sx={ { display: 'flex', flexDirection: 'column' } }>
    { /* Header */ }
    <Box
      sx={ {
        display: 'grid',
        gridTemplateColumns: '110px 1fr',
        gap: 1,
        px: 0.5,
        pb: 0.5,
        borderBottom: '1px solid',
        borderColor: 'divider',
      } }
    >
      <Typography variant="caption" sx={ { fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em' } }>
        Item
      </Typography>
      <Typography variant="caption" sx={ { fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em' } }>
        Description
      </Typography>
    </Box>
    { rows.map((r) => (
      <Box
        key={ r.name }
        sx={ {
          py: 1,
          borderBottom: '1px dashed',
          borderColor: 'divider',
          '&:last-of-type': { borderBottom: 'none' },
        } }
      >
        <Box sx={ { display: 'grid', gridTemplateColumns: '110px 1fr', gap: 1, alignItems: 'baseline' } }>
          <Typography sx={ { fontFamily: 'monospace', fontSize: 13, fontWeight: 600 } }>
            { r.name }
          </Typography>
          <Typography variant="body2" sx={ { fontSize: 13 } }>
            { r.desc }
          </Typography>
        </Box>
        { r.example && (
          <Box sx={ { mt: 0.75, pl: '110px' } }>
            <Typography
              sx={ {
                fontFamily: 'monospace',
                fontSize: 11,
                color: 'text.secondary',
                bgcolor: 'grey.100',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                display: 'inline-block',
                maxWidth: '100%',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              } }
            >
              { r.example }
            </Typography>
          </Box>
        ) }
      </Box>
    )) }
  </Box>
);

const IOPipelineSummary = ({ task, io }) => (
  <Box sx={ { mb: 5 } }>
    <SectionTitle title="① Data Format Summary" description="Input → Prompt → Output at a glance" />
    <Box
      sx={ {
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
        gap: 2,
      } }
    >
      { [
        { label: 'INPUT', hint: `kind: ${task.input.kind}`, description: task.input.description, rows: io?.input },
        { label: 'PROMPT', hint: `model: ${task.model}`, description: `structured output forced via system prompt + tool schema`, prompt: true },
        { label: 'OUTPUT', hint: `tokens out ~${task.estCost.tokensOut}`, description: task.output.description, rows: io?.output },
      ].map((col) => (
        <Box
          key={ col.label }
          sx={ {
            p: 2,
            borderRadius: 2,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
          } }
        >
          <Typography
            sx={ {
              fontFamily: 'monospace',
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: '0.08em',
              pb: 1,
              borderBottom: '1px solid',
              borderColor: 'divider',
            } }
          >
            { col.label }
          </Typography>
          <Typography variant="caption" sx={ { color: 'text.secondary', fontFamily: 'monospace' } }>
            { col.hint }
          </Typography>
          <Typography variant="body2">{ col.description }</Typography>
          { col.prompt
            ? <CodeBlock>{ task.systemPrompt }</CodeBlock>
            : col.rows && col.rows.length > 0
              ? <FieldRows rows={ col.rows } />
              : <CodeBlock>{ col.label === 'INPUT' ? task.input.shape : task.output.shape }</CodeBlock> }
        </Box>
      )) }
    </Box>
  </Box>
);

/** 1.5) Input classification by source: user action / DB / system / model parameter / not received */
const INPUT_CATEGORY_META = {
  user: { label: 'User action', color: 'primary' },
  db: { label: 'DB data', color: 'success' },
  system: { label: 'System resource', color: 'default' },
  model: { label: 'Model parameter', color: 'secondary' },
  callback: { label: 'Callback', color: 'info' },
  none: { label: 'Not received', color: 'error' },
};

const InputBreakdown = ({ inputs }) => {
  const grouped = inputs.reduce((acc, row) => {
    (acc[row.category] = acc[row.category] || []).push(row);
    return acc;
  }, {});
  const orderedKeys = ['user', 'db', 'system', 'model', 'callback', 'none'].filter((k) => grouped[k]);

  return (
    <Box sx={ { mb: 5 } }>
      <SectionTitle title="Input Breakdown by Source" description="What comes in and from where when this task is called once" />
      <TableContainer
        sx={ {
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
        } }
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={ { fontWeight: 600, width: 140 } }>Category</TableCell>
              <TableCell sx={ { fontWeight: 600, width: 220 } }>Item</TableCell>
              <TableCell sx={ { fontWeight: 600, width: 220 } }>Source</TableCell>
              <TableCell sx={ { fontWeight: 600 } }>Note</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { orderedKeys.flatMap((catKey) => {
              const meta = INPUT_CATEGORY_META[catKey];
              return grouped[catKey].map((row, i) => (
                <TableRow key={ `${catKey}-${i}` } hover>
                  <TableCell>
                    { i === 0 ? (
                      <Chip
                        size="small"
                        label={ meta.label }
                        color={ meta.color }
                        variant={ catKey === 'none' ? 'outlined' : 'filled' }
                      />
                    ) : null }
                  </TableCell>
                  <TableCell sx={ { fontFamily: row.mono === false ? 'inherit' : 'monospace', fontSize: 13 } }>
                    { row.item }
                  </TableCell>
                  <TableCell sx={ { fontSize: 13, color: 'text.secondary' } }>{ row.source }</TableCell>
                  <TableCell sx={ { fontSize: 13, color: 'text.secondary' } }>{ row.note || '-' }</TableCell>
                </TableRow>
              ));
            }) }
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

/** 2) Middle: UX explanation (an easy summary from the user's perspective) */
const UXExplanation = ({ task, uxFlow }) => (
  <Box sx={ { mb: 5 } }>
    <SectionTitle title="② UX Flow" description="When and how it is called from the user's perspective" />
    <Box
      sx={ {
        p: 3,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
      } }
    >
      <Typography variant="body1" sx={ { mb: 2, fontWeight: 500 } }>
        { uxFlow.summary }
      </Typography>
      <Box component="ol" sx={ { m: 0, pl: 3, display: 'flex', flexDirection: 'column', gap: 1 } }>
        { uxFlow.steps.map((step, i) => (
          <Box component="li" key={ i }>
            <Typography variant="body2">{ step }</Typography>
          </Box>
        )) }
      </Box>
      { uxFlow.note && (
        <Box sx={ { mt: 2, p: 1.5, bgcolor: 'grey.100', borderRadius: 1.5 } }>
          <Typography variant="caption" sx={ { color: 'text.secondary' } }>
            <strong>Key:</strong> { uxFlow.note }
          </Typography>
        </Box>
      ) }
    </Box>
    <Box sx={ { mt: 2 } }>
      <Typography variant="caption" sx={ { color: 'text.secondary', fontFamily: 'monospace' } }>
        Trigger stage: { task.stage } · Estimated cost: in { task.estCost.tokensIn } → out { task.estCost.tokensOut } tokens · { task.estCost.note }
      </Typography>
    </Box>
  </Box>
);

/** 3) Bottom: related data model (the schema this task reads/writes) */
const RelatedDataModel = ({ dataModel }) => (
  <Box sx={ { mb: 5 } }>
    <SectionTitle title="③ Related Data Model" description="The schema / vocabulary this task reads or writes" />
    <Box sx={ { display: 'flex', flexDirection: 'column', gap: 3 } }>
      { dataModel.fields && (
        <Box>
          <Typography variant="caption" sx={ { display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, color: 'text.secondary' } }>
            Affected schema fields
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={ { fontWeight: 600 } }>Path</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>Type</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>R/W</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>Note</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { dataModel.fields.map((f, i) => (
                  <TableRow key={ i } hover>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ f.path }</TableCell>
                    <TableCell sx={ { fontFamily: 'monospace', fontSize: 12, color: 'text.secondary' } }>{ f.type }</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={ f.access }
                        color={ f.access === 'write' ? 'primary' : f.access === 'read' ? 'default' : 'secondary' }
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell sx={ { fontSize: 13, color: 'text.secondary' } }>{ f.note }</TableCell>
                  </TableRow>
                )) }
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ) }

      { dataModel.vocabulary && (
        <Box>
          <Typography variant="caption" sx={ { display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, color: 'text.secondary' } }>
            { dataModel.vocabularyLabel || 'Related vocabulary' }
          </Typography>
          <Box sx={ { display: 'flex', flexDirection: 'column', gap: 1.5 } }>
            { dataModel.vocabulary.map((v) => (
              <Box key={ v.label }>
                <Typography variant="caption" sx={ { display: 'block', mb: 0.5, fontFamily: 'monospace', color: 'text.secondary' } }>
                  { v.label }
                </Typography>
                <Box sx={ { display: 'flex', gap: 0.5, flexWrap: 'wrap' } }>
                  { v.tags.map((t) => (
                    <Chip key={ t } label={ t } size="small" variant="outlined" />
                  )) }
                </Box>
              </Box>
            )) }
          </Box>
        </Box>
      ) }

      { dataModel.persistence && (
        <Box sx={ { p: 2, bgcolor: 'grey.100', borderRadius: 1.5 } }>
          <Typography variant="caption" sx={ { display: 'block', mb: 0.5, fontWeight: 600 } }>
            Storage location
          </Typography>
          <Typography variant="body2">{ dataModel.persistence }</Typography>
        </Box>
      ) }
    </Box>
  </Box>
);

/** New structure: stacks IO summary → Input classification → UX → data model in order */
const StructuredTaskDetail = ({ task, uxFlow, dataModel, inputs, io }) => (
  <Box>
    <Box sx={ { display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 1 } }>
      <Chip
        size="small"
        label={ task.id.toUpperCase() }
        color="primary"
        variant="filled"
        sx={ { fontFamily: 'monospace' } }
      />
      <Typography variant="h4" sx={ { fontWeight: 700 } }>{ task.name }</Typography>
    </Box>
    <Typography variant="body1" color="text.secondary" sx={ { mb: 4 } }>
      { task.purpose }
    </Typography>

    <IOPipelineSummary task={ task } io={ io } />
    { inputs && (
      <>
        <Divider sx={ { my: 4 } } />
        <InputBreakdown inputs={ inputs } />
      </>
    ) }
    <Divider sx={ { my: 4 } } />
    <UXExplanation task={ task } uxFlow={ uxFlow } />
    <Divider sx={ { my: 4 } } />
    <RelatedDataModel dataModel={ dataModel } />
  </Box>
);

/* ============================================
 * Per-task UX / data-model copy (Storybook-only curation)
 * ============================================ */

const T1_UX = {
  summary: 'When you add an image to the archive, a single call extracts everything: tags + dominant colors + design tokens (extended schema).',
  steps: [
    'The user uploads an image on ArchivePage via drag / file / URL. The store first creates a placeholder reference and shows a "Tagging…" badge on the card.',
    'In the background, `runAutoTag` (Haiku 4.5 vision) is called once, receiving 5-layer tags + dominantColors + title + extracted (palette/typography/layout/gradient) all at once through the extended tool schema.',
    'The result is merged via `updateReference`: tag chips, dominantColors swatches, and detail modal metadata are all filled in.',
    'Retry: `runAutoTag` retries automatically up to 3 times internally (network/429/5xx/missing tool_use) plus the store-level `addReference` itself retries once. If both stages fail, `_tagError` shows a "Tagging failed + try again" UI on the card (manual, unlimited).',
  ],
  note: 'Previously T1 (tagging) + T3 (token extraction) were two calls, but they were merged in session 023: at upload time, T1 alone finishes it. The card dominantColors swatch is also a T1 output.',
};

const T1_DATA = {
  fields: [
    { path: 'references[].tags.color[]', type: 'string[]', access: 'write', note: '`color` layer enum (Muted/Vivid/Pastel…)' },
    { path: 'references[].tags.typography[]', type: 'string[]', access: 'write', note: '`typography` layer enum (Serif/Mono…)' },
    { path: 'references[].tags.layout[]', type: 'string[]', access: 'write', note: 'Bento, Grid, Editorial, etc.' },
    { path: 'references[].tags.gradient[]', type: 'string[]', access: 'write', note: 'Mesh, Linear, etc. (empty array if none)' },
    { path: 'references[].tags.visualDirection.{genre|style|subject}[]', type: 'string[]', access: 'write', note: 'Y2K, Brutalist, etc.' },
    { path: 'references[].dominantColors[]', type: 'hex string[]', access: 'write', note: '3 to 5 dominant colors: source for card swatch and color filter matching' },
    { path: 'references[].title', type: 'string', access: 'write', note: 'Describes the design tone (e.g. "Editorial Layout")' },
    { path: 'references[].extracted.{palette|typography|layout|gradient}', type: 'object[]', access: 'write', note: 'Input for the T3 synthesis stage. Extracted together at upload time, so vision is not re-called when creating a project' },
    { path: 'references[]._pending / _tagError', type: 'flag', access: 'write', note: 'Tagging in-progress/failed state: for the card overlay' },
  ],
  vocabularyLabel: 'Tag vocabulary (preset enum, nothing outside the preset)',
  vocabulary: [
    ...TOKEN_LAYERS.map((l) => ({ label: l, tags: getLayerTags(l) })),
    ...VISUAL_DIRECTION_CATEGORIES.map((c) => ({ label: `visualDirection · ${c}`, tags: getVisualDirectionTags(c) })),
  ],
  persistence: 'Supabase `references` table: `tags` (jsonb) + `dominant_colors` (text[]) + `extracted` (jsonb) + `title` (text).',
};

const T2_UX = {
  summary: 'Given the project intent text, it recommends the Top-N references from the archive that would fit (text-only).',
  steps: [
    'In Step 1 of the project creation wizard, the user fills in the form: `intent` (free text, e.g. "Y2K-style dark poster") + `type` (landing/poster, etc.).',
    'On entering Step 2, `recommendedLoader` calls `runRecommend({intent, type, archive: references, n: 6})`: Haiku 4.5 text-only, no image re-call.',
    'The archive is serialized into the system as compressed JSON keeping only `{id, title, tags, dominantColors}`, and the tool returns `recommendedIds` (5 to 10) + `reasons` (per-id reason under 40 chars).',
    'The received `recommendedIds` filter the references and surface them in the ReferencePicker. The user adds/removes cards, then confirms the final set before Step 3.',
  ],
  note: 'No images viewed, so cheapest cost. The quality of the tags/colors T1 attached is exactly the T2 recommendation quality. The result is not stored in the DB, only in wizard state.',
};

const T2_DATA = {
  fields: [
    { path: 'input.intent', type: 'string', access: 'read', note: 'Natural-language intent entered by the user' },
    { path: 'input.type', type: 'string', access: 'read', note: 'Project category (landing/poster/app, etc.)' },
    { path: 'input.archive[]', type: '{id, title, tags, dominantColors}[]', access: 'read', note: 'Only compressed metadata of the whole archive (no image URLs)' },
    { path: 'output.recommendedIds[]', type: 'string[]', access: 'write', note: 'Recommended reference ids (5 to 10, in rank order)' },
    { path: 'output.reasons[]', type: '{id, reason}[]', access: 'write', note: 'Per-id recommendation reason under 40 chars (UI chip label)' },
  ],
  persistence: 'Not stored in the DB. Kept only in wizard client state (`projectDraft`). Only the `referenceIds[]` the user confirms are persisted to `projects.reference_ids`.',
};

const T3_UX = {
  summary: 'It combines the pre-extracted tokens of the selected references with the intent to synthesize the project 4-layer tokens + visualDirection markdown (text-only, no images).',
  steps: [
    'Clicking "Start Analysis" in wizard Step 3 makes `onAnalyze` call `runAnalyzeTokens({intent, type, selectedRefs, onProgress})`.',
    'Only `{id, title, tags, dominantColors, extracted}` are pulled from the selected references, serialized to JSON, and passed as the user message: no image re-call.',
    'Haiku 4.5 uses three tool calls: `submit_design_system_core` (the 4 layers color/typography/layout/gradient) and `submit_visual_direction` (genre/style/subject tags + Markdown body) run in parallel, then `submit_design_system_designmd` (spacing/rounded/elevation/components).',
    'The `onProgress` callback reflects the 5-layer status (running → done) into the AnalysisProgress component in real time.',
    'On completion, `setAnalysis` saves to store/DB, so the project detail page can export via ThemeExportDialog (MUI theme) + ZIP (JSON tokens + VD MD + reference images).',
  ],
  note: 'Cost reduction (session 023): previously called with Sonnet + N images (~$0.048), now Haiku + text-only (~$0.008, about 6x cheaper). Thanks to T1 already building `extracted` at upload time.',
};

const T3_DATA = {
  fields: [
    { path: 'input.intent / type', type: 'string', access: 'read', note: 'Wizard Step 1 form values' },
    { path: 'input.selectedRefs[].extracted', type: 'object', access: 'read', note: 'Tokens T1 pre-extracted at upload time (palette/typography/layout/gradient)' },
    { path: 'input.selectedRefs[].tags / dominantColors', type: 'object / hex[]', access: 'read', note: 'T1 output: synthesis context' },
    { path: 'output.tokens.color[]', type: '{id, label, hex, role, group, ...}[]', access: 'write', note: 'exactly 1 with role==="primary"' },
    { path: 'output.tokens.typography[]', type: '{hierarchy, fontFamily, ...}[]', access: 'write', note: 'h1>h2>body1 hierarchy enforced' },
    { path: 'output.tokens.layout[]', type: 'object[]', access: 'write', note: 'Synthesized grid columns/spacing values' },
    { path: 'output.tokens.gradient[]', type: 'object[]', access: 'write', note: 'gradient stops (only when present)' },
    { path: 'output.visualDirection.markdown', type: 'string', access: 'write', note: 'Template including required sections 1 to 6' },
    { path: 'output.visualDirection.tags.{genre|style|subject}[]', type: 'string[]', access: 'write', note: 'Aggregated tags' },
    { path: 'projects[].tokens', type: 'jsonb', access: 'write', note: 'Persisting the synthesis result: the JSON part of Export' },
  ],
  persistence: 'Supabase `projects.tokens` (jsonb) + analysis record. The ZIP export bundles `tokens.json` + `visual-direction.md` + reference images.',
};

const T1_INPUTS = [
  { category: 'user', item: 'Image file / URL', source: 'ArchivePage drag-and-drop or URL', note: 'Called one image at a time' },
  { category: 'user', item: 'base64 dataURL (1024px resize)', source: 'imageUrlToBase64DataUrl + resizeDataUrl', note: 'vision input' },
  { category: 'system', item: 'TASK_AUTO_TAG.systemPrompt', source: 'data/muse/aiTasks.js', note: 'prompt cache hit target' },
  { category: 'system', item: 'TASK_AUTO_TAG.toolSchema', source: 'data/muse/aiTasks.js', note: '5-layer enum + extracted merged' },
  { category: 'system', item: 'preset vocabulary (TOKEN_LAYERS + VISUAL_DIRECTION_CATEGORIES)', source: 'muse_tags_preset.json', note: 'enforced via tool schema enum' },
  { category: 'model', item: 'model: claude-haiku-4-5', source: 'hardcoded', note: 'vision capable' },
  { category: 'model', item: 'max_tokens: 512, tool_choice: forced', source: 'runAutoTag', note: 'forces structured output' },
  { category: 'none', item: 'intent / type / other references / project context', source: '-', note: 'Sees only one image (descriptive)' },
];

const T2_INPUTS = [
  { category: 'user', item: 'intent (free text)', source: 'Wizard Step 1 form', note: 'e.g. "Y2K-style dark poster"' },
  { category: 'user', item: 'type (category)', source: 'Wizard Step 1 form', note: 'landing / poster / app, etc.' },
  { category: 'user', item: 'n (recommendation count)', source: 'hardcoded at call site', note: 'default 6' },
  { category: 'db', item: 'entire archive[]', source: 'store references', note: 'All references in the archive' },
  { category: 'db', item: 'compressed to only {id, title, tags, dominantColors}', source: 'compactArchive transform', note: 'No image URLs (text-only)' },
  { category: 'system', item: 'TASK_RECOMMEND.systemPrompt', source: 'data/muse/aiTasks.js', note: '-' },
  { category: 'system', item: 'TASK_RECOMMEND.userMessageTemplate', source: 'data/muse/aiTasks.js', note: '{{intent}}/{{type}}/{{n}}/{{archiveCount}}/{{archiveJson}} substitution' },
  { category: 'system', item: 'TASK_RECOMMEND.toolSchema', source: 'data/muse/aiTasks.js', note: 'submit_recommendations' },
  { category: 'model', item: 'model: claude-haiku-4-5, max_tokens: 1024, text-only', source: 'hardcoded', note: '-' },
  { category: 'none', item: 'images / extracted tokens / user prior project history', source: '-', note: 'Recommends from tag+color metadata only' },
];

const T3_INPUTS = [
  { category: 'user', item: 'intent', source: 'Wizard Step 1 form', note: 'Reuses the same value as T2' },
  { category: 'user', item: 'type', source: 'Wizard Step 1 form', note: 'Reuses the same value as T2' },
  { category: 'user', item: 'selectedRefs[]', source: 'T2 recommendation + user add/remove', note: 'Up to 4 images recommended' },
  { category: 'user', item: '"Start Analysis" button click', source: 'Wizard Step 3', note: 'Explicit trigger' },
  { category: 'db', item: 'selectedRefs[].tags', source: 'T1 output (references table)', note: 'Layer tags' },
  { category: 'db', item: 'selectedRefs[].dominantColors', source: 'T1 output', note: 'Dominant color hex' },
  { category: 'db', item: 'selectedRefs[].extracted', source: 'T1 output', note: '★ Core synthesis input (palette/typo/layout/gradient)' },
  { category: 'db', item: 'selectedRefs[].id, title', source: 'references metadata', note: 'For tracking' },
  { category: 'system', item: 'TASK_ANALYZE_TOKENS.systemPrompt', source: 'data/muse/aiTasks.js', note: '-' },
  { category: 'system', item: 'TASK_ANALYZE_TOKENS.userMessageTemplate', source: 'data/muse/aiTasks.js', note: '{{intent}}/{{type}}/{{count}}/{{ids}} substitution' },
  { category: 'system', item: 'three toolSchemas', source: 'submit_design_system_core + submit_visual_direction (parallel) then submit_design_system_designmd', note: 'Each forced via its own tool_choice' },
  { category: 'model', item: 'model: claude-haiku-4-5, text-only', source: 'hardcoded', note: 'No images, so Haiku is enough' },
  { category: 'callback', item: 'onProgress(layers)', source: 'Injected by ProjectCreateRoute', note: 'For updating the AnalysisProgress UI' },
  { category: 'none', item: 'original images / entire archive (only the selected N)', source: '-', note: 'Synthesizes from only T1 pre-extracted tokens' },
];

const T1_IO = {
  input: [
    { name: 'Image to analyze', desc: 'dataURL resized to 1024px', example: '"data:image/jpeg;base64,/9j/4AAQ…"' },
    { name: 'mediaType', desc: 'Image MIME type', example: '"image/jpeg" | "image/png"' },
  ],
  output: [
    { name: 'tags', desc: '5-layer tag groups (preset enum enforced)', example: '{ color: ["Muted"], typography: ["Serif"], layout: ["Bento"], gradient: [], visualDirection: { genre, style, subject } }' },
    { name: 'dominantColors', desc: 'Dominant color hex array (3 to 5)', example: '["#14132B", "#4F46E5", "#FCFCFF"]' },
    { name: 'title', desc: 'Short title describing the design tone', example: '"Editorial Layout"' },
    { name: 'extracted', desc: '4 pre-extracted token types for T3 synthesis (palette/typo/layout/gradient)', example: '{ palette: [...], typography: [...], layout: [...], gradient: [...] }' },
  ],
};

const T2_IO = {
  input: [
    { name: 'intent', desc: 'Natural-language intent entered by the user', example: '"Y2K-style dark poster"' },
    { name: 'type', desc: 'Project category', example: "'landing' | 'dashboard' | 'mobile' | 'brand'" },
    { name: 'archive', desc: 'Compressed archive metadata (no image URLs)', example: '[{ id, title, tags, dominantColors }]' },
    { name: 'n?', desc: 'Recommendation count (default 6)', example: '6' },
  ],
  output: [
    { name: 'recommendedIds', desc: 'Recommended reference ids (5 to 10, in rank order)', example: '["ref-002", "ref-005", "ref-013"]' },
    { name: 'reasons', desc: 'Per-id recommendation reason under 40 chars', example: '[{ id: "ref-002", reason: "Magazine+Swiss match" }]' },
  ],
};

const T3_IO = {
  input: [
    { name: 'intent', desc: 'User intent (same value as T2)', example: '"Calm dark mood"' },
    { name: 'mode', desc: 'concept | system (TP2)', example: "'system'" },
    { name: 'selectedRefs', desc: 'Only the metadata of the selected references (≤4): images are not sent, only the text tokens T1 extracted are passed', example: '[{ id, title, tags, dominantColors, extracted, useLayers? }]  // no thumbnailUrl' },
    { name: 'userNotes (Step 3)', desc: 'Refinement notes after viewing references (HIGHEST PRIORITY). system=30+ (concept=0)', example: '"strong edge lines, magnolia only on superscript"' },
    { name: 'referenceNotes[refId]', desc: 'Per-ref borrowing note (optional). Ignore layers other than the specified', example: '{ "ref-002": "borrow only the hero area color" }' },
  ],
  output: [
    { name: 'tokens.color', desc: 'Role-assigned color tokens (exactly 1 primary)', example: '[{ id, hex, role: "primary", group: "Brand", decisionRationale }]' },
    { name: 'tokens.typography', desc: 'h1>h2>body hierarchy enforced', example: '[{ variant: "h1", fontFamily, fontWeight, decisionRationale }]' },
    { name: 'tokens.layout', desc: 'grid|container only (spacing separated)', example: '[{ kind: "grid", columns: 12, gap: 16 }]' },
    { name: 'tokens.gradient', desc: 'Gradient stops', example: '[{ gradient, stops }]' },
    { name: '★ tokens.spacing', desc: 'NEW: scale map (DESIGN.md compatible)', example: '{ xs: "4px", sm: "8px", md: "16px", lg: "24px" }' },
    { name: '★ tokens.rounded', desc: 'NEW: radius scale map', example: '{ sm: "4px", md: "8px", lg: "16px" }' },
    { name: '★ tokens.elevation', desc: 'NEW: shadow tokens (optional, empty array allowed)', example: '[{ id: "elev-1", shadow: "0 1px 2px rgba(0,0,0,0.08)", level: 1 }]' },
    { name: '★ tokens.components', desc: 'NEW: UI components, every value is a {a.b} token-ref (core of DESIGN.md)', example: '{ "button-primary": { backgroundColor: "{colors.primary-ink}", padding: "{spacing.md}", rounded: "{rounded.sm}", decisionRationale } }' },
    { name: 'visualDirection.markdown', desc: 'Design direction body (required sections 1 to 6)', example: '"# Visual Direction\\n## 1. Mood…"' },
    { name: 'visualDirection.tags', desc: '3 types of aggregated tags', example: '{ genre: [...], style: [...], subject: [...] }' },
    { name: '(deprecated) layerDetails', desc: 'Old handoff-mode-only 8-key Korean detail. Removed along with the handoff deprecation. Its intent is absorbed into the system visualDirection.markdown.', example: '(none)' },
  ],
  notes: [
    'concept mode is a separate function (runAnalyzeConcept): unrelated to the output shape above, produces a single conceptPrompt(string).',
    'system mode: on token-ref dangling, retry once, then fallback (components empty object).',
    'Export: system → DESIGN.md ZIP (DESIGN.md + DTCG + decision-trace + refs). The old handoff mode is deprecated and absorbed by system.',
  ],
};

const TASK_COPY = {
  t1: { ux: T1_UX, data: T1_DATA, inputs: T1_INPUTS, io: T1_IO },
  t2: { ux: T2_UX, data: T2_DATA, inputs: T2_INPUTS, io: T2_IO },
  t3: { ux: T3_UX, data: T3_DATA, inputs: T3_INPUTS, io: T3_IO },
};

/* ============================================
 * Existing single-task detail: kept in the combined Overview
 * ============================================ */

/** Single-task detail view: for the combined Overview page only (full schema dump) */
const TaskDetail = ({ task }) => (
  <Box sx={ { mb: 8 } }>
    <Box sx={ { display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 1 } }>
      <Chip
        size="small"
        label={ task.id.toUpperCase() }
        color="primary"
        variant="filled"
        sx={ { fontFamily: 'monospace' } }
      />
      <Typography variant="h5" sx={ { fontWeight: 700 } }>{ task.name }</Typography>
    </Box>
    <Typography variant="body1" color="text.secondary" sx={ { mb: 3 } }>
      { task.purpose }
    </Typography>

    {/* Meta */}
    <Box sx={ { mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' } }>
      <MetaRow label="stage" value={ task.stage } mono />
      <MetaRow label="model" value={ task.model } mono />
      <MetaRow label="input kind" value={ task.input.kind } mono />
      <MetaRow label="est. tokens" value={ `in ${task.estCost.tokensIn} · out ${task.estCost.tokensOut}` } mono />
      <MetaRow label="cost note" value={ task.estCost.note } />
    </Box>

    {/* Input / Output Schema */}
    <SectionTitle title="Input / Output Schema" description="The structure exchanged in the API call" />
    <Box sx={ { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 } }>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={ { display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: '0.08em' } }>
          Input
        </Typography>
        <Typography variant="body2" sx={ { mb: 1 } }>{ task.input.description }</Typography>
        <CodeBlock>{ task.input.shape }</CodeBlock>
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={ { display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: '0.08em' } }>
          Output
        </Typography>
        <Typography variant="body2" sx={ { mb: 1 } }>{ task.output.description }</Typography>
        <CodeBlock>{ task.output.shape }</CodeBlock>
      </Box>
    </Box>

    {/* System Prompt */}
    <SectionTitle title="System Prompt" description="The system field of Anthropic messages.create" />
    <CodeBlock tone="dark">{ task.systemPrompt }</CodeBlock>

    {/* User message template */}
    <Box sx={ { mt: 3, mb: 3 } }>
      <SectionTitle title="User Message Template" description="Variables are marked as {{...}}" />
      <CodeBlock>{ task.userMessageTemplate }</CodeBlock>
    </Box>

    {/* Tool Schema */}
    <SectionTitle title="Tool Schema" description="Forces structured output via tool use" />
    <CodeBlock>{ task.toolSchema }</CodeBlock>

    {/* Quality criteria */}
    <Box sx={ { mt: 3, mb: 3 } }>
      <SectionTitle title="Quality Criteria" description="Axes for evaluating output quality" />
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={ { fontWeight: 600 } }>ID</TableCell>
              <TableCell sx={ { fontWeight: 600 } }>Label</TableCell>
              <TableCell sx={ { fontWeight: 600 } }>Type</TableCell>
              <TableCell sx={ { fontWeight: 600 } }>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { task.qualityCriteria.map((c) => (
              <TableRow key={ c.id } hover>
                <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ c.id }</TableCell>
                <TableCell sx={ { fontWeight: 500 } }>{ c.label }</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={ c.type }
                    color={ c.type === 'auto' ? 'success' : 'default' }
                    variant="outlined"
                  />
                </TableCell>
                <TableCell sx={ { color: 'text.secondary', fontSize: 13 } }>{ c.description }</TableCell>
              </TableRow>
            )) }
          </TableBody>
        </Table>
      </TableContainer>
    </Box>

    {/* Golden example */}
    <SectionTitle title="Golden Example" description="Expected output sample" />
    <Typography variant="body2" color="text.secondary" sx={ { mb: 1 } }>
      <strong>Input:</strong> { task.goldenExample.inputDescription }
    </Typography>
    <CodeBlock>{ task.goldenExample.expectedOutput }</CodeBlock>

    {/* Workflow */}
    <Box sx={ { mt: 3 } }>
      <SectionTitle title="Workflow" description="Task execution steps" />
      <Box component="ol" sx={ { m: 0, pl: 3 } }>
        { task.workflow.map((step, i) => (
          <Box component="li" key={ i } sx={ { mb: 0.5 } }>
            <Typography variant="body2">{ step }</Typography>
          </Box>
        )) }
      </Box>
    </Box>
  </Box>
);

/* ============================================
 * Story: Overview: all 3 tasks at a glance
 * ============================================ */

export const Overview = {
  render: () => (
    <>
      <DocumentTitle
        title="AI Tasks Overview"
        status="Draft"
        note="System prompts & workflows for Claude API integration"
        brandName="MUSE"
        systemName="AI Tasks"
        version="0.1"
      />
      <PageContainer>
        <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
          AI Tasks
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={ { mb: 4 } }>
          The system prompts and workflows of the 3 tasks MUSE delegates to the Claude API.
          The actual call code imports and uses this data from a separate layer (`scripts/muse-ai/*`).
        </Typography>

        <SectionTitle title="Task Map" description="3 stages: Archiving → Recommendation → Analysis" />
        <TableContainer sx={ { mb: 4 } }>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={ { fontWeight: 600 } }>ID</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>Task</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>Stage</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>Model</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>Input</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>Cost</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { AI_TASKS.map((t) => (
                <TableRow key={ t.id } hover>
                  <TableCell sx={ { fontFamily: 'monospace', fontWeight: 600 } }>{ t.id.toUpperCase() }</TableCell>
                  <TableCell>{ t.name }</TableCell>
                  <TableCell sx={ { fontFamily: 'monospace', fontSize: 12, color: 'text.secondary' } }>{ t.stage }</TableCell>
                  <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ t.model }</TableCell>
                  <TableCell>{ t.input.kind }</TableCell>
                  <TableCell sx={ { fontSize: 12, color: 'text.secondary' } }>
                    { t.estCost.tokensIn } → { t.estCost.tokensOut }
                  </TableCell>
                </TableRow>
              )) }
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle title="Tag Vocabulary by Layer (Preset)" description="Enforced as each layer enum in T1 auto-tagging. No words outside the preset" />
        <Box sx={ { display: 'flex', flexDirection: 'column', gap: 2, mb: 4 } }>
          { TOKEN_LAYERS.map((layer) => (
            <Box key={ layer }>
              <Typography variant="caption" color="text.secondary" sx={ { display: 'block', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'monospace' } }>
                { layer }
              </Typography>
              <Box sx={ { display: 'flex', gap: 0.5, flexWrap: 'wrap' } }>
                { getLayerTags(layer).map((t) => (
                  <Chip key={ t } label={ t } size="small" variant="outlined" />
                )) }
              </Box>
            </Box>
          )) }
          { VISUAL_DIRECTION_CATEGORIES.map((cat) => (
            <Box key={ cat }>
              <Typography variant="caption" color="text.secondary" sx={ { display: 'block', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'monospace' } }>
                visualDirection · { cat }
              </Typography>
              <Box sx={ { display: 'flex', gap: 0.5, flexWrap: 'wrap' } }>
                { getVisualDirectionTags(cat).map((t) => (
                  <Chip key={ t } label={ t } size="small" color="secondary" variant="outlined" />
                )) }
              </Box>
            </Box>
          )) }
        </Box>

        <Divider sx={ { my: 4 } } />

        {/* 3-task detail */}
        { AI_TASKS.map((t) => <TaskDetail key={ t.id } task={ t } />) }
      </PageContainer>
    </>
  ),
};

/* ============================================
 * Story: T1 · T2 · T3 individual details
 * ============================================ */

export const T1AutoTag = {
  name: 'T1 · Auto Tag',
  render: () => (
    <PageContainer>
      <StructuredTaskDetail
        task={ TASK_AUTO_TAG }
        uxFlow={ TASK_COPY.t1.ux }
        dataModel={ TASK_COPY.t1.data }
        inputs={ TASK_COPY.t1.inputs }
        io={ TASK_COPY.t1.io }
      />
    </PageContainer>
  ),
};

export const T2Recommend = {
  name: 'T2 · Recommend',
  render: () => (
    <PageContainer>
      <StructuredTaskDetail
        task={ TASK_RECOMMEND }
        uxFlow={ TASK_COPY.t2.ux }
        dataModel={ TASK_COPY.t2.data }
        inputs={ TASK_COPY.t2.inputs }
        io={ TASK_COPY.t2.io }
      />
    </PageContainer>
  ),
};

export const T3AnalyzeTokens = {
  name: 'T3 · Analyze Tokens',
  render: () => (
    <PageContainer>
      <StructuredTaskDetail
        task={ TASK_ANALYZE_TOKENS }
        uxFlow={ TASK_COPY.t3.ux }
        dataModel={ TASK_COPY.t3.data }
        inputs={ TASK_COPY.t3.inputs }
        io={ TASK_COPY.t3.io }
      />
    </PageContainer>
  ),
};

/* ============================================
 * Story: Workflow: full flow + cost/model summary
 * ============================================ */

export const Workflow = {
  render: () => (
    <>
      <DocumentTitle
        title="AI Workflow"
        status="Draft"
        note="End-to-end AI pipeline for MUSE"
        brandName="MUSE"
        systemName="AI Tasks"
        version="0.1"
      />
      <PageContainer>
        <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
          AI Workflow
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={ { mb: 4 } }>
          The full AI pipeline from user input to Export
        </Typography>

        <SectionTitle title="Flow Diagram" description="Mermaid source" />
        <CodeBlock>{ AI_WORKFLOW_DIAGRAM }</CodeBlock>

        <Box sx={ { mt: 3 } }>
          <SectionTitle title="Entry Point per Stage" />
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={ { fontWeight: 600 } }>Stage</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>Task</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>Trigger</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>archive.upload</TableCell>
                  <TableCell>T1 auto-tagging</TableCell>
                  <TableCell>On completing drag-and-drop/URL input in the archive</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>project.create.step2</TableCell>
                  <TableCell>T2 reference recommendation</TableCell>
                  <TableCell>On entering Step 2 after completing wizard Step 1</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>project.create.step3</TableCell>
                  <TableCell>T3 token analysis</TableCell>
                  <TableCell>On clicking "Start Analysis" in Step 2</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box sx={ { mt: 4 } }>
          <SectionTitle title="Common Operating Principles" />
          <Box component="ul" sx={ { m: 0, pl: 3 } }>
            <Box component="li" sx={ { mb: 1 } }>
              <Typography variant="body2">
                <strong>Tool use enforced</strong>: all 3 tasks produce structured output via a tool use schema rather than coaxing JSON from the prompt alone.
              </Typography>
            </Box>
            <Box component="li" sx={ { mb: 1 } }>
              <Typography variant="body2">
                <strong>Prompt caching</strong>: system prompts are cache hit targets. For T1, batch tagging of 27 images yields large cost savings.
              </Typography>
            </Box>
            <Box component="li" sx={ { mb: 1 } }>
              <Typography variant="body2">
                <strong>Auto-validate then retry once</strong>: on schema/vocab/hex validation failure, automatically call once more. On a second failure, fall back.
              </Typography>
            </Box>
            <Box component="li" sx={ { mb: 1 } }>
              <Typography variant="body2">
                <strong>API key in local env</strong>: no direct calls from the browser. Go through the Node CLI or the Vite dev proxy.
              </Typography>
            </Box>
            <Box component="li" sx={ { mb: 1 } }>
              <Typography variant="body2">
                <strong>Cost guard</strong>: T3 is the most expensive as a Sonnet call based on N images. Initially limited to N ≤ 4.
              </Typography>
            </Box>
          </Box>
        </Box>
      </PageContainer>
    </>
  ),
};
