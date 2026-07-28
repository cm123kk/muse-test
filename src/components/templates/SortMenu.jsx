import { useCallback, useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SortIcon from '@mui/icons-material/Sort';

const DEFAULT_SORT_OPTIONS = [
  { id: 'newest', label: 'Newest First' },
  { id: 'oldest', label: 'Oldest First' },
  { id: 'name-asc', label: 'Name (A-Z)' },
  { id: 'name-desc', label: 'Name (Z-A)' },
];

/**
 * SortMenu component
 *
 * A dropdown button for choosing the sort criteria.
 *
 * Behavior:
 * 1. When the user clicks the button, a menu of available sort options opens.
 * 2. Selecting an option from the menu calls the onChange callback and closes the menu.
 * 3. The button label shows the label of the currently selected option, falling back to 'Sort' when there is none.
 *
 * Props:
 * @param {string} value - currently selected option id [Required]
 * @param {function} onChange - (id) => void, called when an option is selected [Required]
 * @param {Array<{id: string, label: string}>} options - sort options to display [Optional, default: Newest/Oldest/Name A-Z/Name Z-A]
 * @param {string} size - button size (MUI Button size) [Optional, default: 'small']
 * @param {object} sx - additional button styles [Optional]
 *
 * Example usage:
 * <SortMenu value={ sortBy } onChange={ setSortBy } />
 */
export function SortMenu({
  value,
  onChange,
  options = DEFAULT_SORT_OPTIONS,
  size = 'small',
  sx,
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = useCallback((event) => setAnchorEl(event.currentTarget), []);
  const handleClose = useCallback(() => setAnchorEl(null), []);
  const handleSelect = useCallback(
    (id) => {
      onChange?.(id);
      setAnchorEl(null);
    },
    [onChange],
  );

  const current = options.find((opt) => opt.id === value);

  return (
    <>
      <Button
        variant="outlined"
        size={ size }
        startIcon={ <SortIcon /> }
        onClick={ handleOpen }
        sx={ {
          textTransform: 'none',
          borderColor: 'divider',
          color: 'text.secondary',
          ...sx,
        } }
      >
        { current?.label || 'Sort' }
      </Button>
      <Menu anchorEl={ anchorEl } open={ Boolean(anchorEl) } onClose={ handleClose }>
        { options.map((option) => (
          <MenuItem
            key={ option.id }
            selected={ option.id === value }
            onClick={ () => handleSelect(option.id) }
          >
            { option.label }
          </MenuItem>
        )) }
      </Menu>
    </>
  );
}
