import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Masonry from '@mui/lab/Masonry';
import { ReferenceCard } from './ReferenceCard';
import { URL_BY_BASENAME, getExampleByBasename } from '../../utils/exampleImageTokens.js';

/* Convert every basename in exampleTokens into a demo entry (same pool as the hero) */
const ALL_EXAMPLES = Object.keys(URL_BY_BASENAME)
  .map(getExampleByBasename)
  .filter(Boolean);

const SAMPLE = ALL_EXAMPLES[0] || {
  src: '',
  title: 'Sample Reference',
  tags: ['minimal', 'editorial'],
  dominantColors: ['#1a1a1a', '#f5f5f5'],
};

export default {
  title: 'Component/3. Card/ReferenceCard',
  component: ReferenceCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## ReferenceCard

An \`ImageCard\` composition wrapper. Branches based on the \`state\` machine (0|1|2):

| state | Screen |
|-------|------|
| **0** | Just uploaded: image only (tags / colors / title empty) |
| **1** | Analyzing: ImageCard + \`LayerAnalysisStrip\` at the bottom |
| **2** | Done: ImageCard filled with tags / dominantColors / title, strip removed |

Used with the same appearance everywhere a *reference being analyzed* is needed:
landing Solution Stage 1, the archive _tagInProgress card, T1 progress display, and more.

### Sequence usage example
When used with the \`useStaggeredSequence\` hook, you can build an analysis demo where
multiple cards progress 0 → 1 → 2 with staggered timing (see the Sequence story).
        `,
      },
    },
  },
  argTypes: {
    src: { control: 'text' },
    title: { control: 'text' },
    tags: { control: 'object' },
    dominantColors: { control: 'object' },
    state: {
      control: { type: 'select' },
      options: [0, 1, 2],
      description: '0=empty card / 1=analyzing / 2=done',
    },
    layerStatuses: { control: 'object' },
    layerLabels: { control: 'object' },
    mediaRatio: { control: 'text' },
  },
};

const CardSlot = ({ children }) => (
  <Box sx={ { width: 320, maxWidth: '100%' } }>{ children }</Box>
);

/** Docs: manipulate props from the Storybook controls */
export const Docs = {
  args: {
    src: SAMPLE.src,
    title: SAMPLE.title,
    tags: SAMPLE.tags,
    dominantColors: SAMPLE.dominantColors,
    state: 1,
    analyzingVariant: 'strip',
    layerStatuses: ['done', 'done', 'running', 'pending', 'pending'],
  },
  render: (args) => <CardSlot><ReferenceCard { ...args } /></CardSlot>,
};

/** State 0: just uploaded */
export const State0 = {
  args: {
    src: SAMPLE.src,
    title: SAMPLE.title,
    tags: SAMPLE.tags,
    dominantColors: SAMPLE.dominantColors,
    state: 0,
  },
  render: (args) => <CardSlot><ReferenceCard { ...args } /></CardSlot>,
};

/** State 1 strip: analyzing (strip variant for the landing demo) */
export const State1Strip = {
  args: {
    src: SAMPLE.src,
    title: SAMPLE.title,
    state: 1,
    analyzingVariant: 'strip',
    layerStatuses: ['done', 'done', 'done', 'running', 'pending'],
  },
  render: (args) => <CardSlot><ReferenceCard { ...args } /></CardSlot>,
};

/** State 1 chip: analyzing (compact production chip variant) */
export const State1Chip = {
  args: {
    src: SAMPLE.src,
    title: SAMPLE.title,
    state: 1,
    analyzingVariant: 'chip',
  },
  render: (args) => <CardSlot><ReferenceCard { ...args } /></CardSlot>,
};

/** Error: tagging failed + retry chip */
export const Error = {
  args: {
    src: SAMPLE.src,
    title: SAMPLE.title,
    state: 2,
    errorMessage: 'Anthropic API rate limit exceeded',
    onRetry: () => alert('retry'),
  },
  render: (args) => <CardSlot><ReferenceCard { ...args } /></CardSlot>,
};

/** State 2: done (tags + colors shown) */
export const State2 = {
  args: {
    src: SAMPLE.src,
    title: SAMPLE.title,
    tags: SAMPLE.tags,
    dominantColors: SAMPLE.dominantColors,
    state: 2,
  },
  render: (args) => <CardSlot><ReferenceCard { ...args } /></CardSlot>,
};

