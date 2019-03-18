import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import moment from 'moment';

function createData(id, siteName, setName, recordTime, latitude, longitude) {
  return { id: id, siteName, setName, recordTime, latitude, longitude };
}

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
  { id: 'siteName', numeric: false, disablePadding: false, label: 'Site Name' },
  { id: 'setName', numeric: false, disablePadding: false, label: 'Series Name' },
  { id: 'recordTime', numeric: false, disablePadding: false, label: 'Recording Date'},
  { id: 'latitude', numeric: true, disablePadding: false, label: 'Latitude' },
  { id: 'longitude', numeric: true, disablePadding: false, label: 'Longitude' },
];

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              style={{color: '#b6cd26'}}
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {rows.map(row => {
            return (
              <TableCell
                key={row.id}
                align='left'
                padding={row.disablePadding ? 'none' : 'none'}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title={<p style={{fontSize:10+'px'}}>Sort</p>}
                  placement='top'
                  enterDelay={300}
                >
                  <TableSortLabel
                    style={{ fontSize:16+'px' }}
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: '2.5',
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: '#b6cd26',
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: '#FE4A49',
  },
  title: {
    flex: '0 0 auto',
  },
});

let EnhancedTableToolbar = props => {
  const { numSelected, classes } = props;
  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography style={{backgroundColor: '#b6cd26'}} variant="h5">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography variant="h5" id="tableTitle">
            Input Files
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <Tooltip title={<p style={{fontSize:10+'px'}}>Delete</p>} placement='top'>
            <IconButton aria-label="Delete">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title={<p style={{fontSize:10+'px'}}>Filter List</p>} placement='top'>
            <IconButton aria-label="Filter List">
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    width: '100%',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

class EnhancedTable extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'recordTime',
    // send prop form filtering?
    selected: this.props.selected,
    data: [

    ],
    page: 0,
    rowsPerPage: 5,
  };

  componentDidMount = () => {
    var data = this.props.filteredInputs.map(input => {
      return createData(input.inputId, input.site, input.series, moment(input.recordTimeMs).format("MMM Do YY, hh:mm:ss"), input.coords.lat, input.coords.long)
    })
    this.setState({data: data})
  }

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if(prevProps !== this.props) {
      var data = this.props.filteredInputs.map(input => {
        return createData(input.inputId, input.site, input.series, moment(input.recordTimeMs).format("MMM Do YY, hh:mm:ss"), input.coords.lat, input.coords.long)
      })
      if(data !== this.state.data)
        this.setState({data: data})
      if(this.props.selected !== this.state.selected)
        this.setState({selected: this.props.selected})
    }
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      var list = this.state.data.map(n => n.id)
      this.setState({ selected: list });
      this.props.updateSelectedInputs(list)
      return;
    }
    this.setState({ selected: [] });
    this.props.updateSelectedInputs([])
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    this.props.updateSelectedInputs(newSelected)
    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <Paper className={classes.root}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {stableSort(data, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const isSelected = this.isSelected(n.id);
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, n.id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          style={{color: '#b6cd26'}}
                        />
                      </TableCell>
                      <TableCell style={{ fontSize:13+'px' }} component="th" scope="row" padding="none">
                        {n.siteName}
                      </TableCell>
                      <TableCell style={{ fontSize:13+'px' }} component="th" scope="row" padding="none">{n.setName}</TableCell>
                      <TableCell style={{ fontSize:13+'px' }} component="th" scope="row" padding="none">{n.recordTime}</TableCell>
                      <TableCell style={{ fontSize:13+'px' }} component="th" scope="row" padding="none">{n.latitude}</TableCell>
                      <TableCell style={{ fontSize:13+'px' }} component="th" scope="row" padding="none">{n.longitude}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          labelRowsPerPage={<p style={{fontSize:13+'px'}}>Rows per page:</p>}
          labelDisplayedRows={({ from, to , count}) => <p style={{fontSize:10+'px'}}>Displaying items {from}-{to} of total {count} items</p>}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EnhancedTable);
