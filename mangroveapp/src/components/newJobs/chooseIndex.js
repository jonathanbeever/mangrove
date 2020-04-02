import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import RadioButtons from './radioButtons';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing(3),
  },
  group: {
    margin: `${theme.spacing(1)}px 0`,
  },
});

class ChooseIndex extends React.Component {
  state = {

  };

  handleChange = event => {
  };

  componentDidMount = () => {
    this.renderInfo()
  }

  componentDidUpdate(prevProps) {
    if(prevProps.index !== this.props.index)
      this.renderInfo()
  }

  renderInfo() {
    switch(this.props.index) {
      case 'aci': {
        var html = (
        <div>
          <h3>Acoustic Complexity Index</h3>
          <p>
          Acoustic Complexity Index ACI from <i>Pieretti, et al. 2011</i>. The ACI is based on the "observation
          that many biotic sounds, such as bird songs, are characterized by an intrinsic variability of intensities, while some types of human generated noise (such as car passing or airplane transit) present
          very constant intensity values" <i>Pieretti, et al. 2011</i>.
          </p>
        </div>
        )
        this.setState({ indexInfo: html })
        break;
      }
      case 'ndsi': {
        html = (
          <div>
            <h3>Normalized Difference Soundscape Index</h3>
            <p>
            Normalized Difference Soundscape Index NDSI from <i>REAL and Kasten, et al. 2012</i>. The NDSI
            seeks to "estimate the level of anthropogenic disturbance on the soundscape by computing the ratio
            of human-generated anthrophony to biological biophony acoustic components found in field
            collected sound samples" <i>Kasten, et al. 2012</i>.
            </p>
          </div>
        )
        this.setState({ indexInfo: html })
        break;
      }
      case 'aei': {
        html = (
          <div>
            <h3>Acoustic Evenness Index</h3>
            <p>
            Acoustic Evenness Index from <i>Villanueva-Rivera et al. 2011</i> band evenness using the Gini index.
            The AEI is calculated by dividing the spectrogram into bins default 10 and taking the proportion
            of the signals in each bin above a threshold default -50 dBFS. The AEI is the result of the Gini
            index applied to these bins.
            </p>
          </div>
        )
        this.setState({ indexInfo: html })
        break;
      }
      case 'adi': {
        html = (
          <div>
            <h3>Acoustic Diversity Index</h3>
            <p>
            Acoustic Diversity Index from <i>Villanueva-Rivera et al. 2011</i>. The ADI is calculated by dividing
            the spectrogram into bins default 10 and taking the proportion of the signals in each bin above a
            threshold default -50 dBFS. The ADI is the result of the Shannon index applied to these bins.
            </p>
          </div>
        )
        this.setState({ indexInfo: html }) 
        break;
      }
      case 'bi': {
        html = (
          <div>
            <h3>Bioacoustic Index</h3>
            <p>
            Bioacoustic Index from <i>Boelman, et al. 2007</i>. Inspired on Matlab code courtesy of NT Boelman.
            Several parts where changed, in particular log math, so this won’t be directly comparable to the
            original code in the paper.
            The Bioacoustic Index is calculated as the "area under each curve included all frequency bands
            associated with the dB value that was greater than the minimum dB value for each curve. The area
            values are thus a function of both the sound level and the number of frequency bands used by the
            avifauna" <i>Boelman, et al. 2007</i>.
            </p>
          </div>
        )
        this.setState({ indexInfo: html })
        break;
      }
      case 'rms': {
        html = (
          <div>
            <h3>Root Mean Square</h3>
            <p>
            RMS is often used to characterize the overall pressure, or loudness of a sound file. It is calculated 
            by the square root of the average of the sound wave's various intensities over time squared. This index 
            is most useful for sound files with a consistent wave pattern. This index does not require specifying 
            additional parameters.
            </p>
          </div>
        )
        this.setState({ indexInfo: html })
        break;
      }
      case 'ml': {
        html = (
          <div>
            <h3>Machine Learning</h3>
            <p>
            Example Text 
            </p>
          </div>
        )
        this.setState({ indexInfo: html })
        break;
      }
      default:
        break;
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div className="row">
          <div className="col-4">
            <RadioButtons index={this.props.index} changeIndex={this.props.changeIndex} />          
          </div>
          <div className="col-8">
            {this.state.indexInfo}
          </div>
        </div>
      </div>
    );
  }
}

ChooseIndex.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChooseIndex);