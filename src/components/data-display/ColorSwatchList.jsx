import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { TokenListItem } from './TokenListItem.jsx';
import { TokenDecisionTracePanel } from './TokenDecisionTracePanel.jsx';

/**
 * ColorSwatchList component
 *
 * Renders the token list of the color layer with TokenListItem.
 * Optionally, specifying `groupBy` splits the list into sections with group headers.
 *
 * Props:
 * @param {array} tokens - [{ id, label, hex, role?, group?, isEnabled, decisionRationale? }] [Required]
 * @param {function} onChange - (id, patch) => void [Optional]
 * @param {boolean} isGrouped - Split into sections based on the group field [Optional, default: false]
 * @param {array} references - Reference pool for TP6 source thumbnails [Optional]
 * @param {string} defaultExpandedId - Token id automatically expanded on mount [Optional]
 * @param {object} sx - Additional styles [Optional]
 *
 * Example usage:
 * <ColorSwatchList
 *   tokens={ [{ id: 'p', label: 'Primary', hex: '#14132B', isEnabled: true }] }
 *   onChange={ (id, patch) => updateToken(id, patch) }
 * />
 */
export function ColorSwatchList({ tokens, onChange, isGrouped = false, references = [], defaultExpandedId = null, sx }) {
  const [expandedId, setExpandedId] = useState(defaultExpandedId);

  const renderItem = (token, isLastInGroup) => {
    const hasRationale = !!token.decisionRationale || (token.sourceReferenceIds || []).length > 0;
    const isExpanded = expandedId === token.id;
    return (
      <Box key={ token.id }>
        <TokenListItem
          preview={
            <Box
              sx={ {
                width: 48,
                height: 48,
                borderRadius: 1.5,
                backgroundColor: token.hex,
                border: '1px solid',
                borderColor: 'divider',
              } }
            />
          }
          label={ token.label }
          value={ token.hex }
          isEnabled={ token.isEnabled }
          onToggleEnabled={ (next) => onChange?.(token.id, { isEnabled: next }) }
          trailing={ hasRationale ? (
            <IconButton
              size="small"
              aria-label={ isExpanded ? 'Hide rationale' : 'Show rationale' }
              onClick={ () => setExpandedId(isExpanded ? null : token.id) }
              sx={ {
                color: isExpanded ? 'primary.main' : 'text.secondary',
                transition: 'color 150ms',
              } }
              title={ `from ${(token.decisionRationale?.whichReferences || token.sourceReferenceIds || []).length} refs` }
            >
              <HelpOutlineIcon fontSize="small" />
            </IconButton>
          ) : null }
        />
        <Collapse in={ isExpanded }>
          <TokenDecisionTracePanel
            decisionRationale={ token.decisionRationale || (token.sourceReferenceIds ? {
              whichReferences: token.sourceReferenceIds,
              whichLayers: ['color'],
              whyChosen: '(Legacy data: no decisionRationale, showing sources only)',
            } : null) }
            references={ references }
            sx={ { mx: 2, mb: 1 } }
          />
        </Collapse>
        { !isLastInGroup && <Divider sx={ { mx: 2 } } /> }
      </Box>
    );
  };

  if (!isGrouped) {
    return (
      <Box sx={ { width: '100%', bgcolor: 'background.paper', borderRadius: 3, py: 1, ...sx } }>
        { tokens.map((token, i) => renderItem(token, i === tokens.length - 1)) }
      </Box>
    );
  }

  const groups = tokens.reduce((acc, token) => {
    const key = token.group || 'Etc';
    (acc[key] = acc[key] || []).push(token);
    return acc;
  }, {});

  return (
    <Box sx={ { width: '100%', ...sx } }>
      { Object.entries(groups).map(([groupName, groupTokens]) => (
        <Box key={ groupName } sx={ { mb: 3 } }>
          <Typography
            variant="caption"
            sx={ {
              display: 'block',
              px: 2,
              mb: 1,
              color: 'text.secondary',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            } }
          >
            { groupName }
          </Typography>
          <Box sx={ { bgcolor: 'background.paper', borderRadius: 3, py: 1 } }>
            { groupTokens.map((token, i) => renderItem(token, i === groupTokens.length - 1)) }
          </Box>
        </Box>
      )) }
    </Box>
  );
}
