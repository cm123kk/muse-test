import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

/**
 * Section component
 *
 * Props:
 * @param {ReactNode} children - Content inside the section [Required]
 * @param {boolean} isEnd - Whether this is the last section (removes right border) [Optional, default: false]
 *
 * Example usage:
 * <Section isEnd={ false }>
 *   <Typography>Label</Typography>
 *   <Typography>Value</Typography>
 * </Section>
 */
function Section({ children, isEnd = false }) {
  const theme = useTheme();

  return (
    <Box
      sx={ {
        px: 1.5,
        py: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        borderRight: isEnd ? 'none' : `1px solid ${ theme.palette.divider }`,
        color: theme.palette.text.primary,
      } }
    >
      { children }
    </Box>
  );
}

/**
 * DocumentTitle component
 *
 * Title bar displayed at the top of a Storybook document.
 * Shows the document title, status, note, brand information, and version.
 *
 * Props:
 * @param {string} title - Document title (e.g. Color System) [Required]
 * @param {string} status - Component status (e.g. Available, Disabled, Pending) [Optional, default: 'Available']
 * @param {string} note - Note related to the document [Optional, default: 'N/A']
 * @param {string} brandName - Brand name label [Optional]
 * @param {string} systemName - Design system name [Optional]
 * @param {string} version - Version information [Optional, default: '1.0']
 *
 * Example usage:
 * <DocumentTitle
 *   title="Color System"
 *   status="Available"
 *   note="Primary colors updated"
 *   brandName="Brand"
 *   systemName="Starter Kit"
 *   version="1.0"
 * />
 */
export function DocumentTitle({
  title,
  status = 'Available',
  note = 'N/A',
  brandName,
  systemName,
  version = '1.0',
}) {
  const theme = useTheme();

  const renderLabel = (label) =>
    label ? (
      <Typography variant="caption" sx={ { color: theme.palette.text.secondary } }>
        { label }
      </Typography>
    ) : null;

  const renderValue = (value) => (
    <Typography variant="body2" sx={ { fontWeight: 700, wordBreak: 'keep-all' } }>
      { value ?? '' }
    </Typography>
  );

  return (
    <>
      <Container
        disableGutters
        maxWidth={ false }
        sx={ {
          borderBottom: `1px solid ${ theme.palette.divider }`,
          pt: { xs: 1, md: 2 },
          pb: { xs: 1, md: 2 },
          px: { xs: 1, md: 4 },
          position: 'fixed',
          width: '100%',
          left: 0,
          top: 0,
          backgroundColor: theme.palette.background.paper,
          zIndex: 999,
        } }
      >
        <Grid container columns={ { xs: 24 } } spacing={ 0 }>
          <Grid size={ { xs: 24, md: 3 } }>
            <Section isEnd={ false }>
              { renderLabel('Title') }
              { renderValue(title) }
            </Section>
          </Grid>
          <Grid size={ { xs: 24, md: 2 } }>
            <Section isEnd={ false }>
              { renderLabel('Status') }
              { renderValue(status) }
            </Section>
          </Grid>
          <Grid size={ { xs: 24, md: 12 } }>
            <Section isEnd={ false }>
              { renderLabel('Note') }
              { renderValue(note) }
            </Section>
          </Grid>
          <Grid size={ { xs: 24, md: 6 } }>
            <Section isEnd={ false }>
              { renderLabel(brandName) }
              { renderValue(systemName) }
            </Section>
          </Grid>
          <Grid size={ { xs: 24, md: 1 } }>
            <Section isEnd>
              { renderLabel('Version') }
              { renderValue(version) }
            </Section>
          </Grid>
        </Grid>
      </Container>
      <Box sx={ { height: '56px' } } />
    </>
  );
}
