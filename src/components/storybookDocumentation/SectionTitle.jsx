import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/**
 * SectionTitle component
 *
 * Displays a section title and description within a Storybook document.
 * Includes a divider below the title.
 *
 * Props:
 * @param {string} title - Section title [Required]
 * @param {string} description - Section description (supports line breaks) [Optional]
 * @param {ReactNode} children - Section content [Optional]
 *
 * Example usage:
 * <SectionTitle
 *   title="Color Palette"
 *   description="Primary and secondary colors used in the design system."
 * />
 *
 * <SectionTitle title="Color Palette">
 *   <Table>...</Table>
 * </SectionTitle>
 */
export function SectionTitle({ title, description, children }) {
  return (
    <Box sx={ { mt: 4, mb: 3 } }>
      <Typography
        variant="h5"
        sx={ {
          fontWeight: 600,
          pb: 1,
          mb: 1.5,
          borderBottom: '2px solid',
          borderColor: 'text.primary',
        } }
      >
        { title }
      </Typography>
      { description && (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={ { whiteSpace: 'pre-line', mb: children ? 3 : 0 } }
        >
          { description }
        </Typography>
      ) }
      { children }
    </Box>
  );
}
