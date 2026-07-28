import { NavLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const NAV_ITEMS = [
  { to: '/archive', label: 'Archive' },
  { to: '/projects', label: 'Projects' },
  { to: '/settings', label: 'Settings' },
];

/**
 * MuseNav: left side of the GNB (logo + navigation)
 */
export function MuseNav() {
  return (
    <Box sx={ { display: 'flex', alignItems: 'center', gap: 4 } }>
      <NavLink to="/archive" style={ { textDecoration: 'none' } }>
        <Typography variant="h6" sx={ { fontWeight: 700, color: 'text.primary', letterSpacing: '-0.02em' } }>
          MUSE
        </Typography>
      </NavLink>
      <Box sx={ { display: 'flex', gap: 3 } }>
        { NAV_ITEMS.map((item) => (
          <NavLink
            key={ item.to }
            to={ item.to }
            style={ { textDecoration: 'none' } }
          >
            { ({ isActive }) => (
              <Typography
                variant="body2"
                sx={ {
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'text.primary' : 'text.secondary',
                  transition: 'color 150ms',
                  '&:hover': { color: 'text.primary' },
                } }
              >
                { item.label }
              </Typography>
            ) }
          </NavLink>
        )) }
      </Box>
    </Box>
  );
}
