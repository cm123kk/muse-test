import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Placeholder, { placeholderSvg } from '../../common/ui/Placeholder';
import { DocumentTitle, PageContainer, SectionTitle } from '../storybookDocumentation';
import { ImageCarousel } from './ImageCarousel';
import { CarouselIndicator } from './CarouselIndicator';

export default {
  title: 'Component/4. Media/ImageCarousel',
  component: ImageCarousel,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## ImageCarousel

Image carousel Component that supports swipe and autoplay.

### Use cases
- Product image galleries
- Hero sliders
- Promotion banners
        `,
      },
    },
  },
  argTypes: {
    transition: {
      control: 'select',
      options: ['slide', 'fade'],
      description: 'Transition type',
    },
    isAutoPlay: {
      control: 'boolean',
      description: 'Autoplay',
    },
    hasArrows: {
      control: 'boolean',
      description: 'Show arrow buttons',
    },
    hasIndicator: {
      control: 'boolean',
      description: 'Show indicator',
    },
    indicatorType: {
      control: 'select',
      options: ['dot', 'line', 'fraction', 'progress'],
      description: 'Indicator type',
    },
    indicatorPosition: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Indicator position',
    },
  },
};

// Sample images
const sampleImages = [
  { src: placeholderSvg(1200, 800), alt: 'Mountains' },
  { src: placeholderSvg(1200, 800), alt: 'Forest' },
  { src: placeholderSvg(1200, 800), alt: 'Beach' },
  { src: placeholderSvg(1200, 800), alt: 'Night Sky' },
  { src: placeholderSvg(1200, 800), alt: 'Forest Path' },
];

/** Basic usage */
export const Default = {
  args: {
    images: sampleImages,
    aspectRatio: '16/9',
    transition: 'slide',
    isAutoPlay: false,
    hasArrows: true,
    hasIndicator: true,
    indicatorType: 'dot',
    indicatorPosition: 'bottom',
    isLoop: true,
  },
  render: (args) => (
    <Box sx={ { maxWidth: 800 } }>
      <ImageCarousel { ...args } />
    </Box>
  ),
};

/** Documentation and demo */
export const Documentation = {
  render: () => (
    <>
      <DocumentTitle
        title="ImageCarousel"
        status="Available"
        note="Swipe/autoplay image carousel"
        brandName="Media"
        systemName="Starter Kit"
        version="1.0"
      />
      <PageContainer>
        <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
          ImageCarousel
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={ { mb: 4 } }>
          Image carousel that supports swipe gestures, keyboard navigation, and autoplay.
          The built-in CarouselIndicator shows the current position.
        </Typography>

        <SectionTitle title="Props" description="Props for the ImageCarousel Component." />
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
                <TableCell>Array of images</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>transition</TableCell>
                <TableCell>&apos;slide&apos; | &apos;fade&apos;</TableCell>
                <TableCell>&apos;slide&apos;</TableCell>
                <TableCell>Transition type</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>isAutoPlay</TableCell>
                <TableCell>boolean</TableCell>
                <TableCell>false</TableCell>
                <TableCell>Autoplay</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>autoPlayInterval</TableCell>
                <TableCell>number</TableCell>
                <TableCell>5000</TableCell>
                <TableCell>Autoplay interval (ms)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>isLoop</TableCell>
                <TableCell>boolean</TableCell>
                <TableCell>true</TableCell>
                <TableCell>Infinite loop</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>hasIndicator</TableCell>
                <TableCell>boolean</TableCell>
                <TableCell>true</TableCell>
                <TableCell>Show indicator</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>indicatorType</TableCell>
                <TableCell>&apos;dot&apos; | &apos;line&apos; | &apos;fraction&apos; | &apos;progress&apos;</TableCell>
                <TableCell>&apos;dot&apos;</TableCell>
                <TableCell>Indicator type</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>indicatorPosition</TableCell>
                <TableCell>&apos;top&apos; | &apos;bottom&apos; | &apos;left&apos; | &apos;right&apos;</TableCell>
                <TableCell>&apos;bottom&apos;</TableCell>
                <TableCell>Indicator position</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>hasArrows</TableCell>
                <TableCell>boolean</TableCell>
                <TableCell>true</TableCell>
                <TableCell>Show arrow buttons</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle title="Slide Transition" description="Default slide Transition. You can drag to swipe." />
        <Box sx={ { maxWidth: 700 } }>
          <ImageCarousel
            images={ sampleImages }
            transition="slide"
            hasIndicator
            indicatorType="dot"
          />
        </Box>

        <SectionTitle title="Fade Transition" description="Fade Transition." />
        <Box sx={ { maxWidth: 700 } }>
          <ImageCarousel
            images={ sampleImages }
            transition="fade"
            transitionDuration={ 500 }
            hasIndicator
            indicatorType="line"
          />
        </Box>

        <SectionTitle title="Auto Play" description="Autoplay carousel. It pauses on hover." />
        <Box sx={ { maxWidth: 700 } }>
          <ImageCarousel
            images={ sampleImages }
            isAutoPlay
            autoPlayInterval={ 3000 }
            hasIndicator
            indicatorType="progress"
          />
        </Box>

        <SectionTitle title="Indicator Types" description="Various indicator types." />
        <Stack spacing={ 4 }>
          <Box>
            <Typography variant="subtitle2" sx={ { mb: 1, color: 'text.secondary' } }>
              Dot (Default)
            </Typography>
            <Box sx={ { maxWidth: 500 } }>
              <ImageCarousel
                images={ sampleImages.slice(0, 4) }
                hasIndicator
                indicatorType="dot"
                hasArrows={ false }
              />
            </Box>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={ { mb: 1, color: 'text.secondary' } }>
              Line
            </Typography>
            <Box sx={ { maxWidth: 500 } }>
              <ImageCarousel
                images={ sampleImages.slice(0, 4) }
                hasIndicator
                indicatorType="line"
                hasArrows={ false }
              />
            </Box>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={ { mb: 1, color: 'text.secondary' } }>
              Fraction
            </Typography>
            <Box sx={ { maxWidth: 500 } }>
              <ImageCarousel
                images={ sampleImages.slice(0, 4) }
                hasIndicator
                indicatorType="fraction"
                hasArrows={ false }
              />
            </Box>
          </Box>
        </Stack>

        <SectionTitle title="Indicator Position" description="Indicator position options." />
        <Stack direction={ { xs: 'column', md: 'row' } } spacing={ 2 }>
          <Box sx={ { flex: 1 } }>
            <Typography variant="caption" sx={ { mb: 1, display: 'block' } }>Top</Typography>
            <ImageCarousel
              images={ sampleImages.slice(0, 3) }
              aspectRatio="4/3"
              indicatorPosition="top"
              hasArrows={ false }
            />
          </Box>
          <Box sx={ { flex: 1 } }>
            <Typography variant="caption" sx={ { mb: 1, display: 'block' } }>Right</Typography>
            <ImageCarousel
              images={ sampleImages.slice(0, 3) }
              aspectRatio="4/3"
              indicatorPosition="right"
              hasArrows={ false }
            />
          </Box>
        </Stack>

        <SectionTitle title="CarouselIndicator (Standalone)" description="The indicator can be used independently." />
        <Stack spacing={ 3 } sx={ { p: 3, backgroundColor: 'grey.100' } }>
          <Box>
            <Typography variant="caption" sx={ { mb: 1, display: 'block' } }>Dot</Typography>
            <CarouselIndicator total={ 5 } current={ 2 } type="dot" />
          </Box>
          <Box>
            <Typography variant="caption" sx={ { mb: 1, display: 'block' } }>Line</Typography>
            <CarouselIndicator total={ 5 } current={ 2 } type="line" />
          </Box>
          <Box>
            <Typography variant="caption" sx={ { mb: 1, display: 'block' } }>Fraction</Typography>
            <CarouselIndicator total={ 5 } current={ 2 } type="fraction" />
          </Box>
          <Box>
            <Typography variant="caption" sx={ { mb: 1, display: 'block' } }>Progress</Typography>
            <CarouselIndicator total={ 5 } current={ 2 } type="progress" />
          </Box>
        </Stack>

        <SectionTitle title="Different Aspect Ratios" description="Various aspect ratio settings." />
        <Stack direction={ { xs: 'column', md: 'row' } } spacing={ 2 }>
          <Box sx={ { flex: 1 } }>
            <Typography variant="caption" sx={ { mb: 1, display: 'block' } }>16/9</Typography>
            <ImageCarousel images={ sampleImages.slice(0, 3) } aspectRatio="16/9" hasArrows={ false } />
          </Box>
          <Box sx={ { flex: 1 } }>
            <Typography variant="caption" sx={ { mb: 1, display: 'block' } }>1/1</Typography>
            <ImageCarousel images={ sampleImages.slice(0, 3) } aspectRatio="1/1" hasArrows={ false } />
          </Box>
        </Stack>

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
          { `// Default carousel
<ImageCarousel
  images={['img1.jpg', 'img2.jpg', 'img3.jpg']}
  hasIndicator
  hasArrows
/>

// Autoplay plus fade Transition
<ImageCarousel
  images={productImages}
  transition="fade"
  isAutoPlay
  autoPlayInterval={4000}
  indicatorType="progress"
/>

// Indicator only
<CarouselIndicator
  total={5}
  current={currentIndex}
  type="line"
  onClick={(index) => setCurrentIndex(index)}
/>` }
        </Box>
      </PageContainer>
    </>
  ),
};
