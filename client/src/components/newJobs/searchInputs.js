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
    padding: 19,
    marginTop: theme.spacing.unit * 1,
    marginBottom: theme.spacing.unit * 1,
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

  onSubmit = () => {
    this.props.submitInputFilter()
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
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
              <Button style={{margin: '0 auto', marginTop: 7}} onClick={this.onSubmit}>
                Apply
              </Button>
            </div>
          </Paper>
          </div>
    );
  }
}

FilterInputs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FilterInputs);