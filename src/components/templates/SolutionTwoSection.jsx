import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { AnalysisLayerTabs } from '../data-display/AnalysisLayerTabs';

/*
 * T3 디자인 시스템 분석 픽스처
 * img1=Bold Red Manifesto / img2=Pixel Grid Blueprint / img3=Risograph Print Poster
 * 3장 합성 결과. AnalysisLayerTabs 가 받는 analysis 구조 그대로.
 */
const T3_ANALYSIS = {
  color: [
    { id: 'col-signal', label: 'Signal Red', hex: '#D91A0A', role: 'primary', group: 'Brand', isEnabled: true, emphasis: 2, sourceReferenceIds: ['img1'] },
    { id: 'col-ink', label: 'Ink Black', hex: '#0D0D0D', role: 'secondary', group: 'Brand', isEnabled: true, emphasis: 2, sourceReferenceIds: ['img1', 'img2'] },
    { id: 'col-cream', label: 'Warm Cream', hex: '#F2EDE8', group: 'Surface', isEnabled: true, emphasis: 1, sourceReferenceIds: ['img1', 'img3'] },
    { id: 'col-mid', label: 'Cool Mid', hex: '#8C8E8C', group: 'Neutral', isEnabled: true, emphasis: 1, sourceReferenceIds: ['img2'] },
    { id: 'col-earth', label: 'Earth Muted', hex: '#6B6460', group: 'Neutral', isEnabled: false, emphasis: 0, sourceReferenceIds: ['img3'] },
  ],
  typography: [
    {
      id: 'typo-display',
      label: 'Brutalist Display',
      variant: 'h1',
      fontFamily: '"Impact", "Anton", sans-serif',
      fontWeight: 900,
      fontSize: '28px',
      lineHeight: 1.0,
      letterSpacing: '-0.02em',
      sampleText: 'Aa',
      isEnabled: true,
      emphasis: 2,
    },
    {
      id: 'typo-mono',
      label: 'Swiss Mono',
      variant: 'body2',
      fontFamily: '"Courier New", "Roboto Mono", monospace',
      fontWeight: 400,
      fontSize: '13px',
      lineHeight: 1.6,
      letterSpacing: '0.04em',
      sampleText: 'Aa',
      isEnabled: true,
      emphasis: 1,
    },
    {
      id: 'typo-serif',
      label: 'Serif Editorial',
      variant: 'h3',
      fontFamily: 'Georgia, "Playfair Display", serif',
      fontWeight: 700,
      fontSize: '20px',
      lineHeight: 1.25,
      letterSpacing: '0.01em',
      sampleText: 'Aa',
      isEnabled: true,
      emphasis: 1,
    },
  ],
  layout: [
    { id: 'lay-fullbleed', label: 'Full Bleed Hero', kind: 'container', ratio: 1, maxWidth: '100vw', isEnabled: true, emphasis: 2 },
    { id: 'lay-grid-12', label: '12 Column Grid', kind: 'grid', columns: 12, gap: 24, isEnabled: true, emphasis: 2 },
    { id: 'lay-section-gap', label: 'Section Gap', kind: 'spacing', px: 80, isEnabled: true, emphasis: 1 },
  ],
  gradient: [
    {
      id: 'grad-signal',
      label: 'Signal Burst',
      gradient: 'radial-gradient(circle at 25% 30%, #D91A0A, #0D0D0D 70%)',
      stops: [{ color: '#D91A0A' }, { color: '#0D0D0D' }],
      isEnabled: true,
      emphasis: 2,
    },
    {
      id: 'grad-paper',
      label: 'Paper Wash',
      gradient: 'linear-gradient(160deg, #F2EDE8, #EDE8DF)',
      stops: [{ color: '#F2EDE8' }, { color: '#EDE8DF' }],
      isEnabled: true,
      emphasis: 1,
    },
  ],
  visualDirection: {
    tags: {
      genre: ['Brutalist', 'Risograph'],
      style: ['Swiss', 'Editorial', 'Print'],
      subject: ['Typography-Hero', 'Full-bleed', 'Asymmetric'],
    },
    markdown: '',
  },
};

const DEMO_PROJECT = {
  name: 'Brutalist Mix',
  intent: 'Brutalist Red + Swiss Grid + Risograph 합성 디자인 시스템',
  mode: 'system',
};

