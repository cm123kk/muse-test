import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { AnalysisProgress } from './AnalysisProgress';

export default {
  title: 'Component/9. Overlay & Feedback/AnalysisProgress',
  component: AnalysisProgress,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    layers: { control: 'object' },
    title: { control: 'text' },
    onCancel: { action: 'cancel' },
    onRetry: { action: 'retry' },
  },
};

const MUSE_LAYERS = [
  { key: 'color', label: 'Color' },
  { key: 'typography', label: 'Typography' },
  { key: 'layout', label: 'Layout' },
  { key: 'gradient', label: 'Gradient' },
  { key: 'visualDirection', label: 'Visual Direction' },
];

/** Waiting state: everything pending */
export const AllPending = {
  args: {
    layers: MUSE_LAYERS.map((l) => ({ ...l, status: 'pending' })),
  },
};

/** In progress: some done, one running */
export const InProgress = {
  args: {
    layers: [
      { ...MUSE_LAYERS[0], status: 'done' },
      { ...MUSE_LAYERS[1], status: 'done' },
      { ...MUSE_LAYERS[2], status: 'running', progress: 0.45, message: 'Analyzing 8 layout patterns' },
      { ...MUSE_LAYERS[3], status: 'pending' },
      { ...MUSE_LAYERS[4], status: 'pending' },
    ],
  },
};

/** Completed state */
export const AllDone = {
  args: {
    layers: MUSE_LAYERS.map((l) => ({ ...l, status: 'done' })),
  },
};

/** Error state: retry action shown */
export const WithError = {
  args: {
    layers: [
      { ...MUSE_LAYERS[0], status: 'done' },
      { ...MUSE_LAYERS[1], status: 'error', message: 'Typography analysis failed: insufficient image resolution' },
      { ...MUSE_LAYERS[2], status: 'done' },
      { ...MUSE_LAYERS[3], status: 'pending' },
      { ...MUSE_LAYERS[4], status: 'pending' },
    ],
  },
};

/** Simulation: auto progression (steps advance at 0.8s intervals) */
export const Simulation = {
  render: () => {
    const [layers, setLayers] = useState(
      MUSE_LAYERS.map((l, i) => ({ ...l, status: i === 0 ? 'running' : 'pending', progress: 0 })),
    );

    useEffect(() => {
      const timers = [];
      // Advance each layer sequentially
      for (let i = 0; i < MUSE_LAYERS.length; i += 1) {
        timers.push(
          setTimeout(() => {
            setLayers((prev) =>
              prev.map((l, idx) => {
                if (idx === i) return { ...l, status: 'done', progress: 1 };
                if (idx === i + 1) return { ...l, status: 'running', progress: 0 };
                return l;
              }),
            );
          }, (i + 1) * 900),
        );
      }
      return () => timers.forEach(clearTimeout);
    }, []);

    return (
      <Box sx={ { display: 'flex', justifyContent: 'center' } }>
        <AnalysisProgress layers={ layers } onCancel={ () => {} } />
      </Box>
    );
  },
};
