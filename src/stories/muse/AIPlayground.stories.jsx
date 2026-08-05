import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import {
  checkAnthropicHealth,
  callAnthropic,
  extractToolInput,
  extractText,
  toImageBlock,
  imageUrlToBase64DataUrl,
} from '../../utils/museAi';
import {
  references,
  TASK_AUTO_TAG,
  TASK_RECOMMEND,
  TASK_ANALYZE_TOKENS,
} from '../../data/muse';
import { ColorSwatchList } from '../../components/data-display/ColorSwatchList';
import { TypographyPreview } from '../../components/data-display/TypographyPreview';
import { LayoutTokenPreview } from '../../components/data-display/LayoutTokenPreview';
import { GradientPreview } from '../../components/data-display/GradientPreview';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import Checkbox from '@mui/material/Checkbox';
import {
  DocumentTitle,
  PageContainer,
  SectionTitle,
} from '../../components/storybookDocumentation';

export default {
  title: 'MUSE/AI Playground',
  parameters: { layout: 'padded' },
};

const CodeBlock = ({ children, tone = 'light', maxHeight }) => (
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
      maxHeight,
    } }
  >
    { typeof children === 'string' ? children : JSON.stringify(children, null, 2) }
  </Box>
);

/* ============================================
 * Health Check: Phase A connection verification
 * ============================================ */

export const HealthCheck = {
  name: 'Health Check',
  render: () => {
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const run = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await checkAnthropicHealth();
        setStatus(data);
      } catch (e) {
        setError(e?.message || String(e));
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => { run(); }, []);

    return (
      <>
        <DocumentTitle
          title="AI Health Check"
          status="Playground"
          note="Verifies Supabase Edge Function session is ready"
          brandName="MUSE"
          systemName="AI Playground"
          version="0.1"
        />
        <PageContainer>
          <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
            Health Check
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={ { mb: 3 } }>
            Verifies the session state required to call the Supabase Edge Function <code>anthropic-messages</code>.
            <br />
            The actual Anthropic key exists only in Supabase secrets and is never exposed to the browser.
          </Typography>

          <Box sx={ { display: 'flex', gap: 1, mb: 2 } }>
            <Button variant="contained" onClick={ run } disabled={ isLoading }>
              { isLoading ? 'Checking…' : 'Recheck' }
            </Button>
          </Box>

          { error && <Alert severity="error" sx={ { mb: 2 } }>{ error }</Alert> }

          { status && (
            <>
              { status.hasKey ? (
                <Alert severity="success" sx={ { mb: 2 } }>
                  The API key is loaded on the server side. ({ status.keyPrefix })
                </Alert>
              ) : (
                <Alert severity="warning" sx={ { mb: 2 } }>
                  Could not find the API key. Check that <code>ANTHROPIC_API_KEY</code> is set in <code>.env.local</code>, then restart Storybook.
                </Alert>
              ) }
              <SectionTitle title="Raw Response" />
              <CodeBlock>{ status }</CodeBlock>
            </>
          ) }
        </PageContainer>
      </>
    );
  },
};

/* ============================================
 * T1 · Auto Tag: tagging a single image
 * ============================================ */

const MODEL_OPTIONS = [
  { value: 'claude-haiku-4-5', label: 'Haiku 4.5 (cheap, fast)' },
  { value: 'claude-sonnet-4-6', label: 'Sonnet 4.6 (balanced)' },
  { value: 'claude-opus-4-7', label: 'Opus 4.7 (highest quality)' },
];

