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
 * AnalysisLayerTabs component
 *
 * A composite component that displays T3 (design system mode) analysis results as layer tabs.
 * It encapsulates CategoryTab (layer tabs) + activeLayer state + switching between the 5 per-layer
 * edit/preview panels (color / typography / layout / gradient / visualDirection + designMd).
 * This extracts the logic that used to be inline in the right-hand area of ProjectDetailPage's system mode.
 *
 * Props:
 * @param {object} analysis - Per-layer token bundle { color, typography, layout, gradient, visualDirection } [Required]
 * @param {object} project - Project metadata to pass to DesignMdPreview [Optional]
 * @param {array} references - Full reference list for decision tracing (source thumbnails) [Optional, default: []]
 * @param {function} onUpdateToken - (layerKey, tokenId, patch) => void token edit callback [Optional]
 * @param {array} categories - Tab categories [{ id, label }] [Optional, default: ANALYSIS_LAYERS_WITH_DESIGN_MD]
 * @param {string} defaultLayer - Initial active layer key [Optional, default: 'color']
 * @param {object} renderOverride - layer key -> () => ReactNode. When present, called instead of the default renderer [Optional]
 * @param {object} sx - Additional styles [Optional]
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
  renderOverride,
  sx,
}) {
  const [activeLayer, setActiveLayer] = useState(defaultLayer);

  const handleChange = (layerKey) => (id, patch) => {
    onUpdateToken?.(layerKey, id, patch);
  };

  const renderEditor = () => {
    const override = renderOverride?.[activeLayer];
    if (override) return override();

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
            {/* Tag chips */}
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
            {/* Markdown body: simple pre render (react-markdown can be added later) */}
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
              { vd.markdown || '# Visual Direction\n\n(Not generated yet)' }
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
