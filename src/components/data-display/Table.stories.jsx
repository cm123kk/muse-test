import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { useState } from 'react';

export default {
  title: 'Component/5. Data Display/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## Table [MUI]

A table Component that displays data organized into rows and columns.

### Usage Patterns

| Pattern | Description | Example |
|------|------|------|
| Basic | Basic table | \`<Table><TableBody>...</TableBody></Table>\` |
| Dense | Dense table | \`size="small"\` |
| Striped | Striped background | Odd/even row background color |
| Sortable | Sortable | Uses \`TableSortLabel\` |
| Selectable | Selectable | Includes \`Checkbox\` |
        `,
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium'],
      description: 'Sets the size of table cells.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'medium' },
      },
    },
    stickyHeader: {
      control: 'boolean',
      description: 'Fixes the table header in place.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    padding: {
      control: 'select',
      options: ['normal', 'checkbox', 'none'],
      description: 'Sets the cell padding.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'normal' },
      },
    },
  },
};

/** Create sample data */
const createData = (id, name, calories, fat, carbs, protein) => ({
  id,
  name,
  calories,
  fat,
  carbs,
  protein,
});

const rows = [
  createData(1, 'Frozen Yogurt', 159, 6.0, 24, 4.0),
  createData(2, 'Ice Cream Sandwich', 237, 9.0, 37, 4.3),
  createData(3, 'Eclair', 262, 16.0, 24, 6.0),
  createData(4, 'Cupcake', 305, 3.7, 67, 4.3),
  createData(5, 'Gingerbread', 356, 16.0, 49, 3.9),
];

/** User data */
const userRows = [
  { id: 1, name: 'James Kim', email: 'kim@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Emily Lee', email: 'lee@example.com', role: 'Editor', status: 'Active' },
  { id: 3, name: 'Michael Park', email: 'park@example.com', role: 'Viewer', status: 'Inactive' },
  { id: 4, name: 'Sujin Choi', email: 'choi@example.com', role: 'Editor', status: 'Active' },
  { id: 5, name: 'Daniel Jung', email: 'jung@example.com', role: 'Viewer', status: 'Pending' },
];

