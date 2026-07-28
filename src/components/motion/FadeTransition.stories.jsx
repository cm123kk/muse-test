import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Placeholder from '../../common/ui/Placeholder';
import FadeTransition from './FadeTransition';

export default {
  title: 'Interactive/14. Motion/FadeTransition',
  component: FadeTransition,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    isIn: {
      control: 'boolean',
      description: 'Visibility (true: fade in, false: fade out)',
    },
    duration: {
      control: { type: 'number', min: 100, max: 3000, step: 100 },
      description: 'Transition duration (milliseconds)',
    },
    delay: {
      control: { type: 'number', min: 0, max: 2000, step: 100 },
      description: 'Transition delay (milliseconds)',
    },
    direction: {
      control: 'select',
      options: ['none', 'up', 'down', 'left', 'right'],
      description: 'Slide direction',
    },
    distance: {
      control: { type: 'number', min: 0, max: 100, step: 4 },
      description: 'Slide travel distance (px)',
    },
    easing: {
      control: 'text',
      description: 'CSS easing function',
    },
    isTriggerOnView: {
      control: 'boolean',
      description: 'Auto trigger on viewport entry',
    },
    threshold: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
      description: 'IntersectionObserver detection ratio',
    },
  },
};

export const Default = {
  args: {
    isIn: true,
    duration: 500,
    delay: 0,
    direction: 'none',
    distance: 24,
    isTriggerOnView: false,
    threshold: 0.1,
  },
  render: (args) => (
    <FadeTransition { ...args }>
      <Placeholder.Box width={ 240 } height={ 160 } label="Fade Content" />
    </FadeTransition>
  ),
};

/** Toggle button to switch between fade in and fade out */
const ToggleDemo = () => {
  const [isIn, setIsIn] = useState(true);

  return (
    <Box sx={ { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 } }>
      <Button variant="outlined" onClick={ () => setIsIn((prev) => !prev) }>
        { isIn ? 'Fade Out' : 'Fade In' }
      </Button>
      <FadeTransition isIn={ isIn } duration={ 600 }>
        <Placeholder.Card width={ 280 } />
      </FadeTransition>
    </Box>
  );
};

export const Toggle = {
  render: () => <ToggleDemo />,
};

export const Directions = {
  render: () => {
    const directions = ['none', 'up', 'down', 'left', 'right'];

    return (
      <Box sx={ { display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' } }>
        { directions.map((dir, index) => (
          <Box key={ dir } sx={ { textAlign: 'center' } }>
            <Typography
              variant="overline"
              color="text.secondary"
              sx={ { mb: 1, display: 'block' } }
            >
              { dir === 'none' ? 'Fade Only' : `Fade + Slide ${dir}` }
            </Typography>
            <FadeTransition
              direction={ dir }
              duration={ 800 }
              delay={ index * 150 }
              isTriggerOnView
            >
              <Placeholder.Box width={ 200 } height={ 80 } label={ dir } />
            </FadeTransition>
          </Box>
        )) }
      </Box>
    );
  },
};

export const StaggeredList = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => {
    const items = ['Design System', 'Component Library', 'Style Guide', 'Pattern Library', 'Token Spec'];

    return (
      <Box sx={ { height: '200vh', pt: 20 } }>
        <Typography
          variant="overline"
          color="text.secondary"
          sx={ { mb: 3, display: 'block', textAlign: 'center' } }
        >
          Scroll down to reveal items
        </Typography>
        <Box sx={ { display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 400, mx: 'auto' } }>
          { items.map((label, index) => (
            <FadeTransition
              key={ label }
              direction="up"
              duration={ 600 }
              delay={ index * 100 }
              isTriggerOnView
              threshold={ 0.2 }
            >
              <Box
                sx={ {
                  p: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                } }
              >
                <Typography
                  variant="h4"
                  sx={ { fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: 'primary.main' } }
                >
                  { String(index + 1).padStart(2, '0') }
                </Typography>
                <Typography variant="body1">{ label }</Typography>
              </Box>
            </FadeTransition>
          )) }
        </Box>
      </Box>
    );
  },
};
