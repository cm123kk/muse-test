import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Placeholder, { placeholderSvg } from '../../common/ui/Placeholder';
import { CustomCard } from './CustomCard';

export default {
  title: 'Component/3. Card/CustomCard',
  component: CustomCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## CustomCard

A basic card component composed of a media area and a content area.
It is the foundation for various card components such as ImageCard and MoodboardCard.

### Layout types
- **vertical**: Media on top, content below (default)
- **horizontal**: Media and content arranged side by side
- **overlay**: Content overlaid on top of the media

### Media ratios
- \`1/1\`: Square
- \`4/3\`: Standard photo ratio
- \`16/9\`: Widescreen
- \`21/9\`: Ultrawide
- \`auto\`: Keep the original image ratio
        `,
      },
    },
  },
  argTypes: {
    layout: {
      control: 'select',
      options: ['vertical', 'horizontal', 'overlay'],
      description: 'Card layout type',
    },
    mediaPosition: {
      control: 'select',
      options: ['start', 'end'],
      description: 'Media position',
    },
    mediaRatio: {
      control: 'select',
      options: ['1/1', '4/3', '16/9', '21/9', 'auto'],
      description: 'Media area ratio',
    },
    contentPadding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Content area padding',
    },
    contentAlign: {
      control: 'select',
      options: ['start', 'center', 'end'],
      description: 'Content alignment',
    },
    isInteractive: {
      control: 'boolean',
      description: 'Hover interaction effect',
    },
  },
};

/**
 * Default Vertical layout
 */
export const Default = {
  args: {
    layout: 'vertical',
    mediaSrc: placeholderSvg(600, 338),
    mediaAlt: 'Sample image',
    mediaRatio: '16/9',
    contentPadding: 'md',
  },
  render: (args) => (
    <CustomCard { ...args } sx={ { width: 320 } }>
      <Typography variant="h6" sx={ { fontWeight: 600, mb: 1 } }>
        Card Title
      </Typography>
      <Typography variant="body2" color="text.secondary">
        CustomCard is a basic card component that supports various layouts.
      </Typography>
    </CustomCard>
  ),
};

/**
 * Horizontal layout
 */
export const Horizontal = {
  render: () => (
    <CustomCard
      layout="horizontal"
      mediaSrc={ placeholderSvg(600, 600) }
      mediaRatio="1/1"
      contentPadding="md"
      sx={ { width: 480 } }
    >
      <Typography variant="h6" sx={ { fontWeight: 600, mb: 1 } }>
        Horizontal Layout
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={ { mb: 2 } }>
        Media and content are arranged side by side.
      </Typography>
      <Button variant="outlined" size="small" sx={ { textTransform: 'none' } }>
        View Details
      </Button>
    </CustomCard>
  ),
};

/**
 * Horizontal: media on the right
 */
export const HorizontalMediaEnd = {
  render: () => (
    <CustomCard
      layout="horizontal"
      mediaPosition="end"
      mediaSrc={ placeholderSvg(600, 600) }
      mediaRatio="1/1"
      contentPadding="md"
      sx={ { width: 480 } }
    >
      <Typography variant="h6" sx={ { fontWeight: 600, mb: 1 } }>
        Media on the Right
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Use mediaPosition=&quot;end&quot; to place the media on the right.
      </Typography>
    </CustomCard>
  ),
};

/**
 * Overlay layout
 */
export const Overlay = {
  render: () => (
    <CustomCard
      layout="overlay"
      mediaSrc={ placeholderSvg(600, 450) }
      contentPadding="lg"
      sx={ { width: 400, height: 300 } }
    >
      <Typography variant="h5" sx={ { fontWeight: 700, mb: 1 } }>
        Overlay Layout
      </Typography>
      <Typography variant="body2" sx={ { opacity: 0.9 } }>
        Content is overlaid on top of the media. A gradient background ensures text readability.
      </Typography>
    </CustomCard>
  ),
};

/**
 * Various media ratios
 */
export const MediaRatios = {
  render: () => (
    <Box sx={ { display: 'flex', gap: 2, flexWrap: 'wrap' } }>
      { ['1/1', '4/3', '16/9', '21/9'].map((ratio) => (
        <CustomCard
          key={ ratio }
          mediaSrc={ placeholderSvg(400, 400) }
          mediaRatio={ ratio }
          contentPadding="sm"
          sx={ { width: 200 } }
        >
          <Typography variant="body2" sx={ { fontWeight: 600 } }>
            { ratio }
          </Typography>
        </CustomCard>
      )) }
    </Box>
  ),
};

/**
 * Auto ratio (keep original)
 */
