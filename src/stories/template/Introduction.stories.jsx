import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { PageContainer } from '../../components/storybookDocumentation';

export default {
  title: 'Template/Introduction',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## Template

Reusable templates composed of multiple components.

### Planned Templates
- Card Grid Template
- Form Template
- Dashboard Template
        `,
      },
    },
  },
};

export const Default = {
  render: () => (
    <PageContainer>
      <Paper sx={ { p: 3 } }>
        <Typography variant="h6" gutterBottom>
          Template Section
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Templates composed of multiple components will be added to this section.
        </Typography>
      </Paper>
    </PageContainer>
  ),
};
