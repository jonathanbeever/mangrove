import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import '../selectResults.css';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ExpansionPanel from '../components/expansionPanel';
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
    marginTop: theme.spacing(3),
    backgroundColor: '#fafafa',
    // opacity: 0.8,
    borderRadius: 2
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
  panels: {
    marginTop: theme.spacing(3),
    marginBottom: 19
  },
  paper: {
    position: 'absolute',
    width: theme.spacing(1) * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(1) * 4,
    outline: 'none',
  },
  buttons: {
    margin: theme.spacing(1)
  }
});

class FilterSpecs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      specInputHtml: '',
      chips: '',
      open: false,
      buttons: []
    }
  }

  componentDidMount = () => {
    sessionStorage.removeItem('analysisViewSave');
    this.formatSpecTables()
    this.formatSpecInput(this.props.specParamsList)
    this.formatChipHtml()
  }

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if(prevProps !== this.props) {
      this.formatSpecTables()
      this.formatSpecInput(this.props.specParamsList)
    }
  }

  onSubmitSpecs = () => {
    this.props.onSubmitSpecs(this.props.index)
    this.formatChipHtml()
  }

  formatChipHtml = () => {
    var chipHtml = []

    const indices = ['aci', 'ndsi', 'adi', 'aei', 'bi', 'rms']

    indices.forEach(index => {
      Object.keys(this.props.specParamsByIndex[index]).forEach((param, i) => {
        if(this.props.specParamsByIndex[index][param].length) {
          if(i !== 0)
            chipHtml.push(
              <div style={{marginTop: 3+'px'}}>
                <Chip
                  key={param}
                  label={<h5>{index + ' : ' + param + ' - ' + this.props.specParamsByIndex[index][param]}</h5>}
                  onDelete={this.deleteChip}
                />
              </div>
            )
          else
            chipHtml.push(
              <Chip
                key={param}
                label={<h5>{this.props.index + ' : ' + param + ' - ' + this.props.specParamsByIndex[this.props.index][param]}</h5>}
                onDelete={this.deleteChip}
              />
            )
        }
      })
    })
    
    this.setState({ chips: <div>{chipHtml}</div> })
  }

  deleteChip = (label) => {
    this.props.onDelete(label)
    this.formatChipHtml()
  }

  formatSpecInput = (params) => {
    const {classes} = this.props
    // Format text field for each parameter
    var specInputHtml = params.map(param => {
      if(param[0] !== 'shannon') {
        return (
          <TextField
            key={param[0]}
            label={<p style={{fontSize:13+'px'}}>{param[1]}</p>}
            value={this.props.specParamsByIndex[this.props.index][param[0]]}
            className={classes.textField}
            onChange={this.props.handleSpecChange(param[0])}
          />
        )
      }
      else {
        return (
          <FormControlLabel
            key={param[0]}
            control={
              <Checkbox
                checked={this.props.specParamsByIndex.adi.shannon}
                onChange={this.props.handleSpecChange('shannon')}
                value="shannon"
                color="primary"
              />
            }
            label={<p style={{fontSize:11+'px', marginTop:12}}>Shannon Diversity Index</p>}
          />
        )
      }
    })
    // Add title and submit button to html
    specInputHtml = (
      <div>
        {specInputHtml}
        <div className="row filterSubmit">
          <Button style={{margin: "0 auto", marginTop: 7}} onClick={this.onSubmitSpecs}>
            <h6>Apply Filters</h6>
          </Button>
        </div>
      </div>
    )
    this.setState({ specInputHtml: specInputHtml })
  }

  formatSpecTables = () => {
    var expansionPanels = ['aci', 'ndsi', 'adi', 'aei', 'bi', 'rms'].map(index => {
      var panel = ''
      if(this.props.filteredSpecs[index]){
        return (
          <ExpansionPanel
            key={index}
            index={index}
            chosen={this.props.index}
            expanded={this.props.index === index}
            specs={this.props.filteredSpecs[index]}
            params={Object.keys(this.props.specParamsByIndex[index])}
            handleChange={this.props.handleIndexChange}
            updateSelectedSpecs={this.props.updateSelectedSpecs}
            selectedSpecs={this.props.selectedSpecs[index]}
            deleteSpecs={this.confirmDelete}
          />
        )
      }
      return panel;
    })
    this.setState({ expansionPanels: <div>{expansionPanels}</div> })
  }

  confirmDelete = (selected) => {
    this.handleOpen(selected)
    this.setState({ selected: selected })
  }

  handleOpen = (selected) => {
    this.setState({ message: 'Are you sure you want to delete ' + selected.length + ' input specification(s)?'})
    this.setState({ buttons: ['No', 'Yes']})
    this.setState({ open: true });
  };

  handleClose = (deleteSpecs) => {
    this.setState({ open: false });

    if(deleteSpecs === 'delete') { this.deleteSpecs() }
    else if(deleteSpecs === 'deleted') { this.props.changeTab(0) }
  };

  deleteSpecs = () => {
    let requests = [];

    this.state.selected.forEach(specId => {
      requests.push(axios.delete('http://127.0.0.1:34251/specs/'+specId));
    });

    Promise.all(requests)
      .then(responses => {
        let deleted = 0
        responses.forEach(response => { deleted += response.data.jobs.length })

        this.setState({ message: this.state.selected.length + ' spec(s) deleted and ' + deleted + ' corresponding job(s) deleted.' })
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
            <h4>Filter Index Specifications</h4>
            <FormControl className={classes.formControl}>
              <InputLabel style={{fontSize:15+'px'}} htmlFor="indexSelect">Index</InputLabel>
              <Select
                style={{marginBottom:10+'px', fontSize:15+'px'}}
                value={this.props.index}
                onChange={this.props.handleIndexChange}
                className={classes.textField}
                inputProps={{
                  name: 'index',
                  id: 'indexSelect',
                }}
              >
                <MenuItem value='aci'>ACI</MenuItem>
                <MenuItem value='ndsi'>NDSI</MenuItem>
                <MenuItem value='adi'>ADI</MenuItem>
                <MenuItem value='aei'>AEI</MenuItem>
                <MenuItem value='bi'>BIO</MenuItem>
                <MenuItem value='rms'>RMS</MenuItem>
              </Select>
              {/* Spec form for index selected */}
              {this.state.specInputHtml}
            </FormControl>
          </Paper>
        </div>
        <div className="col-8">
          <div className={classes.panels}>
            {this.state.expansionPanels ? this.state.expansionPanels : ''}
          </div>
        </div>
      </div>
    );
  }
}

FilterSpecs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FilterSpecs);
