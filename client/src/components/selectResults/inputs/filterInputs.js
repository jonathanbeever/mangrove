import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import '../selectResults.css';
import InputsTable from './inputsTable';
import Chip from '../components/chip'
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const styles = theme => ({
  root: {
    padding: 19,
    marginTop: theme.spacing.unit * 3,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingBottom: 0,
    marginTop: 0,
    fontWeight: 500
  },
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: 'none',
  },
  buttons: {
    margin: theme.spacing.unit
  }
});

class FilterInputs extends Component {

  constructor(props) {
    super(props);
    this.state = {
      chips: '',
      open: false,
      buttons: []
    }
  }

  componentDidMount = () => {
    sessionStorage.removeItem('analysisViewSave');
    this.formatChipHtml()
  }

  formatChipHtml = () => {
    var chipHtml = []
    Object.keys(this.props.inputFiltering).forEach((param, i) => {
      if(this.props.inputFiltering[param].length) {
        if(i !== 0)
          chipHtml.push(
            <div style={{marginTop: 3+'px'}}>
              <Chip
                key={param}
                label={<h5>{param + ' : ' + this.props.inputFiltering[param]}</h5>}
                onDelete={this.deleteChip}
              />
            </div>
          )
        else
          chipHtml.push(
            <Chip
              key={param}
              label={<h5>{param + ' : ' + this.props.inputFiltering[param]}</h5>}
              onDelete={this.deleteChip}
            />
          )
      }
    })
    this.setState({ chips: <h3>{chipHtml}</h3> })
  }

  onSubmit = () => {
    this.formatChipHtml()
    this.props.onSubmitInput()
  }

  deleteChip = (label) => {
    this.props.onDelete(label)
    this.formatChipHtml()
  }

  confirmDelete = (selected) => {
    this.handleOpen(selected)
    this.setState({ selected: selected })
  }

  handleOpen = (selected) => {
    this.setState({ message: 'Are you sure you want to delete ' + selected.length + ' input file(s)?'})
    this.setState({ buttons: ['No', 'Yes']})
    this.setState({ open: true });
  };

  handleClose = (deleteInputs) => {
    this.setState({ open: false });

    if(deleteInputs === 'delete') { this.deleteFiles() }
    else if(deleteInputs === 'deleted') { this.props.changeTab(0) }
  };

  deleteFiles = () => {
    let requests = [];

    this.state.selected.forEach(inputId => {
      requests.push(axios.delete('http://127.0.0.1:34251/inputs/'+inputId));
    });

    Promise.all(requests)
      .then(responses => {
        let deleted = 0
        responses.forEach(response => { deleted += response.data.jobs.length })

        this.setState({ message: this.state.selected.length + ' file(s) deleted and ' + deleted + ' corresponding job(s) deleted.' })
        this.setState({ buttons: ['Close'] })
        this.setState({ open: true })
      });
  }

  render() {
    axios.defaults.headers.common['Authorization'] = window.localStorage.getItem('id');
    const { classes } = this.props;

    return (
      <div className="row">
        <div className="col-4">
          {this.state.open ?
            <div>
              <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.state.open}
              >
                <div style={getModalStyle()} className={classes.paper}>
                  <Typography variant="h6" id="modal-title">
                    {this.state.message}
                  </Typography>
                  <div style={{textAlign: 'center'}}>
                  {this.state.buttons.length > 1 ?
                    (<div>
                      <Button className={classes.buttons} onClick={() => {this.handleClose('delete')}}>{this.state.buttons[1]}</Button>
                      <Button className={classes.buttons} onClick={() => {this.handleClose('close')}}>{this.state.buttons[0]}</Button>
                    </div>)
                    :
                    (<Button className={classes.buttons} onClick={() => {this.handleClose('deleted')}}>{this.state.buttons[0]}</Button>)
                  }
                  </div>
                </div>
              </Modal>
            </div>
            :
            ''
          }
          <Paper className={classes.root}>
            {this.state.chips}
            <h4>Filter Input Files</h4>
            <TextField
              label={<p style={{fontSize:13+'px'}}>Site Name</p>}
              value={this.props.inputFiltering.site}
              className={classes.textField}
              onChange={this.props.onChange('site')}
            />
            <TextField
              label={<p style={{fontSize:13+'px'}}>File Set Name</p>}
              value={this.props.inputFiltering.series}
              className={classes.textField}
              onChange={this.props.onChange('series')}
            />
            <TextField
              label={<p style={{fontSize:13+'px'}}>Latitude</p>}
              value={this.props.inputFiltering.lat}
              className={classes.textField}
              onChange={this.props.onChange('lat')}
            />
            <TextField
              label={<p style={{fontSize:13+'px'}}>Longitude</p>}
              value={this.props.inputFiltering.long}
              className={classes.textField}
              onChange={this.props.onChange('long')}
            />
            <div className="row filterSubmit">
              <Button onClick={this.onSubmit} style={{margin: "0 auto"}}>
                <h6>Apply Filters</h6>
              </Button>
            </div>
          </Paper>
        </div>
        <div className="col-8">
          <InputsTable
            updateSelectedInputs={this.props.updateSelectedInputs}
            filteredInputs={this.props.filteredInputs}
            selected={this.props.selected}
            deleteInputs={this.confirmDelete}
          />
        </div>
      </div>
    );
  }
}

FilterInputs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FilterInputs);
