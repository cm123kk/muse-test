import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { DocumentTitle, PageContainer, SectionTitle } from '../storybookDocumentation';
import { BentoGrid, BentoItem } from './BentoGrid';
import { BENTO_PRESETS } from './bentoPresets';
import Placeholder from '../../common/ui/Placeholder';

export default {
  title: 'Component/8. Layout/BentoGrid',
  component: BentoGrid,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## BentoGrid

Apple-style bento box grid layout.

### Use Cases
- Dashboard widget layouts
- Portfolio and gallery
- Feature introduction sections
        `,
      },
    },
  },
  argTypes: {
    columns: {
      control: { type: 'range', min: 2, max: 6 },
      description: 'Number of columns',
    },
    gap: {
      control: { type: 'range', min: 0, max: 6 },
      description: 'Spacing between cells',
    },
    rowHeight: {
      control: 'text',
      description: 'Default row height',
    },
  },
};

/** Basic usage */
export const Default = {
  args: {
    columns: 4,
    gap: 2,
    rowHeight: '150px',
  },
  render: (args) => (
    <BentoGrid { ...args }>
      <BentoItem colSpan={ 2 } rowSpan={ 2 }>
        <Placeholder.Box label="Featured" height="100%" />
      </BentoItem>
      <BentoItem>
        <Placeholder.Box label="Item 2" height="100%" />
      </BentoItem>
      <BentoItem>
        <Placeholder.Box label="Item 3" height="100%" />
      </BentoItem>
      <BentoItem colSpan={ 2 }>
        <Placeholder.Box label="Wide" height="100%" />
      </BentoItem>
    </BentoGrid>
  ),
};

/** Documentation and demo */
export const Documentation = {
  render: () => (
    <>
      <DocumentTitle
        title="BentoGrid"
        status="Available"
        note="Apple-style bento box layout"
        brandName="Layout"
        systemName="Starter Kit"
        version="1.0"
      />
      <PageContainer>
        <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
          BentoGrid
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={ { mb: 4 } }>
          An Apple-style bento box layout built with CSS Grid.
          Cells of various sizes can be flexibly arranged.
        </Typography>

        <SectionTitle title="Props - BentoGrid" description="Props of the BentoGrid component." />
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={ { fontWeight: 600 } }>Prop</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>Type</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>Default</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>columns</TableCell>
                <TableCell>number</TableCell>
                <TableCell>4</TableCell>
                <TableCell>Default number of columns</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>gap</TableCell>
                <TableCell>number | string</TableCell>
                <TableCell>2</TableCell>
                <TableCell>Spacing between cells</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>rowHeight</TableCell>
                <TableCell>number | string</TableCell>
                <TableCell>&apos;200px&apos;</TableCell>
                <TableCell>Default row height</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>isAutoRows</TableCell>
                <TableCell>boolean</TableCell>
                <TableCell>false</TableCell>
                <TableCell>Whether to auto-size row heights</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle title="Props - BentoItem" description="Props of the BentoItem component." />
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={ { fontWeight: 600 } }>Prop</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>Type</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>Default</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>colSpan</TableCell>
                <TableCell>number | object</TableCell>
                <TableCell>1</TableCell>
                <TableCell>Column span (1-4)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>rowSpan</TableCell>
                <TableCell>number | object</TableCell>
                <TableCell>1</TableCell>
                <TableCell>Row span (1-3)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>background</TableCell>
                <TableCell>string</TableCell>
                <TableCell>-</TableCell>
                <TableCell>Background color</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace' } }>isContained</TableCell>
                <TableCell>boolean</TableCell>
                <TableCell>true</TableCell>
                <TableCell>Apply overflow hidden</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle title="Featured Layout" description="A layout that emphasizes featured content." />
        <BentoGrid columns={ 4 } gap={ 2 } rowHeight="150px">
          <BentoItem colSpan={ 2 } rowSpan={ 2 }>
            <Placeholder.Media index={ 0 } sx={ { height: '100%', width: '100%' } } />
          </BentoItem>
          <BentoItem>
            <Placeholder.Box label="Quick Stats" height="100%" />
          </BentoItem>
          <BentoItem>
            <Placeholder.Box label="Updates" height="100%" />
          </BentoItem>
          <BentoItem>
            <Placeholder.Box label="Settings" height="100%" />
          </BentoItem>
          <BentoItem>
            <Placeholder.Box label="Profile" height="100%" />
          </BentoItem>
        </BentoGrid>

        <SectionTitle title="Dashboard Layout" description="A dashboard-style layout." />
        <BentoGrid columns={ 4 } gap={ 2 } rowHeight="120px">
          <BentoItem colSpan={ 3 }>
            <Placeholder.Box label="Header Banner" height="100%" />
          </BentoItem>
          <BentoItem rowSpan={ 2 }>
            <Placeholder.Box label="Activity" height="100%" />
          </BentoItem>
          <BentoItem>
            <Placeholder.Box label="Growth" height="100%" />
          </BentoItem>
          <BentoItem>
            <Placeholder.Box label="Users" height="100%" />
          </BentoItem>
          <BentoItem>
            <Placeholder.Box label="Tasks" height="100%" />
          </BentoItem>
        </BentoGrid>

        <SectionTitle title="Gallery Layout" description="A portfolio and gallery style layout." />
        <BentoGrid columns={ 3 } gap={ 1 } rowHeight="180px">
          <BentoItem colSpan={ 2 } rowSpan={ 2 }>
            <Placeholder.Media index={ 0 } sx={ { height: '100%', width: '100%' } } />
          </BentoItem>
          <BentoItem>
            <Placeholder.Media index={ 1 } sx={ { height: '100%', width: '100%' } } />
          </BentoItem>
          <BentoItem>
            <Placeholder.Media index={ 2 } sx={ { height: '100%', width: '100%' } } />
          </BentoItem>
          <BentoItem>
            <Placeholder.Media index={ 3 } sx={ { height: '100%', width: '100%' } } />
          </BentoItem>
          <BentoItem colSpan={ 2 }>
            <Placeholder.Media index={ 4 } sx={ { height: '100%', width: '100%' } } />
          </BentoItem>
        </BentoGrid>

        <SectionTitle title="Preset Layouts" description="Commonly used preset layouts." />
        <Stack spacing={ 4 }>
          <Box>
            <Typography variant="subtitle2" sx={ { mb: 1, color: 'text.secondary' } }>
              BENTO_PRESETS.featured
            </Typography>
            <BentoGrid columns={ 3 } gap={ 2 } rowHeight="100px">
              { BENTO_PRESETS.featured.map((preset, i) => (
                <BentoItem key={ i } colSpan={ preset.colSpan } rowSpan={ preset.rowSpan }>
                  <Placeholder.Box label={ `${preset.colSpan}×${preset.rowSpan}` } height="100%" />
                </BentoItem>
              )) }
            </BentoGrid>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={ { mb: 1, color: 'text.secondary' } }>
              BENTO_PRESETS.hero
            </Typography>
            <BentoGrid columns={ 4 } gap={ 2 } rowHeight="100px">
              { BENTO_PRESETS.hero.map((preset, i) => (
                <BentoItem key={ i } colSpan={ preset.colSpan } rowSpan={ preset.rowSpan }>
                  <Placeholder.Box label={ `${preset.colSpan}×${preset.rowSpan}` } height="100%" />
                </BentoItem>
              )) }
            </BentoGrid>
          </Box>
        </Stack>

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
          { `// Basic bento grid
<BentoGrid columns={4} gap={2}>
  <BentoItem colSpan={2} rowSpan={2}>
    <FeaturedCard />
  </BentoItem>
  <BentoItem>
    <SmallCard />
  </BentoItem>
  <BentoItem>
    <SmallCard />
  </BentoItem>
  <BentoItem colSpan={2}>
    <WideCard />
  </BentoItem>
</BentoGrid>

// Using presets
import { BENTO_PRESETS } from './BentoGrid';

<BentoGrid columns={3}>
  {items.map((item, i) => (
    <BentoItem
      key={i}
      colSpan={BENTO_PRESETS.featured[i]?.colSpan || 1}
      rowSpan={BENTO_PRESETS.featured[i]?.rowSpan || 1}
    >
      <Card {...item} />
    </BentoItem>
  ))}
</BentoGrid>` }
        </Box>
      </PageContainer>
    </>
  ),
};
