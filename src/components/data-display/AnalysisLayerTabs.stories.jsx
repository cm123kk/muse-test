import { useState } from 'react';
import Box from '@mui/material/Box';
import { AnalysisLayerTabs } from './AnalysisLayerTabs';

export default {
  title: 'Component/5. Data Display/AnalysisLayerTabs',
  component: AnalysisLayerTabs,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    analysis: {
      control: 'object',
      description: 'Token bundle per Layer { color, typography, layout, gradient, visualDirection }',
    },
    project: {
      control: 'object',
      description: 'Project meta passed to DesignMdPreview',
    },
    references: {
      control: 'object',
      description: 'Full Reference list for decision tracking (source thumbnails)',
    },
    categories: {
      control: 'object',
      description: 'Tab categories [{ id, label }] (Default: 5 Layers + DESIGN.md)',
    },
    defaultLayer: {
      control: 'select',
      options: ['color', 'typography', 'layout', 'gradient', 'visualDirection', 'designMd'],
      description: 'Initial active Layer key',
    },
    onUpdateToken: { action: 'updateToken', description: '(layerKey, tokenId, patch) => void Token edit callback' },
  },
};

/* T3 system mode analysis result fixture, for story demos */
const SAMPLE_ANALYSIS = {
  color: [
    { id: 'c1', label: 'Brand Red', value: '#D91A0A', isEnabled: true, emphasis: 2 },
    { id: 'c2', label: 'Ink', value: '#0D0D0D', isEnabled: true, emphasis: 1 },
    { id: 'c3', label: 'Paper', value: '#F2EDE8', isEnabled: true, emphasis: 0 },
  ],
  typography: [
    { id: 't1', label: 'Display / Condensed', value: 'Anton, 64/72', isEnabled: true, emphasis: 2 },
    { id: 't2', label: 'Body / Sans', value: 'Inter, 16/26', isEnabled: true, emphasis: 1 },
  ],
  layout: [
    { id: 'l1', label: 'Grid', value: '12 col / 24 gutter', isEnabled: true, emphasis: 1 },
    { id: 'l2', label: 'Container', value: 'max 1200', isEnabled: true, emphasis: 0 },
  ],
  gradient: [
    { id: 'g1', label: 'Sunrise', gradient: 'linear-gradient(135deg, #FEE2F5, #FEF9C3)', isEnabled: true, emphasis: 1 },
  ],
  visualDirection: {
    markdown: '# Visual Direction\n\nBrutalist editorial design. Strong contrast, condensed typography focus.',
    tags: {
      genre: ['Editorial', 'Brutalist'],
      style: ['High-contrast', 'All-caps'],
      subject: ['Typography-Hero'],
    },
  },
};

const SAMPLE_PROJECT = { id: 'p1', name: 'Editorial Manifesto', mode: 'system', intent: 'Bold editorial design system' };

export const Default = {
  args: {
    analysis: SAMPLE_ANALYSIS,
    project: SAMPLE_PROJECT,
    references: [],
    defaultLayer: 'color',
  },
};

/** Controlled demo where token edits are actually reflected */
function EditableDemo(args) {
  const [analysis, setAnalysis] = useState(SAMPLE_ANALYSIS);

  const handleUpdateToken = (layerKey, tokenId, patch) => {
    setAnalysis((prev) => ({
      ...prev,
      [layerKey]: (prev[layerKey] || []).map((tok) =>
        tok.id === tokenId ? { ...tok, ...patch } : tok,
      ),
    }));
  };

  return (
    <Box sx={ { maxWidth: 720 } }>
      <AnalysisLayerTabs
        { ...args }
        analysis={ analysis }
        project={ SAMPLE_PROJECT }
        onUpdateToken={ handleUpdateToken }
      />
    </Box>
  );
}

/* Controlled example where token edits are actually reflected */
export const Editable = {
  render: (args) => <EditableDemo { ...args } />,
  args: {
    defaultLayer: 'color',
  },
};