/* 비주얼 디렉션 요약: 태그 그룹 + 핵심 방향성 bullets */
function VisualDirectionSummary({ vd }) {
  const bullets = [
    '흑-적 강대비 구조로 시각적 긴장감 형성',
    '모노스페이스 격자와 세리프를 영역별로 분리',
    '인쇄물 질감 위에 디지털 밀도 레이어링',
  ];

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* 태그 그룹 */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {Object.entries(vd.tags).map(([cat, list]) => list.length > 0 && (
          <Box key={cat} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography
              variant="caption"
              sx={{ minWidth: 56, color: 'text.disabled', fontFamily: 'monospace', letterSpacing: '0.08em', textTransform: 'uppercase' }}
            >
              {cat}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
              {list.map((tag) => (
                <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ fontSize: 11, height: 22 }} />
              ))}
            </Box>
          </Box>
        ))}
      </Box>

      {/* 방향성 요약 */}
      <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 2.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="caption" sx={{ color: 'text.disabled', fontFamily: 'monospace', letterSpacing: '0.1em', mb: 0.5 }}>
          DIRECTION
        </Typography>
        {bullets.map((b, i) => (
          <Box key={i} sx={{ display: 'flex', gap: 1.5 }}>
            <Typography variant="caption" color="text.disabled" sx={{ flexShrink: 0 }}>{i + 1}.</Typography>
            <Typography variant="body2" color="text.secondary">{b}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

/* DESIGN.md 요약: export 시 담기는 레이어별 토큰 수 + 대표값 */
function DesignMdSummary({ analysis }) {
  const rows = [
    {
      key: 'color_tokens',
      count: analysis.color.length,
      preview: analysis.color.map((c) => c.label).join(', '),
    },
    {
      key: 'typography_tokens',
      count: analysis.typography.length,
      preview: analysis.typography.map((t) => t.label).join(', '),
    },
    {
      key: 'layout_tokens',
      count: analysis.layout.length,
      preview: analysis.layout.map((l) => l.label).join(', '),
    },
    {
      key: 'gradient_tokens',
      count: analysis.gradient.length,
      preview: analysis.gradient.map((g) => g.label).join(', '),
    },
    {
      key: 'visual_direction',
      count: Object.values(analysis.visualDirection.tags).flat().length,
      preview: Object.values(analysis.visualDirection.tags).flat().join(', '),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          mb: 2.5,
          px: 1.5,
          py: 0.5,
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.default',
        }}
      >
        <Typography variant="caption" sx={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'text.secondary' }}>
          DESIGN.md.zip
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.disabled' }}>— AI 컨텍스트용 export 파일 구조</Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {rows.map((row, i) => (
          <Box
            key={row.key}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              py: 1.25,
              borderTop: i === 0 ? '1px solid' : 'none',
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography
              variant="caption"
              sx={{ fontFamily: 'monospace', fontSize: '0.65rem', color: 'text.secondary', flexShrink: 0, minWidth: 136 }}
            >
              {row.key}
            </Typography>
            <Typography
              variant="caption"
              color="text.disabled"
              sx={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {row.preview}
            </Typography>
            <Box
              sx={{
                flexShrink: 0,
                minWidth: 24,
                textAlign: 'center',
                px: 0.75,
                py: 0.1,
                borderRadius: 0.5,
                bgcolor: 'action.selected',
              }}
            >
              <Typography variant="caption" sx={{ fontFamily: 'monospace', fontSize: '0.65rem', color: 'text.primary', fontWeight: 600 }}>
                {row.count}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

/**
 * SolutionTwoSection 컴포넌트
 *
 * 랜딩페이지 솔루션 2 섹션. S1 레퍼런스 3장 기반 T3 분석 결과를
 * AnalysisLayerTabs 로 시각화한다.
 * visualDirection / designMd 탭은 renderOverride 로 요약 뷰 주입.
 *
 * Props: 없음
 *
 * Example usage:
 * <SolutionTwoSection />
 */
function SolutionTwoSection() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
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
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h3"
          sx={{ fontWeight: 800, letterSpacing: '-0.02em', mb: 2, lineHeight: 1.2 }}
        >
          의도에 맞게 분석된 레퍼런스를 AI에게 학습시키세요
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
          추출된 토큰과 결정 추적을 DESIGN.md ZIP 으로 export. Claude, Gemini, ChatGPT 어디에 붙여넣어도 의도까지 이해한 코드를 받을 수 있습니다.
        </Typography>
      </Box>

      <Box
        sx={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(28px)',
          transition: 'opacity 0.55s ease, transform 0.55s ease',
        }}
      >
        <AnalysisLayerTabs
          analysis={T3_ANALYSIS}
          project={DEMO_PROJECT}
          references={[]}
          renderOverride={{
            visualDirection: () => <VisualDirectionSummary vd={T3_ANALYSIS.visualDirection} />,
            designMd: () => <DesignMdSummary analysis={T3_ANALYSIS} />,
          }}
        />
      </Box>
    </Box>
  );
}

export default SolutionTwoSection;
