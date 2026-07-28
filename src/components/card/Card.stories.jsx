import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Placeholder, { placeholderSvg } from '../../common/ui/Placeholder';

export default {
  title: 'Component/3. Card/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## Card [MUI]

A card component that groups and displays related content.

### Composition

| Component | Description | Example |
|----------|------|------|
| Card | Card container | \`<Card>...</Card>\` |
| CardHeader | Title, subtitle, avatar | Author info |
| CardMedia | Image, video | Thumbnail |
| CardContent | Main content | Text, description |
| CardActions | Action buttons | Like, share |
        `,
      },
    },
  },
  argTypes: {
    elevation: {
      control: { type: 'range', min: 0, max: 24 },
      description: 'Sets the shadow depth of the card.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
      },
    },
    variant: {
      control: 'select',
      options: ['elevation', 'outlined'],
      description: 'Sets the style variant of the card.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'elevation' },
      },
    },
  },
};

/** Default card */
export const Default = {
  args: {
    elevation: 1,
    variant: 'elevation',
  },
  render: (args) => (
    <Card sx={ { maxWidth: 345 } } elevation={ args.elevation } variant={ args.variant }>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Card Title
        </Typography>
        <Typography variant="body2" color="text.secondary">
          A card is a component that groups and displays related content.
          It can present various information in a structured form.
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
        <Button size="small">Share</Button>
      </CardActions>
    </Card>
  ),
};

/** Card with media */
export const WithMedia = {
  render: () => (
    <Card sx={ { maxWidth: 345 } }>
      <CardMedia
        component="img"
        height="140"
        image={ placeholderSvg(345, 140) }
        alt="Card image"
      />
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Image Card
        </Typography>
        <Typography variant="body2" color="text.secondary">
          You can display images using the CardMedia component.
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary">
          View Details
        </Button>
      </CardActions>
    </Card>
  ),
};

/** Card with header */
export const WithHeader = {
  render: () => (
    <Card sx={ { maxWidth: 345 } }>
      <CardHeader
        avatar={
          <Avatar sx={ { bgcolor: 'primary.main' } }>
            K
          </Avatar>
        }
        action={
          <IconButton>
            <Box component="span" sx={ { fontSize: 20 } }>⋮</Box>
          </IconButton>
        }
        title="John Doe"
        subheader="January 15, 2024"
      />
      <CardMedia
        component="img"
        height="194"
        image={ placeholderSvg(345, 194) }
        alt="Post image"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          I had a wonderful experience today. I am really glad to be starting a new project.
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton>
          <Box component="span" sx={ { fontSize: 20 } }>♡</Box>
        </IconButton>
        <IconButton>
          <Box component="span" sx={ { fontSize: 20 } }>💬</Box>
        </IconButton>
        <IconButton>
          <Box component="span" sx={ { fontSize: 20 } }>↗</Box>
        </IconButton>
      </CardActions>
    </Card>
  ),
};

/** Outlined card */
export const Outlined = {
  render: () => (
    <Card variant="outlined" sx={ { maxWidth: 345 } }>
      <CardContent>
        <Typography variant="overline" color="text.secondary">
          OUTLINED
        </Typography>
        <Typography variant="h5" component="div" sx={ { mb: 1.5 } }>
          Outlined Card
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Using variant="outlined" creates a card with only a border.
          The border defines the area instead of a shadow.
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Confirm</Button>
      </CardActions>
    </Card>
  ),
};

/** Elevation comparison */
export const Elevations = {
  render: () => (
    <Stack direction="row" spacing={ 2 } flexWrap="wrap" useFlexGap>
      { [0, 1, 2, 3, 4].map((elevation) => (
        <Card key={ elevation } elevation={ elevation } sx={ { width: 120, height: 80 } }>
          <CardContent>
            <Typography variant="caption" color="text.secondary">
              elevation
            </Typography>
            <Typography variant="h6">{ elevation }</Typography>
          </CardContent>
        </Card>
      )) }
    </Stack>
  ),
};

/** Product card */
export const ProductCard = {
  render: () => (
    <Card sx={ { maxWidth: 280 } }>
      <CardMedia
        component="img"
        height="200"
        image={ placeholderSvg(280, 200) }
        alt="Product image"
      />
      <CardContent>
        <Box sx={ { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 } }>
          <Typography variant="subtitle1" sx={ { fontWeight: 600 } }>
            Premium Wireless Earbuds
          </Typography>
          <Chip label="NEW" size="small" color="primary" />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={ { mb: 2 } }>
          High-quality sound and comfortable fit
        </Typography>
        <Box sx={ { display: 'flex', alignItems: 'baseline', gap: 1 } }>
          <Typography variant="h6" color="primary" sx={ { fontWeight: 700 } }>
            ₩89,000
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={ { textDecoration: 'line-through' } }
          >
            ₩120,000
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Button variant="contained" fullWidth>
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  ),
};

