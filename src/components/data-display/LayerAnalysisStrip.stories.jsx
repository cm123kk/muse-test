import Box from '@mui/material/Box';
import { LayerAnalysisStrip } from './LayerAnalysisStrip';

export default {
  title: 'Component/5. Data Display/LayerAnalysisStrip',
  component: LayerAnalysisStrip,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## LayerAnalysisStrip

A lightweight progress strip attached below a Reference or media card. Used where the fullscreen
Variant of \`AnalysisProgress\` feels too heavy (card footer, inline demo). Because it follows a
**normal stack flow rather than an overlay**, it sits naturally beneath the card instead of floating on top.

### Structure
\`\`\`
ANALYZING n/N
[━━━━━━━━━━] LinearProgress 2px
✓ Color
◯ Typography  ← spinner (running)
○ Layout      ← muted (pending)
○ Gradient
○ Visual Direction
\`\`\`

### Usage
- \`ReferenceCard\` (state=1, analyzingVariant='strip')
- Landing Solution Stage 1
- Any location that needs a T1 progress indicator
        `,
      },
    },
  },
  argTypes: {
    layerStatuses: {
      control: 'object',
      description: "('pending'|'running'|'done')[] status per Layer",
    },
    layerLabels: {
      control: 'object',
      description: 'Layer label array',
    },
    headerLabel: {
      control: 'text',
      description: 'Top monospace label',
    },
  },
};

const Wrap = ({ children }) => (
  <Box sx={ { width: 320, maxWidth: '100%' } }>{ children }</Box>
);

/** All layers pending, before entering */
export const Docs = {
  args: {
    layerStatuses: ['pending', 'pending', 'pending', 'pending', 'pending'],
  },
  render: (args) => <Wrap><LayerAnalysisStrip { ...args } /></Wrap>,
};

/** Only the first layer running */
export const Starting = {
  args: {
    layerStatuses: ['running', 'pending', 'pending', 'pending', 'pending'],
  },
  render: (args) => <Wrap><LayerAnalysisStrip { ...args } /></Wrap>,
};

/** About halfway through: 3 done / 1 running / 1 pending */
export const HalfDone = {
  args: {
    layerStatuses: ['done', 'done', 'done', 'running', 'pending'],
  },
  render: (args) => <Wrap><LayerAnalysisStrip { ...args } /></Wrap>,
};

/** All complete */
export const Complete = {
  args: {
    layerStatuses: ['done', 'done', 'done', 'done', 'done'],
  },
  render: (args) => <Wrap><LayerAnalysisStrip { ...args } /></Wrap>,
};

/** Custom labels: typography / spacing / rounded only */
export const CustomLabels = {
  args: {
    layerStatuses: ['done', 'running', 'pending'],
    layerLabels: ['Typography', 'Spacing', 'Rounded'],
    headerLabel: 'TOKEN SYNTH',
  },
  render: (args) => <Wrap><LayerAnalysisStrip { ...args } /></Wrap>,
};
