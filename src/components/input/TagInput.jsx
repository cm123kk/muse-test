import { useState, useCallback, useRef } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import InputBase from '@mui/material/InputBase';
import Typography from '@mui/material/Typography';

/**
 * TagInput component
 *
 * An input field that takes tag text and converts it into Chips.
 * A core component used for keyword management and filtering.
 *
 * Behavior:
 * 1. After typing text, add a tag with Enter or a comma
 * 2. Added tags are displayed as Chips
 * 3. Delete a tag with the Chip's X button or Backspace
 * 4. Duplicate tags are filtered out automatically
 *
 * Props:
 * @param {string[]} tags - current list of tags [Required]
 * @param {function} onChange - tag change handler (tags[]) => void [Required]
 * @param {string} placeholder - input placeholder [Optional, default: 'Add tags...']
 * @param {number} maxTags - maximum number of tags [Optional, default: 10]
 * @param {string[]} suggestions - list of autocomplete suggestions [Optional]
 * @param {string} variant - style variant ('outlined' | 'filled') [Optional, default: 'outlined']
 * @param {string} size - size ('sm' | 'md') [Optional, default: 'md']
 * @param {string} chipColor - chip color theme [Optional, default: 'default']
 * @param {string} label - field label [Optional]
 * @param {boolean} isDisabled - disabled state [Optional, default: false]
 * @param {object} sx - additional styles [Optional]
 *
 * Example usage:
 * <TagInput
 *   tags={selectedTags}
 *   onChange={setSelectedTags}
 *   placeholder="Add style keywords..."
 *   maxTags={5}
 * />
 */
export function TagInput({
  tags = [],
  onChange,
  placeholder = 'Add tags...',
  maxTags = 10,
  suggestions = [],
  variant = 'outlined',
  size = 'md',
  chipColor = 'default',
  label,
  isDisabled = false,
  sx,
}) {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  /**
   * Style per size
   */
  const sizeStyles = {
    sm: { minHeight: 36, chipSize: 'small', fontSize: 13, gap: 0.5, px: 1 },
    md: { minHeight: 44, chipSize: 'medium', fontSize: 14, gap: 1, px: 1.5 },
  };

  const currentSize = sizeStyles[size] || sizeStyles.md;

  /**
   * Add a tag
   */
  const addTag = useCallback(
    (tagText) => {
      const trimmed = tagText.trim().toLowerCase();
      if (!trimmed) return;
      if (tags.length >= maxTags) return;
      if (tags.includes(trimmed)) return;

      onChange([...tags, trimmed]);
      setInputValue('');
      setShowSuggestions(false);
    },
    [tags, maxTags, onChange]
  );

  /**
   * Remove a tag
   */
  const removeTag = useCallback(
    (tagToRemove) => {
      onChange(tags.filter((tag) => tag !== tagToRemove));
    },
    [tags, onChange]
  );

  /**
   * Keyboard event handler
   */
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        addTag(inputValue);
      } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
        removeTag(tags[tags.length - 1]);
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
        inputRef.current?.blur();
      }
    },
    [inputValue, tags, addTag, removeTag]
  );

  /**
   * Input change handler
   */
  const handleInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      // If it contains a comma, add it as a tag
      if (value.includes(',')) {
        const parts = value.split(',');
        parts.forEach((part) => addTag(part));
      } else {
        setInputValue(value);
        setShowSuggestions(value.length > 0 && suggestions.length > 0);
      }
    },
    [addTag, suggestions]
  );

  /**
   * Focus the input when the container is clicked
   */
  const handleContainerClick = useCallback(() => {
    if (!isDisabled) {
      inputRef.current?.focus();
    }
  }, [isDisabled]);

  /**
   * Filtered suggestion list
   */
  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
      !tags.includes(suggestion.toLowerCase())
  );

  /**
   * Container style
   */
  const getContainerStyles = () => {
    const base = {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: currentSize.gap,
      minHeight: currentSize.minHeight,
      px: currentSize.px,
      py: 1,
      borderRadius: 1,
      cursor: isDisabled ? 'not-allowed' : 'text',
      opacity: isDisabled ? 0.5 : 1,
      transition: 'all 0.2s ease',
    };

    if (variant === 'filled') {
      return {
        ...base,
        backgroundColor: isFocused ? 'action.selected' : 'action.hover',
        border: '2px solid transparent',
      };
    }

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
  };

  return (
    <Box sx={sx}>
      {/* Label */}
      {label && (
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mb: 0.5,
            fontWeight: 600,
            color: 'text.secondary',
          }}
        >
          {label}
        </Typography>
      )}

      {/* Tag input container */}
      <Box
        onClick={handleContainerClick}
        sx={getContainerStyles()}
      >
        {/* Tag Chip list */}
        {tags.map((tag) => (
          <Chip
            key={tag}
            label={`#${tag}`}
            size={currentSize.chipSize}
            color={chipColor}
            onDelete={isDisabled ? undefined : () => removeTag(tag)}
            sx={{
              fontWeight: 500,
              '& .MuiChip-label': {
                px: 1,
              },
            }}
          />
        ))}

        {/* Input field */}
        {tags.length < maxTags && (
          <InputBase
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              setIsFocused(true);
              setShowSuggestions(inputValue.length > 0 && suggestions.length > 0);
            }}
            onBlur={() => {
              setIsFocused(false);
              // Add a delay so suggestion clicks still register
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            placeholder={tags.length === 0 ? placeholder : ''}
            disabled={isDisabled}
            sx={{
              flex: 1,
              minWidth: 80,
              fontSize: currentSize.fontSize,
              '& .MuiInputBase-input': {
                p: 0,
                '&::placeholder': {
                  color: 'text.disabled',
                  opacity: 1,
                },
              },
            }}
          />
        )}
      </Box>

      {/* Autocomplete suggestions */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <Box
          sx={{
            mt: 0.5,
            p: 1,
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
            Suggestions
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {filteredSuggestions.slice(0, 8).map((suggestion) => (
              <Chip
                key={suggestion}
                label={suggestion}
                size="small"
                variant="outlined"
                onClick={() => addTag(suggestion)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Tag count counter */}
      {maxTags && (
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 0.5,
            textAlign: 'right',
            color: tags.length >= maxTags ? 'warning.main' : 'text.disabled',
          }}
        >
          {tags.length} / {maxTags}
        </Typography>
      )}
    </Box>
  );
}
