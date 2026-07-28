import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import { projects, projectsWithThumbnails } from '../../data/muse';
import {
  DocumentTitle,
  PageContainer,
  SectionTitle,
} from '../../components/storybookDocumentation';

export default {
  title: 'MUSE/Data/Projects',
  parameters: { layout: 'padded' },
};

const TYPE_LABEL = {
  landing: 'Landing',
  dashboard: 'Dashboard',
  mobile: 'Mobile',
  brand: 'Brand',
};

export const Docs = {
  render: () => (
    <>
      <DocumentTitle
        title="Projects Dataset"
        status="Available"
        note="Dummy projects used by MUSE page templates"
        brandName="MUSE"
        systemName="Data"
        version="1.0"
      />
      <PageContainer>
        <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
          Projects Dataset
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={ { mb: 4 } }>
          { projects.length } dummy MUSE projects. Each project holds referenceIds selected from the References pool.
        </Typography>

        <SectionTitle title="Schema" description="Project model from docs/muse/02-ux-flow.md" />
        <TableContainer sx={ { mb: 4 } }>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={ { fontWeight: 600 } }>Field</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>Type</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow><TableCell sx={ { fontFamily: 'monospace' } }>id</TableCell><TableCell>string</TableCell><TableCell>Unique identifier (proj-XXX)</TableCell></TableRow>
              <TableRow><TableCell sx={ { fontFamily: 'monospace' } }>name</TableCell><TableCell>string</TableCell><TableCell>Project name</TableCell></TableRow>
              <TableRow><TableCell sx={ { fontFamily: 'monospace' } }>intent</TableCell><TableCell>string</TableCell><TableCell>One-sentence intent</TableCell></TableRow>
              <TableRow><TableCell sx={ { fontFamily: 'monospace' } }>type</TableCell><TableCell>landing | dashboard | mobile | brand</TableCell><TableCell>Project type</TableCell></TableRow>
              <TableRow><TableCell sx={ { fontFamily: 'monospace' } }>referenceIds</TableCell><TableCell>string[]</TableCell><TableCell>Array of linked Reference ids</TableCell></TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace', fontWeight: 600, color: 'primary.main' } }>mode?</TableCell>
                <TableCell><code>'concept'|'system'</code></TableCell>
                <TableCell>★ <strong>TP2</strong>: Mode selection. Branches the T2 sorting algorithm, T3 synthesis tone, and Export default. default: 'system'</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace', fontWeight: 600, color: 'primary.main' } }>selectedRefs?</TableCell>
                <TableCell><code>{ '[{id, useLayers}]' }</code></TableCell>
                <TableCell>★ <strong>TP4</strong>: User layer curation. If empty, automatic (T2 referenceLayer). If specified, other layers are ignored in T3</TableCell>
              </TableRow>
              <TableRow><TableCell sx={ { fontFamily: 'monospace' } }>createdAt</TableCell><TableCell>string</TableCell><TableCell>Creation date</TableCell></TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle title="List" description="All projects and their linked References" />
        <TableContainer sx={ { mb: 4 } }>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={ { fontWeight: 600 } }>ID</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>Name</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>Type</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>References</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>Intent</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { projects.map((p) => (
                <TableRow key={ p.id } hover>
                  <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>{ p.id }</TableCell>
                  <TableCell sx={ { fontWeight: 500 } }>{ p.name }</TableCell>
                  <TableCell>
                    <Chip size="small" label={ TYPE_LABEL[p.type] || p.type } color="primary" variant="outlined" />
                  </TableCell>
                  <TableCell sx={ { fontFamily: 'monospace', fontSize: 11, color: 'text.secondary' } }>
                    { p.referenceIds.join(', ') }
                  </TableCell>
                  <TableCell sx={ { fontSize: 13, color: 'text.secondary' } }>{ p.intent }</TableCell>
                </TableRow>
              )) }
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle title="Thumbnail preview" description="projectsWithThumbnails: 2x2 thumbnails for project cards" />
        <Grid container spacing={ 3 }>
          { projectsWithThumbnails.map((p) => (
            <Grid key={ p.id } size={ { xs: 12, sm: 6, md: 3 } }>
              <Box
                sx={ {
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gridTemplateRows: '1fr 1fr',
                  gap: 0.5,
                  aspectRatio: '1 / 1',
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'divider',
                } }
              >
                { p.thumbnails.map((url, i) => (
                  <Box
                    key={ i }
                    component="img"
                    src={ url }
                    alt=""
                    sx={ { width: '100%', height: '100%', objectFit: 'cover' } }
                  />
                )) }
              </Box>
              <Box sx={ { mt: 1.5 } }>
                <Typography variant="caption" sx={ { fontFamily: 'monospace', color: 'text.secondary', display: 'block' } }>
                  { p.id }
                </Typography>
                <Typography variant="body2" sx={ { fontWeight: 600 } }>{ p.name }</Typography>
                <Chip size="small" label={ TYPE_LABEL[p.type] } sx={ { mt: 0.5, height: 18, fontSize: 10 } } />
              </Box>
            </Grid>
          )) }
        </Grid>
      </PageContainer>
    </>
  ),
};
