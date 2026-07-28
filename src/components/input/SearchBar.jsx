import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import TuneIcon from '@mui/icons-material/Tune';

/**
 * SearchBar component
 *
 * A refined search input field for keyword search.
 * Provides real-time search, a clear button, and a filter toggle.
 *
 * Behavior:
 * 1. When the user types, the onChange callback is called
 * 2. When there is an input value, the clear (X) button is shown
 * 3. On Enter key or search icon click, the onSearch callback is called
 * 4. On filter icon click, the onFilterToggle callback is called
 *
 * Props:
 * @param {string} value - current search term value [Optional, default: '']
 * @param {string} placeholder - placeholder text [Optional, default: 'Search...']
 * @param {function} onChange - input change handler (value) => void [Optional]
 * @param {function} onSearch - search execution handler (value) => void [Optional]
 * @param {function} onClear - clear button click handler [Optional]
 * @param {boolean} hasFilter - whether to show the filter button [Optional, default: false]
 * @param {boolean} isFilterActive - filter active state [Optional, default: false]
 * @param {function} onFilterToggle - filter toggle handler [Optional]
 * @param {string} variant - style variant ('outlined' | 'filled' | 'minimal') [Optional, default: 'outlined']
 * @param {string} size - size ('sm' | 'md' | 'lg') [Optional, default: 'md']
 * @param {boolean} isFullWidth - whether to use full width [Optional, default: false]
 * @param {object} sx - additional styles [Optional]
 *
 * Example usage:
 * <SearchBar
 *   value={searchTerm}
 *   placeholder="Search references..."
 *   onChange={setSearchTerm}
 *   onSearch={handleSearch}
 *   hasFilter
 * />
 */
export function SearchBar({
  value = '',
  placeholder = 'Search...',
  onChange,
  onSearch,
  onClear,
  hasFilter = false,
  isFilterActive = false,
  onFilterToggle,
  variant = 'outlined',
  size = 'md',
  isFullWidth = false,
  sx,
}) {
  const [isFocused, setIsFocused] = useState(false);

  /**
   * Style mapping per size
   */
  const sizeStyles = {
    sm: { height: 36, fontSize: 13, px: 1.5, iconSize: 'small' },
    md: { height: 44, fontSize: 14, px: 2, iconSize: 'medium' },
    lg: { height: 52, fontSize: 15, px: 2.5, iconSize: 'medium' },
  };

  const currentSize = sizeStyles[size] || sizeStyles.md;

  /**
   * Container style per variant
   */
  const getVariantStyles = () => {
    const base = {
      display: 'flex',
      alignItems: 'center',
      height: currentSize.height,
      borderRadius: 2,
      transition: 'all 0.2s ease',
    };

    switch (variant) {
      case 'filled':
        return {
          ...base,
          backgroundColor: isFocused ? 'action.selected' : 'action.hover',
          border: '2px solid transparent',
          '&:hover': {
            backgroundColor: 'action.selected',
          },
        };

      case 'minimal':
        return {
          ...base,
          backgroundColor: 'transparent',
          borderBottom: '2px solid',
          borderColor: isFocused ? 'primary.main' : 'divider',
          borderRadius: 0,
          '&:hover': {
            borderColor: 'text.secondary',
          },
        };

      case 'outlined':
      default:
        return {
          ...base,
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: isFocused ? 'primary.main' : 'divider',
          boxShadow: 'none',
          '&:hover': {
            borderColor: isFocused ? 'primary.main' : 'text.secondary',
          },
        };
    }
  };

  /**
   * Keyboard event handler
   */
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && onSearch) {
        onSearch(value);
      }
      if (e.key === 'Escape') {
        e.target.blur();
      }
    },
    [onSearch, value]
  );

  /**
   * Clear button handler
   */
  const handleClear = useCallback(() => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange('');
    }
  }, [onClear, onChange]);

  /**
   * Search button handler
   */
  const handleSearchClick = useCallback(() => {
    if (onSearch) {
      onSearch(value);
    }
  }, [onSearch, value]);

  return (
    <Box
      sx={{
        width: isFullWidth ? '100%' : 'auto',
        minWidth: isFullWidth ? 'auto' : 280,
        ...getVariantStyles(),
        ...sx,
      }}
    >
      {/* Search icon */}
      <IconButton
        size={currentSize.iconSize}
        onClick={handleSearchClick}
        sx={{
          ml: 0.5,
          color: isFocused ? 'primary.main' : 'text.secondary',
        }}
        aria-label="search"
      >
        <SearchIcon fontSize={currentSize.iconSize} />
      </IconButton>

      {/* Search input field */}
      <InputBase
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        sx={{
          flex: 1,
          fontSize: currentSize.fontSize,
          '& .MuiInputBase-input': {
            py: 1,
            '&::placeholder': {
              color: 'text.disabled',
              opacity: 1,
            },
          },
        }}
        inputProps={{
          'aria-label': placeholder,
        }}
      />

      {/* Clear button (shown only when there is a value) */}
      {value && (
        <IconButton
          size={currentSize.iconSize}
          onClick={handleClear}
          sx={{
            color: 'text.secondary',
            '&:hover': {
              color: 'text.primary',
            },
          }}
          aria-label="clear search"
        >
          <ClearIcon fontSize={currentSize.iconSize} />
        </IconButton>
      )}

      {/* Filter button (shown only when hasFilter is true) */}
      {hasFilter && (
        <IconButton
          size={currentSize.iconSize}
          onClick={onFilterToggle}
          sx={{
            mr: 0.5,
            color: isFilterActive ? 'primary.main' : 'text.secondary',
            backgroundColor: isFilterActive ? 'primary.lighter' : 'transparent',
            '&:hover': {
              backgroundColor: isFilterActive ? 'primary.light' : 'action.hover',
            },
          }}
          aria-label="toggle filter"
          aria-pressed={isFilterActive}
        >
          <TuneIcon fontSize={currentSize.iconSize} />
        </IconButton>
      )}
    </Box>
  );
}
