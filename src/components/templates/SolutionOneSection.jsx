import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { ReferenceCard } from '../card/ReferenceCard';

import img1 from '../../assets/example/213923458a6349a228e888fc5ce9bde5.jpg';
import img2 from '../../assets/example/55f247b3e73bb80f77bbde407a6c4bce.jpg';
import img3 from '../../assets/example/6f6f57df5a7e220ec1c9dd5faee279e4.jpg';

const LAYER_LABELS = ['Color', 'Typography', 'Layout', 'Gradient', 'Visual Direction'];
/* 레이어 하나가 done 으로 바뀌는 간격 (ms) */
const LAYER_MS = 600;

/* 미리 준비된 T1 분석 결과 픽스처 — 랜딩 페이지 데모용 */
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

/** layerDoneCount(0~5)로부터 layerStatuses 배열 생성 */
function toLayerStatuses(doneCount) {
  return LAYER_LABELS.map((_, i) => {
    if (i < doneCount) return 'done';
    if (i === doneCount) return 'running';
    return 'pending';
  });
}

/**
 * SolutionOneSection 컴포넌트
 *
 * 랜딩페이지의 솔루션 1 섹션. 뷰포트 진입 시 미리 준비된 T1 픽스처 데이터로
 * 레이어 분석 애니메이션(loading → 태그)을 보여준다.
 *
 * Props: 없음
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
          /* 진입: 기존 타이머 취소 후 애니메이션 시작 */
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
          /* 이탈: 타이머 취소 + 상태 초기화 (다음 진입 시 재생) */
          clearAllTimers();
          setCards(FIXTURES.map(() => ({ state: 0, layerDoneCount: 0 })));
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearAllTimers();
    };
  }, []);

  return (
    <Box
      ref={sectionRef}
      sx={{
        px: { xs: 3, md: 8 },
        py: { xs: 10, md: 14 },
        maxWidth: 1200,
        mx: 'auto',
      }}
    >
      <Box sx={{ mb: 8 }}>
        <Typography
          variant="h3"
          sx={{ fontWeight: 800, letterSpacing: '-0.02em', mb: 2, lineHeight: 1.2 }}
        >
          정확한 분류 체계로 레퍼런스를 관리하세요
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
          업로드 한 장이 들어오면 같은 5 layer 격자 (color, typography, layout, gradient, visual direction) 로 자동 분류됩니다. 분류가 같아야 비교, 합성, 추적이 가능합니다.
        </Typography>
      </Box>

      <Grid container spacing={3}>
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
