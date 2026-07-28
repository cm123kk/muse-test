import Typography from '@mui/material/Typography';
import { AppShell } from '../layout/AppShell.jsx';

/**
 * Storybook decorator: a shell that wraps template stories in AppShell.
 *
 * In the real app, <AppShellLayout /> wraps AppShell at the route level and injects
 * MuseNav, but stories render standalone without a Router context, so we only add a
 * simple logo text.
 */
export const withAppShell = (Story) => (
  <AppShell
    logo={ <Typography variant="h6" sx={ { fontWeight: 700 } }>MUSE</Typography> }
  >
    <Story />
  </AppShell>
);