/** Sequence: auto demo of 0 -> 1 -> 2 via setInterval */
function SequenceDemo({ src, title, tags, dominantColors }) {
  const LAYER_LABELS = ['Color', 'Typography', 'Layout', 'Gradient', 'Visual Direction'];
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % 14), 400);
    return () => clearInterval(id);
  }, []);

  // 0..1: state 0
  // 2..11: state 1, gradual layerStatuses progression (5 layers × 2 ticks each)
  // 12..13: state 2
  let state = 0;
  let layerStatuses;
  if (tick >= 2 && tick < 12) {
    state = 1;
    const progress = tick - 2; // 0..9
    layerStatuses = LAYER_LABELS.map((_, i) => {
      const start = i * 2;
      const end = start + 2;
      if (progress < start) return 'pending';
      if (progress < end) return 'running';
      return 'done';
    });
  } else if (tick >= 12) {
    state = 2;
  }

  return (
    <CardSlot>
      <ReferenceCard
        src={ src }
        title={ title }
        tags={ tags }
        dominantColors={ dominantColors }
        state={ state }
        analyzingVariant="strip"
        layerStatuses={ layerStatuses }
      />
    </CardSlot>
  );
}

export const Sequence = {
  args: {
    src: SAMPLE.src,
    title: SAMPLE.title,
    tags: SAMPLE.tags,
    dominantColors: SAMPLE.dominantColors,
  },
  render: (args) => <SequenceDemo { ...args } />,
};

/** AllExamples: all example images used in the hero shown as a grid (state 2 = completed catalog) */
export const AllExamples = {
  parameters: {
    docs: {
      description: {
        story: `Mounts **all ${ ALL_EXAMPLES.length }** references from the \`src/assets/example/*\` pool as cards in \`state=2\` (done). The actual T1 results (tags / dominantColors / title) from \`exampleTokens.json\` are shown as-is, serving as an analysis result catalog for the same data pool as the hero scatter / Stage 1 demo.`,
      },
    },
  },
  render: () => (
    <Box>
      <Typography
        variant="caption"
        sx={ {
          display: 'block',
          fontFamily: 'monospace',
          fontSize: '0.7rem',
          letterSpacing: '0.18em',
          color: 'text.secondary',
          mb: 2,
        } }
      >
        { ALL_EXAMPLES.length } REFERENCES · TAGGED
      </Typography>
      <Masonry columns={ { xs: 2, sm: 3, md: 3, lg: 4, xl: 6 } } spacing={ 2 }>
        { ALL_EXAMPLES.map((ex) => (
          <ReferenceCard
            key={ ex.src }
            src={ ex.src }
            title={ ex.title }
            tags={ ex.tags }
            dominantColors={ ex.dominantColors }
            state={ 2 }
          />
        )) }
      </Masonry>
    </Box>
  ),
};

/** AllExamplesAnalyzing: the same pool in state=1 (analyzing), with staggered progress */
export const AllExamplesAnalyzing = {
  parameters: {
    docs: {
      description: {
        story: 'Mounts the same example pool in \`state=1\` (analyzing). Each card shows the strip with a different progress (1/5 to 5/5).',
      },
    },
  },
  render: () => {
    const STATUSES_BY_PROGRESS = (done) => Array.from({ length: 5 }, (_, i) => {
      if (i < done) return 'done';
      if (i === done) return 'running';
      return 'pending';
    });
    return (
      <Box>
        <Typography
          variant="caption"
          sx={ {
            display: 'block',
            fontFamily: 'monospace',
            fontSize: '0.7rem',
            letterSpacing: '0.18em',
            color: 'text.secondary',
            mb: 2,
          } }
        >
          { ALL_EXAMPLES.length } REFERENCES · ANALYZING
        </Typography>
        <Masonry columns={ { xs: 2, sm: 3, md: 3, lg: 4, xl: 6 } } spacing={ 2 }>
          { ALL_EXAMPLES.map((ex, i) => (
            <ReferenceCard
              key={ ex.src }
              src={ ex.src }
              title={ ex.title }
              tags={ ex.tags }
              dominantColors={ ex.dominantColors }
              state={ 1 }
              analyzingVariant="strip"
              layerStatuses={ STATUSES_BY_PROGRESS(i % 5) }
            />
          )) }
        </Masonry>
      </Box>
    );
  },
};
