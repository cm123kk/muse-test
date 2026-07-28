import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const STATUS_COLOR = {
  pending: 'text.disabled',
  running: 'info.main',
  done: 'success.main',
  error: 'error.main',
};

const STATUS_LABEL = {
  pending: 'Pending',
  running: 'Analyzing',
  done: 'Done',
  error: 'Error',
};

/** Detailed description of "what is happening right now" for each layer */
const LAYER_DETAIL = {
  color: {
    running: 'Clustering reference palettes and assigning primary / secondary / accent roles to match the intent',
    done: 'Project palette and role assignment complete',
    pending: 'Will restructure hex values extracted from references based on intent',
    error: 'Palette synthesis failed',
  },
  typography: {
    running: 'Consolidating typography observations into a display / heading / body / caption hierarchy',
    done: 'Typography hierarchy and variant mapping complete',
    pending: 'Will align font family, size, and line height to the project scale',
    error: 'Typography synthesis failed',
  },
  layout: {
    running: 'Tuning grid and spacing values to the project type (landing / dashboard / ...) context',
    done: 'Layout tokens (grid / spacing / container) configured',
    pending: 'Will consolidate columns, gap, and padding to match the intent',
    error: 'Layout synthesis failed',
  },
  gradient: {
    running: 'Selecting reference gradients and checking their consistency with the palette',
    done: 'Gradient tokens selected',
    pending: 'Will build consistent gradients from the palette',
    error: 'Gradient synthesis failed',
  },
  visualDirection: {
    running: 'Writing the visual direction document from the intent and aggregated reference tags',
    done: 'Visual direction Markdown written',
    pending: 'Will describe tone, implementation guide, and elements to avoid',
    error: 'Visual direction writing failed',
  },
  spacing: {
    running: 'Deriving the spacing scale (xs/sm/md/lg/xl) from the intent and reference rhythm',
    done: 'Spacing scale defined',
    pending: 'Will align spacing units (px/rem) into a consistent scale',
    error: 'Spacing scale synthesis failed',
  },
  rounded: {
    running: 'Deciding the rounded scale (sm/md/lg) to fit the brand tone (soft to geometric)',
    done: 'Rounded scale defined',
    pending: 'Will decide the border radius scale',
    error: 'Rounded scale synthesis failed',
  },
  components: {
    running: 'Assembling UI components like button-primary / card / input via token references ({path})',
    done: 'Component assembly complete (DESIGN.md compatible)',
    pending: 'Will define components using token reference syntax',
    error: 'Component assembly failed (token-ref violation)',
  },
};

/** Status icon, rendered large */
const StatusIcon = ({ status, size = 28 }) => {
  if (status === 'running') return <CircularProgress size={ size - 6 } thickness={ 4.5 } />;
  if (status === 'done') return <CheckCircleIcon sx={ { fontSize: size, color: STATUS_COLOR.done } } />;
  if (status === 'error') return <ErrorOutlineIcon sx={ { fontSize: size, color: STATUS_COLOR.error } } />;
  return <RadioButtonUncheckedIcon sx={ { fontSize: size, color: STATUS_COLOR.pending } } />;
};

/**
 * AnalysisProgress - large, detailed analysis progress UI
 *
 * Props:
 * @param {array} layers - [{ key, label, status, progress?, message? }] [Required]
 * @param {function} onCancel [Optional]
 * @param {function} onRetry [Optional]
 * @param {string} title [Optional]
 * @param {string} intent [Optional] - Project intent statement
 * @param {object} sx [Optional]
 */
