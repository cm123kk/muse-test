import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { DocumentTitle, PageContainer, SectionTitle } from '../storybookDocumentation';
import Placeholder, { placeholderSvg } from '../../common/ui/Placeholder';
import { ImageTransition } from './ImageTransition';

export default {
  title: 'Component/4. Media/ImageTransition',
  component: ImageTransition,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## ImageTransition

Index-based image Transition Component.

### Use cases
- Transitions for image sliders/galleries
- Hero image Transition
- Product image change effects
        `,
      },
    },
  },
  argTypes: {
    transition: {
      control: 'select',
      options: ['fade', 'slide', 'zoom', 'reveal', 'flip'],
      description: 'Transition effect',
    },
    duration: {
      control: { type: 'range', min: 200, max: 2000, step: 100 },
      description: 'Transition duration (ms)',
    },
    aspectRatio: {
      control: 'select',
      options: ['16/9', '4/3', '1/1', '21/9'],
      description: 'Container aspect ratio',
    },
  },
};

// Sample images
const sampleImages = [
  { src: placeholderSvg(1200, 800), alt: 'Mountains' },
  { src: placeholderSvg(1200, 800), alt: 'Forest' },
  { src: placeholderSvg(1200, 800), alt: 'Beach' },
  { src: placeholderSvg(1200, 800), alt: 'Night Sky' },
];

/** Basic usage */
export const Default = {
  render: function DefaultStory() {
    const [index, setIndex] = useState(0);

    return (
      <Box sx={ { maxWidth: 800 } }>
        <ImageTransition
          images={ sampleImages }
          activeIndex={ index }
          transition="fade"
          duration={ 500 }
        />
        <Stack direction="row" spacing={ 1 } sx={ { mt: 2, justifyContent: 'center' } }>
          { sampleImages.map((_, i) => (
            <Button
              key={ i }
              variant={ index === i ? 'contained' : 'outlined' }
              size="small"
              onClick={ () => setIndex(i) }
            >
              { i + 1 }
            </Button>
          )) }
        </Stack>
      </Box>
    );
  },
};

/** Documentation and demo */
export const Documentation = {
  render: function DocumentationStory() {
    const [fadeIndex, setFadeIndex] = useState(0);
    const [slideIndex, setSlideIndex] = useState(0);
    const [zoomIndex, setZoomIndex] = useState(0);
    const [revealIndex, setRevealIndex] = useState(0);
    const [flipIndex, setFlipIndex] = useState(0);

    const handlePrev = (current, setter) => {
      setter(current > 0 ? current - 1 : sampleImages.length - 1);
    };

    const handleNext = (current, setter) => {
      setter(current < sampleImages.length - 1 ? current + 1 : 0);
    };

    return (
      <>
        <DocumentTitle
          title="ImageTransition"
          status="Available"
          note="Index-based image transition component"
          brandName="Media"
          systemName="Starter Kit"
          version="1.0"
        />
        <PageContainer>
          <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
            ImageTransition
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={ { mb: 4 } }>
            Changing activeIndex runs a Transition between the previous image and the new image.
            It supports five Transition effects.
          </Typography>

          <SectionTitle title="Props" description="Props for the ImageTransition Component." />
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={ { fontWeight: 600 } }>Prop</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>Type</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>Default</TableCell>
                  <TableCell sx={ { fontWeight: 600 } }>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={ { fontFamily: 'monospace' } }>images</TableCell>
                  <TableCell>Array</TableCell>
                  <TableCell>[]</TableCell>
                  <TableCell>Array of images (string[] or {'{src, alt}'}[])</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={ { fontFamily: 'monospace' } }>activeIndex</TableCell>
                  <TableCell>number</TableCell>
                  <TableCell>0</TableCell>
                  <TableCell>Index of the currently active image</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={ { fontFamily: 'monospace' } }>transition</TableCell>
                  <TableCell>&apos;fade&apos; | &apos;slide&apos; | &apos;zoom&apos; | &apos;reveal&apos; | &apos;flip&apos;</TableCell>
                  <TableCell>&apos;fade&apos;</TableCell>
                  <TableCell>Transition effect</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={ { fontFamily: 'monospace' } }>duration</TableCell>
                  <TableCell>number</TableCell>
                  <TableCell>500</TableCell>
                  <TableCell>Transition duration (ms)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={ { fontFamily: 'monospace' } }>easing</TableCell>
                  <TableCell>string</TableCell>
                  <TableCell>&apos;ease-out&apos;</TableCell>
                  <TableCell>CSS easing function</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={ { fontFamily: 'monospace' } }>aspectRatio</TableCell>
                  <TableCell>string</TableCell>
                  <TableCell>&apos;16/9&apos;</TableCell>
                  <TableCell>Container aspect ratio</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={ { fontFamily: 'monospace' } }>onTransitionEnd</TableCell>
                  <TableCell>function</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>Callback when the Transition completes</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <SectionTitle title="Transition: Fade" description="Default crossfade effect." />
          <Box sx={ { maxWidth: 700 } }>
            <ImageTransition
              images={ sampleImages }
              activeIndex={ fadeIndex }
              transition="fade"
              duration={ 600 }
            />
            <Stack direction="row" spacing={ 1 } sx={ { mt: 2, justifyContent: 'center' } }>
              <Button variant="outlined" onClick={ () => handlePrev(fadeIndex, setFadeIndex) }>
                ← Prev
              </Button>
              <Typography sx={ { lineHeight: '36px', px: 2 } }>
                { fadeIndex + 1 } / { sampleImages.length }
              </Typography>
              <Button variant="outlined" onClick={ () => handleNext(fadeIndex, setFadeIndex) }>
                Next →
              </Button>
            </Stack>
          </Box>

          <SectionTitle title="Transition: Slide" description="Left-right slide effect." />
          <Box sx={ { maxWidth: 700 } }>
            <ImageTransition
              images={ sampleImages }
              activeIndex={ slideIndex }
              transition="slide"
              duration={ 500 }
            />
            <Stack direction="row" spacing={ 1 } sx={ { mt: 2, justifyContent: 'center' } }>
              <Button variant="outlined" onClick={ () => handlePrev(slideIndex, setSlideIndex) }>
                ← Prev
              </Button>
              <Typography sx={ { lineHeight: '36px', px: 2 } }>
                { slideIndex + 1 } / { sampleImages.length }
              </Typography>
              <Button variant="outlined" onClick={ () => handleNext(slideIndex, setSlideIndex) }>
                Next →
              </Button>
            </Stack>
          </Box>

          <SectionTitle title="Transition: Zoom" description="Zoom in/out effect." />
          <Box sx={ { maxWidth: 700 } }>
            <ImageTransition
              images={ sampleImages }
              activeIndex={ zoomIndex }
              transition="zoom"
              duration={ 700 }
            />
            <Stack direction="row" spacing={ 1 } sx={ { mt: 2, justifyContent: 'center' } }>
              <Button variant="outlined" onClick={ () => handlePrev(zoomIndex, setZoomIndex) }>
                ← Prev
              </Button>
              <Typography sx={ { lineHeight: '36px', px: 2 } }>
                { zoomIndex + 1 } / { sampleImages.length }
              </Typography>
              <Button variant="outlined" onClick={ () => handleNext(zoomIndex, setZoomIndex) }>
                Next →
              </Button>
            </Stack>
          </Box>

          <SectionTitle title="Transition: Reveal" description="Mask reveal effect." />
          <Box sx={ { maxWidth: 700 } }>
            <ImageTransition
              images={ sampleImages }
              activeIndex={ revealIndex }
              transition="reveal"
              duration={ 800 }
            />
            <Stack direction="row" spacing={ 1 } sx={ { mt: 2, justifyContent: 'center' } }>
              <Button variant="outlined" onClick={ () => handlePrev(revealIndex, setRevealIndex) }>
                ← Prev
              </Button>
              <Typography sx={ { lineHeight: '36px', px: 2 } }>
                { revealIndex + 1 } / { sampleImages.length }
              </Typography>
              <Button variant="outlined" onClick={ () => handleNext(revealIndex, setRevealIndex) }>
                Next →
              </Button>
            </Stack>
          </Box>

          <SectionTitle title="Transition: Flip" description="3D flip effect." />
          <Box sx={ { maxWidth: 700 } }>
            <ImageTransition
              images={ sampleImages }
              activeIndex={ flipIndex }
              transition="flip"
              duration={ 600 }
            />
            <Stack direction="row" spacing={ 1 } sx={ { mt: 2, justifyContent: 'center' } }>
              <Button variant="outlined" onClick={ () => handlePrev(flipIndex, setFlipIndex) }>
                ← Prev
              </Button>
              <Typography sx={ { lineHeight: '36px', px: 2 } }>
                { flipIndex + 1 } / { sampleImages.length }
              </Typography>
              <Button variant="outlined" onClick={ () => handleNext(flipIndex, setFlipIndex) }>
                Next →
              </Button>
            </Stack>
          </Box>

          <SectionTitle title="All Transitions Comparison" description="Comparison of all Transition effects." />
          <TransitionComparison />

          <SectionTitle title="Usage Example" description="Code usage example." />
          <Box
            component="pre"
            sx={ {
              backgroundColor: 'grey.100',
              p: 3,
              fontSize: 13,
              fontFamily: 'monospace',
              overflow: 'auto',
              lineHeight: 1.6,
            } }
          >
            { `const [activeIndex, setActiveIndex] = useState(0);

// Default fade Transition
<ImageTransition
  images={['img1.jpg', 'img2.jpg', 'img3.jpg']}
  activeIndex={activeIndex}
  transition="fade"
  duration={500}
/>

// Slide Transition
<ImageTransition
  images={[
    { src: 'img1.jpg', alt: 'First' },
    { src: 'img2.jpg', alt: 'Second' },
  ]}
  activeIndex={activeIndex}
  transition="slide"
  duration={400}
  aspectRatio="4/3"
  onTransitionEnd={() => console.log('Done!')}
/>` }
          </Box>
        </PageContainer>
      </>
    );
  },
};

/** Transition comparison component */
function TransitionComparison() {
  const [indices, setIndices] = useState({
    fade: 0,
    slide: 0,
    zoom: 0,
    reveal: 0,
    flip: 0,
  });

  const handleChangeAll = () => {
    setIndices(prev => ({
      fade: (prev.fade + 1) % sampleImages.length,
      slide: (prev.slide + 1) % sampleImages.length,
      zoom: (prev.zoom + 1) % sampleImages.length,
      reveal: (prev.reveal + 1) % sampleImages.length,
      flip: (prev.flip + 1) % sampleImages.length,
    }));
  };

  const transitions = ['fade', 'slide', 'zoom', 'reveal', 'flip'];

  return (
    <Box>
      <Button variant="contained" onClick={ handleChangeAll } sx={ { mb: 3 } }>
        Change All Images →
      </Button>
      <Box
        sx={ {
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: 2,
        } }
      >
        { transitions.map((t) => (
          <Box key={ t }>
            <Typography variant="caption" sx={ { mb: 1, display: 'block', fontWeight: 600 } }>
              { t.toUpperCase() }
            </Typography>
            <ImageTransition
              images={ sampleImages }
              activeIndex={ indices[t] }
              transition={ t }
              duration={ 600 }
              aspectRatio="16/9"
            />
          </Box>
        )) }
      </Box>
    </Box>
  );
}
