import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 30
  const left = 40

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 110,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: 'none',
  },
  buttons: {
    textAlign: 'center'
  },
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing.unit,
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
  },
});

class SimpleModal extends React.Component {
  state = {
    open: this.props.modal,
    value: 'STRING,DATE,TIME',
    separator: '_'
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
    this.props.closeModal()
  };

  handleRadioChange = (e) => {
    this.setState({value: e.target.value})
  }

  // local storage for adding new
  // validate
  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleSubmit = () => {
    this.props.setNamingConvention(this.state.value, this.state.separator)
    this.props.closeModal()
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onClose={this.handleClose}
        >
          <div style={getModalStyle()} className={classes.paper}>
            <div className='row'>
              {/* <div className='col-4'>
                <Typography variant="h5" id="simple-modal-description">
                  Upload Summary File
                </Typography>
                <input
                  accept=".txt"
                  style={{ display: 'none' }}
                  onChange={this.props.addSummaryFile}
                  id="selectFiles"
                  type="file"
                />
                <div>
                  <div>
                    <label htmlFor="selectFiles">
                      <Button component="span">
                        Choose .txt File
                      </Button>
                    </label> 
                  </div>
                </div> 
              </div> */}
              {/* <div className='col-8'> */}
                <Typography variant="h5" id="simple-modal-description">
                  Input properties contained in file names<br/><br/>
                </Typography>
                <Typography variant="subtitle1" id="simple-modal-description">
                  Use any of the key words <strong>DATE, TIME, LAT, LONG, SITE, SERIES</strong> to represent the location of these properties in your file naming convention, separated by a comma.
                  Use keyword <strong>STRING</strong> for parts of the file names not correlating to one of these keywords.
                  Define the character separating these fields, such as underscores and slashes.
                </Typography>
                <FormControl component="fieldset" className={classes.formControl}>
                  <RadioGroup
                    aria-label="naming"
                    name="naming"
                    className={classes.group}
                    value={this.state.value}
                    onChange={this.handleChange}
                  >
                    <FormControlLabel
                      value="STRING,DATE,TIME"
                      control={<Radio color="primary" />}
                      label={<h6>STRING,DATE,TIME (separator: _)</h6>}
                      labelPlacement="end"
                    />
                  </RadioGroup>
                  <TextField
                    id="convention"
                    label="Order"
                    onChange={this.handleChange('value')}
                    style={{marginBottom: '10px'}}
                  />
                  <TextField
                    id="convention"
                    label="Separator"
                    onChange={this.handleChange('separator')}
                    style={{marginBottom: '10px'}}
                  />
                  <Button onClick={this.handleSubmit}>Apply</Button>
                </FormControl>
              {/* </div> */}
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

SimpleModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

// We need an intermediary variable for handling the recursive nesting.
const SimpleModalWrapped = withStyles(styles)(SimpleModal);

export default SimpleModalWrapped;