export const T1AutoTag = {
  name: 'T1 · Auto Tag',
  render: () => {
    const [selectedId, setSelectedId] = useState(references[0]?.id);
    const [model, setModel] = useState(TASK_AUTO_TAG.model);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const [raw, setRaw] = useState(null);
    const [elapsed, setElapsed] = useState(null);

    const selected = references.find((r) => r.id === selectedId);

    const run = async () => {
      if (!selected) return;
      setIsLoading(true);
      setError(null);
      setResult(null);
      setRaw(null);
      setElapsed(null);
      const start = performance.now();
      try {
        // Vite import URL to base64 dataURL (Anthropic image block)
        const dataUrl = await imageUrlToBase64DataUrl(selected.thumbnailUrl);
        const imageBlock = toImageBlock(dataUrl);
        if (!imageBlock) throw new Error('Failed to build image block');

        const response = await callAnthropic({
          model,
          max_tokens: 512,
          system: TASK_AUTO_TAG.systemPrompt,
          tools: [TASK_AUTO_TAG.toolSchema],
          tool_choice: { type: 'tool', name: TASK_AUTO_TAG.toolSchema.name },
          messages: [
            {
              role: 'user',
              content: [
                imageBlock,
                { type: 'text', text: TASK_AUTO_TAG.userMessageTemplate },
              ],
            },
          ],
        });

        setRaw(response);
        const toolInput = extractToolInput(response, TASK_AUTO_TAG.toolSchema.name);
        if (!toolInput) {
          throw new Error(`No tool use response. text: ${extractText(response) || '(empty)'}`);
        }
        setResult(toolInput);
      } catch (e) {
        setError(e?.message || String(e));
      } finally {
        setElapsed(Math.round(performance.now() - start));
        setIsLoading(false);
      }
    };

    return (
      <>
        <DocumentTitle
          title="T1 · Auto Tag"
          status="Playground"
          note="Live test: image → tags / dominantColors / title"
          brandName="MUSE"
          systemName="AI Playground"
          version="0.1"
        />
        <PageContainer>
          <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
            T1 · Auto Tag
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={ { mb: 3 } }>
            { TASK_AUTO_TAG.purpose }
          </Typography>

          {/* Controls */}
          <Box sx={ { display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' } }>
            <FormControl size="small" sx={ { minWidth: 160 } }>
              <InputLabel>Reference</InputLabel>
              <Select
                label="Reference"
                value={ selectedId }
                onChange={ (e) => setSelectedId(e.target.value) }
              >
                { references.map((r) => (
                  <MenuItem key={ r.id } value={ r.id }>{ r.id } · { r.title }</MenuItem>
                )) }
              </Select>
            </FormControl>
            <FormControl size="small" sx={ { minWidth: 240 } }>
              <InputLabel>Model</InputLabel>
              <Select
                label="Model"
                value={ model }
                onChange={ (e) => setModel(e.target.value) }
              >
                { MODEL_OPTIONS.map((m) => (
                  <MenuItem key={ m.value } value={ m.value }>{ m.label }</MenuItem>
                )) }
              </Select>
            </FormControl>
            <Button variant="contained" onClick={ run } disabled={ isLoading }>
              { isLoading ? <><CircularProgress size={ 16 } sx={ { mr: 1 } } /> Analyzing… </> : 'Run Analysis' }
            </Button>
            { elapsed != null && (
              <Typography variant="caption" color="text.secondary">
                { elapsed } ms
              </Typography>
            ) }
          </Box>

          { error && <Alert severity="error" sx={ { mb: 3 } }>{ error }</Alert> }

          {/* Compare: Image vs Result */}
          <Box sx={ { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 3 } }>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={ { display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: '0.08em' } }>
                Input Image
              </Typography>
              { selected && (
                <>
                  <Box
                    component="img"
                    src={ selected.thumbnailUrl }
                    alt={ selected.title }
                    sx={ {
                      width: '100%',
                      aspectRatio: '4 / 3',
                      objectFit: 'cover',
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: 'divider',
                    } }
                  />
                  <Typography variant="caption" sx={ { display: 'block', mt: 1, fontFamily: 'monospace', color: 'text.secondary' } }>
                    { selected.id } · { selected.title }
                  </Typography>
                </>
              ) }
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary" sx={ { display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: '0.08em' } }>
                AI Output
              </Typography>

              { !result && !isLoading && (
                <Typography variant="body2" color="text.secondary">
                  Press Run Analysis
                </Typography>
              ) }

              { result && (
                <>
                  <Box sx={ { mb: 2 } }>
                    <Typography variant="overline" color="text.secondary">Title</Typography>
                    <Typography variant="h6" sx={ { fontWeight: 600 } }>{ result.title }</Typography>
                  </Box>

                  {/* Tags per 5 layers */}
                  <Box sx={ { mb: 2, display: 'flex', flexDirection: 'column', gap: 1 } }>
                    <Typography variant="overline" color="text.secondary">Layered Tags</Typography>
                    { ['color', 'typography', 'layout', 'gradient'].map((layer) => {
                      const list = result.tags?.[layer] || [];
                      if (!list.length) return null;
                      return (
                        <Box key={ layer } sx={ { display: 'flex', alignItems: 'center', gap: 1 } }>
                          <Typography variant="caption" color="text.secondary" sx={ { minWidth: 84, fontFamily: 'monospace' } }>
                            { layer }
                          </Typography>
                          <Box sx={ { display: 'flex', gap: 0.5, flexWrap: 'wrap' } }>
                            { list.map((t) => (
                              <Chip key={ t } label={ t } size="small" color="primary" variant="outlined" />
                            )) }
                          </Box>
                        </Box>
                      );
                    }) }
                    { result.tags?.visualDirection && Object.entries(result.tags.visualDirection).map(([cat, list]) => (
                      list?.length > 0 && (
                        <Box key={ cat } sx={ { display: 'flex', alignItems: 'center', gap: 1 } }>
                          <Typography variant="caption" color="text.secondary" sx={ { minWidth: 84, fontFamily: 'monospace' } }>
                            vd.{ cat }
                          </Typography>
                          <Box sx={ { display: 'flex', gap: 0.5, flexWrap: 'wrap' } }>
                            { list.map((t) => (
                              <Chip key={ t } label={ t } size="small" color="secondary" variant="outlined" />
                            )) }
                          </Box>
                        </Box>
                      )
                    )) }
                  </Box>

                  <Box sx={ { mb: 2 } }>
                    <Typography variant="overline" color="text.secondary">Dominant Colors</Typography>
                    <Box sx={ { display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' } }>
                      { (result.dominantColors || []).map((hex) => (
                        <Box
                          key={ hex }
                          sx={ {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.75,
                            px: 1.25,
                            py: 0.5,
                            borderRadius: 999,
                            border: '1px solid',
                            borderColor: 'divider',
                          } }
                        >
                          <Box sx={ { width: 16, height: 16, borderRadius: '50%', bgcolor: hex } } />
                          <Typography variant="caption" sx={ { fontFamily: 'monospace' } }>{ hex }</Typography>
                        </Box>
                      )) }
                    </Box>
                  </Box>

                  <Typography variant="overline" color="text.secondary">Raw JSON</Typography>
                  <CodeBlock maxHeight={ 240 }>{ result }</CodeBlock>
                </>
              ) }
            </Box>
          </Box>

          {/* Golden comparison */}
          <SectionTitle title="Golden Example" description="Expected output defined in aiTasks.js (for reference)" />
          <CodeBlock>{ TASK_AUTO_TAG.goldenExample.expectedOutput }</CodeBlock>

          {/* Raw API response (debug) */}
          { raw && (
            <Box sx={ { mt: 3 } }>
              <SectionTitle title="Raw API Response" description="For debugging: all content blocks" />
              <CodeBlock tone="dark" maxHeight={ 320 }>{ raw }</CodeBlock>
            </Box>
          ) }
        </PageContainer>
      </>
    );
  },
};

/* ============================================
 * T2 · Recommend: intent sentence to top-N reference recommendations (text only, cheap)
 * ============================================ */

/** Compresses an archive Reference into T2 input meta form (no images) */
const toRecommendMeta = (r) => ({
  id: r.id,
  title: r.title,
  tags: r.tags,
  dominantColors: r.dominantColors,
});

export const T2Recommend = {
  name: 'T2 · Recommend',
  render: () => {
    const [intent, setIntent] = useState('Black-and-white contrast magazine tone, large typography focused');
    const [n, setN] = useState(6);
    const [model, setModel] = useState(TASK_RECOMMEND.model);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const [elapsed, setElapsed] = useState(null);

    const run = async () => {
      setIsLoading(true);
      setError(null);
      setResult(null);
      setElapsed(null);
      const start = performance.now();
      try {
        const archive = references.map(toRecommendMeta);
        const userText = TASK_RECOMMEND.userMessageTemplate
          .replace('{{intent}}', intent)
          .replace('{{n}}', String(n))
          .replace('{{archiveCount}}', String(archive.length))
          .replace('{{archiveJson}}', JSON.stringify(archive, null, 2));

        const response = await callAnthropic({
          model,
          max_tokens: 1024,
          system: TASK_RECOMMEND.systemPrompt,
          tools: [TASK_RECOMMEND.toolSchema],
          tool_choice: { type: 'tool', name: TASK_RECOMMEND.toolSchema.name },
          messages: [{ role: 'user', content: userText }],
        });

        const toolInput = extractToolInput(response, TASK_RECOMMEND.toolSchema.name);
        if (!toolInput) throw new Error(`No tool use response. text: ${extractText(response) || '(empty)'}`);
        setResult(toolInput);
      } catch (e) {
        setError(e?.message || String(e));
      } finally {
        setElapsed(Math.round(performance.now() - start));
        setIsLoading(false);
      }
    };

    const reasonById = new Map((result?.reasons || []).map((r) => [r.id, r.reason]));

    return (
      <>
        <DocumentTitle
          title="T2 · Recommend"
          status="Playground"
          note="Live test: intent → top-N references (text only, no images)"
          brandName="MUSE"
          systemName="AI Playground"
          version="0.1"
        />
        <PageContainer>
          <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
            T2 · Recommend
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={ { mb: 3 } }>
            { TASK_RECOMMEND.purpose } · cheapest since no images are sent
          </Typography>

          {/* Controls */}
          <Box sx={ { display: 'flex', flexDirection: 'column', gap: 2, mb: 3 } }>
            <TextField
              label="Project Intent"
              value={ intent }
              onChange={ (e) => setIntent(e.target.value) }
              fullWidth
              multiline
              rows={ 2 }
            />
            <Box sx={ { display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' } }>
              <Box sx={ { display: 'flex', alignItems: 'center', gap: 1, minWidth: 220 } }>
                <Typography variant="caption" color="text.secondary">N</Typography>
                <Slider value={ n } onChange={ (_, v) => setN(v) } min={ 5 } max={ 10 } step={ 1 } marks valueLabelDisplay="auto" sx={ { maxWidth: 160 } } />
                <Typography variant="body2" sx={ { fontFamily: 'monospace', minWidth: 16 } }>{ n }</Typography>
              </Box>
              <FormControl size="small" sx={ { minWidth: 220 } }>
                <InputLabel>Model</InputLabel>
                <Select label="Model" value={ model } onChange={ (e) => setModel(e.target.value) }>
                  { MODEL_OPTIONS.map((m) => <MenuItem key={ m.value } value={ m.value }>{ m.label }</MenuItem>) }
                </Select>
              </FormControl>
              <Button variant="contained" onClick={ run } disabled={ isLoading || !intent.trim() }>
                { isLoading ? <><CircularProgress size={ 16 } sx={ { mr: 1 } } /> Recommending… </> : 'Run Recommendation' }
              </Button>
              { elapsed != null && <Typography variant="caption" color="text.secondary">{ elapsed } ms</Typography> }
            </Box>
          </Box>

          { error && <Alert severity="error" sx={ { mb: 3 } }>{ error }</Alert> }

          {/* Results: recommended thumbnail grid */}
          { result && (
            <>
              <SectionTitle title={ `Top ${result.recommendedIds?.length || 0} Recommended` } description="ranked best-first" />
              <Box sx={ { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 2, mb: 3 } }>
                { (result.recommendedIds || []).map((id, rank) => {
                  const ref = references.find((r) => r.id === id);
                  if (!ref) return null;
                  const reason = reasonById.get(id);
                  return (
                    <Box key={ id }>
                      <Box sx={ { position: 'relative' } }>
                        <Box
                          component="img"
                          src={ ref.thumbnailUrl }
                          alt={ ref.title }
                          sx={ { width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 2, border: '1px solid', borderColor: 'divider' } }
                        />
                        <Chip label={ `#${rank + 1}` } size="small" color="primary" sx={ { position: 'absolute', top: 8, left: 8 } } />
                      </Box>
                      <Typography variant="caption" sx={ { display: 'block', mt: 1, fontFamily: 'monospace', color: 'text.secondary' } }>{ id }</Typography>
                      <Typography variant="body2" sx={ { fontWeight: 500 } }>{ ref.title }</Typography>
                      { reason && (
                        <Typography variant="caption" color="text.secondary" sx={ { display: 'block', mt: 0.5 } }>
                          { reason }
                        </Typography>
                      ) }
                    </Box>
                  );
                }) }
              </Box>

              <SectionTitle title="Raw JSON" />
              <CodeBlock maxHeight={ 280 }>{ result }</CodeBlock>
            </>
          ) }
        </PageContainer>
      </>
    );
  },
};

/* ============================================
 * T3 · Analyze Tokens + Visual Direction (2-tool pattern)
 * ============================================ */

const resizeDataUrl = async (dataUrl, maxDim = 512) => {
  // Resize for T3 input. Default 512px (T1 is the primary signal, the image is verification)
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
};

export const T3AnalyzeTokens = {
  name: 'T3 · Analyze Tokens + VD',
  render: () => {
    const [intent, setIntent] = useState('Black-and-white contrast magazine tone, large typography focused');
    const [model, setModel] = useState(TASK_ANALYZE_TOKENS.model);
    const [selectedIds, setSelectedIds] = useState(new Set([references[0]?.id, references[4]?.id, references[9]?.id]));
    // Phase 0 verification: to measure the effect of Step 3 usage notes (L4 userNotes)
    const [userNotes, setUserNotes] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [tokensResult, setTokensResult] = useState(null);
    const [vdResult, setVdResult] = useState(null);
    const [elapsed, setElapsed] = useState(null);
    const [raw, setRaw] = useState(null);

    const toggleSelect = (id) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else if (next.size < 4) next.add(id); // Limit to a maximum of 4 images
        return next;
      });
    };

    const run = async () => {
      setIsLoading(true);
      setError(null);
      setTokensResult(null);
      setVdResult(null);
      setElapsed(null);
      setRaw(null);
      const start = performance.now();
      try {
        const selectedRefs = references.filter((r) => selectedIds.has(r.id));
        if (!selectedRefs.length) throw new Error('Select at least 1 image');

        // No images: send only the pre-extracted data
        const extractedPool = selectedRefs.map((ref) => ({
          id: ref.id,
          title: ref.title || null,
          tags: ref.tags || {},
          dominantColors: ref.dominantColors || [],
          extracted: ref.extracted || {},
        }));

        // Phase 0 verification: if userNotes exist, add a Progressive Narrowing block (do not touch the production system prompt, inject only at the end of the user message)
        const userNotesBlock = userNotes && userNotes.trim().length >= 10
          ? `\n\n=== USER NOTES (HIGHEST PRIORITY, L4) ===
After seeing the actual references, the user added these refinement notes:
"${userNotes.trim()}"

Treat these as USER REQUIREMENTS, NOT suggestions.
- When L4 conflicts with the initial intent above, L4 WINS.
- When L4 explicitly mentions a ref-id (e.g. "make ref-002 color the primary"), apply directly.
- For each token influenced by L4, include a "decisionRationale.appliedUserNotes" field
  with the relevant 10-30 char fragment from the user notes (verbatim).
- For tokens NOT influenced by L4, omit appliedUserNotes (do not echo across all tokens).`
          : '';

        const content = [
          {
            type: 'text',
            text: `=== Pre-extracted references (${selectedRefs.length}) ===

${JSON.stringify(extractedPool, null, 2)}

=== End of references ===`,
          },
          {
            type: 'text',
            text: TASK_ANALYZE_TOKENS.userMessageTemplate
              .replace('{{intent}}', intent)
              .replace('{{count}}', String(selectedRefs.length))
              .replace('{{ids}}', selectedRefs.map((r) => r.id).join(', '))
              + userNotesBlock,
          },
        ];

        // Tokens and visual direction are now two separate tool calls (run in parallel),
        // matching runAnalyzeTokens. toolSchemas = [core, visualDirection, designmd].
        const [coreSchema, vdSchema] = TASK_ANALYZE_TOKENS.toolSchemas;
        const [response, vdResponse] = await Promise.all([
          callAnthropic({
            model,
            max_tokens: 8192,
            system: TASK_ANALYZE_TOKENS.systemPrompt,
            tools: [coreSchema],
            tool_choice: { type: 'tool', name: coreSchema.name },
            messages: [{ role: 'user', content }],
          }),
          callAnthropic({
            model,
            max_tokens: 2048,
            system: TASK_ANALYZE_TOKENS.systemPrompt,
            tools: [vdSchema],
            tool_choice: { type: 'tool', name: vdSchema.name },
            messages: [{ role: 'user', content }],
          }),
        ]);

        setRaw(response);
        const input = extractToolInput(response, coreSchema.name);
        setTokensResult(input?.tokens || null);
        setVdResult(extractToolInput(vdResponse, vdSchema.name) || null);

        if (!input) {
          throw new Error(`No tool use response. text: ${extractText(response) || '(empty)'}`);
        }
      } catch (e) {
        setError(e?.message || String(e));
      } finally {
        setElapsed(Math.round(performance.now() - start));
        setIsLoading(false);
      }
    };

    return (
      <>
        <DocumentTitle
          title="T3 · Analyze Tokens + Visual Direction"
          status="Playground"
          note="Live test: images + intent → 4 token layers + MD"
          brandName="MUSE"
          systemName="AI Playground"
          version="0.1"
        />
        <PageContainer>
          <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
            T3 · Analyze Tokens + VD
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={ { mb: 3 } }>
            { TASK_ANALYZE_TOKENS.purpose } · no images (based on T1 extracted) · Haiku · tokens + visual direction in parallel calls
          </Typography>

          {/* Phase 0 verification info box */}
          <Box
            sx={ {
              p: 2,
              mb: 3,
              borderRadius: 1.5,
              border: '1px dashed',
              borderColor: 'warning.main',
              bgcolor: 'warning.50',
            } }
          >
            <Typography variant="caption" sx={ { fontWeight: 700, color: 'warning.dark', display: 'block', mb: 1 } }>
              🧪 Phase 0 Verification: measuring the effect of Step 3 (Usage Notes)
            </Typography>
            <Typography variant="body2" sx={ { fontSize: '0.85rem', mb: 1.5 } }>
              Call 3 times with the same references and same intent, changing only <strong>userNotes</strong>, then compare results:
            </Typography>
            <Box component="ul" sx={ { m: 0, pl: 2.5, fontSize: '0.85rem' } }>
              <li><strong>case A</strong>: userNotes empty (current default behavior)</li>
              <li><strong>case B</strong>: userNotes = "make ref-002 color the primary"</li>
              <li><strong>case C</strong>: userNotes = "emphasize ref-005 grid layout, make typography lighter"</li>
            </Box>
            <Typography variant="caption" sx={ { display: 'block', mt: 1, color: 'text.secondary' } }>
              Checkpoints: do tokens.color[primary], tokens.layout, tokens.typography differ per case? Does decisionRationale output an appliedUserNotes field?
            </Typography>
          </Box>

          {/* Controls */}
          <Box sx={ { display: 'flex', flexDirection: 'column', gap: 2, mb: 3 } }>
            <TextField label="Project Intent (L2)" value={ intent } onChange={ (e) => setIntent(e.target.value) } fullWidth multiline rows={ 2 } />
            <TextField
              label="🧪 Usage Notes / userNotes (L4): for Phase 0 verification"
              placeholder='e.g. "make ref-002 color the primary" / "emphasize ref-005 grid, lighter typography" / leave empty for case A'
              value={ userNotes }
              onChange={ (e) => setUserNotes(e.target.value) }
              fullWidth
              multiline
              rows={ 3 }
              helperText={ `${userNotes.length} chars / must be 10+ chars to activate. Empty = case A (same as existing behavior)` }
              inputProps={ { maxLength: 400 } }
            />
            <Box sx={ { display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' } }>
              <FormControl size="small" sx={ { minWidth: 220 } }>
                <InputLabel>Model</InputLabel>
                <Select label="Model" value={ model } onChange={ (e) => setModel(e.target.value) }>
                  { MODEL_OPTIONS.map((m) => <MenuItem key={ m.value } value={ m.value }>{ m.label }</MenuItem>) }
                </Select>
              </FormControl>
              <Button variant="contained" onClick={ run } disabled={ isLoading || selectedIds.size === 0 }>
                { isLoading ? <><CircularProgress size={ 16 } sx={ { mr: 1 } } /> Analyzing… </> : `Run Analysis · ${selectedIds.size} images` }
              </Button>
              { elapsed != null && <Typography variant="caption" color="text.secondary">{ elapsed } ms</Typography> }
            </Box>
          </Box>

          {/* Reference picker (up to 4 images) */}
          <SectionTitle title="Select References" description="Up to 4 images (to save cost)" />
          <Box sx={ { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 1.5, mb: 3, maxHeight: 320, overflow: 'auto', p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 2 } }>
            { references.map((ref) => {
              const isSelected = selectedIds.has(ref.id);
              return (
                <Box
                  key={ ref.id }
                  onClick={ () => toggleSelect(ref.id) }
                  sx={ {
                    position: 'relative',
                    cursor: 'pointer',
                    borderRadius: 2,
                    overflow: 'hidden',
                    outline: isSelected ? '2px solid' : 'none',
                    outlineColor: 'primary.main',
                  } }
                >
                  <Box component="img" src={ ref.thumbnailUrl } alt={ ref.title }
                    sx={ { width: '100%', aspectRatio: '1/1', objectFit: 'cover', display: 'block', opacity: isSelected ? 1 : 0.7 } } />
                  <Checkbox checked={ isSelected } size="small" sx={ { position: 'absolute', top: 2, left: 2, bgcolor: 'background.paper', borderRadius: '50%', p: 0.25 } } />
                  <Typography variant="caption" sx={ { position: 'absolute', bottom: 4, left: 4, px: 0.5, bgcolor: 'rgba(20,19,43,0.7)', color: 'white', borderRadius: 0.5, fontSize: 10 } }>
                    { ref.id }
                  </Typography>
                </Box>
              );
            }) }
          </Box>

          { error && <Alert severity="error" sx={ { mb: 3 } }>{ error }</Alert> }

          {/* Results */}
          { (tokensResult || vdResult) && (
            <>
              {/* Tokens preview: using the real preview components */}
              { tokensResult && (
                <>
                  <SectionTitle title="Token Layers (submit_design_system_core)" description="Instant preview of 4 layers" />
                  <Box sx={ { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 } }>
                    { tokensResult.color?.length > 0 && (
                      <Box>
                        <Typography variant="overline">color</Typography>
                        <ColorSwatchList tokens={ tokensResult.color } onChange={ () => {} } />
                      </Box>
                    ) }
                    { tokensResult.typography?.length > 0 && (
                      <Box>
                        <Typography variant="overline">typography</Typography>
                        <TypographyPreview tokens={ tokensResult.typography } onChange={ () => {} } />
                      </Box>
                    ) }
                    { tokensResult.layout?.length > 0 && (
                      <Box>
                        <Typography variant="overline">layout</Typography>
                        <LayoutTokenPreview tokens={ tokensResult.layout } onChange={ () => {} } />
                      </Box>
                    ) }
                    { tokensResult.gradient?.length > 0 && (
                      <Box>
                        <Typography variant="overline">gradient</Typography>
                        <GradientPreview tokens={ tokensResult.gradient } onChange={ () => {} } />
                      </Box>
                    ) }
                  </Box>
                </>
              ) }

              {/* Visual Direction MD */}
              { vdResult && (
                <>
                  <SectionTitle title="Visual Direction (submit_visual_direction)" description="MD document + aggregated tags" />
                  { vdResult.tags && (
                    <Box sx={ { display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 } }>
                      { Object.entries(vdResult.tags).flatMap(([cat, list]) =>
                        (list || []).map((t) => (
                          <Chip key={ `${cat}-${t}` } size="small" label={ `${cat}:${t}` } variant="outlined" />
                        )),
                      ) }
                    </Box>
                  ) }
                  <Box
                    component="pre"
                    sx={ {
                      m: 0, p: 2.5, bgcolor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'divider',
                      fontSize: 13, lineHeight: 1.7, fontFamily: 'inherit', whiteSpace: 'pre-wrap', maxHeight: 480, overflow: 'auto', mb: 3,
                    } }
                  >
                    { vdResult.markdown }
                  </Box>
                </>
              ) }

              {/* Raw debug */}
              { raw && (
                <>
                  <SectionTitle title="Raw API Response" description="Debug: all content blocks" />
                  <CodeBlock tone="dark" maxHeight={ 320 }>{ raw }</CodeBlock>
                </>
              ) }
            </>
          ) }
        </PageContainer>
      </>
    );
  },
};
