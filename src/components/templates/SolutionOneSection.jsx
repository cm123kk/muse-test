import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { ReferenceCard } from '../card/ReferenceCard';

import img1 from '../../assets/example/213923458a6349a228e888fc5ce9bde5.jpg';
import img2 from '../../assets/example/55f247b3e73bb80f77bbde407a6c4bce.jpg';
import img3 from '../../assets/example/6f6f57df5a7e220ec1c9dd5faee279e4.jpg';

const LAYER_LABELS = ['Color', 'Typography', 'Layout', 'Gradient', 'Visual Direction'];
/* Interval between each layer flipping to done (ms) */
const LAYER_MS = 600;

/* Pre-built T1 analysis result fixtures, for the landing page demo */
const FIXTURES = [
  {
    src: img1,
    title: 'Bold Red Manifesto',
    tags: ['Vivid', 'High-contrast', 'Condensed', 'All-caps', 'Display', 'Full-bleed', 'Brutalist', 'Typography-Hero'],
    dominantColors: ['#D91A0A', '#0D0D0D', '#F2EDE8'],
  },
  {
    src: img2,
    title: 'Pixel Grid Blueprint',
    tags: ['Cool', 'Mono', 'Monospace', 'All-caps', 'Grid', 'Modular', 'Swiss', 'UI-Mockup'],
    dominantColors: ['#E5E8E5', '#161616', '#8C8E8C'],
  },
  {
    src: img3,
    title: 'Risograph Print Poster',
    tags: ['Earth', 'Faded', 'Serif', 'Editorial', 'Asymmetric', 'Full-bleed', 'Risograph', 'Typography-Hero'],
    dominantColors: ['#EDE8DF', '#1C1C1C', '#6B6460'],
  },
];

/** Build the layerStatuses array from layerDoneCount (0-5) */
function toLayerStatuses(doneCount) {
  return LAYER_LABELS.map((_, i) => {
    if (i < doneCount) return 'done';
    if (i === doneCount) return 'running';
    return 'pending';
  });
}

/**
 * SolutionOneSection component
 *
 * The Solution 1 section of the landing page. On viewport entry, it plays a layer
 * analysis animation (loading -> tags) using the pre-built T1 fixture data.
 *
 * Props: none
 *
 * Example usage:
 * <SolutionOneSection />
 */
function SolutionOneSection() {
  const [cards, setCards] = useState(
    FIXTURES.map(() => ({ state: 0, layerDoneCount: 0 })),
  );

  const sectionRef = useRef(null);
  const timerRefs = useRef([]);

  const clearAllTimers = () => {
    timerRefs.current.forEach(clearTimeout);
    timerRefs.current = [];
  };

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          /* Entry: cancel existing timers, then start the animation */
          clearAllTimers();
          setCards(FIXTURES.map(() => ({ state: 1, layerDoneCount: 0 })));

          FIXTURES.forEach((_, i) => {
            let doneCount = 0;

            const advance = () => {
              doneCount += 1;
              if (doneCount < LAYER_LABELS.length) {
                setCards((prev) => {
                  const next = [...prev];
                  next[i] = { state: 1, layerDoneCount: doneCount };
                  return next;
                });
                timerRefs.current.push(setTimeout(advance, LAYER_MS));
              } else {
                setCards((prev) => {
                  const next = [...prev];
                  next[i] = { state: 2, layerDoneCount: LAYER_LABELS.length };
                  return next;
                });
              }
            };

            timerRefs.current.push(setTimeout(advance, LAYER_MS));
          });
        } else {
          /* Exit: cancel timers + reset state (replays on next entry) */
          clearAllTimers();
          setCards(FIXTURES.map(() => ({ state: 0, layerDoneCount: 0 })));
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearAllTimers();
    };
  }, []);

  return (
    <Box
      sx={{
        px: { xs: 3, md: 8 },
        py: { xs: 10, md: 14 },
        maxWidth: 1200,
        mx: 'auto',
      }}
    >
      <Box sx={{ mb: 8 }}>
        <Typography
          variant="sectionHeading"
          component="h3"
          sx={{ mb: 2 }}
        >
          Organize your references with a precise taxonomy
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
          Every upload is automatically sorted into the same 5 layer grid (color, typography, layout, gradient, visual direction). A shared taxonomy is what makes references comparable, composable, and traceable.
        </Typography>
      </Box>

      <Grid ref={sectionRef} container spacing={3}>
        {FIXTURES.map((fixture, i) => {
          const card = cards[i];
          const isDone = card.state === 2;
          const layerStatuses = card.state === 1
            ? toLayerStatuses(card.layerDoneCount)
            : undefined;

          return (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
              <ReferenceCard
                src={fixture.src}
                title={isDone ? fixture.title : undefined}
                tags={isDone ? fixture.tags : []}
                dominantColors={isDone ? fixture.dominantColors : []}
                state={card.state}
                analyzingVariant="strip"
                layerStatuses={layerStatuses}
                layerLabels={LAYER_LABELS}
                mediaRatio="auto"
                hideActions
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default SolutionOneSection;
