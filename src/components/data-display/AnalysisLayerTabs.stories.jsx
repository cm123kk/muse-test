import { useState } from 'react';
import Box from '@mui/material/Box';
import { AnalysisLayerTabs } from './AnalysisLayerTabs';

export default {
  title: 'Component/5. Data Display/AnalysisLayerTabs',
  component: AnalysisLayerTabs,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    analysis: {
      control: 'object',
      description: '레이어별 토큰 묶음 { color, typography, layout, gradient, visualDirection }',
    },
    project: {
      control: 'object',
      description: 'DesignMdPreview 에 전달할 프로젝트 메타',
    },
    references: {
      control: 'object',
      description: '결정 추적(출처 썸네일)용 전체 레퍼런스 목록',
    },
    categories: {
      control: 'object',
      description: '탭 카테고리 [{ id, label }] (기본: 5 레이어 + DESIGN.md)',
    },
    defaultLayer: {
      control: 'select',
      options: ['color', 'typography', 'layout', 'gradient', 'visualDirection', 'designMd'],
      description: '초기 활성 레이어 키',
    },
    onUpdateToken: { action: 'updateToken', description: '(layerKey, tokenId, patch) => void 토큰 편집 콜백' },
  },
};

/* T3 system 모드 분석 결과 픽스처 — 스토리 데모용 */
const SAMPLE_ANALYSIS = {
  color: [
    { id: 'c1', label: 'Brand Red', value: '#D91A0A', isEnabled: true, emphasis: 2 },
    { id: 'c2', label: 'Ink', value: '#0D0D0D', isEnabled: true, emphasis: 1 },
    { id: 'c3', label: 'Paper', value: '#F2EDE8', isEnabled: true, emphasis: 0 },
  ],
  typography: [
    { id: 't1', label: 'Display / Condensed', value: 'Anton, 64/72', isEnabled: true, emphasis: 2 },
    { id: 't2', label: 'Body / Sans', value: 'Inter, 16/26', isEnabled: true, emphasis: 1 },
  ],
  layout: [
    { id: 'l1', label: 'Grid', value: '12 col / 24 gutter', isEnabled: true, emphasis: 1 },
    { id: 'l2', label: 'Container', value: 'max 1200', isEnabled: true, emphasis: 0 },
  ],
  gradient: [
    { id: 'g1', label: 'Sunrise', gradient: 'linear-gradient(135deg, #FEE2F5, #FEF9C3)', isEnabled: true, emphasis: 1 },
  ],
  visualDirection: {
    markdown: '# Visual Direction\n\n브루탈리스트 편집 디자인. 강한 대비, 컨덴스드 타이포 중심.',
    tags: {
      genre: ['Editorial', 'Brutalist'],
      style: ['High-contrast', 'All-caps'],
      subject: ['Typography-Hero'],
    },
  },
};

const SAMPLE_PROJECT = { id: 'p1', name: 'Editorial Manifesto', mode: 'system', intent: '강렬한 편집 디자인 시스템' };

export const Default = {
  args: {
    analysis: SAMPLE_ANALYSIS,
    project: SAMPLE_PROJECT,
    references: [],
    defaultLayer: 'color',
  },
};

/** 토큰 편집이 실제로 반영되는 controlled 데모 */
function EditableDemo(args) {
  const [analysis, setAnalysis] = useState(SAMPLE_ANALYSIS);

  const handleUpdateToken = (layerKey, tokenId, patch) => {
    setAnalysis((prev) => ({
      ...prev,
      [layerKey]: (prev[layerKey] || []).map((tok) =>
        tok.id === tokenId ? { ...tok, ...patch } : tok,
      ),
    }));
  };

  return (
    <Box sx={ { maxWidth: 720 } }>
      <AnalysisLayerTabs
        { ...args }
        analysis={ analysis }
        project={ SAMPLE_PROJECT }
        onUpdateToken={ handleUpdateToken }
      />
    </Box>
  );
}

/* 토큰 편집이 실제로 반영되는 controlled 예시 */
export const Editable = {
  render: (args) => <EditableDemo { ...args } />,
  args: {
    defaultLayer: 'color',
  },
};
