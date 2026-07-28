import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import RefreshIcon from '@mui/icons-material/Refresh';
import { ImageCard } from './ImageCard.jsx';
import { LayerAnalysisStrip } from '../data-display/LayerAnalysisStrip.jsx';

/**
 * ReferenceCard component
 *
 * A domain card that displays MUSE's official data model `Reference` (an item in store.references,
 * with a `ref-XXX` id). The visual base is `ImageCard`. It has a built-in T1 analysis state machine +
 * error overlay so that it guarantees a consistent appearance in *every place that shows a Reference*
 * such as ArchivePage / ReferencePicker.
 *
 * State (state=0|1|2):
 *   0  Just uploaded - image only (tags / colors / title empty)
 *   1  Analyzing - strip (bottom) or chip (small badge in top-right), depending on analyzingVariant
 *   2  Done - ImageCard filled with tags / dominantColors / title
 *
 * Error: if errorMessage is truthy, shows a red chip in the top-right + an onRetry button.
 *
 * Props:
 * @param {string} src - Image URL [Required]
 * @param {string} title - Title shown when analysis is complete [Optional]
 * @param {string[]} tags - Tag list shown when analysis is complete [Optional, default: []]
 * @param {string[]} dominantColors - Dominant colors shown when analysis is complete [Optional, default: []]
 * @param {0|1|2} state - Card state [Optional, default: 2]
 * @param {('pending'|'running'|'done')[]} layerStatuses - Passed to the strip when state=1 + analyzingVariant='strip' [Optional]
 * @param {string[]} layerLabels - LayerAnalysisStrip labels [Optional]
 * @param {'chip'|'strip'} analyzingVariant - Display mode while analyzing [Optional, default: 'chip']
 * @param {string} errorMessage - Analysis failure message (truthy -> shows error chip) [Optional]
 * @param {function} onRetry - Retry click on the error chip [Optional]
 * @param {function} onClick - ImageCard click (open detail, etc.) [Optional]
 * @param {function} onLike - ImageCard like [Optional]
 * @param {boolean} isSelectable - Selection mode [Optional]
 * @param {boolean} isSelected - Selection state [Optional]
 * @param {function} onToggleSelect - Selection toggle [Optional]
 * @param {boolean} hideActions - Hide ImageCard's default actions [Optional]
 * @param {node} customOverlay - ImageCard's hover overlay slot [Optional]
 * @param {string} mediaRatio - Media ratio. 'auto' preserves the original ratio [Optional, default: 'auto']
 * @param {object} sx - Outer wrapper styles [Optional]
 *
 * Example usage:
 * // ArchivePage / general display
 * <ReferenceCard
 *   src={ ref.thumbnailUrl }
 *   title={ ref.title }
 *   tags={ ref.tags }
 *   dominantColors={ ref.dominantColors }
 *   state={ ref._pending ? 1 : 2 }
 *   errorMessage={ ref._tagError }
 *   onRetry={ () => retryTag(ref.id) }
 *   onClick={ () => openDetail(ref.id) }
 * />
 *
 * // Landing demo / detail strip
 * <ReferenceCard
 *   src={ ref.src }
 *   state={ 1 }
 *   analyzingVariant="strip"
 *   layerStatuses={ ['done', 'running', 'pending', 'pending', 'pending'] }
 * />
 *
 * // ReferencePicker
 * <ReferenceCard
 *   src={ ref.src }
 *   title={ ref.title }
 *   isSelectable
 *   isSelected={ picked.has(ref.id) }
 *   onToggleSelect={ (next) => toggle(ref.id, next) }
 * />
 */
export function ReferenceCard({
  src,
  title,
  tags = [],
  dominantColors = [],
  state = 2,
  layerStatuses,
  layerLabels,
  analyzingVariant = 'chip',
  errorMessage,
  onRetry,
  onClick,
  onLike,
  isSelectable,
  isSelected,
  onToggleSelect,
  hideActions,
  customOverlay,
  mediaRatio = 'auto',
  sx,
}) {
  const isAnalyzing = state === 1;
  const isDone = state === 2;
  const showStrip = isAnalyzing && analyzingVariant === 'strip';
  const showChip = isAnalyzing && analyzingVariant === 'chip';
  const showError = !!errorMessage;

  return (
    <Box sx={ { position: 'relative', borderRadius: '12px', overflow: 'hidden', ...sx } }>
      <ImageCard
        src={ src }
        title={ isDone ? title : ' ' }
        tags={ isDone ? tags : [] }
        dominantColors={ isDone ? dominantColors : [] }
        mediaRatio={ mediaRatio }
        onClick={ onClick }
        onLike={ onLike }
        isSelectable={ isSelectable }
        isSelected={ isSelected }
        onToggleSelect={ onToggleSelect }
        hideActions={ hideActions }
        customOverlay={ customOverlay }
        sx={ { borderRadius: '12px', overflow: 'hidden' } }
      />

      { showStrip && (
        <LayerAnalysisStrip
          layerStatuses={ layerStatuses }
          layerLabels={ layerLabels }
          sx={ { mt: 2 } }
        />
      ) }

      { showChip && !showError && (
        <Box
          sx={ {
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'rgba(252,252,255,0.9)',
            borderRadius: 999,
            px: 1,
            py: 0.25,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            backdropFilter: 'blur(6px)',
          } }
        >
          <CircularProgress size={ 10 } thickness={ 5 } />
          <Typography variant="caption" sx={ { fontSize: 10, color: 'text.secondary' } }>
            Tagging
          </Typography>
        </Box>
      ) }

      { showError && (
        <Box
          sx={ {
            position: 'absolute',
            top: 8,
            right: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            bgcolor: 'error.main',
            color: 'common.white',
            borderRadius: 999,
            pl: 1,
            pr: 0.25,
            py: 0.25,
            fontSize: 10,
          } }
          title={ errorMessage }
        >
          <span>Tagging failed</span>
          { onRetry && (
            <IconButton
              size="small"
              onClick={ (e) => {
                e.stopPropagation();
                onRetry();
              } }
              aria-label="Retry tagging"
              sx={ {
                p: 0.25,
                color: 'common.white',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
              } }
            >
              <RefreshIcon sx={ { fontSize: 14 } } />
            </IconButton>
          ) }
        </Box>
      ) }
    </Box>
  );
}
