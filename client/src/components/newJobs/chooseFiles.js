import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import InputsTable from '../selectResults/inputs/inputsTable';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  formControl: {
    padding: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 3
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
  },
});

class ChooseFiles extends React.Component {
  state = {
    allFiles: this.props.allFiles
  };

  handleChange = e => {
  
  };

  componentDidMount = () => {
  }

  componentDidUpdate(prevProps) {
    if(this.state.allFiles !== this.props.allFiles) {
      this.renderTable()
    }
  }

  renderTable = () => {
    this.setState({allFiles: this.props.allFiles})
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div className="row">
          <Paper className={classes.formControl}>
            <input
              accept="audio/wave"
              className={classes.input}
              style={{ display: 'none' }}
              onChange={this.props.handleInputUpload}
              id="selectFiles"
              multiple
              type="file"
            />
            <label htmlFor="selectFiles">
                <h5>Select New Files</h5>
                <Button variant="contained" component="span" className={classes.button}>
                  Choose Files
                </Button>
            </label> 
            {this.state.allFiles ? 
            (<InputsTable
              updateSelectedInputs={this.props.updateSelectedInputs} 
              filteredInputs={this.state.allFiles} 
              selected={this.props.selectedFiles}          
            />) : ''}
          </Paper>
        </div>
      </div>
    );
  }
}

ChooseFiles.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChooseFiles);