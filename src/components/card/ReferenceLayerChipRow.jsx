import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import {
  LAYER_CHIP_DEFS_BASE as LAYER_DEFS_BASE,
  LAYER_CHIP_DEF_COMPONENTS as LAYER_DEF_COMPONENTS,
} from '../../data/muse/layers.js';

/**
 * ReferenceLayerChipRow component (TP4)
 *
 * The "which layers of this reference to pull in" chip row shown on the Step 2 recommendation card during project creation.
 * The referenceLayer recommended by T2 is auto-activated. The user can change the curation via toggling.
 *
 * How it works:
 * 1. autoLayers (T2 referenceLayer) is active by default
 * 2. When the user toggles a chip, onChange(useLayers) is called -> enters manual mode
 * 3. The "Auto" chip returns to auto mode
 * 4. Visually disabled when locked (after analysis starts)
 *
 * Props:
 * @param {string[]} autoLayers - 1 to 2 layers auto-recommended by T2 [Required]
 * @param {string[]} value - Currently selected useLayers (empty array = auto) [Optional, default: []]
 * @param {function} onChange - (nextLayers) => void [Required]
 * @param {boolean} locked - Locked after analysis starts [Optional, default: false]
 * @param {'concept'|'system'} mode - Determines the active chip set. If system, adds the 'components' chip [Optional, default: 'system']
 * @param {object} sx - Additional styles [Optional]
 *
 * Example usage:
 * <ReferenceLayerChipRow
 *   autoLayers={ ['color', 'typography'] }
 *   value={ selectedRefs[id]?.useLayers || [] }
 *   onChange={ (layers) => setUseLayers(id, layers) }
 *   mode="system"
 * />
 */
export function ReferenceLayerChipRow({
  autoLayers = [],
  value = [],
  onChange,
  locked = false,
  mode = 'system',
  sx,
}) {
  const LAYER_DEFS = mode === 'concept'
    ? LAYER_DEFS_BASE
    : [...LAYER_DEFS_BASE, LAYER_DEF_COMPONENTS];
  const isAuto = !value || value.length === 0;
  const effective = isAuto ? autoLayers : value;

  const toggleLayer = (key) => {
    if (locked) return;
    const base = isAuto ? [...autoLayers] : [...value];
    const next = base.includes(key)
      ? base.filter((l) => l !== key)
      : [...base, key];
    onChange?.(next);
  };

  const resetToAuto = () => {
    if (locked) return;
    onChange?.([]);
  };

  return (
    <Box sx={ { display: 'flex', flexDirection: 'column', gap: 0.5, ...sx } }>
      <Box sx={ { display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' } }>
        <Typography
          variant="caption"
          sx={ {
            fontSize: '0.65rem',
            color: 'text.secondary',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            mr: 0.5,
          } }
        >
          { isAuto ? 'Auto' : 'Manual' }
        </Typography>
        { LAYER_DEFS.map((l) => {
          const isActive = effective.includes(l.key);
          return (
            <Chip
              key={ l.key }
              label={ l.label }
              size="small"
              clickable={ !locked }
              onClick={ () => toggleLayer(l.key) }
              color={ isActive ? 'primary' : 'default' }
              variant={ isActive ? 'filled' : 'outlined' }
              sx={ {
                height: 22,
                fontSize: '0.68rem',
                opacity: locked ? 0.6 : 1,
              } }
            />
          );
        }) }
      </Box>
      { !isAuto && !locked && (
        <Chip
          label="Reset to auto"
          size="small"
          variant="outlined"
          onClick={ resetToAuto }
          sx={ { alignSelf: 'flex-start', height: 18, fontSize: '0.65rem' } }
        />
      ) }
    </Box>
  );
}
