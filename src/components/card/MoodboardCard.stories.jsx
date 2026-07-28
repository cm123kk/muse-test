import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Masonry from '@mui/lab/Masonry';
import { MoodboardCard } from './MoodboardCard';
import Placeholder, { placeholderSvg } from '../../common/ui/Placeholder';

// Generate test asset data (using Placeholder SVG)
const createMockAssets = (category, count = 4) => {
  const labels = {
    abstract: ['Abstract Flow', 'Geometric Pattern', 'Color Study', 'Form Exploration', 'Shape Play', 'Texture Map', 'Wave Motion', 'Grid System'],
    fineart: ['Oil Canvas', 'Brushwork Study', 'Color Palette', 'Gallery Piece', 'Impressionist', 'Still Life', 'Landscape', 'Portrait Study'],
    illustration: ['Digital Art', 'Vector Scene', 'Character Design', 'Icon Set', 'Infographic', 'Editorial Art', 'Book Cover', 'Poster Design'],
    photography: ['Product Shot', 'Still Life', 'Editorial', 'Documentary', 'Landscape', 'Architecture', 'Street Photo', 'Nature'],
    portrait: ['Fashion Portrait', 'Studio Shot', 'Environmental', 'Candid Moment', 'Editorial Look', 'Close-up', 'Full Body', 'Profile'],
    poster: ['Typographic', 'Event Poster', 'Brand Visual', 'Film Poster', 'Concert Art', 'Minimal Poster', 'Retro Style', 'Modern Design'],
  };
  const categoryLabels = labels[category] || labels.abstract;
  return Array.from({ length: count }, (_, index) => ({
    id: `asset-${category}-${index}`,
    title: categoryLabels[index % categoryLabels.length],
    thumbnail: placeholderSvg(320, 320),
    src: {
      small: placeholderSvg(160, 160),
      medium: placeholderSvg(320, 320),
      large: placeholderSvg(640, 640),
    },
  }));
};

// Sample moodboard data
const sampleMoodboards = [
  {
    id: 'board-1',
    name: 'Abstract Art',
    description: 'Abstract and geometric artwork collection for brand exploration',
    items: createMockAssets('abstract', 4),
    createdAt: '2024-10-15',
  },
  {
    id: 'board-2',
    name: 'Fine Art',
    description: 'Paintings and canvas artwork',
    items: createMockAssets('fineart', 4),
    createdAt: '2024-10-10',
  },
  {
    id: 'board-3',
    name: 'Illustration',
    description: 'Digital illustration and artwork for UI design inspiration',
    items: createMockAssets('illustration', 4),
    createdAt: '2024-09-28',
  },
  {
    id: 'board-4',
    name: 'Photography',
    description: 'Product and editorial photography',
    items: createMockAssets('photography', 4),
    createdAt: '2024-09-15',
  },
  {
    id: 'board-5',
    name: 'Portrait',
    description: 'Fashion and artistic portraits',
    items: createMockAssets('portrait', 4),
    createdAt: '2024-09-01',
  },
];

