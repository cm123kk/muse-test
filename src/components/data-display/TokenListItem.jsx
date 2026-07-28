import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';

/**
 * TokenListItem component
 *
 * A shared row component that represents a single token of each layer
 * (color/typography/layout/gradient/key visual) on the MUSE project detail screen.
 *
 * Structure: [preview 48x48] [label + value] [on/off switch]
 *
 * - When `isEnabled=false`, the entire row is dimmed (opacity 0.4, editing still allowed)
 * - preview uses the slot pattern: inject any node such as a color swatch, typography sample, or gradient box
 *
 * Props:
 * @param {node} preview - Left 48x48 preview area (ReactNode) [Required]
 * @param {string} label - Token name/role [Required]
 * @param {string} value - Token value (string representation such as HEX, px, font name) [Optional]
 * @param {boolean} isEnabled - Token enabled state [Optional, default: true]
 * @param {function} onToggleEnabled - Enable toggle (nextEnabled) => void [Optional]
 * @param {node} trailing - Auxiliary action rendered before the right-hand Switch (ReactNode) [Optional]
 * @param {object} sx - Additional styles [Optional]
 *
 * Example usage:
 * <TokenListItem
 *   preview={ <Box sx={{ width: 48, height: 48, bgcolor: '#4F46E5', borderRadius: 1.5 }} /> }
 *   label="Accent Violet"
 *   value="#4F46E5"
 *   isEnabled={ token.isEnabled }
 *   onToggleEnabled={ (next) => updateToken(id, { isEnabled: next }) }
 * />
 */
export function TokenListItem({
  preview,
  label,
  value,
  isEnabled = true,
  onToggleEnabled,
  trailing,
  sx,
}) {
  return (
    <Box
      sx={ {
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        px: 2,
        py: 1.5,
        borderRadius: 3,
        transition: 'background-color 0.15s, opacity 0.15s',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
        ...sx,
      } }
    >
      {/* 1. Preview (48x48) */}
      <Box
        sx={ {
          flex: '0 0 auto',
          width: 48,
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isEnabled ? 1 : 0.4,
          transition: 'opacity 0.15s',
        } }
      >
        { preview }
      </Box>

      {/* 2. Label + Value */}
      <Box
        sx={ {
          flex: '1 1 auto',
          minWidth: 0,
          opacity: isEnabled ? 1 : 0.4,
          transition: 'opacity 0.15s',
        } }
      >
        <Typography
          variant="body2"
          sx={ {
            fontWeight: 500,
            color: 'text.primary',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          } }
        >
          { label }
        </Typography>
        { value && (
          <Typography
            variant="caption"
            sx={ {
              display: 'block',
              fontFamily: 'monospace',
              color: 'text.secondary',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            } }
          >
            { value }
          </Typography>
        ) }
      </Box>

      {/* 3. Trailing slot (e.g. decision rationale toggle) */}
      { trailing && (
        <Box sx={ { flex: '0 0 auto', display: 'flex', alignItems: 'center' } }>
          { trailing }
        </Box>
      ) }

      {/* 4. On/Off switch */}
      <Switch
        checked={ isEnabled }
        onChange={ (e) => onToggleEnabled?.(e.target.checked) }
        size="small"
        color="primary"
        sx={ { flex: '0 0 auto' } }
        aria-label="Toggle token"
      />
    </Box>
  );
}
