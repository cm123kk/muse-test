import TextField from '@mui/material/TextField';

/**
 * IntentGuideField component (TP3: Step 1)
 *
 * A one-line project intent textarea. The guide box was removed to keep the focus on Step 3 (RefinementNotesField).
 * Step 1 serves as a lightweight starting point with just a placeholder and helperText.
 *
 * Props:
 * @param {string} value - current intent text [Required]
 * @param {function} onChange - (next) => void [Required]
 * @param {string} label - textarea label [Optional, default: 'One-line intent']
 * @param {string} placeholder - textarea placeholder [Optional]
 * @param {boolean} disabled - disabled state [Optional, default: false]
 * @param {object} sx - additional styles [Optional]
 *
 * Example usage:
 * <IntentGuideField value={ intent } onChange={ setIntent } />
 */
export function IntentGuideField({
  value,
  onChange,
  label = 'One-line intent',
  placeholder = 'e.g. Calm dark-mood fintech dashboard, data readability first',
  disabled = false,
  sx,
}) {
  const charCount = (value || '').length;

  return (
    <TextField
      label={ label }
      placeholder={ placeholder }
      value={ value }
      onChange={ (e) => onChange?.(e.target.value) }
      disabled={ disabled }
      fullWidth
      multiline
      minRows={ 2 }
      maxRows={ 4 }
      inputProps={ { maxLength: 120 } }
      helperText={ `${charCount} / 120 : mood, user context, visual direction, constraints in one line` }
      sx={ sx }
    />
  );
}