export function AnalysisProgress({
  layers = [],
  onCancel,
  onRetry,
  title = 'Analyzing references',
  intent,
  sx,
}) {
  const total = layers.length;
  const doneCount = layers.filter((l) => l.status === 'done').length;
  const runningLayer = layers.find((l) => l.status === 'running');
  const hasError = layers.some((l) => l.status === 'error');
  const isAllDone = total > 0 && doneCount === total;

  const overallProgress = total === 0
    ? 0
    : Math.min(100, ((doneCount + (runningLayer?.progress ?? 0)) / total) * 100);

  return (
    <Box
      sx={ {
        width: '100%',
        maxWidth: 760,
        py: { xs: 5, md: 8 },
        px: { xs: 3, md: 6 },
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        ...sx,
      } }
    >
      {/* Header: large and roomy */}
      <Box sx={ { textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 2 } }>
        <Typography
          variant="overline"
          sx={ { fontSize: '0.72rem', letterSpacing: '0.2em', color: 'text.secondary' } }
        >
          { hasError ? 'ERROR' : isAllDone ? 'COMPLETE' : 'ANALYZING' }
        </Typography>
        <Typography
          variant="h3"
          sx={ { fontWeight: 600, letterSpacing: '-0.02em' } }
        >
          { title }
        </Typography>
        { intent && (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={ {
              maxWidth: 560,
              mx: 'auto',
              fontStyle: 'italic',
              fontSize: '1.02rem',
              lineHeight: 1.6,
            } }
          >
            &ldquo;{ intent }&rdquo;
          </Typography>
        ) }
      </Box>

      {/* Progress: bold bar plus counter */}
      <Box sx={ { display: 'flex', flexDirection: 'column', gap: 1.5 } }>
        <Box sx={ { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' } }>
          <Typography variant="caption" sx={ { letterSpacing: '0.1em', color: 'text.secondary' } }>
            Overall progress
          </Typography>
          <Typography
            variant="h6"
            sx={ { fontFamily: 'monospace', fontWeight: 500, color: 'text.primary' } }
          >
            { doneCount }
            <Box component="span" sx={ { color: 'text.disabled', mx: 0.5 } }>/</Box>
            { total }
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={ overallProgress }
          color={ hasError ? 'error' : isAllDone ? 'success' : 'primary' }
          sx={ {
            height: 4,
            borderRadius: 0,
            bgcolor: 'rgba(20,19,43,0.06)',
          } }
        />
      </Box>

      {/* Five layer cards: each large, with rich descriptions */}
      <Box sx={ { display: 'flex', flexDirection: 'column', gap: 2 } }>
        { layers.map((layer) => {
          const detail = LAYER_DETAIL[layer.key]?.[layer.status] || layer.message;
          const isActive = layer.status === 'running';
          const isDone = layer.status === 'done';
          const isError = layer.status === 'error';
          return (
            <Box
              key={ layer.key }
              sx={ {
                display: 'flex',
                alignItems: 'flex-start',
                gap: 3,
                p: { xs: 2.5, md: 3 },
                borderRadius: 3,
                border: '1px solid',
                borderColor: isActive
                  ? 'primary.main'
                  : isError
                    ? 'error.light'
                    : 'divider',
                bgcolor: isActive ? 'rgba(79,70,229,0.04)' : 'transparent',
                transition: 'border-color 300ms, background-color 300ms',
              } }
            >
              {/* Icon */}
              <Box sx={ {
                width: 44,
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              } }>
                <StatusIcon status={ layer.status } size={ 28 } />
              </Box>

              {/* Body */}
              <Box sx={ { flex: 1, minWidth: 0, pt: 0.5 } }>
                <Box sx={ {
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  gap: 2,
                  mb: 0.5,
                } }>
                  <Typography
                    variant="h6"
                    sx={ {
                      fontWeight: 500,
                      fontSize: '1.08rem',
                      color: layer.status === 'pending' ? 'text.disabled' : 'text.primary',
                    } }
                  >
                    { layer.label }
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={ {
                      fontFamily: 'monospace',
                      fontSize: '0.72rem',
                      letterSpacing: '0.08em',
                      color: STATUS_COLOR[layer.status],
                      textTransform: 'uppercase',
                    } }
                  >
                    { STATUS_LABEL[layer.status] }
                  </Typography>
                </Box>
                { detail && (
                  <Typography
                    variant="body2"
                    color={ isDone || isActive ? 'text.secondary' : 'text.disabled' }
                    sx={ { lineHeight: 1.6, fontSize: '0.88rem' } }
                  >
                    { detail }
                  </Typography>
                ) }
              </Box>
            </Box>
          );
        }) }
      </Box>

      {/* Actions */}
      { (onCancel || onRetry) && (
        <Box sx={ { display: 'flex', justifyContent: 'center', gap: 2, mt: 2 } }>
          { hasError && onRetry && (
            <Button variant="contained" color="primary" size="large" onClick={ onRetry }>
              Retry
            </Button>
          ) }
          { !isAllDone && onCancel && (
            <Button variant="text" color="inherit" size="large" onClick={ onCancel }>
              Cancel
            </Button>
          ) }
        </Box>
      ) }
    </Box>
  );
}