export const AutoRatio = {
  render: () => (
    <Box sx={ { display: 'flex', gap: 2, alignItems: 'flex-start' } }>
      <CustomCard
        mediaSrc={ placeholderSvg(600, 400) }
        mediaRatio="auto"
        contentPadding="sm"
        sx={ { width: 200 } }
      >
        <Typography variant="body2" sx={ { fontWeight: 600 } }>
          Landscape image (auto)
        </Typography>
      </CustomCard>
      <CustomCard
        mediaSrc={ placeholderSvg(400, 600) }
        mediaRatio="auto"
        contentPadding="sm"
        sx={ { width: 200 } }
      >
        <Typography variant="body2" sx={ { fontWeight: 600 } }>
          Portrait image (auto)
        </Typography>
      </CustomCard>
    </Box>
  ),
};

/**
 * overlaySlot usage example
 */
export const WithOverlaySlot = {
  render: () => (
    <CustomCard
      mediaSrc={ placeholderSvg(400, 300) }
      mediaRatio="4/3"
      contentPadding="sm"
      overlaySlot={
        <Box
          sx={ {
            position: 'absolute',
            top: 8,
            right: 8,
            display: 'flex',
            gap: 0.5,
          } }
        >
          <IconButton
            size="small"
            sx={ {
              bgcolor: 'background.paper',
              boxShadow: 1,
              '&:hover': { bgcolor: 'white' },
            } }
          >
            <FavoriteBorderIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            sx={ {
              bgcolor: 'primary.main',
              color: 'white',
              boxShadow: 1,
              '&:hover': { bgcolor: 'primary.dark' },
            } }
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>
      }
      sx={ { width: 280 } }
    >
      <Typography variant="body2" sx={ { fontWeight: 600 } }>
        Using overlaySlot
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Action buttons overlaid on top of the media
      </Typography>
    </CustomCard>
  ),
};

/**
 * mediaSlot usage example (custom media)
 */
export const WithMediaSlot = {
  render: () => (
    <CustomCard
      mediaSlot={
        <Box
          sx={ {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gridTemplateRows: 'repeat(2, 1fr)',
            gap: '2px',
            width: '100%',
            aspectRatio: '1/1',
            backgroundColor: 'grey.200',
          } }
        >
          { [0, 1, 2, 3].map((i) => (
            <Placeholder.Media
              key={ i }
              index={ i }
              sx={ { width: '100%', height: '100%' } }
            />
          )) }
        </Box>
      }
      contentPadding="md"
      sx={ { width: 280 } }
    >
      <Typography variant="subtitle1" sx={ { fontWeight: 700 } }>
        Custom Media Slot
      </Typography>
      <Typography variant="body2" color="text.secondary">
        2×2 thumbnail grid
      </Typography>
    </CustomCard>
  ),
};

/**
 * Interactive card
 */
export const Interactive = {
  render: () => (
    <CustomCard
      mediaSrc={ placeholderSvg(600, 338) }
      mediaRatio="16/9"
      contentPadding="md"
      isInteractive
      onClick={ () => console.log('Card clicked!') }
      overlaySlot={
        <Box
          sx={ {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          } }
        >
          <IconButton
            sx={ {
              bgcolor: 'rgba(0,0,0,0.6)',
              color: 'white',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
            } }
          >
            <PlayArrowIcon fontSize="large" />
          </IconButton>
        </Box>
      }
      sx={ { width: 320 } }
    >
      <Typography variant="h6" sx={ { fontWeight: 600, mb: 0.5 } }>
        Interactive Card
      </Typography>
      <Typography variant="body2" color="text.secondary">
        A hover effect is applied when you move the mouse over it.
      </Typography>
    </CustomCard>
  ),
};

/**
 * Card without content
 */
export const MediaOnly = {
  render: () => (
    <Box sx={ { display: 'flex', gap: 2 } }>
      <CustomCard
        mediaSrc={ placeholderSvg(300, 300) }
        mediaRatio="1/1"
        sx={ { width: 150 } }
      />
      <CustomCard
        mediaSrc={ placeholderSvg(400, 300) }
        mediaRatio="4/3"
        sx={ { width: 200 } }
      />
      <CustomCard
        mediaSrc={ placeholderSvg(480, 270) }
        mediaRatio="16/9"
        sx={ { width: 240 } }
      />
    </Box>
  ),
};

/**
 * Content padding comparison
 */
export const ContentPaddings = {
  render: () => (
    <Box sx={ { display: 'flex', gap: 2 } }>
      { ['none', 'sm', 'md', 'lg'].map((padding) => (
        <CustomCard
          key={ padding }
          mediaSrc={ placeholderSvg(360, 203) }
          mediaRatio="16/9"
          contentPadding={ padding }
          sx={ { width: 180 } }
        >
          <Typography variant="body2" sx={ { fontWeight: 600 } }>
            padding: { padding }
          </Typography>
          <Box sx={ { display: 'flex', gap: 0.5, mt: 0.5 } }>
            <Chip label="Tag" size="small" />
          </Box>
        </CustomCard>
      )) }
    </Box>
  ),
};
