import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AspectMedia from './AspectMedia';
import Placeholder, { placeholderSvg } from '../../common/ui/Placeholder';
import { testVideos } from '../../utils/pexels-test-data';

export default {
  title: 'Component/4. Media/AspectMedia',
  component: AspectMedia,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## AspectMedia

General-purpose media Component that displays an image or video at a specified ratio.

### Key features
- **CSS aspect-ratio**: keeps the native ratio (96%+ browser support)
- **Image/video unified**: switch via the type prop
- **Lazy Loading**: enabled by Default
- **Video controls**: supports autoPlay, muted, loop, controls

### Use cases
- Responsive image galleries
- Video thumbnails/backgrounds
- Product image cards
        `,
      },
    },
  },
  argTypes: {
    type: {
      control: 'radio',
      options: ['image', 'video'],
      description: 'Media type',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'image' },
      },
    },
    aspectRatio: {
      control: 'select',
      options: ['1/1', '4/3', '3/4', '16/9', '9/16', '21/9'],
      description: 'CSS aspect-ratio value',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '16/9' },
      },
    },
    objectFit: {
      control: 'select',
      options: ['cover', 'contain', 'fill', 'none', 'scale-down'],
      description: 'CSS object-fit value',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'cover' },
      },
    },
    isLazy: {
      control: 'boolean',
      description: 'Enable lazy loading',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
  },
};

/** Basic image */
export const Default = {
  args: {
    src: placeholderSvg(400, 225),
    alt: 'Placeholder image',
    type: 'image',
    aspectRatio: '16/9',
    objectFit: 'cover',
  },
  render: (args) => (
    <Box sx={ { width: 400 } }>
      <AspectMedia { ...args } />
    </Box>
  ),
};

/** Various ratios */
export const AspectRatios = {
  render: () => (
    <Grid container spacing={ 3 } sx={ { width: 800 } }>
      { ['1/1', '4/3', '16/9', '21/9'].map((ratio) => (
        <Grid size={ { xs: 6, md: 3 } } key={ ratio }>
          <Stack spacing={ 1 }>
            <AspectMedia
              src={ placeholderSvg(400, 300) }
              alt={ `Ratio ${ratio}` }
              aspectRatio={ ratio }
            />
            <Typography variant="caption" sx={ { fontFamily: 'monospace' } }>
              { ratio }
            </Typography>
          </Stack>
        </Grid>
      )) }
    </Grid>
  ),
};

/** Object Fit comparison */
export const ObjectFitOptions = {
  render: () => (
    <Grid container spacing={ 3 } sx={ { width: 800 } }>
      { ['cover', 'contain', 'fill', 'none'].map((fit) => (
        <Grid size={ { xs: 6, md: 3 } } key={ fit }>
          <Stack spacing={ 1 }>
            <Box sx={ { backgroundColor: 'grey.200', p: 0.5 } }>
              <AspectMedia
                src={ placeholderSvg(400, 300) }
                alt={ `Object-fit: ${fit}` }
                aspectRatio="1/1"
                objectFit={ fit }
              />
            </Box>
            <Typography variant="caption" sx={ { fontFamily: 'monospace' } }>
              objectFit: { fit }
            </Typography>
          </Stack>
        </Grid>
      )) }
    </Grid>
  ),
};

/** Video */
export const Video = {
  args: {
    type: 'video',
    src: testVideos.motion[0].src.sd,
    poster: placeholderSvg(500, 281),
    aspectRatio: '16/9',
    isAutoPlay: true,
    isMuted: true,
    isLoop: true,
  },
  render: (args) => (
    <Box sx={ { width: 500 } }>
      <AspectMedia { ...args } />
    </Box>
  ),
};

/** Video with Controls */
export const VideoWithControls = {
  render: () => (
    <Box sx={ { width: 500 } }>
      <AspectMedia
        type="video"
        src={ testVideos.motion[1].src.sd }
        poster={ placeholderSvg(500, 281) }
        aspectRatio="16/9"
        hasControls
        isMuted={ false }
      />
    </Box>
  ),
};

/** Image gallery */
export const ImageGallery = {
  render: () => (
    <Stack spacing={ 4 } sx={ { width: 800 } }>
      <Typography variant="h6">Photography</Typography>
      <Grid container spacing={ 2 }>
        { Array.from({ length: 4 }, (_, i) => (
          <Grid size={ { xs: 6, md: 3 } } key={ `photo-${i}` }>
            <Placeholder.Media index={ i } category="photography" ratio="4/3" />
          </Grid>
        )) }
      </Grid>

      <Typography variant="h6">Abstract</Typography>
      <Grid container spacing={ 2 }>
        { Array.from({ length: 4 }, (_, i) => (
          <Grid size={ { xs: 6, md: 3 } } key={ `abstract-${i}` }>
            <Placeholder.Media index={ i } category="abstract" ratio="4/3" />
          </Grid>
        )) }
      </Grid>
    </Stack>
  ),
};
