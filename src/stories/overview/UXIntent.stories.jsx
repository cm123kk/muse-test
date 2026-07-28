import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import {
  DocumentTitle,
  SectionTitle,
} from '../../components/storybookDocumentation';

export default {
  title: 'Overview / UX Intent Map',
  parameters: { layout: 'padded' },
};

const SUPER_THEMES = [
  {
    key: 'T1',
    title: 'No record of why',
    quote: '"DESIGN.md records that \'the button is terracotta,\' but it does not capture why terracotta was chosen. A structure that has the result but is missing the reason."',
    source: 'Kim Eun-su, IBM Research UX Engineer (ZDNet Korea, 2026-04-26)',
  },
  {
    key: 'T2',
    title: 'Monotony of a single input',
    quote: '"Everything looks… the same."',
    source: 'Bitovi (Levi Myers, Google Stitch Review)',
  },
  {
    key: 'T3',
    title: 'Loss of control',
    quote: '"Two prompts for a 12-slide presentation and you are out."',
    source: 'Pasquale Pillitteri / PCWorld (via multiple KR outlets)',
  },
  {
    key: 'T4',
    title: 'AI cannot replace craft',
    quote: '"The future of designers is to design the principles and systems that let AI produce even better results"',
    source: 'Toss Design Team',
  },
];

const TOUCH_POINTS = [
  {
    id: 'TP1 (deprecated)', title: '~~Reference upload chip~~', where: '~~ArchivePage~~',
    before: 'Drop → auto-tagging',
    after: 'Deprecated (2026-04-28): for T1 the image is the source of information. User chips do not improve tagging accuracy. Redundant with TP4 downstream.',
    pain: '-',
    promptVar: '-',
  },
  {
    id: 'TP2', title: 'Project mode selection', where: 'Wizard Step 0',
    before: 'Straight to form',
    after: 'Concept / System cards (basis for all downstream branching)',
    pain: 'T2, T3',
    promptVar: 'projectMode',
  },
  {
    id: 'TP3', title: 'Title + one-line intent', where: 'Wizard Step 1',
    before: 'Empty textarea',
    after: 'IntentGuideField (placeholder + helperText guidance only, maxLength 120)',
    pain: 'T2 keyword matching',
    promptVar: 'intent (T2/T3 input)',
  },
  {
    id: 'TP4', title: 'Card layer chip', where: 'ReferencePicker Step 2',
    before: 'Recommended card add/remove',
    after: 'Per-card Color / Typography / Layout chip (T2 automatic, user manual)',
    pain: 'T3 composition',
    promptVar: 'selectedRefs[].useLayers',
  },
  {
    id: 'Step 3 (NEW)', title: 'Usage Notes (required)', where: 'Wizard Step 3: RefinementNotesField',
    before: '(none: only the TP5 confirmation box existed)',
    after: 'Specify how references will be used after viewing them. minLength varies by mode (concept=0 / system=30). HIGHEST PRIORITY input for T3 composition',
    pain: 'T3 accuracy, craft preservation',
    promptVar: 'userNotes (L4 priority)',
  },
  {
    id: 'TP5 (deprecated)', title: '~~Pre-analysis confirmation box~~', where: '~~Wizard Step 3 AnalysisConfirmBox~~',
    before: 'Separate step',
    after: 'The [Start Analysis →] button at the bottom of Step 3 absorbs the confirm. No separate step needed.',
    pain: '-',
    promptVar: '-',
  },
  {
    id: 'TP6', title: 'Token card source expansion', where: 'ProjectDetailPage 4 token previews',
    before: 'Shows value only',
    after: 'On ? click: source + intent match + user note citation + rejected candidates. Applied to all 4 layers (color/typo/layout/gradient)',
    pain: 'T1 decision tracing',
    promptVar: 'decisionRationale + appliedUserNotes',
  },
];

const PERSONAS = [
  { p: 'P1', label: 'Non-designer PM/founder', need: 'Prototype without a designer', entry: 'TP2 shaping the concept' },
  { p: 'P2', label: 'Senior designer', need: 'Accelerate while preserving craft', entry: 'Curate with TP4 layer chips' },
  { p: 'P3', label: 'Design System engineer', need: 'Avoid 30% loss with token code', entry: 'TP2 System + DTCG export' },
  { p: 'P4', label: 'AI coding heavy user', need: 'AI ignores DESIGN.md', entry: 'TP6 decision tracing + cursorrules' },
];

const METRICS = [
  { metric: 'Average intent input length', before: '<20 chars', after: '>40 chars' },
  { metric: 'Step 2 layer manual change rate', before: '0%', after: '>30%' },
  { metric: 'Token card hover/click rate', before: 'Not measured', after: '>60%' },
  { metric: 'T3 result export rate', before: 'Not measured', after: '↑ 10pp' },
  { metric: '30-day return rate', before: 'Not measured', after: '↑' },
];

