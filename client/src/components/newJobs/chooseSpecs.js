import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
// import '../selectResults.css';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

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
  formControl: {
    // margin: theme.spacing.unit,
    // minWidth: 120,
  }
});

class ChooseSpecs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      specInputHtml: '',
  
      
    }
  }

  componentDidMount = () => {
    // this.formatSpecTables()
    this.formatSpecInput(this.props.specParams[this.props.index])
  }
  // todo: mount functions w this
  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if(prevProps !== this.props) {
    //   this.formatSpecTables()
      this.formatSpecInput(this.props.specParams[this.props.index])
    }
  }

  
  onSubmitSpecs = () => {
    // this.props.onSubmitSpecs(this.props.index)
    // this.formatChipHtml()
  }

  formatSpecInput = (params) => {
    const {classes} = this.props
    // Format text field for each parameter
    var specInputHtml = Object.keys(params).map(param => {
      console.log(this.props.specParams[this.props.index][param])
      if(param !== 'shannon') {
        return (
          <TextField
            key={param}
            label={param}
            value={this.props.specParams[this.props.index][param]}
            className={classes.textField}
            onChange={this.props.onSpecChange(param)}
          />   
        )
      }
      else {
        return (
          <FormControlLabel
            key={param}
            control={
              <Checkbox
                checked={params.shannon}
                onChange={this.onSpecChange('shannon')}
                value="shannon"
                color="primary"
              />
            }
            label="Shannon Diversity Index"
          />
        )
      }
    })
    // Add title and submit button to html
    specInputHtml = (
      <div>
        <h4>Choose Specs</h4>
        {specInputHtml} 
        <div className="row ChooseSubmit">
          {/* <Button onClick={this.onSubmitSpecs} variant="contained" color="primary">
            Apply Spec Chooses
          </Button> */}
        </div>
      </div>
    )
    this.setState({ specInputHtml: specInputHtml })
  }

//   formatSpecTables = () => {
//     var expansionPanels = ['aci', 'ndsi', 'adi', 'aei', 'bi', 'rms'].map(index => {
//       if(this.props.ChooseedSpecs[index]){
//         return (
//           <ExpansionPanel 
//             key={index}
//             index={index}
//             chosen={this.props.index}
//             expanded={this.props.index === index} 
//             specs={this.props.ChooseedSpecs[index]}
//             params={Object.keys(this.props.specParams[index])}
//             handleChange={this.props.handleIndexChange}
//             updateSelectedSpecs={this.props.updateSelectedSpecs}
//             selectedSpecs={this.props.selectedSpecs[index]}            
//           />
//         )      
//       }
//     })
//     this.setState({ expansionPanels: <div>{expansionPanels}</div> })
//   }



  render() {
    const { classes } = this.props;

    return (
      <div className="row">
        <div className="col-4">
          <Paper className={classes.root}>
            <FormControl className={classes.formControl}>
              {this.state.specInputHtml}
            </FormControl>
          </Paper>
        </div>
        <div className="col-8">
        <Paper className={classes.root}>
          {/* {this.state.expansionPanels ? this.state.expansionPanels : ''} */}
          </Paper>
        </div>
      </div>
    );
  }
}

ChooseSpecs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChooseSpecs);