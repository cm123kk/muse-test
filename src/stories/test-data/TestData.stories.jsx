import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { DocumentTitle, PageContainer, SectionTitle } from '../../components/storybookDocumentation';
import AspectMedia from '../../components/media/AspectMedia';
import {
  testImages,
  testVideos,
  getCategories,
} from '../../utils/pexels-test-data';

export default {
  title: 'Test Data/Pexels Gallery',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## Test Data

Free stock image and video test data based on the Pexels API.

### Usage
\`\`\`js
import { testImages, testVideos, getRandomImage } from '@/utils/pexels-test-data';

// Image from a specific category
<img src={testImages.nature[0].src.medium} />

// Random image
<img src={getRandomImage('product').src.large} />
\`\`\`

### License
Pexels License: free to use, commercial use allowed, attribution recommended
        `,
      },
    },
  },
};

/**
 * Image card component
 */
const ImageCard = ({ image, onCopy }) => {
  return (
    <Box sx={{ position: 'relative' }}>
      <AspectMedia
        src={image.src.medium}
        alt={image.alt}
        aspectRatio={image.aspectRatio}
        sx={{ backgroundColor: 'grey.100' }}
      />
      <Stack spacing={0.5} sx={{ mt: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 600 }} noWrap>
          {image.alt}
        </Typography>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Chip label={image.aspectRatio} size="small" variant="outlined" />
          <Typography variant="caption" color="text.secondary">
            by {image.photographer}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
          {['small', 'medium', 'large'].map((size) => (
            <Chip
              key={size}
              label={size}
              size="small"
              onClick={() => onCopy(image.src[size], `${size} URL`)}
              sx={{
                fontSize: '0.65rem',
                height: 20,
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'primary.main', color: 'white' },
              }}
            />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
};

/**
 * Video card component
 */
const VideoCard = ({ video, onCopy }) => {
  return (
    <Box sx={{ position: 'relative' }}>
      <AspectMedia
        type="video"
        src={video.src.sd}
        poster={video.poster}
        aspectRatio={video.aspectRatio}
        isAutoPlay
        isMuted
        isLoop
        sx={{ backgroundColor: 'grey.900' }}
      />
      <Stack spacing={0.5} sx={{ mt: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 600 }} noWrap>
          {video.alt}
        </Typography>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Chip label={`${video.duration}s`} size="small" variant="outlined" />
          <Typography variant="caption" color="text.secondary">
            by {video.photographer}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
          {['sd', 'hd'].map((quality) => (
            <Chip
              key={quality}
              label={quality.toUpperCase()}
              size="small"
              onClick={() => onCopy(video.src[quality], `${quality.toUpperCase()} URL`)}
              sx={{
                fontSize: '0.65rem',
                height: 20,
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'primary.main', color: 'white' },
              }}
            />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
};

/**
 * Main test data gallery component
 */
const TestDataGallery = () => {
  const [mediaType, setMediaType] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const categories = getCategories();

  const handleCopy = (url, label) => {
    navigator.clipboard.writeText(url);
    setSnackbar({ open: true, message: `${label} copied!` });
  };

  return (
    <>
      <DocumentTitle
        title="Test Data"
        status="Available"
        note="Pexels-based test images and videos"
        brandName="Design System"
        systemName="Starter Kit"
        version="1.0"
      />
      <PageContainer>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Test Data Gallery
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Pexels stock media for Storybook and development testing. Click a chip to copy the URL.
        </Typography>

        {/* Tabs */}
        <Tabs
          value={mediaType}
          onChange={(_, v) => setMediaType(v)}
          sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label={`Images (${categories.images.length} categories)`} />
          <Tab label={`Videos (${categories.videos.length} categories)`} />
        </Tabs>

        {/* Images tab */}
        {mediaType === 0 && (
          <>
            {categories.images.map((category) => (
              <Box key={category} sx={{ mb: 6 }}>
                <SectionTitle
                  title={category.charAt(0).toUpperCase() + category.slice(1)}
                  description={`${testImages[category].length} images`}
                />
                <Grid container spacing={3}>
                  {testImages[category].map((image) => (
                    <Grid size={{ xs: 6, sm: 4, md: 3 }} key={image.id}>
                      <ImageCard image={image} onCopy={handleCopy} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </>
        )}

        {/* Videos tab */}
        {mediaType === 1 && (
          <>
            {categories.videos.map((category) => (
              <Box key={category} sx={{ mb: 6 }}>
                <SectionTitle
                  title={category.charAt(0).toUpperCase() + category.slice(1)}
                  description={`${testVideos[category].length} videos`}
                />
                <Grid container spacing={3}>
                  {testVideos[category].map((video) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={video.id}>
                      <VideoCard video={video} onCopy={handleCopy} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </>
        )}

        {/* Usage section */}
        <SectionTitle title="Usage" description="Code example" />
        <Box
          component="pre"
          sx={{
            backgroundColor: 'grey.100',
            p: 2,
            fontSize: 12,
            fontFamily: 'monospace',
            overflow: 'auto',
            mb: 4,
          }}
        >
{`import { testImages, testVideos, getRandomImage } from '@/utils/pexels-test-data';
import AspectMedia from '@/components/media/AspectMedia';

// Using an image
<AspectMedia
  src={testImages.nature[0].src.medium}
  alt={testImages.nature[0].alt}
  aspectRatio="16/9"
/>

// Using a video
<AspectMedia
  type="video"
  src={testVideos.nature[0].src.hd}
  aspectRatio="16/9"
  isAutoPlay
  isMuted
  isLoop
/>

// Random image
const randomImg = getRandomImage('product');
<img src={randomImg.src.large} alt={randomImg.alt} />`}
        </Box>

        {/* API reference table */}
        <SectionTitle title="API Reference" description="Utility functions" />
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Function</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Parameters</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>getRandomImage(category)</TableCell>
                <TableCell sx={{ fontSize: 13 }}>category: string</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>Returns a random image from a specific category</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>getRandomVideo(category)</TableCell>
                <TableCell sx={{ fontSize: 13 }}>category: string</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>Returns a random video from a specific category</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>getCategories()</TableCell>
                <TableCell sx={{ fontSize: 13 }}>-</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>Returns the list of available categories</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>getImagesByRatio(ratio)</TableCell>
                <TableCell sx={{ fontSize: 13 }}>ratio: string (e.g. '16/9')</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>Filters images by a specific aspect ratio</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>getPlaceholder(w, h, cat)</TableCell>
                <TableCell sx={{ fontSize: 13 }}>width, height, category</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>Generates a placeholder URL at the given size</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {/* Image sizes table */}
        <SectionTitle title="Image Sizes" description="Available size options" />
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Size</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Width</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Use Case</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>thumbnail</TableCell>
                <TableCell sx={{ fontSize: 13 }}>160px</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>Small previews, icons</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>small</TableCell>
                <TableCell sx={{ fontSize: 13 }}>320px</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>Mobile thumbnails</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>medium</TableCell>
                <TableCell sx={{ fontSize: 13 }}>640px</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>Cards, list items</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>large</TableCell>
                <TableCell sx={{ fontSize: 13 }}>1260px</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>Hero, backgrounds</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>original</TableCell>
                <TableCell sx={{ fontSize: 13 }}>Full</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>Original resolution</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </PageContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </>
  );
};

/** Default gallery */
export const Default = {
  render: () => <TestDataGallery />,
};
