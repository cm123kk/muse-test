import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { RefImage } from '../media/RefImage.jsx';

const LAYER_LABEL = {
  color: 'Color',
  typography: 'Typography',
  layout: 'Layout',
  gradient: 'Gradient',
  visualDirection: 'Mood',
  spacing: 'Spacing',
  rounded: 'Rounded',
  elevation: 'Elevation',
  components: 'Components',
};

/**
 * TokenDecisionTracePanel component (TP6)
 *
 * A panel of sources + reasons + alternatives that expands when a token card is clicked.
 * "You should be able to trace the reasoning behind every decision the AI made" (T1 super-theme)
 *
 * Props:
 * @param {{whichReferences, whichLayers?, whyChosen, alternativesConsidered?}} decisionRationale - Per-token decision log from the T3 output [Required]
 * @param {Array} [references] - Full references list (for inline thumbnail display) [Optional]
 * @param {object} sx
 *
 * Example usage:
 * <TokenDecisionTracePanel
 *   decisionRationale={ token.decisionRationale }
 *   references={ allReferences }
 * />
 */
export function TokenDecisionTracePanel({ decisionRationale, references = [], sx }) {
  if (!decisionRationale) return null;
  const {
    whichReferences = [],
    whichLayers = [],
    whyChosen,
    appliedUserNotes,
    alternativesConsidered = [],
  } = decisionRationale;

  const refsWithThumb = whichReferences
    .map((id) => references.find((r) => r.id === id))
    .filter(Boolean);

  const rows = [];

  if (refsWithThumb.length > 0 || whichReferences.length > 0) {
    rows.push({
      key: 'sources',
      label: 'Sources',
      content: (
        <Box sx={ { display: 'flex', flexDirection: 'column', gap: 0.75 } }>
          { refsWithThumb.length > 0 ? (
            refsWithThumb.map((r) => (
              <Box key={ r.id } sx={ { display: 'flex', alignItems: 'center', gap: 1 } }>
                { r.thumbnailUrl && (
                  <Box sx={ { width: 32, height: 32, borderRadius: 0.75, overflow: 'hidden', border: '1px solid', borderColor: 'divider', flexShrink: 0 } }>
                    <RefImage
                      src={ r.thumbnailUrl }
                      storagePath={ r.storagePath }
                      alt={ r.title || r.id }
                    />
                  </Box>
                ) }
                <Typography variant="body2" sx={ { fontSize: 13 } }>
                  { r.title || r.id }
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2" sx={ { fontSize: 13, color: 'text.secondary' } }>
              { whichReferences.join(', ') }
            </Typography>
          ) }
          { whichLayers.length > 0 && (
            <Box sx={ { display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.25 } }>
              { whichLayers.map((l) => (
                <Chip
                  key={ l }
                  label={ LAYER_LABEL[l] || l }
                  size="small"
                  variant="outlined"
                  sx={ { height: 20, fontSize: '0.7rem' } }
                />
              )) }
            </Box>
          ) }
        </Box>
      ),
    });
  }

  if (whyChosen) {
    rows.push({
      key: 'why',
      label: 'Intent match',
      content: (
        <Typography variant="body2" sx={ { fontSize: 13, lineHeight: 1.6 } }>
          { whyChosen }
        </Typography>
      ),
    });
  }

  if (appliedUserNotes) {
    rows.push({
      key: 'notes',
      label: 'User notes',
      content: (
        <Typography
          variant="body2"
          sx={ {
            fontSize: 13,
            lineHeight: 1.6,
            fontStyle: 'italic',
            color: 'primary.main',
          } }
        >
          “{ appliedUserNotes }”
        </Typography>
      ),
    });
  }

  if (alternativesConsidered.length > 0) {
    rows.push({
      key: 'alts',
      label: 'Alternatives',
      content: (
        <Box sx={ { display: 'flex', flexDirection: 'column', gap: 0.5 } }>
          { alternativesConsidered.map((alt, i) => (
            <Box key={ i } sx={ { display: 'flex', gap: 1.5, alignItems: 'baseline' } }>
              <Typography variant="caption" sx={ { fontFamily: 'monospace', fontSize: 12, minWidth: 80 } }>
                { alt.value }
              </Typography>
              <Typography variant="caption" sx={ { color: 'text.secondary', fontSize: 12, lineHeight: 1.6 } }>
                { alt.reason }
              </Typography>
            </Box>
          )) }
        </Box>
      ),
    });
  }

  if (rows.length === 0) return null;

  return (
    <Box sx={ { mt: 1, ...sx } }>
      <Table size="small" sx={ { '& td': { borderColor: 'divider' } } }>
        <TableBody>
          { rows.map((row, i) => (
            <TableRow key={ row.key }>
              <TableCell
                sx={ {
                  width: 110,
                  verticalAlign: 'top',
                  py: 1.25,
                  px: 0,
                  borderBottom: i < rows.length - 1 ? '1px solid' : 0,
                } }
              >
                <Typography variant="caption" sx={ { fontWeight: 600, color: 'text.secondary', letterSpacing: '0.02em' } }>
                  { row.label }
                </Typography>
              </TableCell>
              <TableCell
                sx={ {
                  py: 1.25,
                  px: 0,
                  borderBottom: i < rows.length - 1 ? '1px solid' : 0,
                } }
              >
                { row.content }
              </TableCell>
            </TableRow>
          )) }
        </TableBody>
      </Table>
    </Box>
  );
}
