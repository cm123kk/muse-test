import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import MarqueeContainer from '../motion/MarqueeContainer';

/*
 * T1 자동 태깅에서 사용하는 태그 어휘 (SolutionOneSection FIXTURES 기반).
 * 3 행으로 나눠 서로 교차 방향으로 흐른다.
 */
const TAG_ROWS = [
  ['Brutalist', 'High-contrast', 'Typography-Hero', 'Full-bleed', 'All-caps', 'Display'],
  ['Swiss', 'Grid', 'Modular', 'Monospace', 'Mono', 'UI-Mockup', 'Cool'],
  ['Risograph', 'Editorial', 'Serif', 'Asymmetric', 'Faded', 'Earth', 'Condensed', 'Vivid'],
];

/* 1,2,3 행 방향 교차 (좌 / 우 / 좌) */
const ROW_DIRECTIONS = ['left', 'right', 'left'];
/* 행별 한 사이클 시간(초). 클수록 느림 */
const ROW_SPEEDS = [64, 76, 56];

/**
 * TagPill 컴포넌트
 *
 * 마퀴 안에 흐르는 초대형 라운드 칩 태그 1개. 배경 없이 outlined 만.
 *
 * Props:
 * @param {string} label - 태그 텍스트 [Required]
 */
function TagPill({ label }) {
  return (
    <Chip
      label={label}
      variant="outlined"
      sx={{
        /* borderRadius 는 테마 MuiChip(999px)이 이미 round 처리.
           sx 에서 숫자로 다시 주면 shape.borderRadius(0) 와 곱해져 0px 가 되므로 건드리지 않는다. */
        height: 'auto',
        borderColor: 'divider',
        bgcolor: 'transparent',
        color: 'text.primary',
        px: { xs: 0.75, sm: 1.5, md: 3 },
        py: { xs: 0.5, sm: 1, md: 2 },
        '& .MuiChip-label': {
          px: { xs: 0.5, sm: 1, md: 2 },
          fontWeight: 500,
          fontSize: { xs: '1rem', sm: '2rem', md: '4rem' },
          /* 큰 폰트에서 descender(g, p, y) 세로 잘림 방지: 넉넉한 lineHeight + overflow 해제 */
          lineHeight: 1.3,
          letterSpacing: '-0.02em',
          overflow: 'visible',
          textOverflow: 'clip',
        },
      }}
    />
  );
}

/**
 * TagMarqueeSection 컴포넌트
 *
 * 랜딩페이지 솔루션 1 ↔ 솔루션 2 사이 구간.
 * T1 분석 태그들을 3 행 마퀴로 흐르게 한다. 행마다 방향이 교차되고(좌/우/좌)
 * 태그는 초대형으로 렌더링되어 풀블리드로 화면을 가로지른다.
 *
 * Props: 없음
 *
 * Example usage:
 * <TagMarqueeSection />
 */
function TagMarqueeSection() {
  return (
    <Box
      sx={{
        py: { xs: 10, md: 16 },
        overflow: 'hidden',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 1.5, md: 3 },
      }}
    >
      {TAG_ROWS.map((row, rowIdx) => (
        <MarqueeContainer
          key={rowIdx}
          direction={ROW_DIRECTIONS[rowIdx]}
          speed={ROW_SPEEDS[rowIdx]}
          gap={3}
          isPauseOnHover={false}
        >
          {row.map((tag) => (
            <TagPill key={tag} label={tag} />
          ))}
        </MarqueeContainer>
      ))}
    </Box>
  );
}

export default TagMarqueeSection;
