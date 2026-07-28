import { useState } from 'react';
import Box from '@mui/material/Box';
import { ModeSelectCard } from './ModeSelectCard.jsx';

export default {
  title: 'Card / ModeSelectCard',
  component: ModeSelectCard,
  parameters: { layout: 'centered' },
};

const MODES = [
  { mode: 'concept', title: 'Explore a Concept', subtitle: 'I want to get a feel for it', description: 'Prioritize fast variety. T2 diverse moods, T3 distinctive bias' },
  { mode: 'system', title: 'Build a Design System', subtitle: 'I need precise tokens', description: 'Prioritize consistency and rationale. Strict roles, contrast validation' },
];

/** Default: card grid, no selection */
export const Default = {
  render: () => {
    const [selected, setSelected] = useState(null);
    return (
      <Box sx={ { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(220px, 280px))', gap: 2 } }>
        { MODES.map((m) => (
          <ModeSelectCard
            key={ m.mode }
            { ...m }
            isSelected={ selected === m.mode }
            onSelect={ setSelected }
          />
        )) }
      </Box>
    );
  },
};

export const ConceptSelected = {
  render: () => (
    <Box sx={ { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(220px, 280px))', gap: 2 } }>
      { MODES.map((m) => (
        <ModeSelectCard key={ m.mode } { ...m } isSelected={ m.mode === 'concept' } onSelect={ () => {} } />
      )) }
    </Box>
  ),
};

export const SystemSelected = {
  render: () => (
    <Box sx={ { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(220px, 280px))', gap: 2 } }>
      { MODES.map((m) => (
        <ModeSelectCard key={ m.mode } { ...m } isSelected={ m.mode === 'system' } onSelect={ () => {} } />
      )) }
    </Box>
  ),
};

export const Single = {
  render: () => (
    <ModeSelectCard
      mode="concept"
      title="Explore a Concept"
      subtitle="I want to get a feel for it"
      description="Prioritize fast variety. T2 diverse moods, T3 distinctive bias"
      isSelected
      onSelect={ () => {} }
      sx={ { width: 280 } }
    />
  ),
};
