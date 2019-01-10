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
import { lighten } from '@material-ui/core/styles/colorManipulator';
import moment from 'moment';

function createAciData(id, author, date, minFreq, maxFreq, j, fftW) {
  return { id: id, author, date, minFreq, maxFreq, j, fftW};
}

function createNdsiData(id, author, date, anthroMin, anthroMax, bioMin, bioMax, fftW) {
  return { id: id, author, anthroMin, date, anthroMax, bioMin, bioMax, fftW};
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

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, rows } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {rows.map(row => {
            return (
              <TableCell
                key={row.id}
                align={row.numeric ? 'right' : 'left'}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
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
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
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
          <Typography color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography variant="h6" id="tableTitle">
            Matching specs
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton aria-label="Delete">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton aria-label="Filter list">
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
    // TODO: by time
    orderBy: 'calories', 
    selected: this.props.selectedSpecs,
    data: [
      
    ],
    page: 0,
    rowsPerPage: 5,
  };

  componentDidMount = () => {
    console.log(this.props.selectedSpecs, this.state.selected)
    var rows = [
      {id: 'author', numeric: false, disablePadding: true, label: 'Author' },
      {id: 'date', numeric: false, disablePadding: true, label: 'Creation Time' },    
    ]
    
    this.props.params.forEach(param => {
      if(param !== 'shannon')
        rows.push({ id: param, numeric: true, disablePadding: true, label: param })
      else
        rows.push({ id: param, numeric: false, disablePadding: true, label: param })
    })
    
    this.setState({ rows: rows })

    switch (this.props.index) {
      case 'aci' : {
        var data = this.props.specs.map(spec => {
          return createAciData(spec._id, spec.author, moment(spec.creationTimeMs).format('MMM Do YY, h:mm:ss a'), spec[this.props.params[0]], spec[this.props.params[1]], spec[this.props.params[2]], spec[this.props.params[3]])
        })
        this.setState({data: data})
        break;
      }
      case 'ndsi' : {
        var data = this.props.specs.map(spec => {
          return createNdsiData(spec._id, spec.author, moment(spec.creationTimeMs).format('MMM Do YY, h:mm:ss a'), spec[this.props.params[0]], spec[this.props.params[1]], spec[this.props.params[2]], spec[this.props.params[3]], spec[this.props.params[4]])
        })
        this.setState({data: data})
        break;
      }
    }
  }

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if(prevProps.params !== this.props.params) {
      var rows = [{id: 'author', numeric: false, disablePadding: true, label: 'Author' }]
    
      this.props.params.forEach(param => {
        if(param !== 'shannon')
          rows.push({ id: param, numeric: true, disablePadding: true, label: param })
        else
          rows.push({ id: param, numeric: false, disablePadding: true, label: param })      
      })
      
      this.setState({ rows: rows })

      switch (this.props.index) {
        case 'aci' : {
          var data = this.props.specs.map(spec => {
            console.log(spec)
            return createAciData(spec._id, spec.author, moment(spec.creationTimeMs).format('MMM Do YY, h:mm:ss a'), spec[this.props.params[0]], spec[this.props.params[1]], spec[this.props.params[2]], spec[this.props.params[3]])
          })
          this.setState({data: data})
          break;
        }
        case 'ndsi' : {
          var data = this.props.specs.map(spec => {
            return createNdsiData(spec._id, spec.author, moment(spec.creationTimeMs).format('MMM Do YY, h:mm:ss a'), spec[this.props.params[0]], spec[this.props.params[1]], spec[this.props.params[2]], spec[this.props.params[3]], spec[this.props.params[4]])
          })
          this.setState({data: data})
          break;
        }
      }
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
      var newSelected = this.state.data.map(n => n.id) 
      
      this.setState({ selected: newSelected });
      this.props.updateSelectedSpecs(newSelected, this.props.index)
      
      return;
    }
    this.setState({ selected: [] });
    this.props.updateSelectedSpecs([], this.props.index)
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
    // TODO: update for select some?
    this.props.updateSelectedSpecs(newSelected, this.props.index)
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
      <div className="col-12">
        <EnhancedTableToolbar numSelected={selected.length} />
        <div className={classes.tableWrapper}>
          {this.state.rows ? 
            <Table className={classes.table} aria-labelledby="tableTitle">
              <EnhancedTableHead
                rows={this.state.rows}
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
                          <Checkbox checked={isSelected} />
                        </TableCell>
                        {this.state.rows.map((row, i) => {
                          return (   
                            <TableCell key={row.id} align="left">{n[row.id]}</TableCell> 
                          )
                        })}
                      </TableRow> 
                    ); 
                  })}
                {emptyRows > 0 && ( 
                  <TableRow style={{ height: 49 * emptyRows }}> 
                    <TableCell colSpan={0} /> 
                  </TableRow> 
                )} 
              </TableBody> 
            </Table>
          : 
            ''
          }
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
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
      </div>
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EnhancedTable);