import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

/**
 * PageContainer component
 *
 * Top-level container for a Storybook document page.
 * Applies maxWidth at xl (1536px) and above, and 100% width below that.
 * Includes top padding to account for the fixed DocumentTitle header.
 *
 * Props:
 * @param {ReactNode} children - Page content [Required]
 * @param {string} maxWidth - Maximum width breakpoint [Optional, default: 'xl']
 *
 * Example usage:
 * <PageContainer>
 *   <Typography variant="h4">Title</Typography>
 *   <Table>...</Table>
 * </PageContainer>
 */
export function PageContainer({ children, maxWidth = 'xl' }) {
  return (
    <Container
      maxWidth={ maxWidth }
      disableGutters
      sx={ {
        width: '100%',
        pt: { xs: 8, sm: 12, md: 12 },
        px: { xs: 2, sm: 3, md: 4 },
        pb: { xs: 4, sm: 5, md: 6 },
      } }
    >
      { children }
    </Container>
  );
}
