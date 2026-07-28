import { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { ImageCard } from './ImageCard';
import Placeholder, { placeholderSvg } from '../../common/ui/Placeholder';

export default {
  title: 'Component/3. Card/ImageCard',
  component: ImageCard,
  tags: ['autodocs'],
  argTypes: {
    src: { control: 'text', description: 'Image URL' },
    title: { control: 'text', description: 'Title' },
    tags: { control: 'object', description: 'Array of tags' },
    hideActions: { control: 'boolean', description: 'Hide the default action buttons' },
    isSelectable: { control: 'boolean', description: 'Show the selection checkbox' },
    isSelected: { control: 'boolean', description: 'Selected state' },
    onLike: { action: 'liked' },
    onToggleSelect: { action: 'toggled' },
    onClick: { action: 'clicked' },
  },
};

/** Default: title + tags + default actions */
export const Default = {
  args: {
    src: placeholderSvg(600, 400),
    title: 'Neon City Vibes',
    tags: ['Neon', 'City', 'Night'],
  },
};

/** Tags only: only the tag badges, no title */
export const TagsOnly = {
  args: {
    src: placeholderSvg(600, 400),
    tags: ['Minimal', 'Blue', 'Editorial'],
  },
};

/** Selectable: for archive/reference selection UI */
export const Selectable = {
  render: () => {
    const [selected, setSelected] = useState(false);
    return (
      <Box sx={ { maxWidth: 320 } }>
        <ImageCard
          src={ placeholderSvg(600, 400) }
          title="Editorial Layout"
          tags={ ['Editorial', 'Swiss'] }
          isSelectable
          isSelected={ selected }
          onToggleSelect={ setSelected }
        />
      </Box>
    );
  },
};

/** Multi-select example: ReferencePicker pattern preview */
export const MultiSelectGrid = {
  render: () => {
    const [picked, setPicked] = useState(new Set());
    const items = Array.from({ length: 6 }, (_, i) => ({
      id: `ref-${i}`,
      title: [`Abstract`, `Portrait`, `Spatial`, `Gradient`, `Illustration`, `Poster`][i % 6],
      tags: [['Muted'], ['Warm'], ['Deep'], ['Soft'], ['Bold'], ['Editorial']][i % 6],
    }));

    const toggle = (id, next) => {
      setPicked((prev) => {
        const s = new Set(prev);
        if (next) s.add(id);
        else s.delete(id);
        return s;
      });
    };

    return (
      <Box sx={ { maxWidth: 960 } }>
        <Grid container spacing={ 2 }>
          { items.map((it, i) => (
            <Grid key={ it.id } size={ { xs: 12, sm: 6, md: 4 } }>
              <ImageCard
                src={ placeholderSvg(600, 400) }
                title={ it.title }
                tags={ it.tags }
                isSelectable
                isSelected={ picked.has(it.id) }
                onToggleSelect={ (next) => toggle(it.id, next) }
              />
            </Grid>
          )) }
        </Grid>
      </Box>
    );
  },
};

/** Real image example: using Placeholder.Media */
export const WithMediaPlaceholder = {
  render: () => (
    <Box sx={ { maxWidth: 960 } }>
      <Grid container spacing={ 2 }>
        { [0, 1, 2].map((i) => (
          <Grid key={ i } size={ { xs: 12, sm: 6, md: 4 } }>
            <ImageCard
              src={ Placeholder.svg(600, 400) }
              title={ `Sample ${i + 1}` }
              tags={ ['Demo'] }
            />
          </Grid>
        )) }
      </Grid>
    </Box>
  ),
};