export default {
  title: 'Component/3. Card/MoodboardCard',
  component: MoodboardCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## MoodboardCard

A card component that displays a moodboard collection.

### Differences from ImageCard

| Element | ImageCard | MoodboardCard |
|------|-----------|---------------|
| **Thumbnail** | Single image | 2×2 grid (4 images) |
| **Title** | body2 (14px) | subtitle1 (16px), bold |
| **Metadata** | Tag chips | Description, item count, created date |

### Key features
- **2×2 thumbnail grid**: Collection preview in the default state
- **Hover image cycling**: On mouse hover, images fade-transition at 0.3s intervals
- **Responsive metadata**: Name, description, item count, created date
- **Hover interaction**: Shows edit/delete buttons
- **Empty state handling**: Shows a placeholder when there are no images
        `,
      },
    },
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'Moodboard name',
      table: {
        type: { summary: 'string' },
      },
    },
    description: {
      control: 'text',
      description: 'Moodboard description (shows up to 2 lines)',
      table: {
        type: { summary: 'string' },
      },
    },
    items: {
      control: 'object',
      description: 'Array of items in the moodboard (requires a thumbnail field)',
      table: {
        type: { summary: 'Array<{id, title, thumbnail}>' },
      },
    },
    createdAt: {
      control: 'text',
      description: 'Created date (YYYY-MM-DD format)',
      table: {
        type: { summary: 'string' },
      },
    },
    onClick: {
      action: 'clicked',
      description: 'Card click handler',
      table: {
        type: { summary: 'function' },
      },
    },
    onEdit: {
      action: 'edit',
      description: 'Edit button click handler',
      table: {
        type: { summary: 'function' },
      },
    },
    onDelete: {
      action: 'delete',
      description: 'Delete button click handler',
      table: {
        type: { summary: 'function' },
      },
    },
  },
};

/** Default MoodboardCard */
export const Default = {
  args: {
    id: 'board-1',
    name: 'Abstract Art',
    description: 'Abstract and geometric artwork collection for brand exploration',
    items: createMockAssets('abstract', 4),
    createdAt: '2024-10-15',
  },
  render: (args) => (
    <Box sx={ { width: 280 } }>
      <MoodboardCard { ...args } />
    </Box>
  ),
};

/** States by image count */
export const ItemCounts = {
  render: () => (
    <Box sx={ { display: 'flex', gap: 3, flexWrap: 'wrap' } }>
      { [4, 3, 2, 1, 0].map((count) => (
        <Box key={ count } sx={ { width: 240 } }>
          <Typography variant="caption" color="text.secondary" sx={ { mb: 1, display: 'block' } }>
            { count } items
          </Typography>
          <MoodboardCard
            id={ `board-${count}` }
            name={ count === 0 ? 'Empty Board' : `${count} Images` }
            description={ count === 0 ? 'Start adding images to this board' : 'Sample description text' }
            items={ createMockAssets('abstract', count) }
            createdAt="2024-10-15"
            onEdit={ () => {} }
            onDelete={ () => {} }
          />
        </Box>
      )) }
    </Box>
  ),
};

/** Long text handling */
export const LongText = {
  render: () => (
    <Box sx={ { display: 'flex', gap: 3 } }>
      <Box sx={ { width: 280 } }>
        <Typography variant="caption" color="text.secondary" sx={ { mb: 1, display: 'block' } }>
          Long title
        </Typography>
        <MoodboardCard
          id="board-long-title"
          name="This is a very long moodboard name that should be truncated with ellipsis"
          description="Short description"
          items={ createMockAssets('fineart', 4) }
          createdAt="2024-10-15"
          onEdit={ () => {} }
        />
      </Box>
      <Box sx={ { width: 280 } }>
        <Typography variant="caption" color="text.secondary" sx={ { mb: 1, display: 'block' } }>
          Long description
        </Typography>
        <MoodboardCard
          id="board-long-desc"
          name="Fine Art Collection"
          description="This is a very long description that spans multiple lines and should be clamped at two lines with an ellipsis at the end to maintain visual consistency across all cards in the grid layout."
          items={ createMockAssets('fineart', 4) }
          createdAt="2024-10-15"
          onEdit={ () => {} }
        />
      </Box>
    </Box>
  ),
};

/** Masonry grid layout */
export const MasonryGrid = {
  render: () => (
    <Box sx={ { width: '100%', maxWidth: 1200 } }>
      <Typography variant="h6" sx={ { fontWeight: 700, mb: 3 } }>
        Moodboards
      </Typography>
      <Masonry columns={ { xs: 1, sm: 2, md: 3, lg: 4 } } spacing={ 2 }>
        { sampleMoodboards.map((board) => (
          <MoodboardCard
            key={ board.id }
            { ...board }
            onClick={ () => console.log('Navigate to:', board.id) }
            onEdit={ (id) => console.log('Edit:', id) }
            onDelete={ (id) => console.log('Delete:', id) }
          />
        )) }
      </Masonry>
    </Box>
  ),
  parameters: {
    layout: 'padded',
  },
};

/** Grid layout (equal height) */
export const GridLayout = {
  render: () => (
    <Box sx={ { width: '100%', maxWidth: 1200 } }>
      <Typography variant="h6" sx={ { fontWeight: 700, mb: 3 } }>
        Moodboards (Grid Layout)
      </Typography>
      <Grid container spacing={ 2 }>
        { sampleMoodboards.map((board) => (
          <Grid key={ board.id } size={ { xs: 12, sm: 6, md: 4, lg: 3 } }>
            <MoodboardCard
              { ...board }
              onClick={ () => console.log('Navigate to:', board.id) }
              onEdit={ (id) => console.log('Edit:', id) }
            />
          </Grid>
        )) }
      </Grid>
    </Box>
  ),
  parameters: {
    layout: 'padded',
  },
};

/** No action buttons (read only) */
export const ReadOnly = {
  args: {
    id: 'board-readonly',
    name: 'Read Only Board',
    description: 'This board has no edit or delete actions',
    items: createMockAssets('poster', 4),
    createdAt: '2024-10-15',
  },
  render: (args) => (
    <Box sx={ { width: 280 } }>
      <MoodboardCard { ...args } />
    </Box>
  ),
};

/** Hover image cycling (many images) */
export const HoverTransition = {
  render: () => (
    <Box sx={ { display: 'flex', gap: 3 } }>
      <Box sx={ { width: 280 } }>
        <Typography variant="caption" color="text.secondary" sx={ { mb: 1, display: 'block' } }>
          8 images (hover to see cycling)
        </Typography>
        <MoodboardCard
          id="board-many"
          name="Many Images"
          description="Hover to see images cycle through with fade transition"
          items={ [
            ...createMockAssets('abstract', 4),
            ...createMockAssets('fineart', 4),
          ] }
          createdAt="2024-10-15"
          onEdit={ () => {} }
        />
      </Box>
      <Box sx={ { width: 280 } }>
        <Typography variant="caption" color="text.secondary" sx={ { mb: 1, display: 'block' } }>
          1 image (no cycling)
        </Typography>
        <MoodboardCard
          id="board-single"
          name="Single Image"
          description="Only one image, no cycling on hover"
          items={ createMockAssets('photography', 1) }
          createdAt="2024-10-15"
          onEdit={ () => {} }
        />
      </Box>
    </Box>
  ),
};