/** Basic table */
export const Default = {
  args: {
    size: 'medium',
    stickyHeader: false,
    padding: 'normal',
  },
  render: (args) => (
    <TableContainer component={ Paper } sx={ { maxHeight: args.stickyHeader ? 300 : 'none' } }>
      <Table size={ args.size } stickyHeader={ args.stickyHeader } padding={ args.padding }>
        <TableHead>
          <TableRow>
            <TableCell>Dessert (100g)</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Fat (g)</TableCell>
            <TableCell align="right">Carbs (g)</TableCell>
            <TableCell align="right">Protein (g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { rows.map((row) => (
            <TableRow key={ row.id }>
              <TableCell component="th" scope="row">
                { row.name }
              </TableCell>
              <TableCell align="right">{ row.calories }</TableCell>
              <TableCell align="right">{ row.fat }</TableCell>
              <TableCell align="right">{ row.carbs }</TableCell>
              <TableCell align="right">{ row.protein }</TableCell>
            </TableRow>
          )) }
        </TableBody>
      </Table>
    </TableContainer>
  ),
};

/** Dense table */
export const Dense = {
  render: () => (
    <TableContainer component={ Paper }>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Dessert (100g)</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Fat (g)</TableCell>
            <TableCell align="right">Carbs (g)</TableCell>
            <TableCell align="right">Protein (g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { rows.map((row) => (
            <TableRow key={ row.id }>
              <TableCell component="th" scope="row">
                { row.name }
              </TableCell>
              <TableCell align="right">{ row.calories }</TableCell>
              <TableCell align="right">{ row.fat }</TableCell>
              <TableCell align="right">{ row.carbs }</TableCell>
              <TableCell align="right">{ row.protein }</TableCell>
            </TableRow>
          )) }
        </TableBody>
      </Table>
    </TableContainer>
  ),
};

/** Striped table */
export const Striped = {
  render: () => (
    <TableContainer component={ Paper }>
      <Table>
        <TableHead>
          <TableRow sx={ { backgroundColor: 'primary.main' } }>
            <TableCell sx={ { color: 'white', fontWeight: 700 } }>Dessert (100g)</TableCell>
            <TableCell sx={ { color: 'white', fontWeight: 700 } } align="right">Calories</TableCell>
            <TableCell sx={ { color: 'white', fontWeight: 700 } } align="right">Fat (g)</TableCell>
            <TableCell sx={ { color: 'white', fontWeight: 700 } } align="right">Carbs (g)</TableCell>
            <TableCell sx={ { color: 'white', fontWeight: 700 } } align="right">Protein (g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { rows.map((row, index) => (
            <TableRow
              key={ row.id }
              sx={ { backgroundColor: index % 2 === 0 ? 'grey.50' : 'white' } }
            >
              <TableCell component="th" scope="row">
                { row.name }
              </TableCell>
              <TableCell align="right">{ row.calories }</TableCell>
              <TableCell align="right">{ row.fat }</TableCell>
              <TableCell align="right">{ row.carbs }</TableCell>
              <TableCell align="right">{ row.protein }</TableCell>
            </TableRow>
          )) }
        </TableBody>
      </Table>
    </TableContainer>
  ),
};

/** Selectable table */
export const Selectable = {
  render: () => {
    const [selected, setSelected] = useState([]);

    const handleSelectAll = (event) => {
      if (event.target.checked) {
        setSelected(rows.map((row) => row.id));
      } else {
        setSelected([]);
      }
    };

    const handleSelect = (id) => {
      const selectedIndex = selected.indexOf(id);
      let newSelected = [];

      if (selectedIndex === -1) {
        newSelected = [...selected, id];
      } else {
        newSelected = selected.filter((item) => item !== id);
      }

      setSelected(newSelected);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    return (
      <TableContainer component={ Paper }>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={ selected.length > 0 && selected.length < rows.length }
                  checked={ rows.length > 0 && selected.length === rows.length }
                  onChange={ handleSelectAll }
                />
              </TableCell>
              <TableCell>Dessert (100g)</TableCell>
              <TableCell align="right">Calories</TableCell>
              <TableCell align="right">Fat (g)</TableCell>
              <TableCell align="right">Carbs (g)</TableCell>
              <TableCell align="right">Protein (g)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { rows.map((row) => {
              const isItemSelected = isSelected(row.id);
              return (
                <TableRow
                  key={ row.id }
                  hover
                  onClick={ () => handleSelect(row.id) }
                  selected={ isItemSelected }
                  sx={ { cursor: 'pointer' } }
                >
                  <TableCell padding="checkbox">
                    <Checkbox checked={ isItemSelected } />
                  </TableCell>
                  <TableCell component="th" scope="row">
                    { row.name }
                  </TableCell>
                  <TableCell align="right">{ row.calories }</TableCell>
                  <TableCell align="right">{ row.fat }</TableCell>
                  <TableCell align="right">{ row.carbs }</TableCell>
                  <TableCell align="right">{ row.protein }</TableCell>
                </TableRow>
              );
            }) }
          </TableBody>
        </Table>
        <Box sx={ { p: 2, borderTop: 1, borderColor: 'divider' } }>
          <Typography variant="body2" color="text.secondary">
            { selected.length } selected
          </Typography>
        </Box>
      </TableContainer>
    );
  },
};

/** Sortable table */
export const Sortable = {
  render: () => {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('calories');

    const handleSort = (property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };

    const sortedRows = [...rows].sort((a, b) => {
      if (order === 'asc') {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      }
      return a[orderBy] > b[orderBy] ? -1 : 1;
    });

    const headCells = [
      { id: 'name', label: 'Dessert (100g)', align: 'left' },
      { id: 'calories', label: 'Calories', align: 'right' },
      { id: 'fat', label: 'Fat (g)', align: 'right' },
      { id: 'carbs', label: 'Carbs (g)', align: 'right' },
      { id: 'protein', label: 'Protein (g)', align: 'right' },
    ];

    return (
      <TableContainer component={ Paper }>
        <Table>
          <TableHead>
            <TableRow>
              { headCells.map((headCell) => (
                <TableCell
                  key={ headCell.id }
                  align={ headCell.align }
                  sortDirection={ orderBy === headCell.id ? order : false }
                >
                  <TableSortLabel
                    active={ orderBy === headCell.id }
                    direction={ orderBy === headCell.id ? order : 'asc' }
                    onClick={ () => handleSort(headCell.id) }
                  >
                    { headCell.label }
                  </TableSortLabel>
                </TableCell>
              )) }
            </TableRow>
          </TableHead>
          <TableBody>
            { sortedRows.map((row) => (
              <TableRow key={ row.id } hover>
                <TableCell component="th" scope="row">
                  { row.name }
                </TableCell>
                <TableCell align="right">{ row.calories }</TableCell>
                <TableCell align="right">{ row.fat }</TableCell>
                <TableCell align="right">{ row.carbs }</TableCell>
                <TableCell align="right">{ row.protein }</TableCell>
              </TableRow>
            )) }
          </TableBody>
        </Table>
      </TableContainer>
    );
  },
};

/** Paginated table */
export const WithPagination = {
  render: () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(2);

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    return (
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Dessert (100g)</TableCell>
                <TableCell align="right">Calories</TableCell>
                <TableCell align="right">Fat (g)</TableCell>
                <TableCell align="right">Carbs (g)</TableCell>
                <TableCell align="right">Protein (g)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={ row.id }>
                    <TableCell component="th" scope="row">
                      { row.name }
                    </TableCell>
                    <TableCell align="right">{ row.calories }</TableCell>
                    <TableCell align="right">{ row.fat }</TableCell>
                    <TableCell align="right">{ row.carbs }</TableCell>
                    <TableCell align="right">{ row.protein }</TableCell>
                  </TableRow>
                )) }
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={ [2, 3, 5] }
          component="div"
          count={ rows.length }
          rowsPerPage={ rowsPerPage }
          page={ page }
          onPageChange={ handleChangePage }
          onRowsPerPageChange={ handleChangeRowsPerPage }
          labelRowsPerPage="Rows per page:"
        />
      </Paper>
    );
  },
};

