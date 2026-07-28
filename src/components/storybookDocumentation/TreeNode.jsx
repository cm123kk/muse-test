import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';

/**
 * TreeNode - Component that visualizes the MUI theme structure as a tree
 *
 * Props:
 * @param {string} keyName - Key name to display [Required]
 * @param {any} value - Value for the key (object, array, or primitive) [Required]
 * @param {number} depth - Tree depth (used to calculate indentation) [Optional, default: 0]
 * @param {boolean} defaultOpen - Initial expanded state [Optional, default: false]
 *
 * Example usage:
 * <TreeNode keyName="palette" value={theme.palette} defaultOpen={true} />
 */
export const TreeNode = ({ keyName, value, depth = 0, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const isObject = typeof value === 'object' && value !== null && !Array.isArray(value);
  const isArray = Array.isArray(value);
  const isExpandable = isObject || isArray;
  const childCount = isExpandable ? Object.keys(value).length : 0;

  // Detect color values
  const isColor = typeof value === 'string' && (
    value.startsWith('#') ||
    value.startsWith('rgb') ||
    value.startsWith('rgba')
  );

  // Format the value
  const formatValue = (val) => {
    if (typeof val === 'string') return `"${val}"`;
    if (typeof val === 'number') return val;
    if (typeof val === 'boolean') return val ? 'true' : 'false';
    if (typeof val === 'function') return 'ƒ()';
    if (val === null) return 'null';
    if (val === undefined) return 'undefined';
    return String(val);
  };

  return (
    <Box sx={ { ml: depth > 0 ? 2 : 0 } }>
      <Box
        onClick={ () => isExpandable && setIsOpen(!isOpen) }
        sx={ {
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          py: 0.5,
          px: 1,
          cursor: isExpandable ? 'pointer' : 'default',
          borderRadius: 1,
          '&:hover': isExpandable ? { backgroundColor: 'action.hover' } : {},
          borderLeft: depth > 0 ? '1px solid' : 'none',
          borderColor: 'divider',
        } }
      >
        {/* Expand/collapse icon */}
        { isExpandable ? (
          <Typography
            component="span"
            sx={ {
              width: 16,
              color: 'text.secondary',
              fontSize: '12px',
              fontFamily: 'monospace',
              userSelect: 'none',
            } }
          >
            { isOpen ? '▼' : '▶' }
          </Typography>
        ) : (
          <Box sx={ { width: 16 } } />
        ) }

        {/* Key name */}
        <Typography
          component="span"
          sx={ {
            color: isExpandable ? 'primary.main' : 'secondary.main',
            fontFamily: 'monospace',
            fontSize: '13px',
            fontWeight: isExpandable ? 600 : 400,
          } }
        >
          { keyName }
        </Typography>

        {/* Separator */}
        <Typography component="span" sx={ { color: 'text.secondary', fontSize: '13px' } }>
          :
        </Typography>

        {/* Value or type information */}
        { isExpandable ? (
          <Typography
            component="span"
            sx={ { color: 'text.secondary', fontSize: '12px', fontFamily: 'monospace' } }
          >
            { isArray ? `Array[${childCount}]` : `{${childCount}}` }
          </Typography>
        ) : (
          <Box sx={ { display: 'flex', alignItems: 'center', gap: 1 } }>
            { isColor && (
              <Box
                sx={ {
                  width: 14,
                  height: 14,
                  backgroundColor: value,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: '2px',
                  flexShrink: 0,
                } }
              />
            ) }
            <Typography
              component="span"
              sx={ {
                color: typeof value === 'string' ? 'success.dark' :
                       typeof value === 'number' ? 'warning.dark' : 'text.primary',
                fontFamily: 'monospace',
                fontSize: '12px',
                maxWidth: 400,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              } }
            >
              { formatValue(value) }
            </Typography>
          </Box>
        ) }
      </Box>

      {/* Child nodes */}
      { isExpandable && (
        <Collapse in={ isOpen }>
          <Box>
            { Object.entries(value).map(([childKey, childValue]) => (
              <TreeNode
                key={ childKey }
                keyName={ childKey }
                value={ childValue }
                depth={ depth + 1 }
              />
            )) }
          </Box>
        </Collapse>
      ) }
    </Box>
  );
};
