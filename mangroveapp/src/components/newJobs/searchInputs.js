import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import DatePicker from './components/datePicker';
import TimePicker from './components/timePicker';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  root: {
    padding: 17,
    marginTop: theme.spacing(1) * 1,
    marginBottom: theme.spacing(1) * 1,
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
    fontWeight: 400
  }
});

class FilterInputs extends Component {

  onSubmit = () => {
    this.props.submitInputFilter()
  }

  render() {
    const { classes } = this.props;

    const isEnabled = this.props.site && this.props.series && this.props.lat && this.props.long && this.props.date && this.props.time;
    
    return (
      <div>
        <Paper className={classes.root}>
          <h4 style={{marginBottom: 0, marginTop: 0}}>{this.props.message}</h4>
          <TextField
            label={<p style={{fontSize:13+'px', fontWeight: 500, color: 'black'}}>Site Name</p>}
            value={this.props.site}
            className={classes.textField}
            onChange={this.props.onChange('site', this.props.value)}
          />
          <TextField
            label={<p style={{fontSize:13+'px', fontWeight: 500, color: 'black'}}>File Set Name</p>}
            value={this.props.series}
            className={classes.textField}
            onChange={this.props.onChange('series', this.props.value)}
          />
          <TextField
            label={<p style={{fontSize:13+'px', fontWeight: 500, color: 'black'}}>Latitude</p>}
            value={this.props.lat}
            className={classes.textField}
            onChange={this.props.onChange('lat', this.props.value)}
          />
          <TextField
            label={<p style={{fontSize:13+'px', fontWeight: 500, color: 'black'}}>Longitude</p>}
            value={this.props.long}
            className={classes.textField}
            onChange={this.props.onChange('long', this.props.value)}
          />
          {this.props.value === 'upload' ?
            <div>
              <DatePicker 
                date={this.props.date}
                onChange={this.props.onChange}
                value={this.props.value}
              />
              <TimePicker 
                time={this.props.time}
                onChange={this.props.onChange}
                value={this.props.value}
              />
            </div>
            :
            // TODO: datetime pickers for filtering
            ''
          }
          <div className="row filterSubmit">
            <Button disabled={!isEnabled} style={{margin: '0 auto', marginTop: 7}} onClick={this.onSubmit}>
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