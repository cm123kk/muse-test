import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { RefImage } from '../media/RefImage.jsx';

/** Minimum character count per mode: concept=0 (skippable), system=30 */
const MIN_LENGTH_BY_MODE = { concept: 0, system: 30 };

const PLACEHOLDER_BY_MODE = {
  concept: `e.g.
- Editorial dashboard layout
- Modular grid with soft rounded corners for a modern feel
- Retro paper-textured background, fixed position`,
  system: `e.g.
- Editorial dashboard layout
- Modular grid with soft rounded corners (8/16px) for a modern feel
- Subtle elevation (one gentle shadow level)
- Spacing scale based on 8/16/24`,
};

/**
 * RefinementNotesField component (Step 3)
 *
 * Step 3 of the project creation wizard: a usage-notes textarea filled in after reviewing references.
 * The minimum character count varies by mode (concept=0 / system=30).
 * userNotes are applied with HIGHEST PRIORITY during T3 synthesis.
 *
 * Behavior:
 * 1. Show a row of selected reference thumbnails at the top (for the user's visual reference)
 * 2. A textarea, together with a guide box (which ref's what to use / emphasize / transform)
 * 3. When the per-mode minLength is not met, isValid=false, and the parent disables the [Start analysis ->] button
 *
 * Props:
 * @param {string} value - current usage notes [Required]
 * @param {function} onChange - (next) => void [Required]
 * @param {Array<{id, thumbnailUrl, title?}>} selectedRefs - selected references [Optional]
 * @param {'concept'|'system'} mode - TP2 mode. Determines minLength [Optional, default: 'system']
 * @param {boolean} disabled - disabled state [Optional, default: false]
 * @param {object} sx - additional styles [Optional]
 *
 * Example usage:
 * <RefinementNotesField
 *   value={ userNotes }
 *   onChange={ setUserNotes }
 *   selectedRefs={ selectedRefs }
 *   mode={ projectMode }
 * />
 */
export function RefinementNotesField({
  value,
  onChange,
  selectedRefs = [],
  mode = 'system',
  disabled = false,
  sx,
}) {
  const minLen = MIN_LENGTH_BY_MODE[mode] ?? 30;
  const charCount = (value || '').length;
  const isValid = charCount >= minLen;
  const placeholder = PLACEHOLDER_BY_MODE[mode] || PLACEHOLDER_BY_MODE.system;

  const helperText = minLen === 0
    ? `${charCount} / 300 (optional : the more you add, the richer the synthesis)`
    : `${charCount} / 300 (min ${minLen} chars, ${isValid ? '✓' : `${minLen - charCount} more needed`})`;

  return (
    <Box sx={ { display: 'flex', flexDirection: 'column', gap: 2, ...sx } }>
      {/* Top: row of selected ref thumbnails */}
      { selectedRefs.length > 0 && (
        <Box>
          <Typography variant="caption" sx={ { display: 'block', mb: 0.75, color: 'text.secondary' } }>
            Selected references ({ selectedRefs.length })
          </Typography>
          <Box sx={ { display: 'flex', gap: 1, flexWrap: 'wrap' } }>
            { selectedRefs.map((r) => (
              <Box
                key={ r.id }
                title={ r.title || r.id }
                sx={ {
                  width: 56,
                  height: 56,
                  borderRadius: 1,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  flexDirection: 'column',
                } }
              >
                { r.thumbnailUrl && (
                  <RefImage
                    src={ r.thumbnailUrl }
                    storagePath={ r.storagePath }
                    alt={ r.id }
                  />
                ) }
              </Box>
            )) }
          </Box>
        </Box>
      ) }

      {/* Textarea */}
      <TextField
        label="Usage Notes"
        placeholder={ placeholder }
        value={ value }
        onChange={ (e) => onChange?.(e.target.value) }
        disabled={ disabled }
        fullWidth
        multiline
        minRows={ 4 }
        maxRows={ 8 }
        inputProps={ { maxLength: 300 } }
        helperText={ helperText }
        error={ minLen > 0 && charCount > 0 && !isValid }
      />

      {/* Guide box */}
      <Box
        sx={ {
          p: 2,
          borderRadius: 1.5,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
        } }
      >
        <Typography
          variant="caption"
          sx={ {
            display: 'block',
            mb: 1,
            fontWeight: 600,
            color: 'text.secondary',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          } }
        >
          Usage notes guide
        </Typography>
        <Typography variant="body2" sx={ { mb: 1, color: 'text.secondary' } }>
          Start with the overall feel and structure. Pixel-level details can wait.
        </Typography>
        <Box component="ul" sx={ { m: 0, pl: 2.5, display: 'flex', flexDirection: 'column', gap: 0.75 } }>
          <Box component="li">
            <Typography variant="body2">
              <strong>Overall genre and mood</strong> : e.g. "Editorial Dashboard Layout"
            </Typography>
          </Box>
          <Box component="li">
            <Typography variant="body2">
              <strong>Core style direction</strong> : e.g. "Refined radius + modular grid for modernism"
            </Typography>
          </Box>
          <Box component="li">
            <Typography variant="body2">
              <strong>Mood and structure decisions</strong> : e.g. "Retro paper-grained background, fixed position"
            </Typography>
          </Box>
        </Box>
        <Box sx={ { mt: 1.5, pt: 1.5, borderTop: '1px dashed', borderColor: 'divider' } }>
          <Typography variant="caption" sx={ { color: 'text.secondary' } }>
            <strong>Bad example</strong>: "make it pretty" / "make it trendy" (only vague feelings)
            <br />
            <strong>Good example</strong>: genre + style direction + structure/background decisions (3 lines is enough)
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
