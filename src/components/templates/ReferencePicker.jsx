import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { ReferenceCard } from '../card/ReferenceCard.jsx';
import { ReferenceLayerChipRow } from '../card/ReferenceLayerChipRow.jsx';
import { useInfiniteScroll } from '../layout/useInfiniteScroll.js';
import { flattenTags } from '../../data/muse';

/**
 * ReferencePicker component
 *
 * Used in project creation Step 2. Separates recommended references and the full
 * archive into tabs so you can multi-select. Supports tag chip filtering.
 *
 * Props:
 * @param {array} recommended - recommended references [{ id, src, title?, tags? }] [Optional]
 * @param {array} archive - full archive [{ id, src, title?, tags? }] [Required]
 * @param {string[]} selectedIds - currently selected id array [Required]
 * @param {function} onChange - (nextIds) => void [Required]
 * @param {string[]} tagFilter - active tag array [Optional, default: []]
 * @param {function} onTagFilterChange - (nextTags) => void [Optional]
 * @param {function} onLoadMore - load more from the archive [Optional]
 * @param {boolean} hasMore - whether more archive items can be loaded [Optional, default: false]
 * @param {boolean} isLoading - loading in progress [Optional, default: false]
 * @param {object} referenceLayerMap - TP4 auto: { [refId]: layers[] } [Optional]
 * @param {Array} selectedRefs - TP4 user curation: [{id, useLayers}] [Optional]
 * @param {function} onUseLayersChange - TP4 (id, layers) => void [Optional]
 * @param {'concept'|'system'} mode - determines the recommendation/curation chip set (system adds a components chip) [Optional, default: 'system']
 * @param {object} sx - additional styles [Optional]
 *
 * Example usage:
 * <ReferencePicker
 *   recommended={ recommended }
 *   archive={ archive }
 *   selectedIds={ ids }
 *   onChange={ setIds }
 * />
 */
