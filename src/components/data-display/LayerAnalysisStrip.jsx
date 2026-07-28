import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const DEFAULT_LAYER_LABELS = ['Color', 'Typography', 'Layout', 'Gradient', 'Visual Direction'];

/**
 * LayerAnalysisStrip component
 *
 * A lightweight progress strip attached to the bottom of a reference / media card. Used in places
 * where the full-screen variant of AnalysisProgress would be too heavy (card footer / inline demo).
 * Because it is a normal stack flow rather than an overlay, it does not float over the card and
 * follows along naturally.
 *
 * Layout: ANALYZING n/N + 2px-thick LinearProgress + per-layer rows (status icon + label)
 *
 * Props:
 * @param {('pending'|'running'|'done')[]} layerStatuses - Array of per-layer statuses [Required]
 * @param {string[]} layerLabels - Array of layer labels (must match the length of layerStatuses) [Optional, default: ['Color', 'Typography', 'Layout', 'Gradient', 'Visual Direction']]
 * @param {string} headerLabel - Top monospace eyebrow text [Optional, default: 'ANALYZING']
 * @param {object} sx - Additional styles [Optional]
 *
 * Example usage:
 * <LayerAnalysisStrip
 *   layerStatuses={ ['done', 'done', 'running', 'pending', 'pending'] }
 * />
 */
export function LayerAnalysisStrip({
  layerStatuses,
  layerLabels = DEFAULT_LAYER_LABELS,
  headerLabel = 'ANALYZING',
  sx,
}) {
  const total = layerStatuses?.length || 0;
  const doneCount = (layerStatuses || []).filter((s) => s === 'done').length;
  const overall = total === 0 ? 0 : (doneCount / total) * 100;

  return (
    <Box
      sx={ {
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        ...sx,
      } }
    >
      <Typography
        variant="caption"
        sx={ {
          display: 'block',
          fontFamily: 'monospace',
          fontSize: '0.62rem',
          letterSpacing: '0.18em',
          color: 'text.secondary',
        } }
      >
        { headerLabel } · { doneCount }/{ total }
      </Typography>
      <LinearProgress
        variant="determinate"
        value={ overall }
        sx={ {
          height: 2,
          borderRadius: 0,
          bgcolor: 'action.hover',
        } }
      />
      <Box sx={ { display: 'flex', flexDirection: 'column', gap: 1 } }>
        { (layerStatuses || []).map((status, i) => {
          const Icon = status === 'done' ? CheckCircleIcon : RadioButtonUncheckedIcon;
          const color = status === 'done'
            ? 'success.main'
            : status === 'running'
              ? 'text.primary'
              : 'text.disabled';
          return (
            <Box
              key={ i }
              sx={ {
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontSize: '0.78rem',
                color,
                fontWeight: status === 'running' ? 600 : 400,
              } }
            >
              { status === 'running'
                ? <CircularProgress size={ 12 } thickness={ 5 } />
                : <Icon sx={ { fontSize: 14 } } /> }
              <Box component="span">
                { layerLabels[i] || `Layer ${ i + 1 }` }
              </Box>
            </Box>
          );
        }) }
      </Box>
    </Box>
  );
}
