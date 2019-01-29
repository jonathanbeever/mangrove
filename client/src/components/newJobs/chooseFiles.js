import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import InputsTable from '../selectResults/inputs/inputsTable';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing.unit * 3,
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
  },
});

class ChooseFiles extends React.Component {
  state = {

  };

  handleChange = e => {
    const url = 'http://localhost:3000/inputs';
    var files = e.target.files

    Array.from(files).forEach(file => {
      const form = new FormData();
      // Input this for all files or get from name on server?
      form.append('json', '{ "site": "UCF Arboretum", "series": "Hurricane Irma", "recordTimeMs": 1505016000000, "coords": { "lat": 28.596238, "long": -81.191381 } }')
      form.append('file', file)
  
      axios.put(url, form)
      .then(res => {
        console.log(res.data);
        this.props.listDbFiles(res.data)
      }).catch(err => {
        console.log(err)
      });
    });
  };

  componentDidMount = () => {
  }

  componentDidUpdate(prevProps) {
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div className="row">
          <div className="col-4">
            <input
              accept="audio/wave"
              className={classes.input}
              style={{ display: 'none' }}
              onChange={this.handleChange}
              id="selectFiles"
              multiple
              type="file"
            />
            <label htmlFor="selectFiles">
              <Button variant="raised" component="span" className={classes.button}>
                Choose Files
              </Button>
            </label> 
          </div>
          <div className="col-8">
            <InputsTable
              updateSelectedInputs={this.props.updateSelectedInputs} 
              filteredInputs={this.props.allFiles} 
              selected={this.props.selectedFiles}          
            />
          </div>
        </div>
      </div>
    );
  }
}

ChooseFiles.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChooseFiles);