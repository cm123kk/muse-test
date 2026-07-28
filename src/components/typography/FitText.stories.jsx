import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FitText } from '.';

export default {
  title: 'Component/1. Typography/FitText',
  component: FitText,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## FitText

A responsive typography component that automatically adjusts text size to fit the container width.

### Key Features
- **Auto sizing**: Detects container size changes with ResizeObserver
- **Variant support**: Automatically applies body (Inter) / headline (Chillax) fonts
- **Min/Max limits**: Configurable minimum/maximum font size
- **Spacing control**: Adjusts letterSpacing, wordSpacing multipliers

### Use Cases
- Hero section headlines
- Responsive banner text
- Card titles
        `,
      },
    },
  },
  argTypes: {
    text: {
      control: 'text',
      description: 'Text to display',
      table: {
        type: { summary: 'string' },
      },
    },
    variant: {
      control: 'radio',
      options: ['body', 'headline', 'h1'],
      description: 'Typography variant',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'body' },
      },
    },
    minFontSize: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Minimum font size (px)',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
      },
    },
    maxFontSize: {
      control: { type: 'number', min: 10, max: 500 },
      description: 'Maximum font size (px)',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '9999' },
      },
    },
    letterSpacing: {
      control: { type: 'number', min: 0, max: 5, step: 0.1 },
      description: 'Letter spacing multiplier',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
      },
    },
    wordSpacing: {
      control: { type: 'number', min: 0, max: 5, step: 0.1 },
      description: 'Word spacing multiplier',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
      },
    },
    fontWeight: {
      control: { type: 'number', min: 100, max: 900, step: 100 },
      description: 'Font weight',
      table: {
        type: { summary: 'number' },
      },
    },
  },
};

/** Basic usage */
export const Default = {
  args: {
    text: 'Hello World',
    variant: 'body',
    minFontSize: 16,
    maxFontSize: 200,
  },
  render: (args) => (
    <Box sx={ { width: 400, border: '1px dashed grey', p: 2 } }>
      <FitText { ...args } />
    </Box>
  ),
};

/** Headline variant */
export const Headline = {
  args: {
    text: 'HEADLINE',
    variant: 'headline',
    minFontSize: 24,
    maxFontSize: 300,
  },
  render: (args) => (
    <Box sx={ { width: 500, border: '1px dashed grey', p: 2 } }>
      <FitText { ...args } />
    </Box>
  ),
};

/** Various container widths */
export const ResponsiveWidths = {
  render: () => (
    <Stack spacing={ 3 } sx={ { width: 600 } }>
      { [200, 300, 400, 500].map((width) => (
        <Box key={ width }>
          <Typography variant="caption" sx={ { fontFamily: 'monospace', mb: 1, display: 'block' } }>
            width: { width }px
          </Typography>
          <Box sx={ { width, border: '1px dashed grey', p: 1 } }>
            <FitText text="Responsive Text" variant="body" />
          </Box>
        </Box>
      )) }
    </Stack>
  ),
};

/** Variant comparison */
export const VariantComparison = {
  render: () => (
    <Stack spacing={ 4 } sx={ { width: 500 } }>
      <Box>
        <Typography variant="caption" sx={ { fontFamily: 'monospace', mb: 1, display: 'block' } }>
          variant: body (Inter)
        </Typography>
        <Box sx={ { border: '1px dashed grey', p: 2 } }>
          <FitText text="Body Text Style" variant="body" />
        </Box>
      </Box>
      <Box>
        <Typography variant="caption" sx={ { fontFamily: 'monospace', mb: 1, display: 'block' } }>
          variant: headline (Chillax)
        </Typography>
        <Box sx={ { border: '1px dashed grey', p: 2 } }>
          <FitText text="Headline Style" variant="headline" />
        </Box>
      </Box>
    </Stack>
  ),
};

/** Min/Max font size limits */
export const FontSizeLimits = {
  render: () => (
    <Grid container spacing={ 3 } sx={ { width: 600 } }>
      <Grid size={ { xs: 6 } }>
        <Typography variant="caption" sx={ { fontFamily: 'monospace', mb: 1, display: 'block' } }>
          maxFontSize: 48px
        </Typography>
        <Box sx={ { border: '1px dashed grey', p: 2 } }>
          <FitText text="Limited" variant="headline" maxFontSize={ 48 } />
        </Box>
      </Grid>
      <Grid size={ { xs: 6 } }>
        <Typography variant="caption" sx={ { fontFamily: 'monospace', mb: 1, display: 'block' } }>
          maxFontSize: 120px
        </Typography>
        <Box sx={ { border: '1px dashed grey', p: 2 } }>
          <FitText text="Limited" variant="headline" maxFontSize={ 120 } />
        </Box>
      </Grid>
    </Grid>
  ),
};

/** Spacing adjustment */
export const SpacingOptions = {
  render: () => (
    <Stack spacing={ 3 } sx={ { width: 500 } }>
      { [
        { letterSpacing: 1, wordSpacing: 1, label: 'Default' },
        { letterSpacing: 2, wordSpacing: 1, label: 'Wide Letters' },
        { letterSpacing: 1, wordSpacing: 2, label: 'Wide Words' },
        { letterSpacing: 0.5, wordSpacing: 0.5, label: 'Tight' },
      ].map((config) => (
        <Box key={ config.label }>
          <Typography variant="caption" sx={ { fontFamily: 'monospace', mb: 1, display: 'block' } }>
            { config.label } (letter: { config.letterSpacing }, word: { config.wordSpacing })
          </Typography>
          <Box sx={ { border: '1px dashed grey', p: 2 } }>
            <FitText
              text="Spacing Test"
              variant="body"
              letterSpacing={ config.letterSpacing }
              wordSpacing={ config.wordSpacing }
            />
          </Box>
        </Box>
      )) }
    </Stack>
  ),
};

/**
 * Hero section usage example
 *
 * Extremely minimal full-screen typography.
 * Delivers a powerful message with text alone.
 */
export const HeroSectionUsage = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <Box
      sx={ {
        width: '100%',
        height: '100vh',
        backgroundColor: '#000000',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        px: { xs: 2, md: 4 },
      } }
    >
      <FitText
        text="RETHINK"
        variant="headline"
        sx={ { color: '#ffffff' } }
      />
      <FitText
        text="REVERSE"
        variant="headline"
        sx={ { color: '#ffffff' } }
      />
      <FitText
        text="REPEAT"
        variant="headline"
        sx={ { color: '#ffffff' } }
      />
    </Box>
  ),
};
