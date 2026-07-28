import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { PageContainer } from '../../components/storybookDocumentation';

export default {
  title: 'Page/Introduction',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## Page

Shows the full page layout and flow.

### Purpose
- Review page-level layouts
- Inspect component composition patterns
- Simulate the complete user flow
        `,
      },
    },
  },
};

export const Default = {
  render: () => (
    <PageContainer>
      <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
        Page Section
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={ { mb: 4 } }>
        Full page layouts will be added here.
      </Typography>

      <Divider sx={ { mb: 4 } } />

      <Typography variant="h5" sx={ { fontWeight: 600, mb: 3 } }>
        Planned Pages
      </Typography>

      <TableContainer sx={ { mb: 4 } }>
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell sx={ { fontWeight: 600, width: '30%' } }>Main Page</TableCell>
              <TableCell>Main landing page</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={ { fontWeight: 600 } }>Detail Page</TableCell>
              <TableCell>Detail information page</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={ { fontWeight: 600 } }>Settings Page</TableCell>
              <TableCell>Settings page</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="body2" color="text.secondary">
        Each page is built from the component compositions in the Template section.
      </Typography>
    </PageContainer>
  ),
};