/** Blog post card */
export const BlogPostCard = {
  render: () => (
    <Card sx={ { maxWidth: 400 } }>
      <CardMedia
        component="img"
        height="180"
        image={ placeholderSvg(400, 180) }
        alt="Blog thumbnail"
      />
      <CardContent>
        <Stack direction="row" spacing={ 1 } sx={ { mb: 1 } }>
          <Chip label="React" size="small" variant="outlined" />
          <Chip label="TypeScript" size="small" variant="outlined" />
        </Stack>
        <Typography variant="h6" gutterBottom sx={ { fontWeight: 600 } }>
          Exploring the New Features of React 19
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={ { mb: 2 } }>
          Learn about the new features and performance improvements added in React 19.
          Actions, use(), and the new hooks...
        </Typography>
        <Box sx={ { display: 'flex', alignItems: 'center', gap: 2 } }>
          <Avatar sx={ { width: 32, height: 32, bgcolor: 'secondary.main' } }>D</Avatar>
          <Box>
            <Typography variant="caption" sx={ { fontWeight: 500 } }>
              Developer Kim
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              2024.01.15 · 5 min read
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  ),
};

/** Profile card */
export const ProfileCard = {
  render: () => (
    <Card sx={ { maxWidth: 300, textAlign: 'center' } }>
      <Box sx={ { pt: 3 } }>
        <Avatar
          sx={ {
            width: 80,
            height: 80,
            mx: 'auto',
            bgcolor: 'primary.main',
            fontSize: '2rem',
          } }
        >
          JS
        </Avatar>
      </Box>
      <CardContent>
        <Typography variant="h6" sx={ { fontWeight: 600 } }>
          Sumin Jung
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Frontend Developer
        </Typography>
        <Stack direction="row" spacing={ 1 } justifyContent="center" sx={ { mt: 2 } }>
          <Chip label="React" size="small" />
          <Chip label="TypeScript" size="small" />
          <Chip label="MUI" size="small" />
        </Stack>
      </CardContent>
      <CardActions sx={ { justifyContent: 'center', pb: 2 } }>
        <Button variant="outlined" size="small">
          View Profile
        </Button>
        <Button variant="contained" size="small">
          Follow
        </Button>
      </CardActions>
    </Card>
  ),
};

/** Stat card */
export const StatCard = {
  render: () => (
    <Stack direction="row" spacing={ 2 }>
      <Card sx={ { minWidth: 180 } }>
        <CardContent>
          <Typography variant="overline" color="text.secondary">
            Total Visitors
          </Typography>
          <Typography variant="h4" sx={ { fontWeight: 700 } }>
            12,543
          </Typography>
          <Typography variant="caption" color="success.main">
            +12.5% vs last week
          </Typography>
        </CardContent>
      </Card>
      <Card sx={ { minWidth: 180 } }>
        <CardContent>
          <Typography variant="overline" color="text.secondary">
            New Signups
          </Typography>
          <Typography variant="h4" sx={ { fontWeight: 700 } }>
            847
          </Typography>
          <Typography variant="caption" color="error.main">
            -3.2% vs last week
          </Typography>
        </CardContent>
      </Card>
      <Card sx={ { minWidth: 180 } }>
        <CardContent>
          <Typography variant="overline" color="text.secondary">
            Conversion Rate
          </Typography>
          <Typography variant="h4" sx={ { fontWeight: 700 } }>
            4.8%
          </Typography>
          <Typography variant="caption" color="success.main">
            +0.8% vs last week
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  ),
};

/** Card grid */
export const CardGrid = {
  render: () => (
    <Box sx={ { width: 800 } }>
      <Grid container spacing={ 3 }>
        { [1, 2, 3, 4, 5, 6].map((item) => (
          <Grid size={ { xs: 12, sm: 6, md: 4 } } key={ item }>
            <Card>
              <CardMedia
                component="img"
                height="120"
                image={ placeholderSvg(300, 120) }
                alt={ `Image ${item}` }
              />
              <CardContent>
                <Typography variant="subtitle1" sx={ { fontWeight: 600 } }>
                  Card Title { item }
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This is card description text.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )) }
      </Grid>
    </Box>
  ),
};
