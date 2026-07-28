import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SearchBar } from '../input/SearchBar.jsx';
import { REPRESENTATIVE_COLORS, isSimilarColor } from '../../utils/colorSimilarity';

const DESIGN_LAYER_KEYS = ['typography', 'layout', 'gradient'];
const VISUAL_DIRECTION_KEYS = ['genre', 'style', 'subject'];
const DESIGN_LAYER_LABELS = [
  { key: 'typography', label: 'Typography' },
  { key: 'layout', label: 'Layout' },
  { key: 'gradient', label: 'Gradient' },
];
const VISUAL_DIRECTION_LABELS = [
  { key: 'genre', label: 'Genre' },
  { key: 'style', label: 'Style' },
  { key: 'subject', label: 'Subject' },
];

/** Filter category Accordion: collapse/expand */
function FilterAccordion({ label, count, defaultExpanded = false, children }) {
  return (
    <Accordion
      defaultExpanded={ defaultExpanded }
      disableGutters
      elevation={ 0 }
      sx={ {
        bgcolor: 'transparent',
        borderBottom: '1px solid',
        borderColor: 'divider',
        '&:before': { display: 'none' },
        '&:last-of-type': { borderBottom: 'none' },
      } }
    >
      <AccordionSummary
        expandIcon={ <ExpandMoreIcon fontSize="small" /> }
        sx={ { px: 0, minHeight: 40, '& .MuiAccordionSummary-content': { my: 1 } } }
      >
        <Typography
          variant="overline"
          sx={ { fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.06em', color: 'text.primary' } }
        >
          { label }
          { count > 0 && (
            <Box component="span" sx={ { ml: 1, color: 'primary.main', fontSize: '0.7rem' } }>
              { count }
            </Box>
          ) }
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={ { px: 0, pt: 0, pb: 2, display: 'flex', flexDirection: 'column', gap: 1.5 } }>
        { children }
      </AccordionDetails>
    </Accordion>
  );
}

/** Sub-row (typography / layout / gradient / genre / style / subject level) */
function FilterSubRow({ label, children }) {
  return (
    <Box sx={ { display: 'flex', alignItems: 'flex-start', gap: 1.5 } }>
      <Typography
        variant="caption"
        sx={ { minWidth: 64, pt: 0.75, color: 'text.secondary', fontSize: '0.72rem' } }
      >
        { label }
      </Typography>
      <Box sx={ { display: 'flex', flexWrap: 'wrap', gap: 0.5 } }>
        { children }
      </Box>
    </Box>
  );
}

function buildLayeredTags(references) {
  const buckets = {
    typography: new Set(),
    layout: new Set(),
    gradient: new Set(),
    genre: new Set(),
    style: new Set(),
    subject: new Set(),
  };
  references.forEach((r) => {
    const t = r.tags || {};
    (t.typography || []).forEach((x) => buckets.typography.add(x));
    (t.layout || []).forEach((x) => buckets.layout.add(x));
    (t.gradient || []).forEach((x) => buckets.gradient.add(x));
    const vd = t.visualDirection || {};
    (vd.genre || []).forEach((x) => buckets.genre.add(x));
    (vd.style || []).forEach((x) => buckets.style.add(x));
    (vd.subject || []).forEach((x) => buckets.subject.add(x));
  });
  return Object.fromEntries(Object.entries(buckets).map(([k, s]) => [k, [...s].sort()]));
}

function buildRepresentativeCounts(references) {
  return REPRESENTATIVE_COLORS
    .map((rep) => {
      const count = references.filter((r) =>
        (r.dominantColors || []).some((hex) => isSimilarColor(rep.hex, hex)),
      ).length;
      return { ...rep, count };
    })
    .filter((rep) => rep.count > 0);
}

/**
 * FilterPanel component
 *
 * A search + color + per-layer tag filtering UI for a reference collection.
 *
 * Flow:
 * 1. Typing a keyword into the top search bar makes the parent screen render the filtered results
 * 2. Automatically computes the representative color wheel and per-layer tag lists from references
 * 3. Clicking a color swatch or a tag chip toggles activeColors / activeTags
 * 4. A "Reset filters" button appears at the bottom whenever any filter is active
 * 5. Filter state is managed by the parent (controlled). The panel only handles pure display and event forwarding
 *
 * Props:
 * @param {array} references - Full array of references (filter source) [Required]
 * @param {string} searchTerm - Current search term [Required]
 * @param {function} onSearchTermChange - (nextTerm) => void [Required]
 * @param {string[]} activeTags - Array of active tags [Required]
 * @param {function} onToggleTag - (tag) => void [Required]
 * @param {string[]} activeColors - Array of active color hexes [Required]
 * @param {function} onToggleColor - (hex) => void [Required]
 * @param {function} onResetColors - () => void, clears the color filter when "View all" is clicked [Optional]
 * @param {function} onResetFilters - () => void [Required]
 * @param {number} filteredCount - Current filtered result count [Required]
 * @param {number} totalCount - Total count [Required]
 * @param {object} sx - Additional container styles [Optional]
 *
 * Example usage:
 * <FilterPanel
 *   references={ references }
 *   searchTerm={ searchTerm }
 *   onSearchTermChange={ setSearchTerm }
 *   activeTags={ activeTags }
 *   onToggleTag={ toggleTag }
 *   activeColors={ activeColors }
 *   onToggleColor={ toggleColor }
 *   onResetFilters={ resetAllFilters }
 *   filteredCount={ filtered.length }
 *   totalCount={ references.length }
 * />
 */
export function FilterPanel({
  references,
  searchTerm,
  onSearchTermChange,
  activeTags,
  onToggleTag,
  activeColors,
  onToggleColor,
  onResetColors,
  onResetFilters,
  filteredCount,
  totalCount,
  sx,
}) {
  const layeredTags = useMemo(() => buildLayeredTags(references), [references]);
  const hasAnyTag = useMemo(
    () => Object.values(layeredTags).some((arr) => arr.length > 0),
    [layeredTags],
  );
  const representativeCounts = useMemo(
    () => buildRepresentativeCounts(references),
    [references],
  );

  const totalActiveFilters = activeTags.length + activeColors.length;

  const countForKeys = (keys) =>
    activeTags.filter((t) => keys.some((k) => layeredTags[k]?.includes(t))).length;

  const hasDesignLayer = DESIGN_LAYER_KEYS.some((k) => layeredTags[k]?.length > 0);
  const hasVisualDirection = VISUAL_DIRECTION_KEYS.some((k) => layeredTags[k]?.length > 0);

  return (
    <Box sx={ sx }>
      <SearchBar
        value={ searchTerm }
        placeholder="Search by title or tag"
        onChange={ onSearchTermChange }
        onClear={ () => onSearchTermChange('') }
        isFullWidth
      />
      { (hasAnyTag || representativeCounts.length > 0) && (
        <Box sx={ { mt: 2 } }>
          { /* Color: based on the representative color wheel; selecting one matches surrounding shades by similarity */ }
          { representativeCounts.length > 0 && (
            <FilterAccordion label="Color" count={ activeColors.length }>
              <Box sx={ { display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' } }>
                { /* "View all": shown as active when the color filter is empty; clicking clears the color filter */ }
                <Box
                  onClick={ () => activeColors.length > 0 && onResetColors?.() }
                  title="View all (clear color filter)"
                  sx={ {
                    position: 'relative',
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'conic-gradient(from 0deg, #ff5b5b, #ffbd2e, #6dd86d, #4cc4ff, #b56bff, #ff5bd0, #ff5b5b)',
                    cursor: activeColors.length > 0 ? 'pointer' : 'default',
                    border: activeColors.length === 0 ? '3px solid' : '1px solid',
                    borderColor: activeColors.length === 0 ? 'primary.main' : 'divider',
                    boxShadow: activeColors.length === 0 ? '0 0 0 2px rgba(99,102,241,0.25)' : 'none',
                    transition: 'border-color 150ms, border-width 150ms, box-shadow 150ms',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxSizing: 'border-box',
                  } }
                >
                  <Box
                    sx={ {
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      bgcolor: 'background.default',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    } }
                  >
                    <Typography
                      sx={ { fontSize: '0.55rem', fontWeight: 700, lineHeight: 1, color: 'text.primary' } }
                    >
                      All
                    </Typography>
                  </Box>
                </Box>

                { representativeCounts.map(({ hex, label, count }) => {
                  const isActive = activeColors.includes(hex);
                  return (
                    <Box
                      key={ hex }
                      onClick={ () => onToggleColor(hex) }
                      title={ `${label} · ${count}` }
                      sx={ {
                        position: 'relative',
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        bgcolor: hex,
                        cursor: 'pointer',
                        border: isActive ? '3px solid' : '1px solid',
                        borderColor: isActive ? 'primary.main' : 'divider',
                        boxSizing: 'border-box',
                        boxShadow: isActive ? '0 0 0 2px rgba(99,102,241,0.25)' : 'none',
                        transition: 'border-color 150ms, border-width 150ms, box-shadow 150ms',
                        '&:hover': {
                          borderColor: isActive ? 'primary.main' : 'text.secondary',
                        },
                      } }
                    >
                      { isActive && (
                        <Box
                          sx={ {
                            position: 'absolute',
                            top: -6,
                            right: -6,
                            minWidth: 18,
                            height: 18,
                            px: 0.5,
                            borderRadius: '9px',
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            fontSize: '0.65rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          } }
                        >
                          { count }
                        </Box>
                      ) }
                    </Box>
                  );
                }) }
              </Box>
              <Typography variant="caption" color="text.secondary">
                Selecting a representative color also filters references in similar shades
              </Typography>
            </FilterAccordion>
          ) }

          { hasDesignLayer && (
            <FilterAccordion label="Design Layer" count={ countForKeys(DESIGN_LAYER_KEYS) }>
              { DESIGN_LAYER_LABELS
                .filter(({ key }) => layeredTags[key]?.length > 0)
                .map(({ key, label }) => (
                  <FilterSubRow key={ key } label={ label }>
                    { layeredTags[key].map((tag) => (
                      <Chip
                        key={ tag }
                        label={ tag }
                        size="small"
                        color={ activeTags.includes(tag) ? 'primary' : 'default' }
                        variant={ activeTags.includes(tag) ? 'filled' : 'outlined' }
                        onClick={ () => onToggleTag(tag) }
                        sx={ { height: 26, fontSize: '0.72rem' } }
                      />
                    )) }
                  </FilterSubRow>
                )) }
            </FilterAccordion>
          ) }

          { hasVisualDirection && (
            <FilterAccordion label="Visual Direction" count={ countForKeys(VISUAL_DIRECTION_KEYS) }>
              { VISUAL_DIRECTION_LABELS
                .filter(({ key }) => layeredTags[key]?.length > 0)
                .map(({ key, label }) => (
                  <FilterSubRow key={ key } label={ label }>
                    { layeredTags[key].map((tag) => (
                      <Chip
                        key={ tag }
                        label={ tag }
                        size="small"
                        color={ activeTags.includes(tag) ? 'primary' : 'default' }
                        variant={ activeTags.includes(tag) ? 'filled' : 'outlined' }
                        onClick={ () => onToggleTag(tag) }
                        sx={ { height: 26, fontSize: '0.72rem' } }
                      />
                    )) }
                  </FilterSubRow>
                )) }
            </FilterAccordion>
          ) }

          { totalActiveFilters > 0 && (
            <Button size="small" variant="text" onClick={ onResetFilters } sx={ { mt: 2 } }>
              Reset filters ({ totalActiveFilters })
            </Button>
          ) }
        </Box>
      ) }
      <Typography variant="caption" color="text.secondary" sx={ { display: 'block', mt: 1.5 } }>
        { filteredCount } / { totalCount } shown
      </Typography>
    </Box>
  );
}
