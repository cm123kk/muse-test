import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FilterListIcon from '@mui/icons-material/FilterList';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import CloseIcon from '@mui/icons-material/Close';
import { SearchBar } from '../input/SearchBar';
import { SortMenu } from './SortMenu.jsx';

/**
 * FilterBar template
 *
 * A top bar that manages search and tag-based filtering interactions.
 * A filtering UI that combines SearchBar, Keyword Chip, and more.
 *
 * How it works:
 * 1. Real-time filtering as you type a search term
 * 2. Toggle filters by clicking tag Chips
 * 3. Select a sort option
 * 4. Switch view mode (grid/list)
 *
 * Props:
 * @param {string} searchValue - Current search term [Optional, default: '']
 * @param {function} onSearchChange - Search term change handler [Required]
 * @param {string[]} availableTags - List of available tags [Optional]
 * @param {string[]} selectedTags - List of selected tags [Optional, default: []]
 * @param {function} onTagToggle - Tag toggle handler (tag) => void [Required]
 * @param {function} onClearFilters - Filter reset handler [Optional]
 * @param {string} sortBy - Current sort key [Optional, default: 'newest']
 * @param {function} onSortChange - Sort change handler [Optional]
 * @param {string} viewMode - Current view mode ('grid' | 'list') [Optional, default: 'grid']
 * @param {function} onViewModeChange - View mode change handler [Optional]
 * @param {number} resultCount - Number of search results [Optional]
 * @param {object} sx - Additional styles [Optional]
 *
 * Example usage:
 * <FilterBar
 *   searchValue={search}
 *   onSearchChange={setSearch}
 *   availableTags={allTags}
 *   selectedTags={activeTags}
 *   onTagToggle={handleTagToggle}
 *   resultCount={filteredItems.length}
 * />
 */
export function FilterBar({
  searchValue = '',
  onSearchChange,
  availableTags = [],
  selectedTags = [],
  onTagToggle,
  onClearFilters,
  sortBy = 'newest',
  onSortChange,
  viewMode = 'grid',
  onViewModeChange,
  resultCount,
  sx,
}) {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = selectedTags.length > 0 || searchValue.length > 0;

  /**
   * Tag toggle handler
   */
  const handleTagClick = useCallback(
    (tag) => {
      onTagToggle(tag);
    },
    [onTagToggle]
  );

  /**
   * Reset all filters
   */
  const handleClearAll = useCallback(() => {
    onClearFilters?.();
  }, [onClearFilters]);

  return (
    <Box sx={{ mb: 3, ...sx }}>
      {/* Main bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        {/* Search bar */}
        <SearchBar
          value={searchValue}
          onChange={onSearchChange}
          placeholder="Search references..."
          hasFilter
          isFilterActive={showFilters}
          onFilterToggle={() => setShowFilters(!showFilters)}
          sx={{ flex: 1, minWidth: 200 }}
        />

        {/* Sort button */}
        {onSortChange && (
          <SortMenu value={sortBy} onChange={onSortChange} />
        )}

        {/* View mode toggle */}
        {onViewModeChange && (
          <Box
            sx={{
              display: 'flex',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              overflow: 'hidden',
            }}
          >
            <IconButton
              size="small"
              onClick={() => onViewModeChange('grid')}
              sx={{
                borderRadius: 0,
                bgcolor: viewMode === 'grid' ? 'action.selected' : 'transparent',
                color: viewMode === 'grid' ? 'primary.main' : 'text.secondary',
              }}
            >
              <GridViewIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onViewModeChange('list')}
              sx={{
                borderRadius: 0,
                bgcolor: viewMode === 'list' ? 'action.selected' : 'transparent',
                color: viewMode === 'list' ? 'primary.main' : 'text.secondary',
              }}
            >
              <ViewListIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* Expanded filter area */}
      <Collapse in={showFilters}>
        <Box
          sx={{
            mt: 2,
            p: 2,
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.default',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterListIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Filter by Tags
              </Typography>
            </Box>
            {hasActiveFilters && onClearFilters && (
              <Button
                size="small"
                onClick={handleClearAll}
                sx={{ textTransform: 'none', color: 'text.secondary' }}
              >
                Clear all
              </Button>
            )}
          </Box>

          {/* Tag Chip list */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {availableTags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <Chip
                  key={tag}
                  label={`#${tag}`}
                  onClick={() => handleTagClick(tag)}
                  variant={isSelected ? 'filled' : 'outlined'}
                  color={isSelected ? 'primary' : 'default'}
                  sx={{
                    fontWeight: isSelected ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      backgroundColor: isSelected ? 'primary.dark' : 'action.hover',
                    },
                  }}
                />
              );
            })}
          </Box>
        </Box>
      </Collapse>

      {/* Active filter display & result count */}
      {(hasActiveFilters || resultCount !== undefined) && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: 2,
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          {/* Active filter Chips */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            {selectedTags.map((tag) => (
              <Chip
                key={tag}
                label={`#${tag}`}
                size="small"
                onDelete={() => handleTagClick(tag)}
                deleteIcon={<CloseIcon sx={{ fontSize: 14 }} />}
                sx={{
                  fontWeight: 500,
                  bgcolor: 'primary.lighter',
                  color: 'primary.dark',
                  '& .MuiChip-deleteIcon': {
                    color: 'primary.main',
                    '&:hover': {
                      color: 'primary.dark',
                    },
                  },
                }}
              />
            ))}
            {searchValue && (
              <Chip
                label={`"${searchValue}"`}
                size="small"
                onDelete={() => onSearchChange('')}
                deleteIcon={<CloseIcon sx={{ fontSize: 14 }} />}
                sx={{
                  fontWeight: 500,
                  bgcolor: 'grey.200',
                  '& .MuiChip-deleteIcon': {
                    color: 'text.secondary',
                  },
                }}
              />
            )}
          </Box>

          {/* Result count */}
          {resultCount !== undefined && (
            <Typography variant="body2" color="text.secondary">
              {resultCount} {resultCount === 1 ? 'result' : 'results'}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}