export function ReferencePicker({
  recommended = [],
  archive,
  selectedIds,
  onChange,
  tagFilter = [],
  onTagFilterChange,
  onLoadMore,
  hasMore = false,
  isLoading = false,
  referenceLayerMap = {},
  selectedRefs = [],
  onUseLayersChange,
  mode = 'system',
  sx,
}) {
  const [tab, setTab] = useState(recommended.length ? 'recommended' : 'archive');

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const toggleId = (id, next) => {
    if (next) {
      onChange?.([...selectedIds, id]);
    } else {
      onChange?.(selectedIds.filter((x) => x !== id));
    }
  };

  const allTags = useMemo(() => {
    const set = new Set();
    archive.forEach((ref) => flattenTags(ref).forEach((t) => set.add(t)));
    return [...set];
  }, [archive]);

  const visibleArchive = useMemo(() => {
    if (!tagFilter.length) return archive;
    return archive.filter((ref) => {
      const refTags = flattenTags(ref);
      return tagFilter.every((t) => refTags.includes(t));
    });
  }, [archive, tagFilter]);

  const toggleTag = (tag) => {
    if (!onTagFilterChange) return;
    const next = tagFilter.includes(tag)
      ? tagFilter.filter((t) => t !== tag)
      : [...tagFilter, tag];
    onTagFilterChange(next);
  };

  const currentList = tab === 'recommended' ? recommended : visibleArchive;

  /** selected id -> look up metadata from archive union recommended (for the thumbnail strip) */
  const selectedItems = useMemo(() => {
    const map = new Map();
    archive.forEach((r) => map.set(r.id, r));
    recommended.forEach((r) => map.set(r.id, r));
    return selectedIds.map((id) => map.get(id)).filter(Boolean);
  }, [selectedIds, archive, recommended]);

  return (
    <Box sx={ { width: '100%', ...sx } }>
      {/* Selected references: bottom-right viewport-fixed floating strip (above the bottom nav)
          Fixed so it stays visible at all times; not rendered when nothing is selected. */}
      { selectedItems.length > 0 && (
        <Box
          sx={ {
            position: 'fixed',
            right: { xs: 16, md: 24, lg: 40 },
            // Floats 16px above the bottom nav (BOTTOM_BAR_HEIGHT=88)
            bottom: { xs: 96, md: 104 },
            zIndex: (theme) => theme.zIndex.appBar - 1,
            maxWidth: { xs: 'calc(100vw - 32px)', md: '60vw', lg: 720 },
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            boxShadow: (theme) => theme.customShadows.sm,
            backdropFilter: 'blur(8px)',
            p: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            overflowX: 'auto',
            '&::-webkit-scrollbar': { height: 6 },
            '&::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: 3 },
          } }
        >
          { selectedItems.map((item) => (
            <Box
              key={ item.id }
              sx={ {
                position: 'relative',
                flexShrink: 0,
                width: 56,
                height: 56,
              } }
            >
              <Box
                component="img"
                src={ item.src }
                alt={ item.title || '' }
                decoding="async"
                sx={ {
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: 2,
                  display: 'block',
                } }
              />
              <IconButton
                size="small"
                aria-label="Deselect"
                onClick={ () => toggleId(item.id, false) }
                sx={ {
                  position: 'absolute',
                  top: -6,
                  right: -6,
                  width: 20,
                  height: 20,
                  bgcolor: 'rgba(20,19,43,0.85)',
                  color: 'common.white',
                  '&:hover': { bgcolor: 'error.main' },
                } }
              >
                <CloseIcon sx={ { fontSize: 12 } } />
              </IconButton>
            </Box>
          )) }
        </Box>
      ) }

      {/* Header: tabs + selection counter */}
      <Box
        sx={ {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
          gap: 2,
        } }
      >
        <Tabs
          value={ tab }
          onChange={ (_e, v) => setTab(v) }
          textColor="primary"
          indicatorColor="primary"
        >
          { recommended.length > 0 && (
            <Tab value="recommended" label={ `Recommended (${recommended.length})` } />
          ) }
          <Tab value="archive" label={ `Archive (${archive.length})` } />
        </Tabs>

        <Typography variant="body2" color="text.secondary">
          { selectedIds.length } selected
        </Typography>
      </Box>

      {/* Tag filter (archive tab only) */}
      { tab === 'archive' && allTags.length > 0 && (
        <Box
          sx={ {
            display: 'flex',
            flexWrap: 'wrap',
            gap: 0.75,
            mb: 2,
            alignItems: 'center',
          } }
        >
          <Typography variant="caption" color="text.secondary" sx={ { mr: 0.5 } }>
            Tags
          </Typography>
          { allTags.map((tag) => {
            const isActive = tagFilter.includes(tag);
            return (
              <Chip
                key={ tag }
                label={ tag }
                size="small"
                onClick={ () => toggleTag(tag) }
                color={ isActive ? 'primary' : 'default' }
                variant={ isActive ? 'filled' : 'outlined' }
              />
            );
          }) }
          { tagFilter.length > 0 && (
            <Button
              size="small"
              variant="text"
              onClick={ () => onTagFilterChange?.([]) }
              sx={ { ml: 1 } }
            >
              Reset
            </Button>
          ) }
        </Box>
      ) }

      {/* Grid: a fixed aspect-ratio CSS Grid removes Masonry's measurement jitter.
          Each cell's media area is locked to mediaRatio 4/5 so the height stays fixed regardless of image load. */}
      { currentList.length === 0 ? (
        <Box sx={ { py: 6, textAlign: 'center' } }>
          <Typography color="text.secondary" variant="body2">
            { tab === 'recommended'
              ? 'No recommended references yet. Try describing your project intent in more detail.'
              : tagFilter.length > 0
                ? 'No items match the selected tags.'
                : 'No references in the archive.' }
          </Typography>
        </Box>
      ) : (
        <Box
          sx={ {
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(3, 1fr)',
              md: 'repeat(4, 1fr)',
              lg: 'repeat(5, 1fr)',
              xl: 'repeat(6, 1fr)',
            },
            gap: 2,
            alignItems: 'start',
          } }
        >
          { currentList.map((item) => {
            const isSelected = selectedSet.has(item.id);
            const autoLayers = referenceLayerMap[item.id] || [];
            const userCuration = selectedRefs.find((r) => r.id === item.id)?.useLayers || [];
            return (
              <Box key={ item.id }>
                <ReferenceCard
                  src={ item.src }
                  title={ item.title }
                  mediaRatio="4/5"
                  isSelectable
                  isSelected={ isSelected }
                  onToggleSelect={ (next) => toggleId(item.id, next) }
                />
                { isSelected && onUseLayersChange && (
                  <Box onClick={ (e) => e.stopPropagation() } sx={ { mt: 0.5 } }>
                    <ReferenceLayerChipRow
                      autoLayers={ autoLayers.length > 0 ? autoLayers : ['color', 'typography'] }
                      value={ userCuration }
                      onChange={ (layers) => onUseLayersChange(item.id, layers) }
                      mode={ mode }
                    />
                  </Box>
                ) }
              </Box>
            );
          }) }
        </Box>
      ) }

      {/* Infinite scroll sentinel: active on the archive tab only */}
      <InfiniteScrollSentinel
        onLoadMore={ onLoadMore }
        hasMore={ tab === 'archive' && hasMore }
        isLoading={ isLoading }
      />
    </Box>
  );
}

/** Infinite scroll sentinel: calls onLoadMore when the IntersectionObserver enters view */
function InfiniteScrollSentinel({ onLoadMore, hasMore, isLoading }) {
  const sentinelRef = useInfiniteScroll({
    onLoadMore,
    hasMore: !!hasMore,
    isEnabled: !!onLoadMore,
  });
  if (!hasMore) return null;
  return (
    <Box ref={ sentinelRef } sx={ { height: 32, mt: 2 } }>
      { isLoading && (
        <Typography variant="caption" color="text.secondary" sx={ { display: 'block', textAlign: 'center' } }>
          Loading more…
        </Typography>
      ) }
    </Box>
  );
}
