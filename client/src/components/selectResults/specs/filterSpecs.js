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

const styles = theme => ({
  root: {
    padding: 19,
    marginTop: theme.spacing.unit * 3,
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
    marginTop: theme.spacing.unit * 3,
    marginBottom: 19
  }
});

class FilterSpecs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      specInputHtml: '',
      chips: ''
    }
  }

  componentDidMount = () => {
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

    Object.keys(this.props.specParamsByIndex[this.props.index]).forEach(param => {
      if(this.props.specParamsByIndex[this.props.index][param].length) {
        chipHtml.push(
          <Chip
            key={param}
            label={<h3>{this.props.index + ' : ' + param + ' - ' + this.props.specParamsByIndex[this.props.index][param]}</h3>}
            onDelete={this.deleteChip}
          />
        )
      }
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
          />
        )
      }
      return panel;
    })
    this.setState({ expansionPanels: <div>{expansionPanels}</div> })
  }



  render() {
    const { classes } = this.props;

    return (
      <div className="row">
        <div className="col-4">
          <Paper className={classes.root}>
            {this.state.chips}
            <h4>Filter By Index Specifications</h4>
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
