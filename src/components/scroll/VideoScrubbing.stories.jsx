import { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { DocumentTitle, PageContainer, SectionTitle } from '../storybookDocumentation';
import VideoScrubbing from './VideoScrubbing';

import testVideo from '../../assets/video/9-motion.mp4';

const TEST_VIDEO_URL = testVideo;

export default {
  title: 'Interactive/12. Scroll/VideoScrubbing',
  component: VideoScrubbing,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## VideoScrubbing

A Component that plays a video frame by frame (scrubbing) based on Scroll position.

### Key Features
- Scroll-based playback: video frames move as the page scrolls
- Performance optimization: IntersectionObserver + requestAnimationFrame (~60fps)
- Progress callback: onProgressChange exposes the progress (0-1) to the outside
        `,
      },
    },
  },
  argTypes: {
    src: {
      control: 'text',
      description: 'Video source path',
      table: {
        type: { summary: 'string' },
      },
    },
    containerRef: {
      control: false,
      description: 'Container element for Scroll tracking',
      table: {
        type: { summary: 'React.RefObject' },
      },
    },
    scrollRange: {
      control: 'object',
      description: 'Scroll range mapping',
      table: {
        type: { summary: '{ start: number, end: number }' },
        defaultValue: { summary: '{ start: 0, end: 1 }' },
      },
    },
    onProgressChange: {
      control: false,
      description: 'Progress change callback (0-1)',
      table: {
        type: { summary: 'function' },
      },
    },
  },
};

/** Scroll area wrapper */
const ScrollArea = ({ children, height = '150vh' }) => (
  <Box sx={{ minHeight: height, pb: 8 }}>
    {children}
  </Box>
);

/** Progress callback demo */
const ProgressDemo = () => {
  const [progress, setProgress] = useState(0);

  return (
    <ScrollArea height="180vh">
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 5,
          backgroundColor: 'grey.100',
          py: 1.5,
          px: 2,
          mb: 3,
        }}
      >
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          progress: {(progress * 100).toFixed(1)}%
        </Typography>
        <Box sx={{ height: 4, backgroundColor: 'grey.300', mt: 1 }}>
          <Box
            sx={{
              height: '100%',
              width: `${progress * 100}%`,
              backgroundColor: 'primary.main',
              transition: 'width 0.05s linear',
            }}
          />
        </Box>
      </Box>
      <Box sx={{ maxWidth: 800 }}>
        <VideoScrubbing
          src={TEST_VIDEO_URL}
          onProgressChange={setProgress}
        />
      </Box>
    </ScrollArea>
  );
};

/** Container Ref demo */
const ContainerRefDemo = () => {
  const containerRef = useRef(null);

  return (
    <ScrollArea height="180vh">
      <Box
        ref={containerRef}
        sx={{
          height: '150vh',
          backgroundColor: 'grey.50',
          p: 2,
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
          Video progresses based on this container height
        </Typography>
        <Box sx={{ position: 'sticky', top: 16, maxWidth: 800 }}>
          <VideoScrubbing
            src={TEST_VIDEO_URL}
            containerRef={containerRef}
          />
        </Box>
      </Box>
    </ScrollArea>
  );
};

/** Basic usage */
export const Default = {
  render: () => (
    <>
      <DocumentTitle
        title="VideoScrubbing"
        status="Available"
        note="Scroll-based video scrubbing"
        brandName="Design System"
        systemName="Starter Kit"
        version="1.0"
      />
      <PageContainer>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          VideoScrubbing
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          A Component that plays a video frame by frame based on Scroll position.
        </Typography>

        <SectionTitle title="Demo" description="Scroll to test video playback" />
        <ScrollArea>
          <Box sx={{ maxWidth: 800 }}>
            <VideoScrubbing src={TEST_VIDEO_URL} />
          </Box>
        </ScrollArea>

        <SectionTitle title="Props" description="Component props" />
        <TableContainer sx={{ mb: 4 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Prop</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Default</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>src</TableCell>
                <TableCell sx={{ fontSize: 13 }}>string</TableCell>
                <TableCell sx={{ fontSize: 13 }}>-</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>Video source path [Required]</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>containerRef</TableCell>
                <TableCell sx={{ fontSize: 13 }}>React.RefObject</TableCell>
                <TableCell sx={{ fontSize: 13 }}>null</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>Container element for Scroll tracking</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>scrollRange</TableCell>
                <TableCell sx={{ fontSize: 13 }}>{'{ start, end }'}</TableCell>
                <TableCell sx={{ fontSize: 13 }}>{'{ 0, 1 }'}</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>Scroll range mapping (0-1)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>onProgressChange</TableCell>
                <TableCell sx={{ fontSize: 13 }}>function</TableCell>
                <TableCell sx={{ fontSize: 13 }}>-</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>Progress change callback (progress: 0-1)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>sx</TableCell>
                <TableCell sx={{ fontSize: 13 }}>object</TableCell>
                <TableCell sx={{ fontSize: 13 }}>{'{}'}</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>MUI sx style object</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

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
{`import VideoScrubbing from '@/components/media/VideoScrubbing';

// Basic usage
<VideoScrubbing src="/video.mp4" />

// Using the progress callback
const [progress, setProgress] = useState(0);
<VideoScrubbing
  src="/video.mp4"
  onProgressChange={setProgress}
/>

// Container-based scroll
const containerRef = useRef(null);
<Box ref={containerRef} sx={{ height: '200vh' }}>
  <VideoScrubbing
    src="/video.mp4"
    containerRef={containerRef}
  />
</Box>`}
        </Box>

        <SectionTitle title="Video Encoding" description="Video encoding for scrubbing optimization" />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          For smooth scrubbing, the video keyframe (I-frame) settings matter.
          Regular video has keyframe intervals of 2 to 10 seconds, so seeking must decode from the nearest keyframe, which causes stutter.
        </Typography>

        <TableContainer sx={{ mb: 3 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Video Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Keyframe Interval</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Seeking Speed</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>File Size</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontSize: 13 }}>Regular MP4</TableCell>
                <TableCell sx={{ fontSize: 13 }}>2 to 10s</TableCell>
                <TableCell sx={{ color: 'error.main', fontSize: 13 }}>50 to 100ms (stutter)</TableCell>
                <TableCell sx={{ fontSize: 13 }}>Default</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontSize: 13 }}>Scrubbing optimized</TableCell>
                <TableCell sx={{ fontSize: 13 }}>Every frame</TableCell>
                <TableCell sx={{ color: 'success.main', fontSize: 13 }}>1 to 5ms (instant)</TableCell>
                <TableCell sx={{ fontSize: 13 }}>2 to 3x</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          FFmpeg Encoding Command
        </Typography>
        <Box
          component="pre"
          sx={{
            backgroundColor: 'grey.100',
            p: 2,
            fontSize: 12,
            fontFamily: 'monospace',
            overflow: 'auto',
            mb: 2,
          }}
        >
{`# Encode every frame as a keyframe
ffmpeg -i input.mp4 -g 1 -keyint_min 1 -c:v libx264 -crf 23 output.mp4

# Option descriptions
# -g 1          : Set GOP (Group of Pictures) size to 1
# -keyint_min 1 : Minimum keyframe interval of 1
# -crf 23       : Quality setting (lower is higher quality, 18 to 28 recommended)`}
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 4 }}>
          Note: keyframe-optimized video increases file size, so it suits short clips (under 30 seconds).
        </Typography>
      </PageContainer>
    </>
  ),
};

