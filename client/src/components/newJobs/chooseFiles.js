import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import axios from 'axios';

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
    // TODO: multiple files
    const form = new FormData();
    form.append('json', '{ "site": "UCF Arboretum", "series": "Hurricane Irma", "recordTimeMs": 1505016000000, "coords": { "lat": 28.596238, "long": -81.191381 } }')
    form.append('file', e.target.files[0])

    axios.put(url, form)
    .then(res => {
      console.log(res.data);
    }).catch(err => {
      console.log(err)
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
      </div>
    );
  }
}

ChooseFiles.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChooseFiles);