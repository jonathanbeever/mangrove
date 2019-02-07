import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// import DateAndTimePickers from '../components/dateTimePicker';
import Button from '@material-ui/core/Button';
// import '../selectResults.css';

const styles = theme => ({
  root: {
    // padding: 19,
    // marginTop: theme.spacing.unit * 3,
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
  }
});

class FilterInputs extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // chips: ''
    }
  }

  componentDidMount = () => {
    // this.formatChipHtml()
  }

  // formatChipHtml = () => {
  //   var chipHtml = []
  //   Object.keys(this.props.inputFiltering).forEach(param => {
  //     if(this.props.inputFiltering[param].length) {
  //       chipHtml.push(
  //         <Chip
  //           key={param}
  //           label={param + ' : ' + this.props.inputFiltering[param]}
  //           onDelete={this.deleteChip}
  //         />
  //       )
  //     }
  //   })
  //   this.setState({ chips: <div>{chipHtml}</div> })
  // }

  onSubmit = () => {
    this.props.submitInputFilter()
  }

  deleteChip = (label) => {
  }

  render() {
    const { classes } = this.props;

    return (
          <Paper className={classes.root}>
            <h4>{this.props.message}</h4>
            <TextField
              label={<p style={{fontSize:13+'px'}}>Site Name</p>}
              value={this.props.site}
              className={classes.textField}
              onChange={this.props.onChange('site')}
            />
            <TextField
              label={<p style={{fontSize:13+'px'}}>File Set Name</p>}
              value={this.props.series}
              className={classes.textField}
              onChange={this.props.onChange('series')}
            />
            {/* TODO */}
            {/* <DateAndTimePickers/> */}
            <TextField
              label={<p style={{fontSize:13+'px'}}>Latitude</p>}
              value={this.props.lat}
              className={classes.textField}
              onChange={this.props.onChange('lat')}
            />
            <TextField
              label={<p style={{fontSize:13+'px'}}>Longitude</p>}
              value={this.props.long}
              className={classes.textField}
              onChange={this.props.onChange('long')}
            />
            <div className="row filterSubmit">
              <Button style={{fontSize:12+'px'}} onClick={this.onSubmit} variant="contained" color="primary">
                Apply
              </Button>
            </div>
          </Paper>
    );
  }
}

FilterInputs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FilterInputs);