/** Progress callback */
export const WithProgressCallback = {
  render: () => (
    <>
      <DocumentTitle
        title="VideoScrubbing"
        status="Available"
        note="Using onProgressChange callback"
        brandName="Design System"
        systemName="Starter Kit"
        version="1.0"
      />
      <PageContainer>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Progress Callback
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          The onProgressChange callback exposes the current progress (0-1) to the outside.
        </Typography>
        <ProgressDemo />
      </PageContainer>
    </>
  ),
};

/** Container Ref */
export const WithContainerRef = {
  render: () => (
    <>
      <DocumentTitle
        title="VideoScrubbing"
        status="Available"
        note="Using containerRef"
        brandName="Design System"
        systemName="Starter Kit"
        version="1.0"
      />
      <PageContainer>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Container Reference
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Passing containerRef calculates Scroll progress relative to that container.
        </Typography>
        <ContainerRefDemo />
      </PageContainer>
    </>
  ),
};

/** Various ratios */
export const AspectRatios = {
  render: () => (
    <>
      <DocumentTitle
        title="VideoScrubbing"
        status="Available"
        note="Aspect ratio variations"
        brandName="Design System"
        systemName="Starter Kit"
        version="1.0"
      />
      <PageContainer>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Aspect Ratios
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          You can apply various aspect ratios with the sx prop.
        </Typography>

        <ScrollArea height="300vh">
          <Stack spacing={6} sx={{ maxWidth: 800 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontFamily: 'monospace' }}>
                aspectRatio: 21/9 (Cinematic)
              </Typography>
              <VideoScrubbing
                src={TEST_VIDEO_URL}
                sx={{ aspectRatio: '21/9', objectFit: 'cover' }}
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontFamily: 'monospace' }}>
                aspectRatio: 16/9 (Standard)
              </Typography>
              <VideoScrubbing
                src={TEST_VIDEO_URL}
                sx={{ aspectRatio: '16/9', objectFit: 'cover' }}
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontFamily: 'monospace' }}>
                aspectRatio: 4/3 (Classic)
              </Typography>
              <VideoScrubbing
                src={TEST_VIDEO_URL}
                sx={{ aspectRatio: '4/3', objectFit: 'cover' }}
              />
            </Box>
          </Stack>
        </ScrollArea>
      </PageContainer>
    </>
  ),
};
