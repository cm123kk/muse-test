import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { DocumentTitle, PageContainer, SectionTitle } from '../storybookDocumentation';
import Placeholder, { placeholderSvg } from '../../common/ui/Placeholder';
import {
  InlineTypography,
  InlineObject,
  InlineIcon,
  InlineImage,
} from '.';

export default {
  title: 'Component/1. Typography/InlineTypography',
  component: InlineTypography,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## InlineTypography

A component that naturally inserts images, icons, or other components within the text flow.

### Use Cases
- Editorial style text and image combinations
- Inline placement of icons and text
- Inserting brand logos or emoji
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['body1', 'body2', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      description: 'Typography variant',
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right', 'justify'],
      description: 'Text alignment',
    },
  },
};

// Sample image URLs (based on placeholderSvg)
const sampleImages = {
  avatar1: placeholderSvg(100, 100),
  avatar2: placeholderSvg(100, 100),
  icon1: placeholderSvg(100, 100),
  landscape: placeholderSvg(200, 100),
};

/** Basic usage */
export const Default = {
  render: () => (
    <InlineTypography variant="h4">
      We build <InlineIcon icon={ <StarIcon /> } color="primary.main" size={ 1 } /> amazing products.
    </InlineTypography>
  ),
};

/** Documentation and demo */
export const Documentation = {
  render: () => (
    <>
      <DocumentTitle
        title="InlineTypography"
        status="Available"
        note="Insert images/icons inline with text"
        brandName="Typography"
        systemName="Starter Kit"
        version="1.0"
      />
      <PageContainer>
        <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
          InlineTypography
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={ { mb: 4 } }>
          A component that naturally inserts images, icons, or other components within the text flow.
          Used together with InlineObject, InlineIcon, and InlineImage in a compound component pattern.
        </Typography>

        <SectionTitle title="Sub Components" description="Sub components used together with InlineTypography." />
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={ { fontWeight: 600 } }>Component</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>Description</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>Use Case</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>InlineObject</TableCell>
                <TableCell>General purpose inline element wrapper</TableCell>
                <TableCell>Custom components, complex elements</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>InlineIcon</TableCell>
                <TableCell>Wrapper dedicated to MUI icons</TableCell>
                <TableCell>Icon insertion</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>InlineImage</TableCell>
                <TableCell>Wrapper dedicated to images</TableCell>
                <TableCell>Image and avatar insertion</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle title="With Icons" description="Place MUI icons together with text." />
        <Stack spacing={ 3 }>
          <Box sx={ { p: 3, border: '1px solid', borderColor: 'divider' } }>
            <InlineTypography variant="h4">
              We <InlineIcon icon={ <FavoriteIcon /> } color="error.main" /> building
              <InlineIcon icon={ <AutoAwesomeIcon /> } color="warning.main" /> products.
            </InlineTypography>
          </Box>

          <Box sx={ { p: 3, border: '1px solid', borderColor: 'divider' } }>
            <InlineTypography variant="h3">
              Launch your ideas <InlineIcon icon={ <RocketLaunchIcon /> } color="primary.main" size={ 1.2 } /> today.
            </InlineTypography>
          </Box>

          <Box sx={ { p: 3, border: '1px solid', borderColor: 'divider' } }>
            <InlineTypography variant="body1">
              This feature received <InlineIcon icon={ <StarIcon /> } color="warning.main" />
              <InlineIcon icon={ <StarIcon /> } color="warning.main" />
              <InlineIcon icon={ <StarIcon /> } color="warning.main" />
              <InlineIcon icon={ <StarIcon /> } color="warning.main" />
              <InlineIcon icon={ <StarIcon /> } color="warning.main" /> 5-star rating from our users.
            </InlineTypography>
          </Box>
        </Stack>

        <SectionTitle title="With Images" description="Place images together with text." />
        <Stack spacing={ 3 }>
          <Box sx={ { p: 3, border: '1px solid', borderColor: 'divider' } }>
            <InlineTypography variant="h4">
              Meet our team:
              <InlineImage src={ sampleImages.avatar1 } alt="Team member 1" size={ 1.5 } circle hover />
              <InlineImage src={ sampleImages.avatar2 } alt="Team member 2" size={ 1.5 } circle hover />
              and more talented people.
            </InlineTypography>
          </Box>

          <Box sx={ { p: 3, border: '1px solid', borderColor: 'divider' } }>
            <InlineTypography variant="h3">
              Explore the
              <InlineImage src={ sampleImages.landscape } alt="Mountains" size="3em" rounded sx={ { mx: '0.3em' } } />
              world with us.
            </InlineTypography>
          </Box>
        </Stack>

        <SectionTitle title="With Custom Objects" description="Insert custom elements with InlineObject." />
        <Stack spacing={ 3 }>
          <Box sx={ { p: 3, border: '1px solid', borderColor: 'divider' } }>
            <InlineTypography variant="h4">
              Powered by
              <InlineObject size={ 1.5 } spacing={ 0.3 }>
                <Box
                  sx={ {
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.6em',
                  } }
                >
                  AI
                </Box>
              </InlineObject>
              technology.
            </InlineTypography>
          </Box>

          <Box sx={ { p: 3, border: '1px solid', borderColor: 'divider' } }>
            <InlineTypography variant="h4">
              Status:
              <InlineObject size={ 0.8 } rounded spacing={ 0.3 }>
                <Box
                  sx={ {
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'success.main',
                    borderRadius: '50%',
                  } }
                />
              </InlineObject>
              Online
            </InlineTypography>
          </Box>
        </Stack>

        <SectionTitle title="Vertical Alignment" description="Vertical alignment options." />
        <Stack spacing={ 3 }>
          <Box sx={ { p: 3, border: '1px solid', borderColor: 'divider' } }>
            <Typography variant="subtitle2" sx={ { mb: 1, color: 'text.secondary' } }>
              align=&quot;middle&quot; (default)
            </Typography>
            <InlineTypography variant="h4">
              Text with <InlineIcon icon={ <StarIcon /> } color="primary.main" align="middle" /> icon aligned to middle.
            </InlineTypography>
          </Box>

          <Box sx={ { p: 3, border: '1px solid', borderColor: 'divider' } }>
            <Typography variant="subtitle2" sx={ { mb: 1, color: 'text.secondary' } }>
              align=&quot;baseline&quot;
            </Typography>
            <InlineTypography variant="h4">
              Text with <InlineIcon icon={ <StarIcon /> } color="primary.main" align="baseline" /> icon aligned to baseline.
            </InlineTypography>
          </Box>

          <Box sx={ { p: 3, border: '1px solid', borderColor: 'divider' } }>
            <Typography variant="subtitle2" sx={ { mb: 1, color: 'text.secondary' } }>
              align=&quot;top&quot;
            </Typography>
            <InlineTypography variant="h4">
              Text with <InlineIcon icon={ <StarIcon /> } color="primary.main" align="top" /> icon aligned to top.
            </InlineTypography>
          </Box>
        </Stack>

        <SectionTitle title="Hover Effects" description="Inline images with hover effects applied." />
        <Box sx={ { p: 4, border: '1px solid', borderColor: 'divider' } }>
          <InlineTypography variant="h3">
            Connect with
            <InlineImage src={ sampleImages.avatar1 } alt="User 1" size={ 2 } circle hover />
            <InlineImage src={ sampleImages.avatar2 } alt="User 2" size={ 2 } circle hover />
            on our platform.
          </InlineTypography>
          <Typography variant="caption" color="text.secondary" sx={ { mt: 1, display: 'block' } }>
            (Hover over the images)
          </Typography>
        </Box>

        <SectionTitle title="Usage Example" description="Code usage example." />
        <Box
          component="pre"
          sx={ {
            backgroundColor: 'grey.100',
            p: 3,
            fontSize: 13,
            fontFamily: 'monospace',
            overflow: 'auto',
            lineHeight: 1.6,
          } }
        >
          {`// With icons
<InlineTypography variant="h4">
  We <InlineIcon icon={<FavoriteIcon />} color="error.main" /> building products.
</InlineTypography>

// With images
<InlineTypography variant="h3">
  Meet our team:
  <InlineImage src="avatar.jpg" alt="Member" size={1.5} circle hover />
</InlineTypography>

// Custom element
<InlineTypography variant="h4">
  Powered by
  <InlineObject size={1.5}>
    <CustomBadge>AI</CustomBadge>
  </InlineObject>
  technology.
</InlineTypography>`}
        </Box>
      </PageContainer>
    </>
  ),
};
