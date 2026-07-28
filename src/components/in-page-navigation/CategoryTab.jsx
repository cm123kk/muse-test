import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

/**
 * CategoryTab component
 *
 * A tab menu for category filtering.
 *
 * Props:
 * @param {Array} categories - list of categories [{ id, label }] [Required]
 * @param {string} selected - currently selected category ID [Required]
 * @param {function} onChange - change handler (id) => void [Required]
 * @param {object} sx - additional styles [Optional]
 */
export function CategoryTab({ categories = [], selected, onChange, sx }) {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, ...sx }}>
      <Tabs
        value={selected}
        onChange={(e, newValue) => onChange(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="category tabs"
        sx={{
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 600,
            minWidth: 'auto',
            mr: 2,
          },
        }}
      >
        {categories.map((cat) => (
          <Tab key={cat.id} label={cat.label} value={cat.id} />
        ))}
      </Tabs>
    </Box>
  );
}