export const UXIntentMap = {
  name: 'UX Intent Map',
  render: () => (
    <>
      <DocumentTitle
        title="UX Intent Map: user intent embedded into the UX itself"
        status="Draft"
        note="Integrated narrative of TP1~TP6 + system prompt variables"
        brandName="MUSE"
        systemName="UX Intervention"
        version="0.1"
      />
      <PageContainer>
        <Typography variant="body1" color="text.secondary" sx={ { mb: 3 } }>
          No new large screens. We insert a "why?" question into the 6 existing input points to embed user intent into the UX itself.
          The answers flow into the T1/T2/T3 system prompt variables and raise the level of detail in the results.
        </Typography>

        <SectionTitle title="Four validated super-themes" description="docs/research/02-painpoints-qualitative-analysis.md" />
        <Box sx={ { display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 4 } }>
          { SUPER_THEMES.map((t) => (
            <Box
              key={ t.key }
              sx={ {
                p: 3,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              } }
            >
              <Box sx={ { display: 'flex', alignItems: 'baseline', gap: 1 } }>
                <Chip label={ t.key } size="small" color="primary" />
                <Typography variant="h6" sx={ { fontWeight: 600 } }>{ t.title }</Typography>
              </Box>
              <Typography variant="body2" sx={ { fontStyle: 'italic', color: 'text.primary' } }>
                { t.quote }
              </Typography>
              <Typography variant="caption" sx={ { color: 'text.secondary' } }>
                Source: { t.source }
              </Typography>
            </Box>
          )) }
        </Box>

        <Divider sx={ { my: 4 } } />

        <SectionTitle title="6 touchpoints (TP1~TP6)" description="Places where user intent is inserted into the UX flow" />
        <Box sx={ { display: 'flex', flexDirection: 'column', gap: 2, mb: 4 } }>
          { TOUCH_POINTS.map((tp) => (
            <Box
              key={ tp.id }
              sx={ {
                p: 2.5,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '90px 1fr 1fr 200px' },
                gap: 2,
                alignItems: 'flex-start',
              } }
            >
              <Box>
                <Chip label={ tp.id } size="small" color="primary" variant="filled" sx={ { fontFamily: 'monospace' } } />
                <Typography variant="caption" sx={ { display: 'block', mt: 0.5, color: 'text.secondary' } }>
                  { tp.where }
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={ { fontWeight: 600, mb: 0.5 } }>{ tp.title }</Typography>
                <Box sx={ { display: 'flex', flexDirection: 'column', gap: 0.5 } }>
                  <Typography variant="caption" sx={ { color: 'text.secondary' } }>
                    <strong>Before</strong>: { tp.before }
                  </Typography>
                  <Typography variant="caption" sx={ { color: 'text.primary' } }>
                    <strong>After</strong>: { tp.after }
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Typography variant="caption" sx={ { color: 'text.secondary' } }>Direct pain</Typography>
                <Typography variant="body2">{ tp.pain }</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={ { color: 'text.secondary' } }>system prompt variable</Typography>
                <Typography variant="caption" sx={ { fontFamily: 'monospace', display: 'block', fontSize: 11 } }>
                  { tp.promptVar }
                </Typography>
              </Box>
            </Box>
          )) }
        </Box>

        <Divider sx={ { my: 4 } } />

        <SectionTitle title="Persona entry paths" description="P1~P4 each feel the value at a different TP" />
        <Box sx={ { display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 4 } }>
          { PERSONAS.map((p) => (
            <Box
              key={ p.p }
              sx={ {
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                bgcolor: 'background.paper',
              } }
            >
              <Chip label={ p.p } size="small" sx={ { mb: 1, fontFamily: 'monospace' } } />
              <Typography variant="body2" sx={ { fontWeight: 600 } }>{ p.label }</Typography>
              <Typography variant="caption" sx={ { display: 'block', mt: 0.5, color: 'text.secondary' } }>
                Needs: { p.need }
              </Typography>
              <Typography variant="caption" sx={ { display: 'block', mt: 1, color: 'primary.main', fontWeight: 600 } }>
                ↳ { p.entry }
              </Typography>
            </Box>
          )) }
        </Box>

        <Divider sx={ { my: 4 } } />

        <SectionTitle title="Verifiable metrics" description="Measured after 3 weeks" />
        <Box sx={ { mb: 4 } }>
          { METRICS.map((m, i) => (
            <Box
              key={ i }
              sx={ {
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr',
                gap: 2,
                py: 1,
                borderBottom: i === METRICS.length - 1 ? 'none' : '1px solid',
                borderColor: 'divider',
              } }
            >
              <Typography variant="body2">{ m.metric }</Typography>
              <Typography variant="caption" sx={ { color: 'text.secondary' } }>
                Before: { m.before }
              </Typography>
              <Typography variant="caption" sx={ { color: 'primary.main', fontWeight: 600 } }>
                After: { m.after }
              </Typography>
            </Box>
          )) }
        </Box>

        <Box
          sx={ {
            p: 3,
            bgcolor: 'primary.50',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'primary.main',
          } }
        >
          <Typography variant="h6" sx={ { fontWeight: 700, mb: 1 } }>
            One-line message
          </Typography>
          <Typography variant="body1">
            <strong>"For an AI-made design, tell me why it was made that way."</strong>
          </Typography>
          <Typography variant="caption" sx={ { color: 'text.secondary', display: 'block', mt: 1 } }>
            Throw in 5 photos, and a design system comes out. With the rationale, too.
          </Typography>
        </Box>
      </PageContainer>
    </>
  ),
};