/** Real world example: user list */
export const UserList = {
  render: () => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'Active': return 'success';
        case 'Inactive': return 'error';
        case 'Pending': return 'warning';
        default: return 'default';
      }
    };

    const getRoleVariant = (role) => {
      switch (role) {
        case 'Admin': return 'filled';
        default: return 'outlined';
      }
    };

    return (
      <TableContainer component={ Paper }>
        <Table>
          <TableHead>
            <TableRow sx={ { backgroundColor: 'grey.100' } }>
              <TableCell sx={ { fontWeight: 700 } }>Name</TableCell>
              <TableCell sx={ { fontWeight: 700 } }>Email</TableCell>
              <TableCell sx={ { fontWeight: 700 } }>Role</TableCell>
              <TableCell sx={ { fontWeight: 700 } }>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { userRows.map((row) => (
              <TableRow key={ row.id } hover>
                <TableCell>
                  <Typography variant="body2" sx={ { fontWeight: 500 } }>
                    { row.name }
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    { row.email }
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={ row.role }
                    size="small"
                    variant={ getRoleVariant(row.role) }
                    color={ row.role === 'Admin' ? 'primary' : 'default' }
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={ row.status }
                    size="small"
                    color={ getStatusColor(row.status) }
                  />
                </TableCell>
              </TableRow>
            )) }
          </TableBody>
        </Table>
      </TableContainer>
    );
  },
};

/** Sticky header table */
export const StickyHeader = {
  render: () => (
    <Paper sx={ { width: '100%', overflow: 'hidden' } }>
      <TableContainer sx={ { maxHeight: 200 } }>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={ { fontWeight: 700 } }>Dessert (100g)</TableCell>
              <TableCell sx={ { fontWeight: 700 } } align="right">Calories</TableCell>
              <TableCell sx={ { fontWeight: 700 } } align="right">Fat (g)</TableCell>
              <TableCell sx={ { fontWeight: 700 } } align="right">Carbs (g)</TableCell>
              <TableCell sx={ { fontWeight: 700 } } align="right">Protein (g)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { rows.map((row) => (
              <TableRow key={ row.id } hover>
                <TableCell component="th" scope="row">
                  { row.name }
                </TableCell>
                <TableCell align="right">{ row.calories }</TableCell>
                <TableCell align="right">{ row.fat }</TableCell>
                <TableCell align="right">{ row.carbs }</TableCell>
                <TableCell align="right">{ row.protein }</TableCell>
              </TableRow>
            )) }
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  ),
};
