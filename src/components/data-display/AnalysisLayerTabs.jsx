import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { CategoryTab } from '../in-page-navigation/CategoryTab.jsx';
import { ColorSwatchList } from './ColorSwatchList.jsx';
import { TypographyPreview } from './TypographyPreview.jsx';
import { LayoutTokenPreview } from './LayoutTokenPreview.jsx';
import { GradientPreview } from './GradientPreview.jsx';
import { DesignMdPreview } from './DesignMdPreview.jsx';
import { ANALYSIS_LAYERS_WITH_DESIGN_MD } from '../../data/muse/layers.js';

/**
 * AnalysisLayerTabs 컴포넌트
 *
 * T3 (디자인 시스템 모드) 분석 결과를 레이어 탭으로 보여주는 합성 컴포넌트.
 * CategoryTab(레이어 탭) + activeLayer 상태 + 레이어별 편집/프리뷰 패널 5종
 * (color / typography / layout / gradient / visualDirection + designMd) 전환을 캡슐화한다.
 * ProjectDetailPage 의 system 모드 우측 영역에서 인라인이던 로직을 추출한 것.
 *
 * Props:
 * @param {object} analysis - 레이어별 토큰 묶음 { color, typography, layout, gradient, visualDirection } [Required]
 * @param {object} project - DesignMdPreview 에 전달할 프로젝트 메타 [Optional]
 * @param {array} references - 결정 추적(출처 썸네일)용 전체 레퍼런스 목록 [Optional, 기본값: []]
 * @param {function} onUpdateToken - (layerKey, tokenId, patch) => void 토큰 편집 콜백 [Optional]
 * @param {array} categories - 탭 카테고리 [{ id, label }] [Optional, 기본값: ANALYSIS_LAYERS_WITH_DESIGN_MD]
 * @param {string} defaultLayer - 초기 활성 레이어 키 [Optional, 기본값: 'color']
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <AnalysisLayerTabs
 *   analysis={ analysis }
 *   project={ project }
 *   references={ references }
 *   onUpdateToken={ (layer, id, patch) => updateStore(layer, id, patch) }
 * />
 */
export function AnalysisLayerTabs({
  analysis,
  project,
  references = [],
  onUpdateToken,
  categories = ANALYSIS_LAYERS_WITH_DESIGN_MD,
  defaultLayer = 'color',
  sx,
}) {
  const [activeLayer, setActiveLayer] = useState(defaultLayer);

  const handleChange = (layerKey) => (id, patch) => {
    onUpdateToken?.(layerKey, id, patch);
  };

  const renderEditor = () => {
    switch (activeLayer) {
      case 'color':
        return (
          <ColorSwatchList
            tokens={ analysis.color || [] }
            onChange={ handleChange('color') }
            references={ references }
          />
        );
      case 'typography':
        return (
          <TypographyPreview
            tokens={ analysis.typography || [] }
            onChange={ handleChange('typography') }
            references={ references }
          />
        );
      case 'layout':
        return (
          <LayoutTokenPreview
            tokens={ analysis.layout || [] }
            onChange={ handleChange('layout') }
            references={ references }
          />
        );
      case 'gradient':
        return (
          <GradientPreview
            tokens={ analysis.gradient || [] }
            onChange={ handleChange('gradient') }
            references={ references }
          />
        );
      case 'designMd':
        return (
          <Box sx={ { bgcolor: 'background.paper', borderRadius: 3, p: { xs: 2, md: 4 }, border: '1px solid', borderColor: 'divider' } }>
            <DesignMdPreview project={ project } layers={ analysis } variant="raw" />
          </Box>
        );
      case 'visualDirection': {
        const vd = analysis.visualDirection || { markdown: '', tags: { genre: [], style: [], subject: [] } };
        return (
          <Box sx={ { bgcolor: 'background.paper', borderRadius: 3, p: 4 } }>
            {/* 태그 칩 */}
            { vd.tags && (
              <Box sx={ { display: 'flex', flexDirection: 'column', gap: 1, mb: 3 } }>
                { Object.entries(vd.tags).map(([category, list]) => (
                  list?.length > 0 && (
                    <Box key={ category } sx={ { display: 'flex', alignItems: 'center', gap: 1 } }>
                      <Typography variant="caption" color="text.secondary" sx={ { minWidth: 64, textTransform: 'uppercase', letterSpacing: '0.08em' } }>
                        { category }
                      </Typography>
                      <Box sx={ { display: 'flex', gap: 0.75, flexWrap: 'wrap' } }>
                        { list.map((t) => (
                          <Box key={ t } sx={ { px: 1, py: 0.25, borderRadius: 999, border: '1px solid', borderColor: 'divider', fontSize: 12 } }>{ t }</Box>
                        )) }
                      </Box>
                    </Box>
                  )
                )) }
              </Box>
            ) }
            {/* Markdown 본문 — 단순 pre 렌더 (추후 react-markdown 도입 가능) */}
            <Box
              component="pre"
              sx={ {
                m: 0,
                p: 2.5,
                bgcolor: 'grey.50',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                fontSize: 13,
                lineHeight: 1.7,
                fontFamily: 'inherit',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                maxHeight: '60vh',
                overflow: 'auto',
              } }
            >
              { vd.markdown || '# Visual Direction\n\n(아직 생성되지 않았습니다)' }
            </Box>
          </Box>
        );
      }
      default:
        return null;
    }
  };

  return (
    <Box sx={ { ...sx } }>
      <CategoryTab
        categories={ categories }
        selected={ activeLayer }
        onChange={ setActiveLayer }
      />
      <Box sx={ { py: 2 } }>
        { renderEditor() }
      </Box>
    </Box>
  );
}

export default AnalysisLayerTabs;
