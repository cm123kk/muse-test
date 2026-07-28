import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Placeholder from '../../common/ui/Placeholder';
import MarqueeContainer from './MarqueeContainer';

export default {
  title: 'Interactive/14. Motion/MarqueeContainer',
  component: MarqueeContainer,
  tags: ['autodocs'],
  argTypes: {
    speed: {
      control: { type: 'number', min: 1, max: 60 },
      description: 'Time to complete one cycle (seconds, larger is slower)',
    },
    direction: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Scroll direction',
    },
    isPauseOnHover: {
      control: 'boolean',
      description: 'Pause on hover',
    },
    gap: {
      control: { type: 'number', min: 0, max: 10 },
      description: 'Spacing between items (theme.spacing units)',
    },
    isScrollScrub: {
      control: 'boolean',
      description: 'Scroll scrubbing mode (moves based on scroll position)',
    },
  },
};

/** Keyword tags (design system context) */
const keywords = [
  'Typography', 'Layout', 'Motion', 'Color System',
  'Spacing', 'Elevation', 'Iconography', 'Grid',
];

/** Partner logo blocks (placeholders for client and collaborator logos) */
const partners = [
  { name: 'STUDIO A', accent: 'primary.main' },
  { name: 'FORMA', accent: 'secondary.main' },
  { name: 'GRIDWORK', accent: 'primary.main' },
  { name: 'TONECRAFT', accent: 'secondary.main' },
  { name: 'PIXEL LAB', accent: 'primary.main' },
  { name: 'ARCHETYPE', accent: 'secondary.main' },
];

/** Array of gallery image indices */
const galleryIndices = [0, 1, 2, 3, 4, 5];

export const Default = {
  args: {
    speed: 20,
    direction: 'left',
    isPauseOnHover: true,
    gap: 2,
  },
  render: (args) => (
    <MarqueeContainer { ...args }>
      { keywords.map((label) => (
        <Chip key={ label } label={ label } variant="outlined" />
      )) }
    </MarqueeContainer>
  ),
};

export const Variants = {
  render: () => (
    <Box sx={ { display: 'flex', flexDirection: 'column', gap: 6 } }>
      {/* Keyword tag flow */}
      <Box>
        <Typography variant="overline" color="text.secondary" sx={ { mb: 1, display: 'block' } }>
          Keyword Tags
        </Typography>
        <MarqueeContainer speed={ 15 } gap={ 2 }>
          { keywords.map((label) => (
            <Chip key={ label } label={ label } variant="outlined" />
          )) }
        </MarqueeContainer>
      </Box>

      {/* Reverse direction plus filled tags */}
      <Box>
        <Typography variant="overline" color="text.secondary" sx={ { mb: 1, display: 'block' } }>
          Reverse Direction
        </Typography>
        <MarqueeContainer speed={ 18 } direction="right" gap={ 2 }>
          { keywords.map((label) => (
            <Chip
              key={ label }
              label={ label }
              sx={ { backgroundColor: 'secondary.main', color: 'white' } }
            />
          )) }
        </MarqueeContainer>
      </Box>

      {/* Partner logo blocks */}
      <Box>
        <Typography variant="overline" color="text.secondary" sx={ { mb: 1, display: 'block' } }>
          Partner Logos
        </Typography>
        <MarqueeContainer speed={ 25 } gap={ 3 }>
          { partners.map((p) => (
            <Box
              key={ p.name }
              sx={ {
                width: 140,
                height: 56,
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              } }
            >
              <Typography
                variant="caption"
                sx={ {
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: p.accent,
                } }
              >
                { p.name }
              </Typography>
            </Box>
          )) }
        </MarqueeContainer>
      </Box>

      {/* Image gallery flow */}
      <Box>
        <Typography variant="overline" color="text.secondary" sx={ { mb: 1, display: 'block' } }>
          Image Gallery
        </Typography>
        <MarqueeContainer speed={ 30 } gap={ 1 }>
          { galleryIndices.map((i) => (
            <Placeholder.Media
              key={ i }
              index={ i }
              category="abstract"
              size="small"
              width={ 160 }
              height={ 100 }
            />
          )) }
        </MarqueeContainer>
      </Box>
    </Box>
  ),
};

export const ScrollScrub = {
  render: () => (
    <Box sx={ { height: '300vh', pt: 20 } }>
      <Typography
        variant="overline"
        color="text.secondary"
        sx={ { mb: 2, display: 'block', textAlign: 'center' } }
      >
        Scroll to Scrub
      </Typography>

      {/* Image gallery linked to scroll */}
      <MarqueeContainer isScrollScrub gap={ 1 }>
        { galleryIndices.map((i) => (
          <Placeholder.Media
            key={ i }
            index={ i }
            category="abstract"
            size="medium"
            width={ 240 }
            height={ 150 }
          />
        )) }
      </MarqueeContainer>

      {/* Reverse direction partner logos linked to scroll */}
      <Box sx={ { mt: 3 } }>
        <MarqueeContainer isScrollScrub direction="right" gap={ 3 }>
          { partners.map((p) => (
            <Box
              key={ p.name }
              sx={ {
                width: 140,
                height: 56,
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              } }
            >
              <Typography
                variant="caption"
                sx={ {
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: p.accent,
                } }
              >
                { p.name }
              </Typography>
            </Box>
          )) }
        </MarqueeContainer>
      </Box>
    </Box>
  ),
};
